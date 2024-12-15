// src/config.ts
export const COLORS = {
  WHITE:  [255, 255, 255],
  BLACK:  [0  , 0  , 0  ],
  DARK:   [40 , 40 , 40 ],
  YELLOW: [255, 255, 0  ],
  BLUE:   [50 , 50 , 255]
};

export const WINDOW_DIMENSIONS = {
  WIDTH: 900,
  HEIGHT: 500,
  BOUNDARY_OFFSET: 300,
};

export const GRAVITY = 0;

export const PADDLE_PROPERTIES = {
  PADDING: 75,
  SPEED: 10,
  WIDTH: 10,
  HEIGHT: 125,
  LEFT_SUCCESS_RATE: 0.8,
  RIGHT_SUCCESS_RATE: 0.25,
};

export const BALL_PROPERTIES = {
  MASS: 0.5,
  RADIUS: 10,
  MAX_BOUNCE_ANGLE: Math.PI / 4,
  SPIN_FACTOR: 1,
  MAX_SPEED: 20,
};