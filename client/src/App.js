import React, { useEffect, useReducer } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {socket, socketContext} from './utils/socketContext';
import auth from './utils/auth';

import Home from './pages/Home';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Lobby from './pages/Lobby';
import Game from './pages/Game';
import Header from './components/Header';
import Footer from './components/Footer';



const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const reducer = (state, pair) => ({ ...state, ...pair });



function App() {
  const [gameData, setGameData] = useReducer(reducer, {gameState: 'Testing',lobbyCode: localStorage.getItem('lobbycode')});
  useEffect(()=>{
    console.log(gameData.lobbyCode);
    socket.emit('CONNECTTOSERVER', gameData.lobbyCode, auth.getUsername(), (data) => {
      localStorage.setItem('lobbycode', data.lobbyCode);
      setGameData(data);
    });
  },[])
  return (
    <ApolloProvider client={client}>
      <socketContext.Provider value={{socket,gameData,setGameData}}>
      <Router>
        <div className="flex-column justify-flex-start min-100-vh">
          <Header />
          <div className="container">
            <Routes>
              <Route 
                path="/" 
                element={<Home />}
              />
              <Route 
                path="/login" 
                element={<Login />}
              />
              <Route 
                path="/signup" 
                element={<Signup />}
              />
              <Route 
                path="/me" 
                element={<Profile />}
              />
              <Route 
                path="/profiles/:profileId"
                element={<Profile />}
              />
              <Route 
                path="/lobby/:lobbyId"
                element={<Lobby />}
              />
              <Route 
                path="/game/:lobbyId"
                element={<Game />}
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
      </socketContext.Provider>
    </ApolloProvider>
  );
}

export default App;
