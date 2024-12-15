import pygame, random
from config import HEIGHT, WHITE, PADDLE_SPEED, PADDLE_WIDTH, PADDLE_HEIGHT

class Paddle:
    """
    Represents a paddle in the Pong game.

    Attributes:
        rect (pygame.Rect): The rectangle representing the paddle's position and size.
        speed (int): The speed at which the paddle moves.
    """
    def __init__(self, x, y):
        """
        Initialize the paddle with its position and speed.

        Args:
            x (int): The x-coordinate of the paddle's initial position.
            y (int): The y-coordinate of the paddle's initial position.
        """
        self.rect = pygame.Rect(x, y, PADDLE_WIDTH, PADDLE_HEIGHT)
        self.speed = PADDLE_SPEED

    def move(self, up, down):
        """
        Move the paddle up or down based on key presses.

        Args:
            up (int): The key code for moving the paddle up.
            down (int): The key code for moving the paddle down.
        """
        keys = pygame.key.get_pressed()
        if keys[up] and self.rect.top > 0:
            self.rect.y -= self.speed
        if keys[down] and self.rect.bottom < HEIGHT:
            self.rect.y += self.speed

    def follow(self, ball):
        """
        Move the paddle automatically to follow the ball.

        Args:
            ball (Ball): The ball object that the paddle will follow.

        Notes:
            The paddle moves by 10% of the difference between its center and the ball's center each frame.
            This creates a smoother and more gradual movement.
            The paddle's position is clamped to ensure it stays within the screen bounds.
        """
        # Introduce randomness to make the AI less consistent
        if random.random() < 0.87:  # 87% chance to move
            difference = ball.rect.centery - self.rect.centery
            move_amount = difference * 0.1  # Move by 10% of the difference
            self.rect.y += move_amount

            # Ensure the paddle stays within the screen bounds
            if self.rect.top < 0:
                self.rect.top = 0
            if self.rect.bottom > HEIGHT:
                self.rect.bottom = HEIGHT

    def draw(self, screen):
        """
        Draw the paddle on the screen.

        Args:
            screen (pygame.Surface): The surface on which to draw the paddle.
        """
        pygame.draw.rect(screen, WHITE, self.rect)