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
  worldSize: Size,
  scale: number,
) => {
  entities.forEach((entity) => {
    const position = entity.components.get(COMPONENT.POSITION) as | Position | undefined;
    const size = entity.components.get(COMPONENT.SIZE) as Size | undefined;
    const sprite = entity.components.get(COMPONENT.SPRITE) as | Sprite | undefined;

    if (!position || !size) return;
    if (!isEntityIsInWorld(position, size, worldSize.width, worldSize.height)) return;

    if (sprite) {
      context.drawImage(
        sprite.image,
        position.x * scale,
        position.y * scale,
        size.width * scale,
        size.height * scale,
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
  worldSize: Size,
) => {
  entities.forEach((entity) => {
    const position = entity.components.get(COMPONENT.POSITION) as | Position | undefined;
    const size = entity.components.get(COMPONENT.SIZE) as Size | undefined;
    const velocity = entity.components.get(COMPONENT.VELOCITY) as | Velocity | undefined;
    const bouncesFromEdges = entity.components.get(COMPONENT.BOUNCES_FROM_EDGES) as | BouncesFromEdges | undefined;
    const clampToEdges = entity.components.get(COMPONENT.CLAMP_TO_EDGES) as | BouncesFromEdges | undefined;

    if (!position || !velocity || !size) return;
    if (!isEntityIsInWorld(position, size, worldSize.width, worldSize.height)) return;

    const newPosition = {
      x: position.x + velocity.x,
      y: position.y + velocity.y,
    };

    if (clampToEdges) {
      if (newPosition.x < 0 && clampToEdges.left) {
        position.x = 0;
      }

      else if (newPosition.x + size.width > worldSize.width && clampToEdges.right) {
        position.x = worldSize.width - size.width;
      }

      else {
        position.x += velocity.x;
      }

      if (newPosition.y < 0 && clampToEdges.top) {
        position.y = 0;
      }

      else if (newPosition.y + size.height > worldSize.height && clampToEdges.bottom) {
        position.y = worldSize.height - size.height;
      }

      else {
        position.y += velocity.y
      }
    }

    if (bouncesFromEdges) {
      if (newPosition.x < 0 && bouncesFromEdges.left) {
        velocity.x = -velocity.x;
      }

      else if (newPosition.x + size.width > worldSize.width && bouncesFromEdges.right) {
        velocity.x = -velocity.x;
      }

      if (newPosition.y < 0 && bouncesFromEdges.top) {
        velocity.y = -velocity.y;
      }

      else if (newPosition.y + size.height > worldSize.height && bouncesFromEdges.bottom) {
        velocity.y = -velocity.y;
      }
    }

    if (!clampToEdges) {
      position.x += velocity.x;
      position.y += velocity.y;
    }
  });
};
