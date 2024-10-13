import { isEntityIsInWorld } from "../utils";
import {
  BouncesFromEdges,
  COMPONENT,
  Position,
  Size,
  Sprite,
  Velocity,
} from "./components";
import { Entity } from "./entities";

export const drawEntities = (
  entities: Map<string, Entity>,
  context: CanvasRenderingContext2D,
  worldWith: number,
  worldHeight: number,
) => {
  entities.forEach((entity) => {
    const position = entity.components.get(COMPONENT.POSITION) as | Position | undefined;
    const size = entity.components.get(COMPONENT.SIZE) as Size | undefined;
    const sprite = entity.components.get(COMPONENT.SPRITE) as | Sprite | undefined;

    if (!position || !size) return;
    if (!isEntityIsInWorld(position, size, worldWith, worldHeight)) return;

    if (sprite) {
      context.drawImage(
        sprite.image,
        position.x,
        position.y,
        size.width,
        size.height,
      );
    }

    // If no sprite is found, draw a gray rectangle with the entity's ID
    else {
      context.fillStyle = "gray";
      context.fillRect(position.x, position.y, size.width, size.height);

      context.fillStyle = "white";
      context.fillText(entity.id, position.x, position.y + 16);
    }
  });
};

// TODO make a seprate system for the ball
export const moveEntities = (
  entities: Map<string, Entity>,
  worldWith: number,
  worldHeight: number,
) => {
  entities.forEach((entity) => {
    const position = entity.components.get(COMPONENT.POSITION) as | Position | undefined;
    const size = entity.components.get(COMPONENT.SIZE) as Size | undefined;
    const velocity = entity.components.get(COMPONENT.VELOCITY) as | Velocity | undefined;
    const bounces = entity.components.get(COMPONENT.BOUNCES_FROM_EDGES) as | BouncesFromEdges | undefined;
    const clamp = entity.components.get(COMPONENT.CLAMP_TO_EDGES) as | BouncesFromEdges | undefined;

    if (!position || !velocity || !size) return;
    if (!isEntityIsInWorld(position, size, worldWith, worldHeight)) return;

    if (bounces) {
      if (
        position.x + velocity.x < 0 ||
        position.x + velocity.x + size.width > worldWith
      ) {
        velocity.x *= -1;
      }

      if (position.y + velocity.y < 0) {
        velocity.y *= -1;
      }
    }

    if (clamp) {
      if (position.x + velocity.x < 0) {
        position.x = 0;
      } else if (position.x + velocity.x + size.width > worldWith) {
        position.x = worldWith - size.width;
      } else {
        position.x += velocity.x;
      }

      if (position.y + velocity.y < 0) {
        position.y = 0;
      } else if (position.y + velocity.y + size.height > worldHeight) {
        position.y = worldHeight - size.height;
      } else {
        position.y += velocity.y;
      }
    } else {
      position.x += velocity.x;
      position.y += velocity.y;
    }
  });
};
