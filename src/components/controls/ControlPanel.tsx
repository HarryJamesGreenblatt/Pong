import React, { useState, useEffect } from 'react';
import ControlInput from './ControlInput';
import { Box, Drawer, Accordion, AccordionSummary, AccordionDetails, Typography, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import {WINDOW_DIMENSIONS} from '../../config';
/*
    This interface defines the props that the ControlPanel component expects.
*/
interface ControlPanelProps {
  config: {                         // An object that represents the configuration for the Pong game containing:
    gravity: number;                   // A number that represents the amount of gravity in the game
    ballMass: number;                  // A number that represents the mass of the ball
    ballRadius: number;                // A number that represents the radius of the ball
    ballMaxSpeed: number;              // A number that represents the maximum speed of the ball
    ballMaxBounceAngle: number;        // A number that represents the maximum bounce angle of the ball
    ballSpinFactor: number;            // A number that represents the spin factor of the ball
    leftPaddle: {                      // An object that represents the configuration for the left paddle
      width: number;                     // A number that represents the width of the left paddle
      height: number;                    // A number that represents the height of the left paddle
      offset: number;                    // A number that represents the offset of the left paddle
      successRate: number;               // A number that represents the success rate of the left paddle
    };
    rightPaddle: {                     // An object that represents the configuration for the right paddle
      width: number;                     // A number that represents the width of the right paddle
      height: number;                    // A number that represents the height of the right paddle
      offset: number;                    // A number that represents the offset of the right paddle
      successRate: number;               // A number that represents the success rate of the right paddle
    };
  };
  onChange: (config: any) => void;  // A function that takes a configuration object as an argument and returns void
}

/*
    This component is a control panel that allows the user to adjust the game configuration.
    It takes the following props:
    - config: an object that represents the configuration for the Pong game
    - onChange: a function that takes a configuration object as an argument and returns void
*/
const ControlPanel: React.FC<ControlPanelProps> = ({ config, onChange }) => {

  // State variable to keep track of whether the drawer is open or closed
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Function to toggle the drawer open and closed
  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {

    // If the event is a keydown event and the key is 'Tab' or 'Shift', return early
    if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
      return;
    }

    // Set the state variable to open or closed based on the value of the 'open' parameter
    setDrawerOpen(open);
  };

  // Destructure the configuration object into individual state variables
  const [gravity, setGravity] = useState(config.gravity);
  const [ballMass, setBallMass] = useState(config.ballMass);
  const [ballRadius, setBallRadius] = useState(config.ballRadius);
  const [ballMaxSpeed, setBallMaxSpeed] = useState(config.ballMaxSpeed);
  const [ballMaxBounceAngle, setBallMaxBounceAngle] = useState(config.ballMaxBounceAngle);
  const [ballSpinFactor, setBallSpinFactor] = useState(config.ballSpinFactor);
  const [leftPaddleWidth, setLeftPaddleWidth] = useState(config.leftPaddle.width);
  const [leftPaddleHeight, setLeftPaddleHeight] = useState(config.leftPaddle.height);
  const [leftPaddleOffset, setLeftPaddleOffset] = useState(config.leftPaddle.offset);
  const [leftPaddleSuccessRate, setLeftPaddleSuccessRate] = useState(config.leftPaddle.successRate);
  const [rightPaddleWidth, setRightPaddleWidth] = useState(config.rightPaddle.width);
  const [rightPaddleHeight, setRightPaddleHeight] = useState(config.rightPaddle.height);
  const [rightPaddleOffset, setRightPaddleOffset] = useState(config.rightPaddle.offset);
  const [rightPaddleSuccessRate, setRightPaddleSuccessRate] = useState(config.rightPaddle.successRate);
  
  // The useEffect hook ensures that the configuration is updated whenever a state variable changes
  useEffect(() => {
    handleConfigChange();
  }, 
  [
    gravity,
    ballMass,
    ballRadius,
    ballMaxSpeed,
    ballMaxBounceAngle,
    ballSpinFactor,
    leftPaddleWidth,
    leftPaddleHeight,
    leftPaddleOffset,
    leftPaddleSuccessRate,
    rightPaddleWidth,
    rightPaddleHeight,
    rightPaddleOffset,
    rightPaddleSuccessRate,
  ]);


  // This function is called whenever a state variable changes to update the configuration
  const handleConfigChange = () => {

    // Call the onChange function with a new configuration object containing the updated state variables          
    onChange({
      gravity,
      ballMass,
      ballRadius,
      ballMaxSpeed,
      ballMaxBounceAngle,
      ballSpinFactor,
      leftPaddle: {
        width: leftPaddleWidth,
        height: leftPaddleHeight,
        offset: leftPaddleOffset,
        successRate: leftPaddleSuccessRate,
      },
      rightPaddle: {
        width: rightPaddleWidth,
        height: rightPaddleHeight,
        offset: rightPaddleOffset,
        successRate: rightPaddleSuccessRate,
      },
    });
    
  };
  
  // Return the control panel with sliders for each configuration
  return (
    <Box sx={{ textAlign: 'center', marginTop: 2 }}>
      <Button startIcon={<SettingsInputComponentIcon />} variant="text" color='error' onClick={toggleDrawer(true)}>
        Game Settings
      </Button>
      <Drawer anchor="bottom" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 'auto', Offset: 2, backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'whitesmoke' }}>
          <Accordion>
            <AccordionSummary expandIcon={<span role="img" aria-label="water">🌎</span>}>
              <Typography>Environmental Properties</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <ControlInput label="Gravity" min={0} max={1} step={0.1} value={gravity} onChange={setGravity} />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<span role="img" aria-label="ball">🏐</span>}>
              <Typography>Ball Properties</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid size={{xs:12}}>
                  <ControlInput label="Mass" min={0.1} max={5} step={0.1} value={ballMass} onChange={setBallMass} />
                  <ControlInput label="Radius" min={5} max={50} value={ballRadius} onChange={setBallRadius} />
                  <ControlInput label="Max Speed" min={1} max={50} value={ballMaxSpeed} onChange={setBallMaxSpeed} />
                  <ControlInput label="Max Bounce Angle" min={0} max={90} step={1} value={ballMaxBounceAngle * 180 / Math.PI} onChange={(value) => setBallMaxBounceAngle(value * Math.PI / 180)} />
                  <ControlInput label="Spin Factor" min={0} max={5} step={0.1} value={ballSpinFactor} onChange={setBallSpinFactor} />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<span role="img" aria-label="paddle">🏓</span>}>
              <Typography>Paddle Properties</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid size={{xs:6}}>
                  <Typography variant="h6">Left Paddle</Typography>
                  <ControlInput label="Width" min={5} max={50} value={leftPaddleWidth} onChange={setLeftPaddleWidth} />
                  <ControlInput label="Height" min={50} max={(WINDOW_DIMENSIONS.WIDTH/2)-50} value={leftPaddleHeight} onChange={setLeftPaddleHeight} />
                  <ControlInput label="Offset" min={0} max={(WINDOW_DIMENSIONS.WIDTH/2)-50} value={leftPaddleOffset} onChange={setLeftPaddleOffset} />
                  <ControlInput label="Success Rate" min={0} max={1} step={0.01} value={leftPaddleSuccessRate} onChange={setLeftPaddleSuccessRate} />
                </Grid>
                <Grid size={{xs:6}}>
                  <Typography variant="h6">Right Paddle</Typography>
                  <ControlInput label="Width" min={5} max={50} value={rightPaddleWidth} onChange={setRightPaddleWidth} />
                  <ControlInput label="Height" min={50} max={(WINDOW_DIMENSIONS.WIDTH/2)-50} value={rightPaddleHeight} onChange={setRightPaddleHeight} />
                  <ControlInput label="Offset" min={0} max={(WINDOW_DIMENSIONS.WIDTH/2)-50} value={rightPaddleOffset} onChange={setRightPaddleOffset} />
                  <ControlInput label="Success Rate" min={0} max={1} step={0.01} value={rightPaddleSuccessRate} onChange={setRightPaddleSuccessRate} />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Drawer>
    </Box>
  );
};

export default ControlPanel;