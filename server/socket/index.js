const { generateRoomCode } = require('../utils/codeGen');
const { User } = require('../models');
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
    async addOrUpdatePlayer(player, io) {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].username === player.username) {
                const checkStatus = io.to(this.players[i].socketId).fetchSockets();
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
        this.answers = {};
        this.selections = {};
        this.totalSelections = 0;
        this.gameState = "Select Prompt";

        const newFireChair = this.players[Math.floor(Math.random() * this.players.length)];
        console.log(newFireChair);
        this.fireChair = newFireChair;
        this.currentRound = this.currentRound + 1;
    }
    countScores() {
        for (const selectionCount in this.selections) {
            this.players.find(item => item.username === selectionCount).currentScore += this.selections[selectionCount].length;
        }
    }
    clientData() {
        return {
            players: this.players,
            lobbyCode: this.lobbyCode,
            gameState: this.gameState,
            host: this.host,
            useHostDeck: this.useHostDeck,
            currentPrompt: this.currentPrompt,
            currentRound: this.currentRound,
            fireChair: this.fireChair,
            answers: this.answers,
            selections: this.selections,
            totalSelections: this.totalSelections
        }
    }
    clientDataFC() {
        return {
            ...this.clientData(),
            gameState: this.gameState + 'FC'
        }
    }
}

function Player(username, socketID) {
    this.username = username;
    this.socketID = socketID;
    this.currentScore = 0;
}
const testplayer = new Player("Testman", "weertetufghft");
const testGame = new Game(testplayer, false, 'ABCD');
const gameStore = { ABCD: testGame };


function gameSystem(socket, io) {
    console.log(socket.id);
    socket.on('CONNECTTOSERVER', async (lobbyCode, userToken, callBack) => {
        if (!userToken) {
            return;
        }
        const user = await User.findById(userToken.data._id);
        const username = user.username;
        console.log(user, username);
        if (gameStore[lobbyCode].players.find(item => item.username === username)) {
            gameStore[lobbyCode].addOrUpdatePlayer(new Player(username, socket.id), io);
            const isFireChair = (gameStore[lobbyCode].gameState === "Select Prompt" ||
                gameStore[lobbyCode].gameState === "Select Answer") &&
                gameStore[lobbyCode].fireChair.username === username;
            const dataPackage = isFireChair ? gameStore[lobbyCode].clientDataFC(): gameStore[lobbyCode].clientData();
            console.log(dataPackage);
            callBack(dataPackage);
        }
    });
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
            const playJoining = game.addOrUpdatePlayer(new Player(username, socket.id), io);
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
        console.log('Working!');
        const game = gameStore[lobbyCode];
        if (game) {
            game.newRound();
            console.log(game.clientDataFC());
            io.to(lobbyCode).except(game.fireChair.socketID).emit('requestPrompt', game.clientData());
            io.to(game.fireChair.socketID).emit('requestPromptFC', game.clientDataFC());
            gameStore[lobbyCode] = game;
        }
    });

    socket.on('promptSelected', (lobbyCode, prompt) => {
        console.log('Working!');
        const game = gameStore[lobbyCode];
        if (game) {
            game.gameState = "Answer Prompt";
            game.currentPrompt = prompt;
            console.log(game.clientData());
            io.to(socket.id).emit('answerPrompt', game.clientData());
            gameStore[lobbyCode] = game;
        }
    });

    socket.on('answerReceived', (lobbyCode, answer, username) => {
        console.log('Working!');
        const game = gameStore[lobbyCode];
        if (game) {
            if (!game.answers[username]) {
                game.answers[username] = answer;
                if (Object.keys(game.answers).length === game.players.length) {
                    for (const user in game.answers) {
                        game.selections[user] = [];
                    }
                    game.gameState = "Select Answer";
                    console.log(game);
                    io.to(lobbyCode).except(game.fireChair.socketID).emit('selectAnswers', game.clientData());
                    io.to(game.fireChair.socketID).emit('selectAnswersFC', game.clientDataFC());
                }
            }
            gameStore[lobbyCode] = game;
        }
    });

    socket.on('selectReceived', (lobbyCode, selected, username) => {
        console.log(selected);
        const game = gameStore[lobbyCode];
        if (game) {
            if (game.selections[selected]) {
                game.selections[selected].push(username);
                game.totalSelections++;
                if (game.totalSelections >= game.players.length - 1) {
                    game.gameState = "Display Score";
                    game.countScores();
                    console.log(game);
                    io.to(lobbyCode).except(game.fireChair.socketID).emit('displaySelectionScore', game.clientData());
                    io.to(game.fireChair.socketID).emit('displaySelectionScore', game.clientData());
                }
            }
            gameStore[lobbyCode] = game;
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