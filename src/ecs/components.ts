export class Component {}

export class Position extends Component {
  public x: number = 0;
  public y: number = 0;

  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
  }
}

export class Size extends Component {
  public width: number = 0;
  public height: number = 0;

  constructor(width: number, height: number) {
    super();
    this.width = width;
    this.height = height;
  }
}

export class Collides extends Component {
  public collides: boolean = true;
}

export class Sprite extends Component {
  public image: HTMLImageElement;

  constructor(image: HTMLImageElement) {
    super();
    this.image = image;
  }
}

export class Health extends Component {
  public health: number = 100;

  constructor(health: number) {
    super();
    this.health = health;
  }
}

export class Velocity extends Component {
  public x: number = 0;
  public y: number = 0;

  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
  }

  public add = (x: number, y: number) => {
    this.x += x;
    this.y += y;
  };

  public subtract = (x: number, y: number) => {
    this.x -= x;
    this.y -= y;
  };

  public set = (x: number, y: number) => {
    this.x = x;
    this.y = y;
  };
}
