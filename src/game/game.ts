import { Brick, drawEntities, Entity, Paddle } from "../ecs";

declare global {
  interface Window {
    game: Game; // Replace with your actual class name
  }
}

type Canvas = {
  htmlElement: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
};

type Controls = {
  panel: HTMLDivElement;
  newGameButton: HTMLButtonElement;
  optionsButton: HTMLButtonElement;
  infoButton: HTMLButtonElement;
};

type GameState = {
  tick: number;
  score: number;
  lives: number;
};

type Sprites = {
  player: HTMLImageElement;
  block: HTMLImageElement;
  ball: HTMLImageElement;
};

export class Game {
  // HTML elements
  private static canvas: Canvas;
  private static controls: Controls;
  // Game state
  private static state: GameState;
  // Global values
  private static palyerName: string = "Player";
  // Resources
  private static sprites: Sprites;
  // Entities
  private static entities: Entity[] = [];

  private static initControls() {
    const panel = document.getElementById("controls") as HTMLDivElement | null;
    const newGameButton = document.getElementById(
      "new-game-button",
    ) as HTMLButtonElement | null;
    const optionsButton = document.getElementById(
      "options-button",
    ) as HTMLButtonElement | null;
    const infoButton = document.getElementById(
      "info-button",
    ) as HTMLButtonElement | null;

    if (!panel || !newGameButton || !optionsButton || !infoButton) {
      console.log("Controls element", panel);
      console.log("New game button", newGameButton);
      console.log("Options button", optionsButton);
      console.log("Info button", infoButton);
      throw new Error("Failed to get controls elements.");
    }

    this.controls = {
      panel: panel,
      newGameButton: newGameButton,
      optionsButton: optionsButton,
      infoButton: infoButton,
    };

    this.initInfoDialog();
  }

  private static initInfoDialog() {
    const dialog = document.getElementById(
      "info-dialog",
    ) as HTMLDialogElement | null;
    const showButton = document.getElementById(
      "info-button",
    ) as HTMLButtonElement | null;
    const closeButton = dialog?.querySelector(
      "dialog button",
    ) as HTMLButtonElement | null;

    if (!dialog || !showButton || !closeButton) {
      console.log("Info dialog", dialog);
      console.log("Info button", showButton);
      console.log("Close button", closeButton);
      throw new Error("Failed to get info dialog elements.");
    }

    showButton.addEventListener("click", () => {
      dialog.showModal();
    });

    closeButton.addEventListener("click", () => {
      dialog.close();
    });
  }

  private static initCanvas() {
    const canvas = document.getElementById(
      "canvas",
    ) as HTMLCanvasElement | null;
    if (!canvas) {
      throw new Error("Failed to create canvas element.");
    }

    const context = canvas.getContext("2d");
    if (!context) {
      console.log("Canvas element", canvas);
      throw new Error("Failed to get 2D context.");
    }

    this.canvas = { htmlElement: canvas, context: context };

    window.addEventListener("resize", this.handleResize.bind(this));
    this.handleResize();
  }

  private static handleResize() {
    const MAGIX_MISSING_PIXELS = 6;
    this.canvas.htmlElement.width = window.innerWidth;
    this.canvas.htmlElement.height =
      window.innerHeight -
      this.controls.panel.clientHeight -
      MAGIX_MISSING_PIXELS;
  }

  private static initState() {
    this.state = {
      tick: 0,
      score: 0,
      lives: 3,
    };
  }

  private static initLevel(level: number) {
    switch (level) {
      default:
      case 1:
        this.entities = Array.from({ length: 10 }, (_, i) => {
          const row = Math.floor(i / 2);
          const col = i % 2;
          return new Brick(
            this.canvas.htmlElement.width / 2 + col * 110,
            100 + row * 50,
          );
        });

        break;
    }
  }

  private static initPaddle() {
    const paddle = new Paddle(
      this.canvas.htmlElement.width / 2,
      this.canvas.htmlElement.height - 50,
    );

    this.entities.push(paddle);
  }

  private static clearCanvas() {
    this.canvas.context.fillStyle = "black";
    this.canvas.context.fillRect(
      0,
      0,
      this.canvas.htmlElement.width,
      this.canvas.htmlElement.height,
    );
  }

  private static update() {
    this.state.tick++;
    this.clearCanvas();
    drawEntities(this.entities, this.canvas.context);

    // Draw the current tick in the top left corner
    this.canvas.context.fillStyle = "white";
    this.canvas.context.font = "16px Arial";
    this.canvas.context.fillText(`Tick: ${this.state.tick}`, 10, 20);

    // Draw the current score in the top right corner
    this.canvas.context.fillText(
      `Score: ${this.state.score}`,
      this.canvas.htmlElement.width - 100,
      20,
    );

    requestAnimationFrame(this.update.bind(this));
  }

  public static startGame() {
    this.initControls();
    this.initCanvas();
    this.initState();
    this.initLevel(1);
    this.initPaddle();
    this.update();
  }
}
