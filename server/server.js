const express = require('express');
const http = require('http');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const { authMiddleware } = require('./utils/auth');
const socketIO = require('socket.io');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const gameLobby = require('./socket');

const PORT = process.env.PORT || 3001;
const app = express();
const httpServer= http.createServer(app);

const io = socketIO(httpServer, {
  cors: {
      origin: ['http://localhost:3000'],
      credentials: true
  }
})

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

io.on('connection', (socket)=>{
  gameLobby(socket, io);
});
// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });
  
  db.once('open', () => {
    httpServer.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
  };
  
// Call the async function to start the server
  startApolloServer(typeDefs, resolvers);
