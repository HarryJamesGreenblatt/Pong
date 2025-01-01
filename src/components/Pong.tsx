// src/components/Pong.tsx
import React, { useRef, useEffect, useState } from 'react';
import p5 from 'p5';
import Paddle from './Paddle';
import Ball from './Ball';
import { COLORS, WINDOW_DIMENSIONS } from '../config'
import '../App.css'; 
import { useGameData } from '../context/GameDataContext';


// Pong component that takes a config object as a prop and renders a p5 sketch
const Pong: React.FC<{ config: any }> = ({ config }) => {
  

  // Create a reference to the div element that will contain the sketch
  const sketchRef = useRef<HTMLDivElement>(null); 

  // Create a reference to the game data context
  const { gameData, setGameData } = useGameData();

  // Create state variable to transform the game data
  const [transformedGameData, setTransformedGameData] = useState<any[]>([]);

  // Create state variables to keep track of the volleys and start time
  const [volleys, setVolleys] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);


  // useEffect hook to create the sketch when the component mounts
  useEffect(() => {

    // use the p5 constructor to create a new sketch
    const sketch = (p: p5) => {
      let ball: Ball;           
      let leftPaddle: Paddle;   
      let rightPaddle: Paddle;  
      let leftScore = 0;        
      let rightScore = 0;       
      let cooldown = 60;        
      let cooldownCounter = 0;  

      // Setup function to create the canvas and objects
      p.setup = () => {

        // Create a canvas using the window dimensions
        p.createCanvas(WINDOW_DIMENSIONS.WIDTH, WINDOW_DIMENSIONS.HEIGHT);

        // Create a new ball object in the center of the canvas
        ball = new Ball(
          p.width / 2,
          p.height / 2,
          config.ballRadius,
          config.ballMass,
          config.gravity,
          config.ballSpinFactor,
          config.ballMaxSpeed,
          config.ballMaxBounceAngle
        );

        // Set the onPaddleCollision function to increment the volleys counter
        ball.onPaddleCollision = () => {

          // Increment the volleys counter
          setVolleys((prevVolleys) => {
            const newVolleys = prevVolleys + 1;
              
            // Update the game data with the new volleys counter
            setGameData((prevData) => {

              // Create a new array with the previous data
              const updatedData = [...prevData];

              // If there is any data, update the last entry with the new volleys counter
              if (updatedData.length > 0) {
                updatedData[updatedData.length - 1].volleys = newVolleys;
              }

              // Set the game data to the updated data
              return updatedData;
            });
            
            // Return the new volleys counter
            return newVolleys;
          });
        };

        // Create a new left paddle
        leftPaddle = new Paddle(
          config.leftPaddle.offset,
          p.height / 2 - config.leftPaddle.height / 2,
          config.leftPaddle.width,
          config.leftPaddle.height,
          COLORS.YELLOW,
          config.leftPaddle.successRate
        );
        
        // Create a new right paddle
        rightPaddle = new Paddle(
          p.width - config.rightPaddle.offset - config.rightPaddle.width,
          p.height / 2 - config.rightPaddle.height / 2,
          config.rightPaddle.width,
          config.rightPaddle.height,
          COLORS.BLUE,
          config.rightPaddle.successRate
        );

        // Set the start time to the current time
        setStartTime(Date.now());
        
      };

      // Draw function to update the canvas
      p.draw = () => {

        // Set the background color to black
        p.background(COLORS.DARK);

        // if the cooldown counter is 0, move the ball
        if (cooldownCounter === 0) {
          ball.move();
        } else {
          // otherwise, decrement the cooldown counter
          cooldownCounter--;
        }

        // Draw the ball
        ball.draw(p);
        
        // Draw the left paddle and make it follow the ball
        leftPaddle.draw(p);
        leftPaddle.follow(p, ball);

        // Draw the right paddle and make it anticipate the ball
        rightPaddle.draw(p);
        rightPaddle.anticipate(ball);

        // Prpare to draw a dashed center line
        p.strokeWeight(1);               
        p.stroke(COLORS.WHITE);

        // For each 20 pixel segment going from 5 pixels to the height of the canvas:
        for (let i = 5; i < p.height; i += 20) {
          
          // Draw a a dashed line at the center of the canvas.
          // where the line ends 10 pixels down, leaving a 10 pixel gap.
          p.line(p.width / 2, i, p.width / 2, i + 10);
        
        }

        // Draw scores
        p.strokeWeight(0.25);                         // Set the stroke weight to 0.25
        p.textSize(36);                               // Set the text size to 32
        p.fill(leftPaddle.color);                     // Set the fill color to the left paddle color
        p.text(leftScore, p.width / 4, 50);           // Display the left score
        p.fill(rightPaddle.color);                    // Set the fill color to the right paddle color
        p.text(rightScore, (p.width * 3) / 4, 50);    // Display the right score

        // Check for collisions and scoring
        ball.handlePaddleCollision(leftPaddle);       // Check for collision with left paddle
        ball.handlePaddleCollision(rightPaddle);      // Check for collision with right paddle
        
        const outOfBounds = ball.checkOutOfBounds();  // Check if the ball is out of bounds
      
        if (outOfBounds) {                            // If the ball is out of bounds
          
          const endTime = Date.now();                   // Get the current time 
          const timeTaken =                             // Calculate the time taken
          (endTime - (startTime || endTime)) / 1000;    // in seconds
          
          if (outOfBounds === 'left') rightScore++;    // Increment the right score if out of bounds on left
          if (outOfBounds === 'right') leftScore++;    // Increment the left score if out of bounds on right
          
          setGameData((prevData) => [                   // Update the game data 
            ...prevData,                                //  with all the previous data
            {                                           //  and the new data, including:
              volleys,                                     //  the number of volleys,
              leftScore,                                   //  the left score,
              rightScore,                                  //  the right score,
              timeTaken,                                   //  the time taken,
              endTime,                                     //  the end time,
              scorer: outOfBounds === 'left'            // track the next scorer:
              ? 'Blue'                                   // if out of bounds on left, next scorer is 'Blue'   
              : 'Yellow',                                // otherwise, next scorer is 'Yellow'
            },
          ]);
          
          setVolleys(0);                               // Reset the volleys counter
          setStartTime(Date.now());                       
          
          ball.reset(p);                               // Reset the ball
      
          cooldownCounter = cooldown;                  // Set the cooldown counter to the cooldown value
        }        
      };
    };

    // Create a new p5 instance with the sketch and the ref to the div element
    const p5Instance = new p5(sketch, sketchRef.current!);

    // Remove the sketch when the component unmounts
    return () => p5Instance.remove();

  }, [config]); // Add config as a dependency


  // Transform the game data to include the time taken and readable end time
  useEffect(() => {

    // Map over the game data and transform each entry
    const transformedData = gameData.map((data, index) => {

      // Calculate the relative time taken from the previous end time
      const previousEndTime = index > 0 ? gameData[index - 1].endTime : startTime;
      const relativeTimeTaken = (data.endTime - (previousEndTime || data.endTime)) / 1000;

      // Calculate the human readable end time
      const readableEndTime = new Date(data.endTime).toLocaleString(); 

      // Return the transformed data
      return {
        ...data,
        timeTaken: relativeTimeTaken,
        readableEndTime,
      };

    });

    // Set the transformed game data
    setTransformedGameData(transformedData);
  }, [gameData]); // The effect will run whenever the game data changes

  // Log the transformed game data to the console
  useEffect(() => {
    console.log(transformedGameData);
  }, [transformedGameData]); // The effect will run whenever the transformed game data changes

  // Render the div element that will contain the sketch
  return (
    <div className="pong-container" ref={sketchRef}></div>
  );

};

export default Pong;