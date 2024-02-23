import { MusicService, MusicServiceAction } from '@/app/api/musicService';
import { SearchItem, SearchParams, SearchType } from '@/app/api/search';
import { Search } from '@wails/go/app/App';
import { createMusicId, html2text, mmss2seconds, transformImgUrl } from '@/utils';
import { bb_client } from '@wails/go/models';
import { GetConfig, GetVideoDetail } from '@wails/go/app/App';
import { getAuth, settingCache } from './setting';
import { DownloadMusic } from '@wails/go/app/App';
import { MusicItem } from '@/app/api/music';
import axios from 'axios';

class BiliAction implements MusicServiceAction {
  searchList = async (params: SearchParams) => {
    const auth = await getAuth();
    const page = params.current || 1;
    const res = await Search(
      {
        page: page + '',
        keyword: params.keyword,
      },
      auth
    );

    return {
      current: page,
      total: res.numResults,
      pageSize: res.pagesize,
      list: res.result
        .filter((r) => !['ketang'].includes(r.type))
        .map((item) => ({
          id: item.id + '',
          name: html2text(item.title),
          cover: transformImgUrl(item.pic),
          duration: mmss2seconds(item.duration),
          author: item.author,
          type: SearchType.Order,
          origin: 'bili',
          extraData: {
            aid: item.aid,
            bvid: item.bvid,
          },
        })),
    };
  };
  searchItemDetail = async (item: SearchItem<bb_client.SearchResultItem>) => {
    const auth = await getAuth();
    const data = item.extraData!;
    const info = await GetVideoDetail(
      {
        aid: data.aid + '',
        bvid: data.bvid,
      },
      auth
    );
    if (info.videos > 1) {
      return {
        ...item,
        musicList: info.pages.map((p) => {
          const f = { aid: info.aid, bvid: info.bvid, cid: p.cid };
          return {
            id: createMusicId(f),
            cover: p.first_frame,
            name: p.part,
            duration: p.duration,
            author: item.author,
            origin: 'bili',
            extraData: {
              aid: f.aid,
              bvid: f.bvid,
              cid: p.cid,
            },
          };
        }),
        type: SearchType.Order,
        extraData: {
          aid: info.aid,
          bvid: info.bvid,
          cid: info.cid,
        },
      };
    } else {
      return {
        ...item,
        type: SearchType.Music,
        extraData: {
          aid: info.aid,
          bvid: info.bvid,
          cid: info.cid,
        },
      };
    }
  };
  getMusicPlayerUrl = async (music: MusicItem) => {
    const q = new URLSearchParams();
    const aid = music.extraData.aid?.toString()!;
    const bvid = music.extraData.bvid?.toString()!;
    const cid = music.extraData.cid?.toString()!;
    const setting = await settingCache.get();
    q.set('aid', aid);
    q.set('bvid', bvid);
    q.set('cid', cid);
    // q.set('uuid_v3', setting?.spiData.uuid_v3!);
    // q.set('uuid_v4', setting?.spiData.uuid_v4!);
    // q.set('img_key', setting?.signData.imgKey!);
    // q.set('sub_key', setting?.signData.subKey!);
    // q.set('name', music.name);
    const config = await GetConfig();
    const port = config.video_proxy_port;
    const uid = createMusicId({ aid, bvid, cid });
    const baseUrl = `http://localhost:${port}`;
    await axios.get(`${baseUrl}/setauth`, {
      params: {
        uuid_v3: setting?.spiData.uuid_v3,
        uuid_v4: setting?.spiData.uuid_v4,
        img_key: setting?.signData.imgKey,
        sub_key: setting?.signData.subKey,
      },
    });
    const url = `${baseUrl}/video/proxy/${music.origin}/${uid}.music?${q.toString()}`;
    return url;
  };
  download = async (music: MusicItem) => {
    const config = await settingCache.get();
    const dir = config?.downloadDir;

    if (!dir) {
      return Promise.reject(new Error('请先设置下载目录'));
    }

    const auth = await getAuth();

    return DownloadMusic(
      {
        aid: music.extraData.aid + '',
        cid: music.extraData.cid + '',
        bvid: music.extraData.bvid + '',
        download_dir: dir,
        name: music.name,
      },
      auth
    );
  };
}

export class BiliMusicServiceInstance implements MusicService {
  name = 'bili';
  cname = '哔哩哔哩';
  ConfigElement = () => {
    return <></>;
  };
  action = new BiliAction();
}
