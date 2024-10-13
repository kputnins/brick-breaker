import { Position, Size } from "../ecs";

export const isEntityIsInWorld = (
  position: Position,
  size: Size,
  worldWidth: number,
  worldHeight: number,
) => {
  if (
    position.x < 0 ||
    position.x - size.width > worldWidth ||
    position.y < 0 ||
    position.y - size.height > worldHeight
  ) {
    return false;
  }

  return true;
};

// TODO check if needed
export const isEntityTouchingWorldEdges = (
  position: Position,
  size: Size,
  worldWidth: number,
  worldHeight: number,
) => {
  if (
    position.x <= 0 ||
    position.x + size.width >= worldWidth ||
    position.y <= 0 ||
    position.y + size.height >= worldHeight
  ) {
    return true;
  }

  return false;
}
