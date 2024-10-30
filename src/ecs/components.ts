export const COMPONENT = {
  POSITION: "POSITION",
  SIZE: "SIZE",
  COLLIDES: "COLLIDES",
  BOUNCES_FROM_EDGES: "BOUNCES_FROM_EDGES",
  CLAMP_TO_EDGES: "CLAMP_TO_EDGES",
  SPRITE: "SPRITE",
  HEALTH: "HEALTH",
  DAMAGE: "DAMAGE",
  VELOCITY: "VELOCITY",
} as const;
export type COMPONENT = (typeof COMPONENT)[keyof typeof COMPONENT];

export class Component {
  public type: COMPONENT;

  constructor(type: COMPONENT) {
    this.type = type;
  }
}

export class Position extends Component {
  public x: number = 0;
  public y: number = 0;

  constructor(x: number, y: number) {
    super(COMPONENT.POSITION);
    this.x = x;
    this.y = y;
  }
}

export class Size extends Component {
  private position: Position;
  public width: number = 0;
  public height: number = 0;

  constructor(position: Position, width: number, height: number) {
    super(COMPONENT.SIZE);
    this.position = position;
    this.width = width;
    this.height = height;
  }

  public get coordinates() {
    return {
      x1: this.position.x,
      y1: this.position.y,
      x2: this.position.x + this.width,
      y2: this.position.y + this.height,
    };
  }

  public nextCoordinates(velocity: Velocity) {
    return {
      x1: this.position.x + velocity.x,
      y1: this.position.y + velocity.y,
      x2: this.position.x + this.width + velocity.x,
      y2: this.position.y + this.height + velocity.y,
    };
  }
}

export class Collides extends Component {
  public collides: boolean = true;

  constructor(collides?: boolean) {
    super(COMPONENT.COLLIDES);
    this.collides = collides ?? true;
  }
}

export class BouncesFromEdges extends Component {
  public top: boolean;
  public bottom: boolean;
  public left: boolean;
  public right: boolean;

  constructor(edges?: { top?: boolean; bottom?: boolean; left?: boolean; right?: boolean }) {
    super(COMPONENT.BOUNCES_FROM_EDGES);
    this.top = edges?.top ?? true;
    this.bottom = edges?.bottom ?? false;
    this.left = edges?.left ?? true;
    this.right = edges?.right ?? true;
  }
}

export class ClampToEdges extends Component {
  public top: boolean;
  public bottom: boolean;
  public left: boolean;
  public right: boolean;

  constructor(edges?: { top?: boolean; bottom?: boolean; left?: boolean; right?: boolean }) {
    super(COMPONENT.CLAMP_TO_EDGES);
    this.top = edges?.top ?? true;
    this.bottom = edges?.bottom ?? false;
    this.left = edges?.left ?? true;
    this.right = edges?.right ?? true;
  }
}

export class Sprite extends Component {
  public image: HTMLImageElement;

  constructor(image: HTMLImageElement) {
    super(COMPONENT.SPRITE);
    this.image = image;
  }
}

export class Health extends Component {
  public health: number = 1;

  constructor(health?: number) {
    super(COMPONENT.HEALTH);
    this.health = health ?? 1;
  }
}

export class Damage extends Component {
  public damage: number = 1;

  constructor(damage?: number) {
    super(COMPONENT.DAMAGE);
    this.damage = damage ?? 1;
  }
}

export class Velocity extends Component {
  public x: number = 0;
  public y: number = 0;

  constructor(x: number, y: number) {
    super(COMPONENT.VELOCITY);
    this.x = x;
    this.y = y;
  }

  public reverseX() {
    this.x = -this.x;
  }

  public reverseY() {
    this.y = -this.y;
  }

  public reverse() {
    this.reverseX();
    this.reverseY();
  }
}
