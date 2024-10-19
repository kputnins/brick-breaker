import { calculateCollisionTarget, calculateEntityOrientation, isEntityIsInWorld } from "../utils";
import {
  BouncesFromEdges,
  ClampToEdges,
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
    const position = entity.components.find(component => component.type === COMPONENT.POSITION) as Position | undefined;
    const size = entity.components.find(component => component.type === COMPONENT.SIZE) as Size | undefined;
    const sprite = entity.components.find(component => component.type === COMPONENT.SPRITE) as Sprite | undefined;

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
    const position = entity.components.find(component => component.type === COMPONENT.POSITION) as Position | undefined;
    const size = entity.components.find(component => component.type === COMPONENT.SIZE) as Size | undefined;
    const velocity = entity.components.find(component => component.type === COMPONENT.VELOCITY) as Velocity | undefined;
    const bouncesFromEdges = entity.components.find(component => component.type === COMPONENT.BOUNCES_FROM_EDGES) as BouncesFromEdges | undefined;
    const clampToEdges = entity.components.find(component => component.type === COMPONENT.CLAMP_TO_EDGES) as ClampToEdges | undefined;

    if (!position || !velocity || !size) return;
    if (!isEntityIsInWorld(position, size, worldSize.width, worldSize.height)) return;

    const newPosition = {
      x: position.x + velocity.x,
      y: position.y + velocity.y,
    };

    const collisionTarget = calculateCollisionTarget(entity, entities);

    if (collisionTarget) {
      const targetOrieantation = calculateEntityOrientation(entity, collisionTarget.entity);
      // TODO remove console log
      console.log(collisionTarget, targetOrieantation)
      if (targetOrieantation) {

        // Reverse the velocity based on the orientation of the collision
        switch (targetOrieantation) {
          case 'top':
          case 'bottom': {
            velocity.reverseY();
            break;
          }
          case 'left':
          case 'right': {
            velocity.reverseX();
            break;
          }
          case 'top-left':
          case 'top-right':
          case 'bottom-left':
          case 'bottom-right': {
            velocity.reverse();
            break;
          }
        }

        // Move the entity to the edge of the collision target
        if (targetOrieantation.includes('top')) {
          position.y = collisionTarget.bounds.endY;
        } else if (targetOrieantation.includes('bottom')) {
          position.y = collisionTarget.bounds.startY - size.height - 1;
        }

        if (targetOrieantation.includes('left')) {
          position.x = collisionTarget.bounds.endX;
        } else if (targetOrieantation.includes('right')) {
          position.x = collisionTarget.bounds.startX - size.width - 1;
        }


      } else {
        // TODO investigate why this is happening
        console.warn('Collision target orientation is null.')
      }

      return;
    }

    if (clampToEdges) {
      if (newPosition.x < 0 && clampToEdges.left) {
        position.x = 0;
      } else if (newPosition.x + size.width > worldSize.width && clampToEdges.right) {
        position.x = worldSize.width - size.width;
      } else {
        position.x += velocity.x;
      }

      if (newPosition.y < 0 && clampToEdges.top) {
        position.y = 0;
      } else if (newPosition.y + size.height > worldSize.height && clampToEdges.bottom) {
        position.y = worldSize.height - size.height;
      } else {
        position.y += velocity.y
      }

      if (bouncesFromEdges) {
        if (newPosition.x < 0 && bouncesFromEdges.left) {
          velocity.x = -velocity.x;
        } else if (newPosition.x + size.width > worldSize.width && bouncesFromEdges.right) {
          velocity.x = -velocity.x;
        }

        if (newPosition.y < 0 && bouncesFromEdges.top) {
          velocity.y = -velocity.y;
        } else if (newPosition.y + size.height > worldSize.height && bouncesFromEdges.bottom) {
          velocity.y = -velocity.y;
        }
      }

      return;
    }

    position.x += velocity.x;
    position.y += velocity.y;
  });
};
