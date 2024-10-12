import brick from "./assets/brick.png";
import paddle from "./assets/paddle.png";
import ball from "./assets/ball.png";

export const SPRITES = {
  BRICK: new Image(),
  PADDLE: new Image(),
  BALL: new Image(),
} as const;

SPRITES.BRICK.src = brick;
SPRITES.PADDLE.src = paddle;
SPRITES.BALL.src = ball;
