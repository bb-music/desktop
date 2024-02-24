import { AudioInstance, Music } from '@/app/api/music';

class PlayerAudio implements AudioInstance {
  ctx = new Audio();
  constructor() {
    const id = 'BB_MUSIC_AUDIO';
    const a = document.getElementById(id) as HTMLAudioElement;
    if (a) {
      this.ctx = a;
      return;
    }
    const audio = new Audio();
    audio.style.display = 'none';
    audio.id = id;
    this.ctx = audio;
    document.body.append(audio);
  }
  setCurrentTime(time: number): void {
    this.ctx.currentTime = time;
  }
  getCurrentTime() {
    return this.ctx.currentTime;
  }
  setSrc(src: string): void {
    this.ctx.src = src;
  }
  play(): void {
    this.ctx.play();
  }
  pause(): void {
    this.ctx.pause();
  }
  addEventListener(event: 'timeupdate' | 'ended', callback: (e: any) => void): void {
    this.ctx.addEventListener(event, callback);
  }
  removeEventListener(event: 'timeupdate' | 'ended', callback: (e: any) => void): void {
    this.ctx.removeEventListener(event, callback);
  }
}

export class MusicInstance implements Music {
  createAudio() {
    return new PlayerAudio();
  }
}
