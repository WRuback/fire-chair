import socketIO from 'socket.io-client';
import React from 'react';

export const socket = socketIO.connect('');
export const socketContext = React.createContext();
// useEffect(()=>{
//     const socket = io('http://localhost:3001');
//     socket.on('connect',()=>{
//      console.log("Conect to server!");
//     });
//     socket.on('startGame',(game)=>{
//       console.log(game);
//      });
//   },[]);