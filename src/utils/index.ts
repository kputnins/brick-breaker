import { Collides, COMPONENT, Entity, Position, Size, Velocity } from "../ecs";

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

export type EntityOrientation = 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null;

export const calculateEntityOrientation = (sourceEntity: Entity, targetEntity: Entity): EntityOrientation => {
  const sourcePosition = sourceEntity.components.find(component => component.type === COMPONENT.POSITION) as Position | undefined;
  const sourceSize = sourceEntity.components.find(component => component.type === COMPONENT.SIZE) as Size | undefined;
  const targetPosition = targetEntity.components.find(component => component.type === COMPONENT.POSITION) as Position | undefined;
  const targetSize = targetEntity.components.find(component => component.type === COMPONENT.SIZE) as Size | undefined;

  if (!sourcePosition || !sourceSize || !targetPosition || !targetSize) {
    console.error("Calculating orientation for entities missing position or size.", sourceEntity, targetEntity);
    throw new Error("Entity missing position or size.");
  }

  let isTop = false;
  let isBottom = false;
  let isLeft = false;
  let isRight = false;

  if (sourcePosition.y + sourceSize.height < targetPosition.y) isBottom = true;
  if (sourcePosition.y >= targetPosition.y + targetSize.height) isTop = true;
  if (sourcePosition.x + sourceSize.width < targetPosition.x) isRight = true;
  if (sourcePosition.x >= targetPosition.x + targetSize.width) isLeft = true;

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

export type CollisionTarget = { entity: Entity, bounds: { startX: number, endX: number, startY: number, endY: number } }

export const calculateCollisionTarget = (entity: Entity, entities: Map<string, Entity>): null | CollisionTarget => {
  const position = entity.components.find(component => component.type === COMPONENT.POSITION) as Position | undefined;
  const size = entity.components.find(component => component.type === COMPONENT.SIZE) as Size | undefined;
  const velocity = entity.components.find(component => component.type === COMPONENT.VELOCITY) as Velocity | undefined;

  if (!position || !size || !velocity) {
    console.error("Calculating collision for entity thats missing position, size, or velocity.", entity);
    throw new Error("Entity missing position, size, or velocity.");
  }

  const newX = position.x + velocity.x;
  const newY = position.y + velocity.y;
  const newBounds = { startX: newX, startY: newY, endX: newX + size.width, endY: newY + size.height };

  const entityKeys = Array.from(entities.keys());

  for (let i = 0; i < entityKeys.length; i++) {
    const otherEntity = entities.get(entityKeys[i]);
    if (!otherEntity) continue;
    if (entity.id === otherEntity.id) continue;

    const collides = otherEntity.components.find(component => component.type === COMPONENT.COLLIDES) as Collides | undefined;
    if (!collides) continue;

    const otherPosition = otherEntity.components.find(component => component.type === COMPONENT.POSITION) as Position | undefined;
    const otherSize = otherEntity.components.find(component => component.type === COMPONENT.SIZE) as Size | undefined;

    if (!otherPosition || !otherSize) {
      console.error("Calculating collision for entity that's missing position or size.", otherEntity);
      throw new Error("Entity missing position, or velocity.");
    }

    const otherBounds = { startX: otherPosition.x, startY: otherPosition.y, endX: otherPosition.x + otherSize.width, endY: otherPosition.y + otherSize.height };

    const overlapsX = newBounds.startX < otherBounds.endX && newBounds.endX > otherBounds.startX;
    const overlapsY = newBounds.startY < otherBounds.endY && newBounds.endY > otherBounds.startY;

    if (overlapsX && overlapsY) return { entity: otherEntity, bounds: otherBounds };
  }

  return null;
}
