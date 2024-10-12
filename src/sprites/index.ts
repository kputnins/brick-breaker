import brickSprite from "./assets/brick.png";
import paddleSprite from "./assets/paddle.png";

export const SPRITES = {
  BRICK: new Image(),
  PADDLE: new Image(),
} as const;

SPRITES.BRICK.src = brickSprite;
SPRITES.PADDLE.src = paddleSprite;
