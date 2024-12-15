import pygame, sys
from   .Paddle import Paddle
from   .Ball   import Ball
from   config  import WIDTH,        \
                      HEIGHT,       \
                      BLACK,        \
                      WHITE,        \
                      PADDLE_PADDING

class Pong:
    """
    Represents the Pong game.

    Attributes:
        display (pygame.Surface): The display surface for the game window.
        left_paddle (Paddle): The left paddle controlled by the cpu.
        right_paddle (Paddle): The right paddle controlled by the cpu.
        ball (Ball): The ball used in the game.
        left_score (int): The score of the left player.
        right_score (int): The score of the right player.
        font (pygame.font.Font): The font used to display the scores.
    """
    def __init__(self, display):
        """
        Initialize the game with paddles, a ball, and scores.

        Args:
            display (pygame.Surface): The display surface for the game.
        """
        # Set the display surface
        self.display = display
        
        # Initialize the left paddle with padding from the left edge
        self.left_paddle = Paddle(PADDLE_PADDING, HEIGHT // 2 - 50)
        
        # Initialize the right paddle with padding from the right edge
        self.right_paddle = Paddle(WIDTH - PADDLE_PADDING - 10, HEIGHT // 2 - 50)
         
        # Initialize the ball at the center of the display
        self.ball = Ball()

        # Define offset defining when the ball is considered out of bounds
        self.boundary_offset = 100
        
        # Initialize the scores for both players
        self.left_score = 0
        self.right_score = 0
        
        # Set the font for displaying the scores
        self.font = pygame.font.Font(None, 74)

        # Initialize the cooldown period
        self.cooldown = 60  # Number of frames to wait before the ball starts moving again
        self.cooldown_counter = 0

    def handle_quit(self):
        """Handle user input events such as quitting the game."""
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

    def check_ball_out_of_bounds(self):
        """Check if the ball is out of bounds, update the score, then reset the ball and paddles."""
        if self.ball.rect.left <= -self.boundary_offset:
            # Increment the right player's score
            self.right_score += 1
            # Reset the ball to move towards the left player
            self.ball.reset(direction=-1)
             # Start the cooldown period
            self.cooldown_counter = self.cooldown

        if self.ball.rect.right >= WIDTH + self.boundary_offset:
            # Increment the left player's score
            self.left_score += 1
            # Reset the ball to move towards the right player
            self.ball.reset(direction=1)
            # Start the cooldown period
            self.cooldown_counter = self.cooldown
       
    def update(self):
        """Update the game state, including paddle and ball positions."""
        # Move the ball only if the cooldown period is over
        if self.cooldown_counter == 0:
            self.ball.move()
        else:
            self.cooldown_counter -= 1

        # Move the paddles to automatically to follow the ball
        # and check for collisions with paddles
        for paddle in [self.left_paddle, self.right_paddle]:
            paddle.follow(self.ball)
            self.ball.handle_paddle_collision(paddle)
        
        # Check if the ball is out of bounds and update the score
        self.check_ball_out_of_bounds()

    def draw(self):
        """Draw all game elements on the display."""
        # Fill the display with black color
        self.display.fill(BLACK)
        
        # Draw the left paddle
        self.left_paddle.draw(self.display)
        
        # Draw the right paddle
        self.right_paddle.draw(self.display)
        
        # Draw the ball
        self.ball.draw(self.display)
        
        # Draw the center line
        pygame.draw.aaline(self.display, WHITE, (WIDTH // 2, 0), (WIDTH // 2, HEIGHT))

        # Render and display the left player's score
        left_text = self.font.render(str(self.left_score), True, WHITE)
        self.display.blit(left_text, (WIDTH // 4, 20))

        # Render and display the right player's score
        right_text = self.font.render(str(self.right_score), True, WHITE)
        self.display.blit(right_text, (WIDTH * 3 // 4, 20))

        # Update the display with the drawn elements
        pygame.display.flip()

    def run(self):
        """Run the main game loop."""
        while True:
            # Handle a potential quit event
            self.handle_quit()
            
            # Update the game state
            self.update()
            
            # Draw the game elements on the display
            self.draw()
            
            # Cap the frame rate to 60 frames per second
            pygame.time.Clock().tick(60)