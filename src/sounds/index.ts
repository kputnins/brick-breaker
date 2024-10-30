import hitBlock from './assets/Click_Standard_00.mp3';
import hitPaddle from './assets/Click_Standard_04.mp3';
import hitEdge from './assets/Click_Standard_05.mp3';

class Sound {
  private channels: HTMLAudioElement[];
  private currentChannel: number = 0;

  constructor(source: string) {
    this.channels = Array.from({ length: 4 }, () => new Audio(source));
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
} as const;
