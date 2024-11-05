import { Game } from "./game/game";

import "./styles/style.scss";
import "./styles/helpers.scss";

function main() {
  Game.startGame();
  // @ts-expect-error - Expose game to global scope for debugging
  globalThis.game = Game;
}

main();
