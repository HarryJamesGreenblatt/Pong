// src/components/Pong.tsx
import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import Paddle from './Paddle';
import Ball from './Ball';
import { COLORS, WINDOW_DIMENSIONS } from '../config'
import '../App.css'; // Import the CSS file


const Pong: React.FC<{ config: any }> = ({ config }) => {
  
  // Create a reference to the div element that will contain the sketch
  const sketchRef = useRef<HTMLDivElement>(null); 

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
          if (outOfBounds === 'left') rightScore++;      // Increment the right score if the ball is out on the left   
          if (outOfBounds === 'right') leftScore++;      // Increment the left score if the ball is out on the right
          ball.reset(p);                                 // Reset the ball to the center of the canvas
          cooldownCounter = cooldown;                    // Set the cooldown counter to the cooldown value
        }
      };
    };

    // Create a new p5 instance with the sketch and the ref to the div element
    const p5Instance = new p5(sketch, sketchRef.current!);

    // Remove the sketch when the component unmounts
    return () => p5Instance.remove();

  }, [config]); // Add config as a dependency

  // Return the pong container that will contain the sketch
  return <div className="pong-container" ref={sketchRef}></div>;

};

export default Pong;