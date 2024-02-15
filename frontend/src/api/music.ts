import { GetConfig, GetVideoDetail } from '@wails/go/app/App';
import { getAuth, settingCache } from './setting';
import { DownloadMusic } from '@wails/go/app/App';
import { AudioInstance, Music, MusicItem, MusicOrderItem } from '@/app/api/music';
import { createMusicId } from '@/player';
import { transformImgUrl } from '@/utils';

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
  getMusicOrderInfo = async (data: MusicOrderItem) => {
    const auth = await getAuth();
    const info = await GetVideoDetail(
      {
        aid: data.extraData.aid + '',
        bvid: data.extraData.bvid,
      },
      auth
    );

    return {
      id: `${info.aid}_${info.bvid}`,
      name: info.title,
      cover: transformImgUrl(info.pic),
      duration: info.duration,
      extraData: info,
      author: '',
      musicList: info.pages.map((p) => {
        return {
          id: createMusicId(p),
          cover: transformImgUrl(p.first_frame),
          name: p.part,
          duration: p.duration,
          author: '',
          extraData: p,
        };
      }),
    };
  };
  getMusicPlayerUrl = async (music: MusicItem) => {
    console.log('music: ', music);
    const q = new URLSearchParams();
    const aid = music.extraData.aid?.toString()!;
    const bvid = music.extraData.bvid?.toString()!;
    const cid = music.extraData.cid?.toString()!;
    const setting = await settingCache.get();
    q.set('aid', aid);
    q.set('bvid', bvid);
    q.set('cid', cid);
    q.set('uuid_v3', setting?.spiData.uuid_v3!);
    q.set('uuid_v4', setting?.spiData.uuid_v4!);
    q.set('img_key', setting?.signData.imgKey!);
    q.set('sub_key', setting?.signData.subKey!);
    // q.set('name', music.name);
    const config = await GetConfig();
    const port = config.video_proxy_port;
    const url = `http://localhost:${port}/videofile/${music.name}?${q.toString()}`;
    console.log('url: ', url);
    return url;
  };
  download = async (music: MusicItem) => {
    const config = await settingCache.get();
    const dir = config?.downloadDir;

    if (!dir) {
      // TODO 提示，要去设置下载目录
      return;
    }

    const auth = await getAuth();

    DownloadMusic(
      {
        aid: music.extraData.aid + '',
        cid: music.extraData.cid + '',
        bvid: music.extraData.bvid + '',
        download_dir: dir,
        name: music.name,
      },
      auth
    ).then((res) => {
      console.log(res);
    });
  };
  createAudio() {
    return new PlayerAudio();
  }
}
