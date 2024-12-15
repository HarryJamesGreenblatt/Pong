import p5 from 'p5';
import { WINDOW_DIMENSIONS, COLORS } from '../config';
import Ball from './Ball';

// Definition of the Paddle class
class Paddle {
  x: number;                           // x-coordinate of the paddle
  y: number;                           // y-coordinate of the paddle
  width: number;                       // width of the paddle
  height: number;                      // height of the paddle
  color: Array<number> = COLORS.WHITE; // color of the paddle
  successRate: number;                 // success rate of the paddle

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: Array<number>,
    successRate: number = 0.87) 
  {
    this.x           = x;
    this.y           = y;
    this.width       = width;
    this.height      = height;
    this.color       = color;
    this.successRate = successRate;
  }

  // Draw the paddle on the canvas
  //   p: a reference to the p5 instance
  draw(p: p5) {
    
    // Set the fill color to the color of the paddle
    p.fill(this.color);

    // Draw the paddle, represented as a rectangular primitive
    p.rect(this.x, this.y, this.width, this.height);

  }

  // Make the paddle follow the ball
  //   p: a reference to the p5 instance
  //   ball: a reference to the Ball object
  follow(p: p5, ball: Ball) {

    // If this random number is within the success rate:
    if (p.random(1) < this.successRate) {
      
      // Calculate the difference between the ball's y-coordinate and the center of the paddle
      const difference = ball.y - (this.y + this.height / 2);

      // Move by 10% of the difference
      const moveAmount = difference * 0.1;  
      this.y += moveAmount;
      
      // if the paddle is at the top of the screen
      if (this.y < 0) {
        this.y = 0; // set the y-coordinate to 0
      }
    
      // if the paddle is at the bottom of the screen
      if (this.y + this.height > WINDOW_DIMENSIONS.HEIGHT) {

        // set the y-coordinate to the height of the window minus the height of the paddle
        this.y = WINDOW_DIMENSIONS.HEIGHT - this.height;

      }
    }
  }

  // Make the paddle anticipate where the ball will land
  //   p: a reference to the p5 instance
  //   ball: a reference to the Ball object
  anticipate(p: p5, ball: Ball) {

    // Predict the future position of the ball
    const predictedY = ball.y + ball.speedY * (this.x - ball.x) / ball.speedX;

    // Calculate the difference between the predicted position and the center of the paddle
    const difference = predictedY - (this.y + this.height / 2);

    // Scale the movement amount based on the success rate
    const moveAmount = difference * 0.1 * this.successRate;
    this.y += moveAmount;

    // if the paddle is at the top of the screen
    if (this.y < 0) {

      // set the y-coordinate to 0
      this.y = 0; 

    }

    // if the paddle is at the bottom of the screen
    if (this.y + this.height > WINDOW_DIMENSIONS.HEIGHT) {

      // set the y-coordinate to the height of the window minus the height of the paddle
      this.y = WINDOW_DIMENSIONS.HEIGHT - this.height;

    }
  }
}

export default Paddle;