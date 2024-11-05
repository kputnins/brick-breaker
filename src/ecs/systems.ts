import { Game } from "../game/game";
import { SOUNDS } from "../sounds";
import { findColidingEntity, calculateTargetEntityOrientation, isEntityIsInWorld } from "../utils";
import {
  Size,
} from "./components";
import { ENTITY, Entity } from "./entities";

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
  const collsisions: Collision[] = [];

  entities.forEach((entity) => {
    const position = entity.position;
    const size = entity.size;
    const velocity = entity.velocity;
    const clampToEdges = entity.clampToEdges;
    const bouncesFromEdges = entity.bouncesFromEdges;

    if (!position || !velocity || !size) return;
    if (!isEntityIsInWorld(size, worldSize)) return;

    const nextCoordinates = size.nextCoordinates(velocity)
    const colidingEntity = findColidingEntity(entity, entities);

    // If entity is coliding with another entity don't move the entity
    if (colidingEntity) {
      collsisions.push({ entity, colidingEntity })
      return;
    }

    let bouncedFromWall = false;

    // Move along x axis
    if (nextCoordinates.x1 < 0 && clampToEdges?.left) {
      position.x = 0;

      if (bouncesFromEdges?.left) {
        velocity.reverseX();
        bouncedFromWall = true;
      }
    } else if (nextCoordinates.x2 > worldSize.width && clampToEdges?.right) {
      position.x = worldSize.width - size.width;

      if (bouncesFromEdges?.right) {
        velocity.reverseX();
        bouncedFromWall = true;
      }
    } else {
      position.x += velocity.x;
    }

    // Move along y axis
    if (nextCoordinates.y1 < 0 && clampToEdges?.top) {
      position.y = 0;

      if (bouncesFromEdges?.top) {
        velocity.reverseY();
        bouncedFromWall = true;
      }
    } else if (nextCoordinates.y2 > worldSize.height && clampToEdges?.bottom) {
      position.y = worldSize.height - size.height;

      if (bouncesFromEdges?.bottom) {
        velocity.reverseY();
        bouncedFromWall = true;
      }
    } else {
      position.y += velocity.y
    }

    if (entity.type === ENTITY.BALL && bouncedFromWall) {
      SOUNDS.HIT_EDGE.play();
    }
  });

  handleCollisions(collsisions);
};

type Collision = {
  entity: Entity;
  colidingEntity: Entity;
};

const handleCollisions = (collisions: Collision[]): void => {
  collisions.forEach(({ entity, colidingEntity }) => {
    const position = entity.position;
    const size = entity.size;
    const velocity = entity.velocity;

    if (!position || !size || !velocity) {
      console.error("Handling collision for entity thats missing position, size or velocity.", entity);
      throw new Error("Entity missing position, size or velocity.");
    }

    const colidingEntitySize = colidingEntity.size;

    if (!colidingEntitySize) {
      console.error("Handling collision for coliding entity thats missing size.", entity);
      throw new Error("Entity missing size.");
    }

    if (entity.type === ENTITY.BALL) {
      switch (colidingEntity.type) {
        case ENTITY.PADDLE: {
          SOUNDS.HIT_PADDLE.play();
          break;
        }
        case ENTITY.BRICK: {
          SOUNDS.HIT_BLOCK.play();

          const damage = entity.damage;
          const colidingEntityHealth = colidingEntity.health;

          if (damage && colidingEntityHealth) {
            const isBrickDestroyed = colidingEntityHealth.tageDamage(damage.damage);
            if (isBrickDestroyed) {
              colidingEntity.delete();
              Game.incrementScore(100);
            }
          }
          break;
        }
      }
    }

    const colidingEntityOrientation = calculateTargetEntityOrientation(entity, colidingEntity);
    if (colidingEntityOrientation) {
      // Reverse the velocity based on the orientation of the collision
      switch (colidingEntityOrientation) {
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

      const targetCoordinates = colidingEntitySize.coordinates;
      // Move the entity to the edge of the collision target
      if (colidingEntityOrientation.includes('top')) {
        position.y = targetCoordinates.y2;
      } else if (colidingEntityOrientation.includes('bottom')) {
        position.y = targetCoordinates.y1 - size.height - 1;
      }

      if (colidingEntityOrientation.includes('left')) {
        position.x = targetCoordinates.x2;
      } else if (colidingEntityOrientation.includes('right')) {
        position.x = targetCoordinates.x1 - size.width - 1;
      }
    } else {
      console.warn("No orientation found for collision.", entity, colidingEntity);
    }
  })
};

export const trackGameBalls = (
  entities: Map<string, Entity>,
  worldSize: Size
): void => {
  entities.forEach((entity) => {
    if (entity.type !== ENTITY.BALL) return;

    const size = entity.size;
    if (!size) {
      console.error("Ball entity missing size.", entity);
      throw new Error("Ball entity missing size.");
    }

    if (!isEntityIsInWorld(size, worldSize)) {
      entity.delete();
    }
  });

  let hasBalls = false;

  entities.forEach((entity) => {
    if (entity.type === ENTITY.BALL) {
      hasBalls = true;
      return
    };

  });

  if (!hasBalls) {
    SOUNDS.LOOSE_ALL_BALLS.play();
    Game.decrementLives();
    Game.resetPaddleAndBall();

    if (!Game.hasLives()) {
      Game.newGame();
    }
  }
};
