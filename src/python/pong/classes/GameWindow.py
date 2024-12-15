import pygame, os

class GameWindow:
    """
    Represents a window for the game.

    Attributes:
        width (int): The width of the window in pixels.
        height (int): The height of the window in pixels.
    """
    def __init__(self, width, height):
        """
        Initialize the GameWindow with its size and set up the display.

        Args:
            width (int): The width of the window in pixels.
            height (int): The height of the window in pixels.
        """
        # Set the width and height attributes based on the provided arguments
        self.width = width
        self.height = height
        
        # Initialize the display window with the specified width and height
        self.display = pygame.display.set_mode((width, height))
        
        # Set the window title to "Pong"
        pygame.display.set_caption("Pong")
        
        # Load the icon image using an absolute path
        icon_path = os.path.join(os.path.dirname(__file__), '../assets/pong_icon.png')
        icon = pygame.image.load(icon_path)
        
        # Set the window icon
        pygame.display.set_icon(icon)
        
        # Initialize all imported pygame modules
        pygame.init()
        
        # Initialize the font module for rendering text
        pygame.font.init()