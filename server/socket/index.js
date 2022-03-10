const { generateRoomCode } = require('../utils/codeGen');
class Game {
    constructor(players,lobbyCode) {
        this.players = players;
        this.lobbyCode = lobbyCode;
        this.host = '';
        this.currentRound = 0;
        this.currentPrompt = '';
        this.firechair = '';
        this.answers = {};
        this.selections = {};
        this.totalSelections = 0;
    }
    addOrUpdatePlayer(player) {
        for (let i = 0; i < this.players.length; i++) {
            if(this.players[i].username === player.username){
                this.players[i].socketID = player.socketID;
                return;
            }
        }
        this.players.push(player);
    }
}

const gameStore = {};

function makePlayer(username, socketID) {
    this.username = username;
    this.socketID = socketID;
    this.currentScore = 0;
}

function gameSystem(socket, io) {
    console.log(socket.id);
    
    socket.on('newLobby', (username) => {
        const host = new makePlayer(username, socket.id);
        const newRoom = generateRoomCode();
        const newGame = new Game(newGame,[host]);
        gameStore[newRoom] = newGame;
        
        socket.join(newGame.lobbyCode);
        socket.join(newGame.lobbyCode+'HOST');
        socket.join('inLobby');
        socket.emit('lobbyCreated', newRoom);
    });
    
    socket.on('joinLobby', (username, lobbyCode) => {
        const game = gameStore[lobbyCode];
        if(game){
            game.addOrUpdatePlayer(new makePlayer(username, socket.id));
            socket.join(game.lobbyCode);
            socket.join('inLobby');
            socket.emit('lobbyJoined', game.lobbyCode, game.players);
            socket.emit('lobbyUpdated', game.lobbyCode, game.players);
        };
    });
    
    socket.on('startRound', (lobbyCode) => {
        const game = gameStore[lobbyCode];
        if(game){
            game.currentPrompt = '';
            game.firechair = '';
            game.answers = {};
            game.selections = {};
            game.totalSelections = 0;

            const fireChair = game.players[Math.floor(Math.random() * game.players.length)];
            game.fireChair = fireChair;
            game.currentRound = game.currentRound + 1;
            io.to(lobbyCode).except(fireChair.socketID).emit('startingRound', game.lobbyCode, game.currentRound, game.fireChair);
            io.to(fireChair.socketID).emit('requestPrompt', game.lobbyCode, game.currentRound);
        }
    });
    
    socket.on('promptSelected', (lobbyCode, prompt) => {
        const game = gameStore[lobbyCode];
        if(game){
            game.prompt = prompt;
            io.to(lobbyCode).except(game.fireChair.socketID).emit('answerPrompt', game.lobbyCode, game.currentRound, game.fireChair);
            io.to(game.fireChair.socketID).emit('answerPromptFC', game.lobbyCode, game.currentRound);
        }
    });

    socket.on('promptReceived', (lobbyCode, prompt) => {
        const game = gameStore[lobbyCode];
        if(game){
            game.prompt = prompt;
            io.to(lobbyCode).except(game.fireChair.socketID).emit('answerPrompt', game.lobbyCode, game.currentRound, game.fireChair);
            io.to(game.fireChair.socketID).emit('answerPromptFC', game.lobbyCode, game.currentRound);
        }
    });

    socket.on('answerReceived', (lobbyCode, answer, username) => {
        const game = gameStore[lobbyCode];
        if(game){
            if(!game.answers[username]){
                game.answers[username] = answer;
                if(game.answers.keys.length === game.players.length){
                    for(const user in game.answers){
                        game.selections[user] = 0;
                    }
                    io.to(lobbyCode).except(game.fireChair.socketID).emit('selectAnswers', game.lobbyCode, game.currentRound, game.currentPrompt, game.fireChair, game.answers.values());
                    io.to(game.fireChair.socketID).emit('awaitSelect', game.lobbyCode, game.currentRound);
                }
            }
        }
    });

    socket.on('selectReceived', (lobbyCode, selected, username) => {
        const game = gameStore[lobbyCode];
        if(game){
            if(!game.selections[username]){
                game.selections[username]++;
                game.totalSelections++;
                if(game.totalSelections === game.players.length-1){
                    io.to(lobbyCode).except(game.fireChair.socketID).emit('displaySelectionScore', game.lobbyCode, game.currentRound, game.currentPrompt, game.fireChair, game.selections);

                }
            }
        }
    });

    socket.on('endGame', async (lobbyCode) => {
        const game = gameStore[lobbyCode];
        if(game && game.host.socketID === socket.id){
            io.to(lobbyCode).emit('gameOver', game.lobbyCode, game.currentRound, game.currentPrompt, game.fireChair, game.selections);
            const players = await io.in(lobbyCode).fetchSockets();
            for (player of players){
                player.leave(lobbyCode);
            }
            delete gameStore[lobbyCode];
        }
    });

    socket.on('disconnecting', (reason) => {
        for (const room of socket.rooms) {
            if ( /^[A-Z]{4}$/.test(room) ) {
              if(gameStore[room].players===1){
                  delete gameStore[room];
              }
            }
          }
    });
};

module.exports = gameSystem;