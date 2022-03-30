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
        this.currentTime = 0;
        this.currentTimer = '';
        this.error = '';
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
    newRound(holdRound) {
        this.currentPrompt = '';
        this.answers = {};
        this.selections = {};
        this.totalSelections = 0;
        this.gameState = "Select Prompt";

        const newFireChair = this.players[Math.floor(Math.random() * this.players.length)];
        console.log(newFireChair);
        this.fireChair = newFireChair;
        if (true) {
            this.currentRound = this.currentRound + 1;
        }
    }
    countScores() {
        for (const selectionCount in this.selections) {
            if (!(selectionCount === this._firechairName)) {
                this.players.find(item => item.username === selectionCount).currentScore += this.selections[selectionCount].length;
            } else {
                this.fireChair.currentScore += this.selections[selectionCount].length * 2;
                this.selections[selectionCount].forEach(element => {
                    this.players.find(item => item.username === element).currentScore += 2;
                });;
            }
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
            totalSelections: this.totalSelections,
            currentTime: this.currentTime,
            error: this.error,
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
const gameStore = {};


function gameSystem(socket, io) {
    console.log(socket.id);
    socket.on('CONNECTTOSERVER', (lobbyCode, username, callBack) => {
        try {
            if (!lobbyCode) {
                callBack({ gameState: null, lobbyCode: null });
                return
            }
            console.log(gameStore);
            if (gameStore[lobbyCode].players.find(item => item.username === username)) {
                gameStore[lobbyCode].addOrUpdatePlayer(new Player(username, socket.id), io);
                const isFireChair = (gameStore[lobbyCode].gameState === "Select Prompt" ||
                    gameStore[lobbyCode].gameState === "Select Answer") &&
                    gameStore[lobbyCode].fireChair.username === username;
                socket.join(lobbyCode);
                console.log(lobbyCode);
                const dataPackage = isFireChair ? gameStore[lobbyCode].clientDataFC() : gameStore[lobbyCode].clientData();
                callBack(dataPackage);
            }
        } catch {
            callBack({ gameState: null, lobbyCode: null });
        }
    });
    socket.on('newLobby', (username, usingCustomDeck, callBack) => {
        for (const room of socket.rooms) {
            if (/^[A-Z]{4}$/.test(room)) {
                callBack('');
                return;
            }
        }
        const host = new Player(username, socket.id);
        let newRoom;
        do{
            newRoom = generateRoomCode();
        }while(gameStore[newRoom]);
        const newGame = new Game(host, usingCustomDeck, newRoom);
        gameStore[newRoom] = newGame;

        socket.join(newGame.lobbyCode);
        socket.join('inLobby');
        callBack(gameStore[newRoom].lobbyCode);
    });

    socket.on('joinLobby', async (username, lobbyCode, callBack) => {
        const game = gameStore[lobbyCode];
        if (game) {
            const playJoining = await gameStore[lobbyCode].addOrUpdatePlayer(new Player(username, socket.id), io);
            if (playJoining) {
                socket.join(game.lobbyCode);
                callBack(lobbyCode);
                io.to(lobbyCode).emit('lobbyUpdate', gameStore[lobbyCode]);
            } else {
                callBack(false);
            }
        };
        console.log(gameStore);
    });

    socket.on('leaveLobby', async (username, lobbyCode, callBack) => {
        const game = gameStore[lobbyCode];
        if (game) {
            if (username === game.host.username) {
                const players = await io.in(lobbyCode).fetchSockets();
                io.to(lobbyCode).emit('lobbyUpdate', { gameState: 'Testing', lobbyCode: null });
                for (let player of players) {
                    player.leave(lobbyCode);
                }
                clearInterval(gameStore[lobbyCode].currentTimer);
                console.log('Removed due to game deletion');
                delete gameStore[lobbyCode];
            } else {
                gameStore[lobbyCode].players = game.players.filter(item => item.username !== username);
                io.to(lobbyCode).emit('lobbyUpdate', gameStore[lobbyCode].clientData());
                if (gameStore[lobbyCode].players.length === 0) {
                    clearInterval(gameStore[lobbyCode].currentTimer);
                    console.log('Removed due to game deletion');
                    delete gameStore[lobbyCode];
                }
            }
        };
        callBack(true);
        console.log(gameStore);
    });

    socket.on('startRound', (lobbyCode) => {
        startRound(lobbyCode, io);
    });

    socket.on('promptSelected', (lobbyCode, prompt) => {
        promptSelected(lobbyCode, prompt, io);
    });

    socket.on('answerReceived', (lobbyCode, answer, username) => {
        console.log('Working!');
        const game = gameStore[lobbyCode];
        if (game) {
            if (!gameStore[lobbyCode].answers[username]) {
                gameStore[lobbyCode].answers[username] = answer;
                console.log(gameStore[lobbyCode]);
                if (Object.keys(gameStore[lobbyCode].answers).length === game.players.length) {
                    for (const user in gameStore[lobbyCode].answers) {
                        gameStore[lobbyCode].selections[user] = [];
                    }
                    gameStore[lobbyCode].gameState = "Select Answer";
                    gameStore[lobbyCode].currentTime = 45;
                    io.to(lobbyCode).except(gameStore[lobbyCode].fireChair.socketID).emit('selectAnswers', gameStore[lobbyCode].clientData());
                    io.to(gameStore[lobbyCode].fireChair.socketID).emit('selectAnswersFC', gameStore[lobbyCode].clientDataFC());

                    clearInterval(gameStore[lobbyCode].currentTimer);
                    gameStore[lobbyCode].currentTimer = setInterval(() => {
                        if (gameStore[lobbyCode]) {
                            gameStore[lobbyCode].currentTime--;
                            console.log(gameStore[lobbyCode].currentTime);
                            if (gameStore[lobbyCode].currentTime === 0) {
                                clearInterval(gameStore[lobbyCode].currentTimer);
                                console.log("Interval Cleared, advancing game state.");
                                if (gameStore[lobbyCode].totalSelections >= 1) {
                                    gameStore[lobbyCode].gameState = "Display Score";
                                    gameStore[lobbyCode].countScores();
                                    io.to(lobbyCode).except(gameStore[lobbyCode].fireChair.socketID).emit('displaySelectionScore', gameStore[lobbyCode].clientData());
                                    io.to(gameStore[lobbyCode].fireChair.socketID).emit('displaySelectionScore', gameStore[lobbyCode].clientData());
                                } else {
                                    startRound(lobbyCode, io, 'No one made a selection, so the round was ended without scoring.');
                                }
                            }
                        } else {
                            clearInterval(gameStore[lobbyCode].currentTimer);
                            console.log('Removed due to game deletion');
                        }
                    }, 1000);
                }
            }
            gameStore[lobbyCode] = game;


        }
    });

    socket.on('selectReceived', (lobbyCode, selected, username) => {
        console.log(selected);
        const game = gameStore[lobbyCode];
        if (game) {
            if (gameStore[lobbyCode].selections[selected]) {
                gameStore[lobbyCode].selections[selected].push(username);
                gameStore[lobbyCode].totalSelections++;
                if (gameStore[lobbyCode].totalSelections >= game.players.length - 1) {
                    clearInterval(gameStore[lobbyCode].currentTimer);
                    gameStore[lobbyCode].gameState = "Display Score";
                    gameStore[lobbyCode].countScores();
                    io.to(lobbyCode).except(gameStore[lobbyCode].fireChair.socketID).emit('displaySelectionScore', gameStore[lobbyCode].clientData());
                    io.to(gameStore[lobbyCode].fireChair.socketID).emit('displaySelectionScore', gameStore[lobbyCode].clientData());
                }
            }
            gameStore[lobbyCode] = game;
        }
    });

    socket.on('endGame', async (lobbyCode) => {
        const game = gameStore[lobbyCode];
        if (game && game.host.socketID === socket.id) {
            game.gameState = 'Game Over';
            io.to(lobbyCode).emit('gameOver', game.clientData());
            const players = await io.in(lobbyCode).fetchSockets();
            for (let player of players) {
                player.leave(lobbyCode);
            }
            clearInterval(gameStore[lobbyCode].currentTimer);
            console.log('Removed due to game deletion');
            delete gameStore[lobbyCode];
        }
    });

    socket.on('disconnecting', async (reason) => {
        for (const room of socket.rooms) {
            if (/^[A-Z]{4}$/.test(room)) {
                const connectedPlayers = await io.in(room).fetchSockets();
                if (connectedPlayers.length <= 1) {
                    console.log('setupdelete');
                    console.log(room);
                    setTimeout(async () => {
                        console.log('Checkdelete');
                        console.log(room);
                        const connectedPlayers = await io.in(room).fetchSockets();
                        if (connectedPlayers.length <= 0) {
                            clearInterval(gameStore[room].currentTimer);
                            console.log('Removed due to game deletion');
                            delete gameStore[room];
                            console.log(room + " deleted.");
                        }
                    }, 5 * 1000);
                }
            }
        }
    });
};

module.exports = gameSystem;

function promptSelected(lobbyCode, prompt, io) {
    console.log('Working!');
    const game = gameStore[lobbyCode];
    if (game) {
        game.gameState = "Answer Prompt";
        game.currentPrompt = prompt;
        console.log(game.clientData());
        game.currentTime = 60;
        io.to(lobbyCode).emit('answerPrompt', game.clientData());

        clearInterval(gameStore[lobbyCode].currentTimer);
        gameStore[lobbyCode] = game;
        gameStore[lobbyCode].currentTimer = setInterval(() => {
            if (gameStore[lobbyCode]) {
                gameStore[lobbyCode].currentTime--;
                console.log(gameStore[lobbyCode].currentTime);
                if (gameStore[lobbyCode].currentTime === 0) {
                    clearInterval(gameStore[lobbyCode].currentTimer);
                    console.log("Interval Cleared, advancing game state.");
                    if (gameStore[lobbyCode].answers[gameStore[lobbyCode]._firechairName]) {
                        for (const user in gameStore[lobbyCode].answers) {
                            gameStore[lobbyCode].selections[user] = [];
                        }
                        gameStore[lobbyCode].gameState = "Select Answer";
                        gameStore[lobbyCode].currentTime = 45;
                        io.to(lobbyCode).except(gameStore[lobbyCode].fireChair.socketID).emit('selectAnswers', gameStore[lobbyCode].clientData());
                        io.to(gameStore[lobbyCode].fireChair.socketID).emit('selectAnswersFC', gameStore[lobbyCode].clientDataFC());
                    } else {
                        startRound(lobbyCode, io, 'The Firechair did not answer the prompt, so a new user was selected.');
                    }
                }
            } else {
                clearInterval(gameStore[lobbyCode].currentTimer);
                console.log('Removed due to game deletion');
            }
        }, 1000);
    }
}

function startRound(lobbyCode, io, errorMessage) {
    console.log('Working!');
    const game = gameStore[lobbyCode];
    if (game) {
        game.newRound(errorMessage);
        console.log(game.clientDataFC());
        if (errorMessage) {
            game.error = errorMessage;
        }
        game.currentTime = 20;
        io.to(lobbyCode).except(game.fireChair.socketID).emit('requestPrompt', game.clientData());
        io.to(game.fireChair.socketID).emit('requestPromptFC', game.clientDataFC());
        clearInterval(gameStore[lobbyCode].currentTimer);
        game.error = '';
        gameStore[lobbyCode] = game;
        gameStore[lobbyCode].currentTimer = setInterval(() => {
            if (gameStore[lobbyCode]) {
                gameStore[lobbyCode].currentTime--;
                console.log(gameStore[lobbyCode].currentTime);
                if (gameStore[lobbyCode].currentTime === 0) {
                    clearInterval(gameStore[lobbyCode].currentTimer);
                    console.log("Interval Cleared, starting new round.");
                    startRound(lobbyCode, io, 'The Firechair did not select a prompt, so a new user was selected.');
                }
            } else {
                clearInterval(gameStore[lobbyCode].currentTimer);
                console.log('Removed due to game deletion');
            }
        }, 1000);
    }
}
