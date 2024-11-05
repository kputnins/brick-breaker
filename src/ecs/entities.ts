import {
  BouncesFromEdges,
  ClampToEdges,
  Collides,
  Damage,
  Health,
  Position,
  Size,
  Sprite,
  Velocity,
} from "./components";

import { SPRITES } from "../sprites";
import { Game } from "../game/game";

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

  public position: Position | null = null;
  public size: Size | null = null;
  public collides: Collides | null = null;
  public bouncesFromEdges: BouncesFromEdges | null = null;
  public clampToEdges: ClampToEdges | null = null;
  public sprite: Sprite | null = null;
  public health: Health | null = null;
  public damage: Damage | null = null;
  public velocity: Velocity | null = null;

  constructor(type: (typeof ENTITY)[keyof typeof ENTITY]) {
    this.type = type;
    this.id = Math.random().toString(36).slice(2, 9);
    entities.set(this.id, this);
  }

  public delete = () => {
    entities.delete(this.id);
  };
}

export class Paddle extends Entity {
  constructor(params?: { size?: number, x?: number, y?: number }) {
    const size = params?.size ?? 100;
    const x = params?.x ?? 0;
    const y = params?.y ?? 0;

    super(ENTITY.PADDLE);
    this.position = new Position(x, y);
    this.size = new Size(this.position, size, size / 5);
    this.collides = new Collides();
    this.clampToEdges = new ClampToEdges();
    this.velocity = new Velocity(0, 0);
    this.sprite = new Sprite(SPRITES.PADDLE);
  }
}

export class Ball extends Entity {
  constructor(params?: { x?: number, y?: number, size?: number, velocity?: number }) {
    super(ENTITY.BALL);

    const size = params?.size ?? 12;
    const x = params?.x ?? 0;
    const y = params?.y ?? 0;
    const velocity = params?.velocity ?? 3;

    this.position = new Position(x, y);
    this.size = new Size(this.position, size, size);
    this.collides = new Collides();
    this.clampToEdges = new ClampToEdges({ bottom: Game.isDemoMode() });
    this.bouncesFromEdges = new BouncesFromEdges({ bottom: Game.isDemoMode() });
    this.velocity = new Velocity(velocity, velocity / -3);
    this.damage = new Damage()
    this.sprite = new Sprite(SPRITES.BALL);
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

    this.position = new Position(x, y);
    this.size = new Size(this.position, width, height);
    this.collides = new Collides();
    this.health = new Health(health);
    this.sprite = new Sprite(SPRITES.BRICK);
  }
}

export class Wall extends Entity {
  constructor(x: number, y: number, width: number, height: number) {
    super(ENTITY.WALL);
    this.position = new Position(x, y);
    this.size = new Size(this.position, width, height);
    this.collides = new Collides();
  }
}
