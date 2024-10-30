import { SOUNDS } from "../sounds";
import { calculateCollisionTarget, calculateEntityOrientation, isEntityIsInWorld } from "../utils";
import {
  Size,
} from "./components";
import { Entity } from "./entities";

export const drawEntities = (
  entities: Map<string, Entity>,
  context: CanvasRenderingContext2D,
  worldSize: Size,
  scale: number,
) => {
  entities.forEach((entity) => {
    const size = entity.size;
    const sprite = entity.sprite;

    if (!size) return;
    if (!isEntityIsInWorld(size, worldSize)) return;

    const coordinates = size.coordinates;

    if (sprite) {
      context.drawImage(
        sprite.image,
        coordinates.x1 * scale,
        coordinates.y1 * scale,
        size.width * scale,
        size.height * scale,
      );
    }

    // If no sprite is found, draw a gray rectangle with the entity's ID
    else {
      context.fillStyle = "gray";
      context.fillRect(coordinates.x1, coordinates.y1, size.width, size.height);

      context.fillStyle = "white";
      context.fillText(entity.id, coordinates.x1, coordinates.y1 + 16);
    }
  });
};

export const moveEntities = (
  entities: Map<string, Entity>,
  worldSize: Size,
) => {
  entities.forEach((entity) => {
    const position = entity.position;
    const size = entity.size;
    const velocity = entity.velocity;
    const bouncesFromEdges = entity.bouncesFromEdges;
    const clampToEdges = entity.clampToEdges;

    if (!position || !velocity || !size) return;
    if (!isEntityIsInWorld(size, worldSize)) return;

    const nextCoordinates = size.nextCoordinates(velocity)
    const collisionTarget = calculateCollisionTarget(entity, entities);

    if (collisionTarget) {
      SOUNDS.HIT_BLOCK.play();

      const targetOrieantation = calculateEntityOrientation(entity, collisionTarget.entity);
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
          position.y = collisionTarget.bounds.y2;
        } else if (targetOrieantation.includes('bottom')) {
          position.y = collisionTarget.bounds.y1 - size.height - 1;
        }

        if (targetOrieantation.includes('left')) {
          position.x = collisionTarget.bounds.x2;
        } else if (targetOrieantation.includes('right')) {
          position.x = collisionTarget.bounds.x1 - size.width - 1;
        }


      } else {
        // TODO investigate why this is happening
        console.warn('Collision target orientation is null.')
      }

      return;
    }

    if (clampToEdges) {
      if (nextCoordinates.x1 < 0 && clampToEdges.left) {
        position.x = 0;
      } else if (nextCoordinates.x2 > worldSize.width && clampToEdges.right) {
        position.x = worldSize.width - size.width;
      } else {
        position.x += velocity.x;
      }

      if (nextCoordinates.y1 < 0 && clampToEdges.top) {
        position.y = 0;
      } else if (nextCoordinates.y2 > worldSize.height && clampToEdges.bottom) {
        position.y = worldSize.height - size.height;
      } else {
        position.y += velocity.y
      }

      if (bouncesFromEdges) {
        let bounced = false;
        if (nextCoordinates.x1 < 0 && bouncesFromEdges.left) {
          velocity.x = -velocity.x;
          bounced = true;
        } else if (nextCoordinates.x2 > worldSize.width && bouncesFromEdges.right) {
          velocity.x = -velocity.x;
          bounced = true;
        }

        if (nextCoordinates.y1 < 0 && bouncesFromEdges.top) {
          velocity.y = -velocity.y;
          bounced = true;
        } else if (nextCoordinates.y2 > worldSize.height && bouncesFromEdges.bottom) {
          velocity.y = -velocity.y;
          bounced = true;
        }

        if (bounced) {
          SOUNDS.HIT_BLOCK.play();
        }
      }

      return;
    }

    position.x += velocity.x;
    position.y += velocity.y;
  });
};
