import {
  BouncesFromEdges,
  ClampToEdges,
  Collides,
  COMPONENT,
  Component,
  Health,
  Position,
  Size,
  Sprite,
  Velocity,
} from "./components";

import { SPRITES } from "../sprites";

export const entities = new Map<string, Entity>();

export const ENTITY = {
  ENTITY: "ENTITY",
  PLAYER: "PLAYER",
  PADDLE: "PADDLE",
  BALL: "BALL",
  BRICK: "BRICK",
  WALL: "WALL",
  // TODO
  POWERUP: "POWERUP",
  BULLET: "BULLET",
  EXPLOSION: "EXPLOSION",
  PARTICLE: "PARTICLE",
  TEXT: "TEXT",
} as const;

export class Entity {
  public id: string;
  type: (typeof ENTITY)[keyof typeof ENTITY];
  public components: Map<COMPONENT, Component> = new Map();

  constructor(type: (typeof ENTITY)[keyof typeof ENTITY]) {
    this.type = type;
    this.id = Math.random().toString(36).slice(2, 9);
    entities.set(this.id, this);
  }

  public delete = () => {
    entities.delete(this.id);
  };
}

export class Player extends Entity {
  constructor() {
    super(ENTITY.PLAYER);
  }
}

export class Paddle extends Entity {
  constructor(params?: { size?: number, x?: number, y?: number }) {
    const size = params?.size ?? 100;
    const x = params?.x ?? 0;
    const y = params?.y ?? 0;

    super(ENTITY.PADDLE);
    this.components.set(COMPONENT.POSITION, new Position(x, y));
    this.components.set(COMPONENT.SIZE, new Size(size, size / 5));
    this.components.set(COMPONENT.COLLIDES, new Collides());
    this.components.set(COMPONENT.CLAMP_TO_EDGES, new ClampToEdges());
    this.components.set(COMPONENT.VELOCITY, new Velocity(0, 0));
    this.components.set(COMPONENT.SPRITE, new Sprite(SPRITES.PADDLE));
  }
}

export class Ball extends Entity {
  constructor(params?: { x?: number, y?: number, size?: number, velocity?: number }) {
    super(ENTITY.BALL);

    const size = params?.size ?? 12;
    const x = params?.x ?? 0;
    const y = params?.y ?? 0;
    const velocity = params?.velocity ?? 3;

    this.components.set(COMPONENT.POSITION, new Position(x, y));
    this.components.set(COMPONENT.SIZE, new Size(size, size));
    this.components.set(COMPONENT.COLLIDES, new Collides());
    this.components.set(COMPONENT.CLAMP_TO_EDGES, new ClampToEdges());
    // TODO remove bottom bounce
    this.components.set(COMPONENT.BOUNCES_FROM_EDGES, new BouncesFromEdges({ bottom: true }));
    this.components.set(COMPONENT.VELOCITY, new Velocity(velocity, velocity / -1));
    this.components.set(COMPONENT.SPRITE, new Sprite(SPRITES.BALL));
  }
}

export class Brick extends Entity {
  constructor(x: number, y: number) {
    super(ENTITY.BRICK);
    this.components.set(COMPONENT.POSITION, new Position(x, y));
    this.components.set(COMPONENT.SIZE, new Size(100, 20));
    this.components.set(COMPONENT.COLLIDES, new Collides());
    this.components.set(COMPONENT.HEALTH, new Health(100));
    this.components.set(COMPONENT.SPRITE, new Sprite(SPRITES.BRICK));
  }
}

export class Wall extends Entity {
  constructor(x: number, y: number, width: number, height: number) {
    super(ENTITY.WALL);
    this.components.set(COMPONENT.POSITION, new Position(x, y));
    this.components.set(COMPONENT.SIZE, new Size(width, height));
    this.components.set(COMPONENT.COLLIDES, new Collides());
  }
}
