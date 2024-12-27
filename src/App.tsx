// src/App.tsx
import React, { useState } from 'react';
import { GRAVITY, PADDLE_PROPERTIES, BALL_PROPERTIES } from './config';
import Pong from './components/Pong';
import './App.css';
import ControlPanel from './components/controls/ControlPanel';


const App: React.FC = () => {
  const [config, setConfig] = useState({
    gravity: GRAVITY,
    ballMass: BALL_PROPERTIES.MASS,
    ballRadius: BALL_PROPERTIES.RADIUS,
    ballMaxSpeed: BALL_PROPERTIES.MAX_SPEED,
    ballMaxBounceAngle: BALL_PROPERTIES.MAX_BOUNCE_ANGLE,
    ballSpinFactor: BALL_PROPERTIES.SPIN_FACTOR,
    leftPaddle: {
      width: PADDLE_PROPERTIES.WIDTH,
      height: PADDLE_PROPERTIES.HEIGHT,
      offset: PADDLE_PROPERTIES.OFFSET,
      successRate: PADDLE_PROPERTIES.LEFT_SUCCESS_RATE,
    },
    rightPaddle: {
      width: PADDLE_PROPERTIES.WIDTH,
      height: PADDLE_PROPERTIES.HEIGHT,
      offset: PADDLE_PROPERTIES.OFFSET,
      successRate: PADDLE_PROPERTIES.RIGHT_SUCCESS_RATE,
    },
  });

  const handleConfigChange = (newConfig: any) => {
    setConfig(newConfig);
  };

  return (
    <div className="App">
      <h1>Pong</h1>
      <Pong config={config} />
      <ControlPanel config={config} onChange={handleConfigChange} />
      {/* <div className="paddle-sections">
        <div className="paddle-section">
          <img src={YellowPaddle} alt="Yellow Paddle" />
        </div>
        <div className="paddle-section">
          <img src={BluePaddle} alt="Blue Paddle" />
        </div>
      </div> */}
    </div>
  );
};

export default App;