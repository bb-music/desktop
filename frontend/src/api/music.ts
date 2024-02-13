import { GetVideoDetail } from '@wails/go/app/App';
import { getAuth, settingCache } from './setting';
import { DownloadMusic } from '@wails/go/app/App';
import { Music, MusicItem, MusicOrderItem } from '@/app/api/music';
import { createMusicId } from '@/player';
import { transformImgUrl } from '@/utils';

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
    const q = new URLSearchParams();
    const aid = music.extraData.aid?.toString()!;
    const bvid = music.extraData.bvid?.toString()!;
    const cid = music.extraData.cid?.toString()!;
    q.set('aid', aid);
    q.set('bvid', bvid);
    q.set('cid', cid);
    const setting = await settingCache.get();
    const port = setting?.videoProxyPort;
    return `http://localhost:${port}/videofile/${music.name}?${q.toString()}`;
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
}
