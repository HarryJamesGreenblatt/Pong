import math

# COLORS (RGB FORMAT)
WHITE = (255, 255, 255)  # paddles, ball, and center line
BLACK = (0, 0, 0)        # Background 

# WINDOW DIMENSIONS
WIDTH, HEIGHT = 800, 600

# GRAVITY
GRAVITY = 0.1  # Acceleration due to gravity

# PADDLE PROPERTIES
PADDLE_PADDING = 30  # Distance between the paddle and the edge of the screen
PADDLE_SPEED = 12    # Speed at which the paddles move
PADDLE_WIDTH = 10    # Width of the paddles
PADDLE_HEIGHT = 100  # Height of the paddles

# BALL PHYSICS
BALL_MAX_BOUNCE_ANGLE = math.pi / 4  # 45 degrees
BALL_SPIN_FACTOR = 1                 # Adjust spin effect
BALL_MASS = .5                       # Mass of the ball
BALL_MAX_SPEED = 20                  # Maximum speed of the ball