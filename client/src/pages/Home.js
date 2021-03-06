import React, { useContext, useEffect, useState } from 'react';
import ParticleBackground from 'react-particle-backgrounds'
import { socketContext } from '../utils/socketContext';
import { Link, Navigate } from 'react-router-dom';
import auth from '../utils/auth';

const Home = () => {
  const { socket, gameData, setGameData } = useContext(socketContext);
  const [ID, setID] = useState('');
  const [validCode, setvalidCode] = useState(false);
  const [error, setError] = useState('');
  const settings = {
    canvas: {
      canvasFillSpace: true,
      width: 200,
      height: 500,
      useBouncyWalls: false
    },
    particle: {
      particleCount: 100,
      color: "#d68c38",
      minSize: 2,
      maxSize: 4
    },
    velocity: {
      directionAngle: 0,
      directionAngleVariance: 30,
      minSpeed: 0.2,
      maxSpeed: 7
    },
    opacity: {
      minOpacity: 0,
      maxOpacity: 0.5,
      opacityTransitionTime: 5000
    }
  }

  function handleChange(e) {
    setID(e.target.value);
    if (/^[A-Za-z]{4}$/.test(e.target.value)) {
      setvalidCode(true);
    } else {
      setvalidCode(false);
    }
  }

  function attemptJoin(lobbyCode) {
    if (lobbyCode) {
      setGameData({ ...gameData, lobbyCode });
      localStorage.setItem('lobbycode', lobbyCode);
      window.location.assign(`lobby/${lobbyCode}`)
    } else {
      setError("Could not find lobby");
    }
  }
  function joinLobby(lobbyCode) {
    socket.emit('joinLobby', auth.getUsername(), lobbyCode, attemptJoin);
  }

  function attemptHost(lobbyCode) {
    if (lobbyCode) {
      setGameData({ ...gameData, lobbyCode });
      localStorage.setItem('lobbycode', lobbyCode);
      window.location.assign(`lobby/${lobbyCode}`);
    } else {
      setError('Already in a lobby!');
    }
  }
  function hostLobby() {
    socket.emit('newLobby', auth.getUsername(), false, attemptHost);
  }

  function attemptLeave(status) {
    if (status) {
      localStorage.removeItem('lobbycode');
      setError('Lobby has been left.');
      setGameData({ gameState: 'Testing', lobbyCode: localStorage.getItem('lobbycode') });
    }
  }
  function leaveGame() {
    socket.emit('leaveLobby', auth.getUsername(), gameData.lobbyCode, attemptLeave);
    if (gameData.host.username === auth.getUsername()) {
      socket.emit('endGame', gameData.lobbyCode);
    }
  }
  return (
    <main>
      <div className="container">
        <div className="row">
          <div className="d-grid gap-5 col-12 mx-auto">
            {auth.loggedIn() ? <>
              <h3 className='text-light'>{error}</h3>
              {gameData.lobbyCode ? <>
                {gameData.gameState === 'lobby' ?
                  <button className="align-self-end btn btn-danger btn-lg py-5" onClick={() => joinLobby(gameData.lobbyCode)}><h1>RE-JOIN GAME</h1></button>
                  :
                  <Link className="align-self-end btn btn-danger btn-lg py-5" to={`game/${gameData.lobbyCode}`}><h1>RE-JOIN GAME</h1></Link>}
                <button className="align-self-end btn btn-danger btn-lg py-5" onClick={leaveGame}><h1>LEAVE GAME</h1></button>
              </> : <>
                <input class="form-control form-control-lg" type="text" placeholder="Have A Lobby Code?" onChange={handleChange} value={ID}></input>
                <button className="align-self-end btn btn-danger btn-lg py-5" onClick={() => joinLobby(ID.toUpperCase())} disabled={!validCode}><h1>JOIN GAME</h1></button>
                <button className="align-self-end btn btn-danger btn-lg py-5" onClick={hostLobby}><h1>HOST GAME</h1></button>
              </>}
            </> : <>
              <Link className="align-self-end btn btn-danger btn-lg py-5" to="/login"><h1>Login or Signup to play!</h1></Link>
            </>}

          </div>
        </div>
      </div>
      <ParticleBackground settings={settings} />
      <div className="flex-row justify-center">
        <div className="col-12 col-md-10 my-3">
        </div>
      </div>
    </main>

  );
};

export default Home;
