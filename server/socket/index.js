const { generateRoomCode } = require('../utils/codeGen');

class Game {
    constructor(host, useHostDeck, lobbyCode) {
        this.players = [host];
        this.lobbyCode = lobbyCode;
        this.gameState = 'lobby';
        this._hostName = host.username;
        this.useHostDeck = useHostDeck;
        this.currentRound = 0;
        this.currentPrompt = '';
        this._firechairName = '';
        this.answers = {};
        this.selections = {};
        this.totalSelections = 0;
    }
    get host() {
        return this.players.find(item => item.username === this._hostName);
    }
    set host(player) {
        this._hostName = player.username;
    }
    get fireChair() {
        return this.players.find(item => item.username === this._firechairName);
    }
    set fireChair(player) {
        this._firechairName = player.username;
    }
    addOrUpdatePlayer(player, io) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].username === player.username) {
                const checkStatus = io.sockets.sockets.get(this.players[i].socketId);
                if (checkStatus) {
                    this.players[i].socketID = player.socketID;
                    return true;
                } else {
                    return false;
                }
            }
        }
        this.players.push(player);
        return true;
    }
    newRound() {
        this.currentPrompt = '';
        this.firechair = '';
        this.answers = {};
        this.selections = {};
        this.totalSelections = 0;
        this.gameState = "Select Prompt";

        const newFireChair = game.players[Math.floor(Math.random() * game.players.length)];
        game.fireChair = newFireChair;
        game.currentRound = game.currentRound + 1;
    }
    clientData() {
        return {
            players: this.players,
            lobbyCode: this.lobbyCode,
            gameState: this.gameState,
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

function Player(username, socketID) {
    this.username = username;
    this.socketID = socketID;
    this.currentScore = 0;
}

const testGame = new Game ({}, false, 'ABCD');
const gameStore = {ABCD: testGame};


function gameSystem(socket, io) {
    console.log(socket.id);

    socket.on('newLobby', (username, usingCustomDeck, callBackError) => {
        for (const room of socket.rooms) {
            if (/^[A-Z]{4}$/.test(room)) {
                callBackError('Already in a game!');
                return;
            }
        }
        const host = new Player(username, socket.id);
        const newRoom = generateRoomCode();
        const newGame = new Game(host, usingCustomDeck, newRoom);
        gameStore[newRoom] = newGame;

        socket.join(newGame.lobbyCode);
        socket.join('inLobby');
        socket.emit('lobbyCreated', newRoom);
    });

    socket.on('joinLobby', (username, lobbyCode, callBackError) => {
        const game = gameStore[lobbyCode];
        if (game) {
            const playJoining = game.addOrUpdatePlayer(new Player(username, socket.id));
            if (playJoining) {
                socket.join(game.lobbyCode);
                socket.join('inLobby');
                socket.emit('lobbyJoined', game.clientData());
                io.to(game.lobbyCode).emit('lobbyUpdated', game.clientData());
            } else {
                callBackError('Username Already Used.');
            }
        };
    });

    socket.on('startRound', (lobbyCode) => {
        //console.log(gameStore);
        console.log('Working!');
        const game = gameStore[lobbyCode];
        game.gameState = "Select Prompt";
        console.log(game.clientData());
        if (game) {
            io.to(socket.id).emit('requestPrompt', game.clientData());
            // game.newRound();
            // io.to(lobbyCode).except(fireChair.socketID).emit('startingRound', game.clientData());
            // console.log(game.clientData());
            // io.to(fireChair.socketID).emit('requestPrompt', game.clientData());
        }
    });

    socket.on('promptSelected', (lobbyCode, prompt) => {
        console.log('Working!');
        const game = gameStore[lobbyCode];
        game.gameState = "Answer Prompt";
        console.log(game.clientData());
        if (game) {
            io.to(socket.id).emit('answerPrompt', game.clientData());
            // game.prompt = prompt;
            // game.gameState = "Answer Prompt";
            // io.to(lobbyCode).except(game.fireChair.socketID).emit('answerPrompt', game.clientData());
            // io.to(game.fireChair.socketID).emit('answerPromptFC', game.clientData());
        }
    });

    socket.on('answerReceived', (lobbyCode, answer, username) => {
        console.log('Working!');
        const game = gameStore[lobbyCode];
        game.gameState = "Select Answer";
        console.log(game.clientData());
        if (game) {
            io.to(socket.id).emit('selectAnswers', game.clientData());
            // if (!game.answers[username]) {
            //     game.answers[username] = answer;
            //     if (game.answers.keys().length === game.players.length) {
            //         for (const user in game.answers) {
            //             game.selections[user] = 0;
            //         }
            //         game.gameState = "Select Answer";
            //         io.to(lobbyCode).except(game.fireChair.socketID).emit('selectAnswers', game.clientData());
            //         io.to(game.fireChair.socketID).emit('awaitSelect', game.clientData());
            //     }
            // }
        }
    });

    socket.on('selectReceived', (lobbyCode, selected, username) => {
        console.log('Working!');
        const game = gameStore[lobbyCode];
        game.gameState = "End of Test";
        console.log(game.clientData());
        if (game) {
            io.to(socket.id).emit('displaySelectionScore', game.clientData());
            // if (!game.selections[username]) {
            //     game.selections[username]++;
            //     game.totalSelections++;
            //     if (game.totalSelections === game.players.length - 1) {
            //         game.gameState = "Display Score";
            //         io.to(lobbyCode).except(game.fireChair.socketID).emit('displaySelectionScore', game.clientData());

            //     }
            // }
        }
    });

    socket.on('endGame', async (lobbyCode) => {
        const game = gameStore[lobbyCode];
        if (game && game.host.socketID === socket.id) {
            io.to(lobbyCode).emit('gameOver', game.clientData());
            const players = await io.in(lobbyCode).fetchSockets();
            for (let player of players) {
                player.leave(lobbyCode);
            }
            delete gameStore[lobbyCode];
        }
    });

    socket.on('disconnecting', async (reason) => {
        for (const room of socket.rooms) {
            if (/^[A-Z]{4}$/.test(room)) {
                const connectedPlayers = await io.in(room).fetchSockets();
                if (connectedPlayers.length <= 1) {
                    delete gameStore[room];
                }
            }
        }
    });
};

module.exports = gameSystem;