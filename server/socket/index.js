const { generateRoomCode } = require('../utils/codeGen');
class Game {
    constructor(host, useHostDeck, lobbyCode) {
        this.players = [host];
        this.lobbyCode = lobbyCode;
        this.gameState = 'lobby';
        this.host = host;
        this.useHostDeck = useHostDeck;
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
    clientData(){
        return {
            players: this.players,
            lobbyCode: this.lobbyCode,
            host: this.host,
            useHostDeck: this.useHostDeck,
            currentRound: this.currentRound,
            firechair: this.firechair,
            answers: this.answers,
            selections: this.selections,
            totalSelections: this.totalSelections
        }
    }
}

const gameStore = {};

function Player(username, socketID) {
    this.username = username;
    this.socketID = socketID;
    this.currentScore = 0;
}

function gameSystem(socket, io) {
    console.log(socket.id);
    
    socket.on('newLobby', (username, usingCustomDeck) => {
        const host = new Player(username, usingCustomDeck, socket.id);
        const newRoom = generateRoomCode();
        const newGame = new Game(newRoom, host);
        gameStore[newRoom] = newGame;
        
        socket.join(newGame.lobbyCode);
        socket.join(newGame.lobbyCode+'HOST');
        socket.join('inLobby');
        socket.emit('lobbyCreated', newRoom);
    });
    
    socket.on('joinLobby', (username, lobbyCode) => {
        const game = gameStore[lobbyCode];
        if(game){
            game.addOrUpdatePlayer(new Player(username, socket.id));
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
            game.gameState = "Select Prompt";

            const fireChair = game.players[Math.floor(Math.random() * game.players.length)];
            game.fireChair = fireChair;
            game.currentRound = game.currentRound + 1;
            io.to(lobbyCode).except(fireChair.socketID).emit('startingRound', game.clientData());
            io.to(fireChair.socketID).emit('requestPrompt', game.clientData());
        }
    });
    
    socket.on('promptSelected', (lobbyCode, prompt) => {
        const game = gameStore[lobbyCode];
        if(game){
            game.prompt = prompt;
            game.gameState = "Answer Prompt";
            io.to(lobbyCode).except(game.fireChair.socketID).emit('answerPrompt', game.clientData());
            io.to(game.fireChair.socketID).emit('answerPromptFC', game.clientData());
        }
    });

    socket.on('answerReceived', (lobbyCode, answer, username) => {
        const game = gameStore[lobbyCode];
        if(game){
            if(!game.answers[username]){
                game.answers[username] = answer;
                if(game.answers.keys().length === game.players.length){
                    for(const user in game.answers){
                        game.selections[user] = 0;
                    }
                    game.gameState = "Select Answer";
                    io.to(lobbyCode).except(game.fireChair.socketID).emit('selectAnswers', game.clientData());
                    io.to(game.fireChair.socketID).emit('awaitSelect', game.clientData());
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
                    game.gameState = "Display Score";
                    io.to(lobbyCode).except(game.fireChair.socketID).emit('displaySelectionScore', game.clientData());

                }
            }
        }
    });

    socket.on('endGame', async (lobbyCode) => {
        const game = gameStore[lobbyCode];
        if(game && game.host.socketID === socket.id){
            io.to(lobbyCode).emit('gameOver', game.clientData());
            const players = await io.in(lobbyCode).fetchSockets();
            for (player of players){
                player.leave(lobbyCode);
            }
            delete gameStore[lobbyCode];
        }
    });

    socket.on('disconnecting', async (reason) => {
        for (const room of socket.rooms) {
            if ( /^[A-Z]{4}$/.test(room) ) {
                const connectedPlayers = await io.in(room).fetchSockets();
                if(connectedPlayers.length<=1){
                  delete gameStore[room];
              }
            }
          }
    });
};

module.exports = gameSystem;