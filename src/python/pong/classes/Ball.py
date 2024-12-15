import pygame, random, math
from config import WIDTH,                 \
                   HEIGHT,                \
                   WHITE,                 \
                   BALL_MAX_BOUNCE_ANGLE, \
                   BALL_MAX_SPEED,        \
                   BALL_SPIN_FACTOR,      \
                   BALL_MASS,             \
                   GRAVITY

class Ball:
    """
    Represents the ball in the Pong game.

    Attributes:
        rect (pygame.Rect): The rectangle representing the ball's position and size.
        speed_x (int): The speed of the ball in the horizontal direction.
        speed_y (int): The speed of the ball in the vertical direction.
        spin (int): The spin effect applied to the ball.
        mass (float): The mass of the ball affecting its speed and bounce.
    """
    def __init__(self):
        """Initialize the ball with its position, speed, spin, and mass."""
        self.rect = pygame.Rect(WIDTH // 2 - 10, HEIGHT // 2 - 10, 20, 20)
        self.set_random_speed()
        self.spin = 0
        self.mass = BALL_MASS

    def set_random_speed(self, direction=1):
        """
        Set the ball's speed in a random direction.

        Args:
            direction (int, optional): The initial horizontal direction of the ball. 
                                       Positive for right, negative for left. Defaults to 1.
        """
        self.speed_x = 5 * direction
        self.speed_y = 5 * random.choice([-1, 1])

    def move(self):
        """
        Update the ball's position and handle collisions with the top and bottom of the screen.

        Notes:
            Applies gravity to the vertical speed.
            Moves the ball based on its speed and spin.
            Checks for collisions with the top and bottom boundaries and handles bouncing.
        """
        # Apply gravity to the vertical speed
        self.speed_y += GRAVITY
        
        # Move the ball
        self.rect.x += self.speed_x
        self.rect.y += self.speed_y

        # Apply spin effect
        self.rect.y += self.spin

        # Check for collisions with the top and bottom boundaries
        self.handle_bouncing_collision()

    def handle_bouncing_collision(self):
        """
        Check for collisions with the top and bottom boundaries, resulting in bouncing.

        Notes:
            If the ball hits the top or bottom of the screen, it bounces back in the opposite direction.
        """
        if self.rect.top <= 0:
            self.rect.top = 0
            self.speed_y = -self.speed_y
        elif self.rect.bottom >= HEIGHT:
            self.rect.bottom = HEIGHT
            self.speed_y = -self.speed_y

    def handle_paddle_collision(self, paddle):
        """
        Handle the collision of the ball with a paddle.

        Args:
            paddle (Paddle): The paddle object that the ball collides with.

        Notes:
            Adjusts the ball's speed and angle based on the collision point.
            Applies spin to the ball based on the collision point.
            Increases the ball's speed and decreases its mass with each successive hit.
            Caps the ball's speed to a maximum value.
        """
        if self.rect.colliderect(paddle.rect):
            # Calculate the relative position of the ball on the paddle
            relative_intersect_y = (paddle.rect.y + (paddle.rect.height / 2)) - (self.rect.y + (self.rect.height / 2))
            normalized_relative_intersect_y = relative_intersect_y / (paddle.rect.height / 2)
            bounce_angle = normalized_relative_intersect_y * BALL_MAX_BOUNCE_ANGLE

            # Adjust the ball's speed and angle
            self.speed_x = -self.speed_x
            self.speed_y = self.speed_x * math.sin(bounce_angle) / self.mass  # Factor in the mass of the ball
            self.spin = normalized_relative_intersect_y * BALL_SPIN_FACTOR

            # Increase speed with each successive hit
            self.speed_x *= 1.1
            self.speed_y *= 1.1

            # Decrease mass with each successive hit
            self.mass *= 0.99

            # Cap the speed to the maximum value
            self.speed_x = max(min(self.speed_x, BALL_MAX_SPEED), -BALL_MAX_SPEED)
            self.speed_y = max(min(self.speed_y, BALL_MAX_SPEED), -BALL_MAX_SPEED)

            # Adjust the ball's position slightly to prevent it from getting stuck
            self.unstick(paddle)

    def unstick(self, paddle):
        """
        Adjust the ball's position slightly after a collision to prevent it from getting stuck.

        Args:
            paddle (Paddle): The paddle object that the ball collides with.
        """
        # If the ball is moving downwards and collides with the top of the paddle
        if self.rect.top < paddle.rect.top and self.speed_y > 0:
            # Move the ball upwards slightly to prevent it from getting stuck
            self.rect.top = paddle.rect.top - self.rect.height - 1

        # If the ball is moving upwards and collides with the bottom of the paddle
        elif self.rect.bottom > paddle.rect.bottom and self.speed_y < 0:
            # Move the ball downwards slightly to prevent it from getting stuck
            self.rect.bottom = paddle.rect.bottom + self.rect.height + 1

        # If the ball is moving leftwards and collides with the right side of the paddle
        elif self.rect.right > paddle.rect.left and self.speed_x < 0:
            # Move the ball leftwards slightly to prevent it from getting stuck
            self.rect.right = paddle.rect.left - 1

        # If the ball is moving rightwards and collides with the left side of the paddle
        elif self.rect.left < paddle.rect.right and self.speed_x > 0:
            # Move th e ball rightwards slightly to prevent it from getting stuck
            self.rect.left = paddle.rect.right + 1
   
    def reset(self, direction=1):
        """
        Reset the ball to the center of the screen and set its speed in a random direction.

        Args:
            direction (int, optional): The initial horizontal direction of the ball. 
                                       Positive for right, negative for left. Defaults to 1.
        """
        self.rect.x, self.rect.y = WIDTH // 2 - 10, HEIGHT // 2 - 10
        self.set_random_speed(direction)
        self.mass = BALL_MASS

    def draw(self, screen):
        """
        Draw the ball on the screen.

        Args:
            screen (pygame.Surface): The surface on which to draw the ball.
        """
        pygame.draw.ellipse(screen, WHITE, self.rect)