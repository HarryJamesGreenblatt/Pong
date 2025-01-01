import p5 from 'p5';
import { BALL_PROPERTIES, COLORS, WINDOW_DIMENSIONS } from '../config';
import Paddle from './Paddle';

// Definition of the Ball class
class Ball {
  x:              number;               // x-coordinate of the ball
  y:              number;               // y-coordinate of the ball
  radius:         number;               // radius of the ball
  speedX:         number;               // horizontal speed of the ball
  speedY:         number;               // vertical speed of the ball
  spinFactor:     number;               // spin of the ball
  mass:           number;               // mass of the ball
  gravity:        number;               // gravity acting on the ball
  maxSpeed:       number;               // maximum speed     
  maxBounceAngle: number = Math.PI / 4; // maximum bounce angle

  constructor(
    x: number,
    y: number,
    radius: number,
    mass: number,
    gravity: number,
    spinFactor: number = 0,
    maxSpeed: number,
    maxBounceAngle: number) 
  {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.mass = mass;
    this.speedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    this.speedY = 5 * (Math.random() > 0.5 ? 1 : -1);
    this.spinFactor = spinFactor;
    this.gravity = gravity;
    this.maxSpeed = maxSpeed;
    this.maxBounceAngle = maxBounceAngle;
  }

  // Draw the ball on the canvas
  //   p: a reference to the p5 instance
  draw(p: p5) {

    // Set the fill color to white
    p.fill(COLORS.WHITE);

    // Draw the ball, represented as an ellipse primitive
    p.ellipse(this.x, this.y, this.radius * 2);
  }

  // Move the ball according to its speed and gravity
  //   p: a reference to the p5 instance
  move() {
    this.speedY += this.gravity;  // Apply gravity to the vertical speed
    this.x += this.speedX;        // Move the ball horizontally
    this.y += this.speedY;        // Move the ball vertically
    this.y += this.spinFactor;    // Apply spin to the vertical position

    // Check for collision with the top and bottom of the window
    // if the ball hits the top 
    if (this.y - this.radius < 0) {
      
      // set the y-coordinate to the radius
      this.y = this.radius;
      
      // reverse the vertical speed
      this.speedY *= -1;
    }
    // otherwise, if the ball hits the bottom
    else if (this.y + this.radius > WINDOW_DIMENSIONS.HEIGHT) {
      
      // set the y-coordinate to the height of the window minus the radius
      this.y = WINDOW_DIMENSIONS.HEIGHT - this.radius;
      
      // reverse the vertical speed
      this.speedY *= -1;
    }
  }

  // Add a callback function for paddle collisions
  onPaddleCollision: (() => void) | null = null;

  // Handle collision with a paddle
  //   paddle: a reference to the Paddle object
  handlePaddleCollision(paddle: Paddle) {

    // if the ball is within the bounds of the paddle
    if (                                                // then each of the following conditions must be true: 
      this.x - this.radius < paddle.x + paddle.width && // - the ball's left side is to the left of the paddle's right side.
      this.x + this.radius > paddle.x &&                // - the ball's right side is to the right of the paddle's left side.
      this.y > paddle.y &&                              // - the ball's top side is below the top side of the paddle
      this.y < paddle.y + paddle.height                 // - the ball's bottom side is above the bottom side of the paddle
    ) {

      // Calculate the relative intersection point on the paddle,
      // which is the difference between the center of the paddle and the center of the ball
      const relativeIntersectY = (paddle.y + paddle.height / 2) - (this.y + this.radius / 2);

      // Normalize the relative intersection point to a value between -1 and 1
      const normalizedRelativeIntersectY = relativeIntersectY / (paddle.height / 2);

      // Calculate the bounce angle based on the normalized relative intersection point
      const bounceAngle = normalizedRelativeIntersectY * this.maxBounceAngle;

      // Update the ball's speed, spin, and mass
      this.speedX = -this.speedX;                                          
      this.speedY = this.speedX * Math.sin(bounceAngle) / this.mass;
      this.spinFactor = normalizedRelativeIntersectY * this.spinFactor;

      // Increase the speed and decrease the mass of the ball after each successive collision
      this.speedX *= 1.05;  // Increase the horizontal speed by 5%
      this.speedY *= 1.05;  // Increase the vertical speed by 5%
      this.mass *= 0.99;    // Decrease the mass by 1%

      // Ensure the ball's speed does not exceed the Maximum Speed
      this.speedX = Math.max(Math.min(this.speedX, this.maxSpeed), -this.maxSpeed);
      this.speedY = Math.max(Math.min(this.speedY, this.maxSpeed), -this.maxSpeed);

      // Unstick the ball from the paddle after collision in case of an overlap condition
      this.unstick(paddle);

      if (this.onPaddleCollision) {
        this.onPaddleCollision();
      }
    }

  }

  // Unstick the ball from the paddle after collision
  //   paddle: a reference to the Paddle object
  unstick(paddle: Paddle) {
  
    // if the ball is within the bounds of the paddle:
    if (this.y < paddle.y && this.speedY > 0) {

      // set the y-coordinate to the top of the paddle minus the radius
      this.y = paddle.y - this.radius - 1;
    
    } 
    // otherwise, if the ball is below the paddle:
    else if (this.y > paddle.y + paddle.height && this.speedY < 0) {
      
      // set the y-coordinate to the bottom of the paddle plus the radius
      this.y = paddle.y + paddle.height + this.radius + 1;
    
    } 
    // otherwise, if the ball is to the left of the paddle:
    else if (this.x < paddle.x && this.speedX > 0) {
      
      // set the x-coordinate to the left of the paddle minus the radius
      this.x = paddle.x - this.radius - 1;
    
    } 
    else if (this.x > paddle.x + paddle.width && this.speedX < 0) {
      
      // set the x-coordinate to the right of the paddle plus the radius
      this.x = paddle.x + paddle.width + this.radius + 1;
    
    }
  
  }

  // Check if the ball is out of bounds
  checkOutOfBounds(): 'left' | 'right' | null {
    
    // if the ball is to the left of the window, return 'left'
    if (this.x < 0 - WINDOW_DIMENSIONS.BOUNDARY_OFFSET) return 'left';

    // if the ball is to the right of the window, return 'right'
    if (this.x > WINDOW_DIMENSIONS.WIDTH + WINDOW_DIMENSIONS.BOUNDARY_OFFSET) return 'right';

    // otherwise, return null
    return null;
    
  }

  // Reset the ball to the center of the screen
  //   p: a reference to the p5 instance
  //   direction: the direction in which the ball should move (default is 1)
  reset(p: p5, direction: number = 1) {

    // set the x-coordinate to the center of the window
    this.x = p.width / 2;

    // set the y-coordinate to the center of the window
    this.y = p.height / 2;

    // set the horizontal speed to 5 times the direction
    this.speedX = 5 * direction;

    // set the vertical speed to 5 times a random direction
    this.speedY = 5 * (Math.random() >   0.5 ? 1 : -1);

    // set the mass of the ball to the default value
    this.mass = BALL_PROPERTIES.MASS;

  }
  
}

export default Ball;