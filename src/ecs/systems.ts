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

export const moveEntities = (
  entities: Map<string, Entity>,
  worldWith: number,
  worldHeight: number,
) => {
  entities.forEach((entity) => {
    const position = entity.components.get(COMPONENT.POSITION) as | Position | undefined;
    const size = entity.components.get(COMPONENT.SIZE) as Size | undefined;
    const velocity = entity.components.get(COMPONENT.VELOCITY) as | Velocity | undefined;
    const bouncesFromEdges = entity.components.get(COMPONENT.BOUNCES_FROM_EDGES) as | BouncesFromEdges | undefined;
    const clampToEdges = entity.components.get(COMPONENT.CLAMP_TO_EDGES) as | BouncesFromEdges | undefined;

    if (!position || !velocity || !size) return;
    if (!isEntityIsInWorld(position, size, worldWith, worldHeight)) return;

    const newPosition = {
      x: position.x + velocity.x,
      y: position.y + velocity.y,
    };

    if (clampToEdges) {
      if (newPosition.x < 0 && clampToEdges.left) {
        position.x = 0;
      }

      else if (newPosition.x + size.width > worldWith && clampToEdges.right) {
        position.x = worldWith - size.width;
      }

      else {
        position.x += velocity.x;
      }

      if (newPosition.y < 0 && clampToEdges.top) {
        position.y = 0;
      }

      else if (newPosition.y + size.height > worldHeight && clampToEdges.bottom) {
        position.y = worldHeight - size.height;
      }

      else {
        position.y += velocity.y
      }
    }

    if (bouncesFromEdges) {
      if (newPosition.x < 0 && bouncesFromEdges.left) {
        velocity.x = -velocity.x;
      }

      else if (newPosition.x + size.width > worldWith && bouncesFromEdges.right) {
        velocity.x = -velocity.x;
      }

      if (newPosition.y < 0 && bouncesFromEdges.top) {
        velocity.y = -velocity.y;
      }

      else if (newPosition.y + size.height > worldHeight && bouncesFromEdges.bottom) {
        velocity.y = -velocity.y;
      }
    }

    if (!clampToEdges) {
      position.x += velocity.x;
      position.y += velocity.y;
    }
  });
};
