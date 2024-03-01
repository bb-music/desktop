import {
  AudioInstance,
  MusicApi,
  PlayerAudioAddEventListener,
  playerStore,
} from '@bb-music/web-app';

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

    audio.addEventListener('play', () => {
      const music = playerStore.getState().current;
      navigator.mediaSession.playbackState = 'playing';
      if (music) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: music.name,
          artist: '',
          album: '',
          artwork: [
            {
              src: music.cover || '',
            },
          ],
        });
      }
    });
    audio.addEventListener('pause', () => {
      navigator.mediaSession.playbackState = 'paused';
    });
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      playerStore.getState().next();
    });
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      playerStore.getState().prev();
    });
    navigator.mediaSession.setActionHandler('play', () => {
      playerStore.getState().play();
    });
    navigator.mediaSession.setActionHandler('pause', () => {
      playerStore.getState().pause();
    });
  }
  setCurrentTime(time: number): void {
    this.ctx.currentTime = time;
  }
  getReadyState() {
    return this.ctx.readyState;
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
  addEventListener: PlayerAudioAddEventListener = (event, callback) => {
    this.ctx.addEventListener(event, callback as any);
  };
  removeEventListener: PlayerAudioAddEventListener = (event, callback) => {
    this.ctx.removeEventListener(event, callback as any);
  };
}

export class MusicInstance implements MusicApi {
  createAudio() {
    return new PlayerAudio();
  }
}
