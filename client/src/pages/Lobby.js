import React, { useContext, useEffect } from "react";
import auth from "../utils/auth";
import { Navigate, useParams } from "react-router-dom";
import { socketContext } from "../utils/socketContext";
import { Link } from "react-router-dom";

const Lobby = () => {
  const { socket, gameData, setGameData } = useContext(socketContext);


  
  useEffect(() => {
    socket.on('lobbyUpdate', clientData => {
      setGameData(clientData);
      if(!clientData.lobbyCode){
        window.location.reload();
      }
    });
    return () => {
      socket.off('lobbyUpdate', clientData => {
        setGameData(clientData);
      });
    }
  }, [socket, setGameData]);
  
  if (!gameData.lobbyCode) {
    return <h1>This lobby no longer exists... sorry!</h1>;
  }
  if (!gameData.players) {
    return <h1>Loading game data...</h1>;
  }
  return (
    <>
      <h1 className="text-light text-center">
        Are you ready for your seat to get warm?
      </h1>

      {auth.loggedIn() ? (
        <>
          <div className="centered">
            <h1 className="text-light text-center bg-primary">Lobby Code: {gameData.lobbyCode} </h1>
            {/* Placeholder for dynamic to be added */}

            <div className="text-center bg-light">
              {gameData.players.map(item => {
                return <h1>{item.username}</h1>
              })}
            </div>
          </div>
          {/* Plug in socket to dynamically add user when lobby is joined */}

          <button className="btn-danger btn-lg py-5 align-item-center justify-content-center">
            <h1>START</h1>
          </button>

        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Lobby;
