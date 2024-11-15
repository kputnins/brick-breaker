import { BALL_SIZE, PADDLE_SIZE, RESOLUTION } from "../constants/index.ts";
import {
  Ball,
  Brick,
  drawEntities,
  entities,
  Entity,
  moveEntities,
  Paddle,
  Position,
  Size,
  trackGameBalls,
} from "../ecs/index.ts";

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
  left: boolean;
  right: boolean;
  space: boolean;
};

type GameState = {
  tick: number;
  score: number;
  lives: number;
  paddleSpeed: number;
  paddleSize: PADDLE_SIZE;
  ballSpeed: number;
  ballSize: BALL_SIZE;
  ballDamage: number;
  ballAttachedToPaddle: boolean;
};

export class Game {
  // HTML elements
  private static canvas: Canvas;
  // Game state
  private static state: GameState;
  // Global values
  private static palyerName: string = "Player";
  private static worldSize: Size = new Size(new Position(0, 0), 1280, 720);
  private static resolution: (typeof RESOLUTION)[keyof typeof RESOLUTION] = RESOLUTION["720p"];
  private static paused: boolean = false;
  private static controls: Controls = { left: false, right: false, space: false };
  // Entities
  private static entities: Map<string, Entity> = entities;
  private static paddle: Paddle;

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
      this.paused = true;
      dialog.showModal();
    });

    closeButton.addEventListener("click", () => {
      this.paused = false;
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

    this.resolution = RESOLUTION[resolutionSelect.value as RESOLUTION];
    resolutionSelect.addEventListener("change", () => {
      this.resolution = RESOLUTION[resolutionSelect.value as RESOLUTION];
      this.canvas.htmlElement.width = this.resolution.width;
      this.canvas.htmlElement.height = this.resolution.height;
      this.draw();
    });

    this.palyerName = playerNameInput.value;
    playerNameInput.addEventListener("input", () => {
      this.palyerName = playerNameInput.value;
    });

    showButton.addEventListener("click", () => {
      this.paused = true;
      dialog.showModal();
    });

    closeButton.addEventListener("click", () => {
      this.paused = false;
      dialog.close();
    });
  }

  private static initNewGameButton() {
    const newGameButton = document.getElementById(
      "new-game-button",
    ) as HTMLButtonElement | null;

    if (!newGameButton) {
      console.log("New game button", newGameButton);
      throw new Error("Failed to get new game button element.");
    }

    newGameButton.addEventListener("click", () => {
      this.newGame();
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
      paddleSpeed: 15,
      paddleSize: PADDLE_SIZE.MEDIUM,
      ballSpeed: 5,
      ballSize: BALL_SIZE.MEDIUM,
      ballDamage: 1,
      ballAttachedToPaddle: true,
    };
  }

  private static initLevel(level: number) {
    switch (level) {
      default:
      case 1: {
        const brickCount = 100;
        const columns = 10;
        // Create 10 columns of 5 rows of bricks
        Array.from({ length: brickCount }, (_, i) => {
          const row = Math.floor(i / columns);
          const col = i % columns;

          const offsetX = (this.worldSize.width - brickCount * columns) / 2;
          const offsetY = 100;

          return new Brick({
            x: offsetX + col * brickCount,
            y: offsetY + row * 20,
          });
        });

        break;
      }
    }
  }

  private static initPaddle() {
    this.paddle = new Paddle({
      size: this.state.paddleSize,
      x: this.worldSize.width / 2 - this.state.paddleSize / 2,
      y: this.worldSize.height - this.state.paddleSize / 8 * 1,
    });
  }

  private static initBall() {
    const paddeCoordiantes = this.paddle.size?.coordinates;

    if (!paddeCoordiantes) {
      throw new Error("Failed to get paddle coordinates.");
    }

    const paddleCenterX = paddeCoordiantes.x1 + (paddeCoordiantes.x2 - paddeCoordiantes.x1) / 2;

    new Ball({
      size: this.state.ballSize,
      x: paddleCenterX - this.state.ballSize / 2,
      y: paddeCoordiantes.y1 - this.state.ballSize,
      velocity: 0,
    });
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

  private static draw() {
    this.clearCanvas();
    drawEntities(this.entities, this.canvas.context, this.worldSize, this.resolution.scale);

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

    // Draw the current lives in the top right corner
    this.canvas.context.fillText(
      `Lives: ${this.state.lives}`,
      this.canvas.htmlElement.width - 100,
      40,
    );
  }

  private static update() {
    if (this.paused) {
      requestAnimationFrame(this.update.bind(this));
      return;
    }

    this.state.tick++;

    this.handleInput();

    moveEntities(this.entities, this.worldSize);
    trackGameBalls(this.entities, this.worldSize);

    this.draw();

    requestAnimationFrame(this.update.bind(this));
  }

  private static handleInput() {
    this.updatePaddleVelocity();

    if (this.controls.space === true) {
      if (this.state.ballAttachedToPaddle) {
        this.state.ballAttachedToPaddle = false;
        this.entities.forEach((entity) => {
          if (entity instanceof Ball) {
            if (!entity.velocity) {
              throw new Error("Ball missing velocity.");
            }

            entity.velocity.set(this.state.ballSpeed, -this.state.ballSpeed);
          }
        });
      }

      // TODO - trigger powerups
    }
  }

  private static updatePaddleVelocity() {
    const paddlePosition = this.paddle.position;
    const paddleSize = this.paddle.size;
    const paddleVelocity = this.paddle.velocity;

    if (!paddlePosition || !paddleSize || !paddleVelocity) {
      throw new Error("Paddle missing size or velocity");
    }

    paddleVelocity.x = 0;

    if (this.controls.left && this.controls.right) return;

    if (this.controls.left) {
      paddleVelocity.x = -this.state.paddleSpeed;
    }

    if (this.controls.right) {
      paddleVelocity.x = this.state.paddleSpeed;
    }

    if (this.state.ballAttachedToPaddle) {
      this.entities.forEach((entity) => {
        if (entity instanceof Ball) {
          if (!entity.position || !entity.size) {
            throw new Error("Ball missing position or size.");
          }

          entity.position.x = paddlePosition.x + paddleSize.width / 2 - entity.size.width / 2;
        }
      });
    }
  }

  private static initInpurListeners() {
    globalThis.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowLeft":
          this.controls.left = true;
          break;
        case "ArrowRight":
          this.controls.right = true;
          break;
        case " ":
          this.controls.space = true;
          break;
      }
    });

    globalThis.addEventListener("keyup", (event) => {
      switch (event.key) {
        case "ArrowLeft":
          this.controls.left = false;
          break;
        case "ArrowRight":
          this.controls.right = false;
          break;
        case " ":
          this.controls.space = false;
          break;
      }
    });
  }

  private static initDom() {
    this.initInfoDialog();
    this.initOptionsDialog();
    this.initNewGameButton();
    this.initInpurListeners();
    this.initCanvas();
  }

  public static newGame() {
    this.entities.clear();
    this.initState();
    this.initLevel(1);
    this.initPaddle();
    this.initBall();
  }

  public static startGame() {
    this.initDom();
    this.newGame();
    this.update();
  }

  public static resetPaddleAndBall() {
    if (!this.paddle.position) {
      throw new Error("Paddle missing position.");
    }

    this.paddle.position.set(
      this.worldSize.width / 2 - this.state.paddleSize / 2,
      this.worldSize.height - this.state.paddleSize / 8 * 1,
    );

    this.initBall();
    Game.state.ballAttachedToPaddle = true;
  }

  public static incrementScore = (amount: number) => {
    Game.state.score += amount;
  };

  public static incrementLives = (amount: number = 1) => {
    Game.state.lives += amount;
  };

  public static decrementLives = (amount: number = 1) => {
    Game.state.lives -= amount;
  };

  public static hasLives = () => {
    return Game.state.lives > 0;
  };

  public static isDevMode(): boolean {
    return globalThis.location.hostname === "localhost";
  }

  public static isDemoMode(): boolean {
    return globalThis.location.search.includes("demo");
  }
}
