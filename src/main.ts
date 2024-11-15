import { Game } from "./game/game.ts";

import "./styles/style.scss";

type ExtraGlobals = {
  game: Game;
};

function main() {
  Game.startGame();
  (globalThis as typeof globalThis & ExtraGlobals).game = Game;
}

main();
