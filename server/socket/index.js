const { generateRoomCode } = require('../utils/codeGen');
class Game {
    constructor(lobbyCode, players) {
        this.lobbyCode = lobbyCode;
        this.players = players;
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

const gameStore = [];

function makePlayer(username, socketID) {
    this.username = username;
    this.socketID = socketID;
}

function gameLobby(socket) {
    console.log(socket.id);
    socket.on('newLobby', (username) => {
        const host = new makePlayer(username, socket.id);
        const newGame = new Game(generateRoomCode(), [host]);
        gameStore.push(newGame);
        socket.join(newGame.lobbyCode);
    })
    socket.on('joinLobby', (username, lobbyCode) => {
        const game = gameStore.find(item => item.lobbyCode === lobbyCode);
        if(game){
            game.addPlayer(username, socketID);
            socket.join(game.lobbyCode);
        };
    })
    socket.on('startGame', (lobbyCode) => {
        socket.emit('startingGame', gameStore.find(item => item.lobbyCode === lobbyCode));
    })
};

module.exports = gameLobby;