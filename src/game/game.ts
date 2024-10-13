import {
  Ball,
  Brick,
  drawEntities,
  entities,
  Entity,
  moveEntities,
  Paddle,
} from "../ecs";

declare global {
  interface Window {
    game: Game; // Replace with your actual class name
  }
}

const RESOLUTIONS = {
  "480p": { width: 640, height: 480, scale: 0.5 },
  "720p": { width: 1280, height: 720, scale: 1 },
  "1080p": { width: 1920, height: 1080, scale: 1.5 },
  "1440p": { width: 2560, height: 1440, scale: 2 },
  "2160p": { width: 3840, height: 2160, scale: 3 },
} as const;

type Resolution = keyof typeof RESOLUTIONS;

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
  private static controls: Controls; // TODO check if field requiered
  // Game state
  private static state: GameState;
  // Global values
  private static palyerName: string = "Player";
  private static resolution: (typeof RESOLUTIONS)[keyof typeof RESOLUTIONS] =
    RESOLUTIONS["720p"];
  // Resources
  private static sprites: Sprites;
  // Entities
  private static entities: Map<string, Entity> = entities;

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
    this.initOptionsDialog();
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

  private static initOptionsDialog() {
    const dialog = document.getElementById(
      "options-dialog",
    ) as HTMLDialogElement | null;
    const showButton = document.getElementById(
      "options-button",
    ) as HTMLButtonElement | null;
    const closeButton = dialog?.querySelector(
      "dialog button",
    ) as HTMLButtonElement | null;

    const resolutionSelect = document.getElementById(
      "option-resolution",
    ) as HTMLSelectElement | null;
    const playerNameInput = document.getElementById(
      "option-player-name",
    ) as HTMLInputElement | null;

    if (
      !dialog ||
      !showButton ||
      !closeButton ||
      !resolutionSelect ||
      !playerNameInput
    ) {
      console.log("Options dialog", dialog);
      console.log("Options button", showButton);
      console.log("Close button", closeButton);
      console.log("Resolution select", resolutionSelect);
      console.log("Player name input", playerNameInput);
      throw new Error("Failed to get options dialog elements.");
    }

    this.resolution = RESOLUTIONS[resolutionSelect.value as Resolution];
    resolutionSelect.addEventListener("change", () => {
      this.resolution = RESOLUTIONS[resolutionSelect.value as Resolution];
      this.canvas.htmlElement.width = this.resolution.width;
      this.canvas.htmlElement.height = this.resolution.height;
    });

    this.palyerName = playerNameInput.value;
    playerNameInput.addEventListener("input", () => {
      this.palyerName = playerNameInput.value;
    });

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
    this.canvas.htmlElement.width = this.resolution.width;
    this.canvas.htmlElement.height = this.resolution.height;
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
        Array.from({ length: 10 }, (_, i) => {
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
    new Paddle(
      this.canvas.htmlElement.width / 2,
      this.canvas.htmlElement.height - 50,
    );
  }

  private static initBall() {
    new Ball(
      this.canvas.htmlElement.width / 2,
      this.canvas.htmlElement.height / 2,
    );
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

    moveEntities(
      this.entities,
      this.canvas.htmlElement.width,
      this.canvas.htmlElement.height,
    );

    this.clearCanvas();
    drawEntities(this.entities, this.canvas.context,
      this.canvas.htmlElement.width,
      this.canvas.htmlElement.height,);

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
    this.initBall();
    this.update();
  }
}
