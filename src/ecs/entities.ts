import {
  Collides,
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
  public static components: Component[] = [new Position(0, 0), new Health(100)];

  constructor() {
    super(ENTITY.PLAYER);
    entities.set(this.id, this);
  }
}

export class Paddle extends Entity {
  public components: Component[];

  constructor(x: number, y: number) {
    super(ENTITY.PADDLE);
    this.components = [
      new Position(x, y),
      new Size(100, 20),
      new Collides(),
      new Velocity(0, 0),
      new Sprite(SPRITES.PADDLE),
    ];
  }
}

export class Ball extends Entity {
  public components: Component[];

  constructor(x: number, y: number) {
    super(ENTITY.BALL);
    this.components = [
      new Position(x, y),
      new Size(10, 10),
      new Collides(),
      new Velocity(10, 10),
    ];
  }
}

export class Brick extends Entity {
  public components: Component[];

  constructor(x: number, y: number) {
    super(ENTITY.BRICK);
    this.components = [
      new Position(x, y),
      new Size(100, 20),
      new Collides(),
      new Health(100),
      new Sprite(SPRITES.BRICK),
    ];
  }
}

export class Wall extends Entity {
  public components: Component[];

  constructor(x: number, y: number, width: number, height: number) {
    super(ENTITY.WALL);
    this.components = [
      new Position(x, y),
      new Size(width, height),
      new Collides(),
    ];
  }
}
