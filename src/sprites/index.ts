import * as brick from "./assets/brick.png";
import * as paddle from "./assets/paddle.png";
import * as ball from "./assets/ball.png";

type SpriteSource = { default: string };

export const SPRITES = {
  BRICK: new Image(),
  PADDLE: new Image(),
  BALL: new Image(),
} as const;

SPRITES.BRICK.src = (brick as SpriteSource).default;
SPRITES.PADDLE.src = (paddle as SpriteSource).default;
SPRITES.BALL.src = (ball as SpriteSource).default;
