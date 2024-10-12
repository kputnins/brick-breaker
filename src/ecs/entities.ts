import {
  Collides,
  Component,
  Health,
  Position,
  Size,
  Sprite,
  Velocity,
} from "./components";

import brickSprite from "../assets/sprites/brick.png";
import paddleSprite from "../assets/sprites/paddle.png";

export const entities = new Map<string, Entity>();

export const entity = {
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
  type: (typeof entity)[keyof typeof entity];
  public components: Component[] = [];

  constructor(type: (typeof entity)[keyof typeof entity]) {
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
    super(entity.PLAYER);
    entities.set(this.id, this);
  }
}

export class Paddle extends Entity {
  public components: Component[];

  constructor(x: number, y: number) {
    super(entity.PADDLE);
    const image = new Image();
    image.src = paddleSprite;
    this.components = [
      new Position(x, y),
      new Size(100, 20),
      new Collides(),
      new Velocity(0, 0),
      new Sprite(image),
    ];
  }
}

export class Ball extends Entity {
  public components: Component[];

  constructor(x: number, y: number) {
    super(entity.BALL);
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
    super(entity.BRICK);
    const image = new Image();
    image.src = brickSprite;
    this.components = [
      new Position(x, y),
      new Size(100, 20),
      new Collides(),
      new Health(100),
      new Sprite(image),
    ];
  }
}

export class Wall extends Entity {
  public components: Component[];

  constructor(x: number, y: number, width: number, height: number) {
    super(entity.WALL);
    this.components = [
      new Position(x, y),
      new Size(width, height),
      new Collides(),
    ];
  }
}
