import "./style.scss";
import "./helpers.scss";

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

type Player = {
  score: number;
  lives: number;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  acceleration: { x: number; y: number };
  size: { width: number; height: number };
};

type GameState = {
  tick: number;
  player: Player;
};

type Sprites = {
  player: HTMLImageElement;
  block: HTMLImageElement;
  ball: HTMLImageElement;
};

class Game {
  private static canvas: Canvas;
  private static controls: Controls;
  private static state: GameState;
  private static palyerName: string = "Player";
  private static sprites: Sprites;

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
      player: {
        score: 0,
        lives: 3,
        position: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 },
        acceleration: { x: 0, y: 0 },
        size: { width: 32, height: 32 },
      },
    };
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
    requestAnimationFrame(this.update.bind(this));
  }

  public static startGame() {
    this.initControls();
    this.initCanvas();
    this.initState();
    this.update();
  }
}

function main() {
  Game.startGame();
  window.game = Game;
}

main();
