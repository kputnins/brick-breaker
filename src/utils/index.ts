import { Entity, Size } from "../ecs";

export const isEntityIsInWorld = (
  size: Size,
  worldSize: Size,
) => {
  const coordinates = size.coordinates;
  if (
    coordinates.x2 < 0 ||
    coordinates.x1 > worldSize.width ||
    coordinates.y2 < 0 ||
    coordinates.y1 > worldSize.height
  ) {
    return false;
  }

  return true;
};

export type EntityOrientation = 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null;

export const calculateEntityOrientation = (sourceEntity: Entity, targetEntity: Entity): EntityOrientation => {
  const sourceSize = sourceEntity.size;
  const targetSize = targetEntity.size;

  if (!sourceSize || !targetSize) {
    console.error("Calculating orientation for entities missing position or size.", sourceEntity, targetEntity);
    throw new Error("Entity missing position or size.");
  }

  const sourceCoordinates = sourceSize.coordinates;
  const targetCoordinates = targetSize.coordinates;

  let isTop = false;
  let isBottom = false;
  let isLeft = false;
  let isRight = false;

  if (sourceCoordinates.y2 < targetCoordinates.y1) isBottom = true;
  if (sourceCoordinates.y1 >= targetCoordinates.y2) isTop = true;
  if (sourceCoordinates.x2 < targetCoordinates.x1) isRight = true;
  if (sourceCoordinates.x1 >= targetCoordinates.x2) isLeft = true;

  if (isTop && isLeft) return 'top-left';
  if (isTop && isRight) return 'top-right';
  if (isBottom && isLeft) return 'bottom-left';
  if (isBottom && isRight) return 'bottom-right';
  if (isTop) return 'top';
  if (isBottom) return 'bottom';
  if (isLeft) return 'left';
  if (isRight) return 'right';

  return null;
}

export type CollisionTarget = { entity: Entity, bounds: { x1: number, x2: number, y1: number, y2: number } }

export const calculateCollisionTarget = (entity: Entity, entities: Map<string, Entity>): null | CollisionTarget => {
  const size = entity.size;
  const velocity = entity.velocity;

  if (!size || !velocity) {
    console.error("Calculating collision for entity thats missing  size, or velocity.", entity);
    throw new Error("Entity missing  size, or velocity.");
  }

  const nextCoordinates = size.nextCoordinates(velocity);
  const entityKeys = Array.from(entities.keys());

  for (let i = 0; i < entityKeys.length; i++) {
    const otherEntity = entities.get(entityKeys[i]);
    if (!otherEntity) continue;
    if (entity.id === otherEntity.id) continue;

    const collides = otherEntity.collides;
    if (!collides) continue;

    const otherPosition = otherEntity.position;
    const otherSize = otherEntity.size;

    if (!otherPosition || !otherSize) {
      console.error("Calculating collision for entity that's missing position or size.", otherEntity);
      throw new Error("Entity missing position, or velocity.");
    }

    const otherBounds = { x1: otherPosition.x, y1: otherPosition.y, x2: otherPosition.x + otherSize.width, y2: otherPosition.y + otherSize.height };

    const overlapsX = nextCoordinates.x1 < otherBounds.x2 && nextCoordinates.x2 > otherBounds.x1;
    const overlapsY = nextCoordinates.y1 < otherBounds.y2 && nextCoordinates.y2 > otherBounds.y1;

    if (overlapsX && overlapsY) return { entity: otherEntity, bounds: otherBounds };
  }

  return null;
}
