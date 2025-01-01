# 🏓Pong Game

This project is an automated Pong game built with React, TypeScript, and Vite. The game features two paddles: Yellow, which follows the ball, and Blue, which anticipates the ball's movement. The game is available to play online via GitHub Pages.

## Live Demo

You can play the game online at [https://harryjamesgreenblatt.github.io/Pong/](https://harryjamesgreenblatt.github.io/Pong/).

## Game Description

In this automated Pong game:
- The Yellow paddle uses an algorithm to follow the ball.
- The Blue paddle uses an algorithm to anticipate the ball's movement.

## Controls

The game provides a control panel to adjust various environmental properties and physical characteristics of the ball and paddles. You can modify the following settings:

### Environmental Properties
- **Gravity**: Adjust the amount of gravity in the game.

### Ball Properties
- **Mass**: Adjust the mass of the ball.
- **Radius**: Adjust the radius of the ball.
- **Max Speed**: Adjust the maximum speed of the ball.
- **Max Bounce Angle**: Adjust the maximum bounce angle of the ball.
- **Spin Factor**: Adjust the spin factor of the ball.

### Paddle Properties
- **Width**: Adjust the width of the paddles.
- **Height**: Adjust the height of the paddles.
- **Padding**: Adjust the padding of the paddles.
- **Success Rate**: Adjust the success rate of the paddles.

## Recent Updates

### Game Data Tracking
- The game now tracks detailed game data, including the number of volleys, scores, time taken for each game, and the scorer.
- The `timeTaken` is now calculated relative to each game, ensuring accurate tracking of game durations.
- Each game's end time is recorded and displayed in a human-readable format.

### Code Enhancements
- Added a new `endTime` property to the game data to facilitate accurate time tracking.
- Transformed the game data to include a readable end time using JavaScript's `Date` object.
- Updated the `Pong` component to reset the `startTime` at the beginning of each game and calculate the `timeTaken` relative to the previous game's end time.