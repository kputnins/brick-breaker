import {
  BouncesFromEdges,
  ClampToEdges,
  Collides,
  Component,
  Damage,
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
  public components: Component[] = [];

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
    this.components.push(new Position(x, y));
    this.components.push(new Size(size, size / 5));
    this.components.push(new Collides());
    this.components.push(new ClampToEdges());
    this.components.push(new Velocity(0, 0));
    this.components.push(new Sprite(SPRITES.PADDLE));
  }
}

export class Ball extends Entity {
  constructor(params?: { x?: number, y?: number, size?: number, velocity?: number }) {
    super(ENTITY.BALL);

    const size = params?.size ?? 12;
    const x = params?.x ?? 0;
    const y = params?.y ?? 0;
    const velocity = params?.velocity ?? 3;

    this.components.push(new Position(x, y));
    this.components.push(new Size(size, size));
    this.components.push(new Collides());
    this.components.push(new ClampToEdges());
    // TODO remove bottom bounce
    this.components.push(new BouncesFromEdges({ bottom: true }));
    this.components.push(new Velocity(velocity, velocity / -3));
    this.components.push(new Damage())
    this.components.push(new Sprite(SPRITES.BALL));
  }
}

export class Brick extends Entity {
  constructor(params?: { x?: number, y?: number, width?: number, height?: number, health?: number }) {
    super(ENTITY.BRICK);

    const x = params?.x ?? 0;
    const y = params?.y ?? 0;
    const width = params?.width ?? 100;
    const height = params?.height ?? 20;
    const health = params?.health ?? 1;

    this.components.push(new Position(x, y));
    this.components.push(new Size(width, height));
    this.components.push(new Collides());
    this.components.push(new Health(health));
    this.components.push(new Sprite(SPRITES.BRICK));
  }
}

export class Wall extends Entity {
  constructor(x: number, y: number, width: number, height: number) {
    super(ENTITY.WALL);
    this.components.push(new Position(x, y));
    this.components.push(new Size(width, height));
    this.components.push(new Collides());
  }
}
