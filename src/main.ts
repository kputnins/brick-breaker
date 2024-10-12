import { Game } from "./game/game";

import "./styles/style.scss";
import "./styles/helpers.scss";

function main() {
  Game.startGame();
  window.game = Game;
}

main();
