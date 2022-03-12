import React, {useContext, useEffect} from 'react';
import ParticleBackground from 'react-particle-backgrounds'
import { socketContext } from '../utils/socketContext';
import { Link } from 'react-router-dom';



const Home = () => {
  const {socket,gameData,setGameData} = useContext(socketContext);
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
  useEffect(()=>{
    socket.on('connect',()=>{
      const newData = {...gameData, gameState: "Testing", lobbyCode: "HIZE"};
      console.log('Connected to server with ID ' + socket.id);
      console.log(newData);
      setGameData(newData);
    })
  }, [socket,setGameData,gameData]);
  return (
    <main>

      <div className="container">
        <div className="row">
          <div className="d-grid gap-5 col-12 mx-auto">
            <Link className="align-self-end btn btn-danger btn-lg py-5"to="/lobby"><h1>START GAME</h1></Link>
            <Link className="align-self-end btn btn-danger btn-lg py-5"to="/lobby"><h1>JOIN GAME</h1></Link>
            <Link className="align-self-end btn btn-danger btn-lg py-5"to="/game"><h1>TEST GAME</h1></Link>
          
          </div>
        </div>
      </div>
      <ParticleBackground settings={settings} />
      <p>{gameData.gameState}</p>
      <div className="flex-row justify-center">
        <div className="col-12 col-md-10 my-3">
        </div>
      </div>
    </main>

  );
};

export default Home;
