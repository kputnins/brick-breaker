import hitBlock from './assets/Click_Standard_00.mp3';
import hitPaddle from './assets/Click_Standard_04.mp3';
import hitEdge from './assets/Click_Standard_05.mp3';
import loosaAllBalls from './assets/Click_Heavy_00.mp3';

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
  HIT_BLOCK: new Sound(hitBlock),
  HIT_PADDLE: new Sound(hitPaddle),
  HIT_EDGE: new Sound(hitEdge),
  LOOSE_ALL_BALLS: new Sound(loosaAllBalls, 0.2),
} as const;
