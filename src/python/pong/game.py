from config             import WIDTH, HEIGHT
from classes.GameWindow import GameWindow
from classes.Pong       import Pong


if __name__ == "__main__":

    game = GameWindow(WIDTH, HEIGHT).display
    
    Pong(game).run()