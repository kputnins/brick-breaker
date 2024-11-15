import * as hitBlock from "./assets/Click_Standard_00.mp3";
import * as hitPaddle from "./assets/Click_Standard_04.mp3";
import * as hitEdge from "./assets/Click_Standard_05.mp3";
import * as loosaAllBalls from "./assets/Click_Heavy_00.mp3";

type SoundSource = { default: string };

class Sound {
  private channels: HTMLAudioElement[];
  private currentChannel: number = 0;

  constructor(source: string, volume: number = 0.5) {
    this.channels = Array.from({ length: 4 }, () => {
      const audio = new Audio(source);
      audio.volume = volume;
      return audio;
    });
  }

  public play() {
    this.currentChannel = (this.currentChannel + 1) % this.channels.length;
    this.channels[this.currentChannel].play();
  }
}

export const SOUNDS = {
  HIT_BLOCK: new Sound((hitBlock as SoundSource).default),
  HIT_PADDLE: new Sound((hitPaddle as SoundSource).default),
  HIT_EDGE: new Sound((hitEdge as SoundSource).default),
  LOOSE_ALL_BALLS: new Sound((loosaAllBalls as SoundSource).default, 0.2),
} as const;
