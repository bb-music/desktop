import {
  MusicService,
  MusicServiceAction,
  MusicServiceHooks,
  SearchItem,
  SearchParams,
  SearchType,
} from '@/app/api/musicService';
import { createMusicId, html2text, mmss2seconds, transformImgUrl } from '@/utils';
import { app_bili, bb_client } from '@wails/go/models';
import { settingCache } from './setting';
import { MusicItem } from '@/app/api/music';
import {
  DownloadMusic,
  GetConfig,
  GetMusicDetail,
  GetMusicPlayerUrl,
  Search,
  InitConfig,
} from '@wails/go/app_bili/App';
import { SettingItem } from '@/app/modules/setting';
import { Input } from '@/app/components/ui/input';
import { useEffect, useState } from 'react';
import { Button } from '@/app/components/ui/button';

class BiliAction implements MusicServiceAction {
  searchList = async (params: SearchParams) => {
    const page = params.current || 1;
    const res = await Search({
      page: page + '',
      keyword: params.keyword,
    });

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
    const data = item.extraData!;
    const info = await GetMusicDetail({
      aid: data.aid + '',
      bvid: data.bvid,
    });
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
    const aid = music.extraData.aid?.toString()!;
    const bvid = music.extraData.bvid?.toString()!;
    const cid = music.extraData.cid?.toString()!;
    const url = await GetMusicPlayerUrl({ aid, bvid, cid });
    return url || '';
  };
  download = async (music: MusicItem) => {
    const config = await settingCache.get();
    const dir = config?.downloadDir;

    if (!dir) {
      return Promise.reject(new Error('请先设置下载目录'));
    }

    return DownloadMusic({
      aid: music.extraData.aid + '',
      cid: music.extraData.cid + '',
      bvid: music.extraData.bvid + '',
      download_dir: dir,
      name: music.name,
    });
  };
}
class BiliHooks implements MusicServiceHooks {
  init = async () => {
    await InitConfig();
  };
}

export class BiliMusicServiceInstance implements MusicService {
  name = 'bili';
  cname = '哔哩哔哩';
  ConfigElement = () => {
    const [config, setConfig] = useState<app_bili.Config>();
    const loadHandler = () => {
      GetConfig().then((res) => {
        setConfig(res);
      });
    };
    useEffect(() => {
      loadHandler();
    }, []);
    return (
      <>
        <SettingItem label='imgKey'>
          <Input
            value={config?.sign_data.img_key}
            disabled
          />
        </SettingItem>
        <SettingItem label='subKey'>
          <Input
            value={config?.sign_data.img_key}
            disabled
          />
        </SettingItem>
        <SettingItem label='UUID_V3'>
          <Input
            value={config?.spi_data.b_3}
            disabled
          />
        </SettingItem>
        <SettingItem label='UUID_V4'>
          <Input
            value={config?.spi_data.b_4}
            disabled
          />
        </SettingItem>
        <div style={{ marginBottom: 15 }}>
          <Button
            type='primary'
            onClick={() => {
              InitConfig().then((res) => {
                loadHandler();
              });
            }}
          >
            刷新源配置
          </Button>
        </div>
      </>
    );
  };
  action = new BiliAction();
  hooks = new BiliHooks();
}
