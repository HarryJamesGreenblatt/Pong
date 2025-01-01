// src/App.tsx
import React, { useState } from 'react';
import { GRAVITY, PADDLE_PROPERTIES, BALL_PROPERTIES } from './config';
import Pong from './components/Pong';
import './App.css';
import ControlPanel from './components/controls/ControlPanel';
import { GameDataProvider } from './context/GameDataContext';


// App component
const App: React.FC = () => {
  

  // State variable to keep track of the game configuration
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

  // Function to update the configuration when the control panel changes
  const handleConfigChange = (newConfig: any) => {
    setConfig(newConfig);
  };

  // Render the Pong game and the control panel
  return (

    // Wrap the app in the GameDataProvider to provide game data to the children
    <GameDataProvider>
      
      <div className="App">
        <h1>Pong</h1>
        <Pong config={config} />
        <ControlPanel config={config} onChange={handleConfigChange} />
      </div>
      
    </GameDataProvider>
  );
};

export default App;