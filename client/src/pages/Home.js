import React from 'react';
import ParticleBackground from 'react-particle-backgrounds'


const Home = () => {
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

  return (
    <main>

      <div className="container">
        <div className="row">
          <div className="col text-center">
            <button className="align-self-end btn btn-danger btn-lg">Start Game</button>
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
