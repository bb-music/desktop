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
import { Switch } from '@/app/components/ui/switch';
import { message } from '@/app/components/ui/message';

class BiliMusicServiceConfigValue {
  enabled = true;
  proxyEnabled = false;
  proxyAddress = '';
  proxyToken = '';
}

const NAME = 'bili';
const CNAME = '哔哩哔哩';

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
    const setting = await settingCache.get();
    const dir = setting?.downloadDir;

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

export class BiliMusicServiceInstance implements MusicService<BiliMusicServiceConfigValue> {
  name = NAME;
  cname = CNAME;
  ConfigElement = ({ onChange }: { onChange?: (v: BiliMusicServiceConfigValue) => void }) => {
    const [config, setConfig] = useState<app_bili.Config>();
    const [data, setData] = useState<BiliMusicServiceConfigValue>(
      new BiliMusicServiceConfigValue()
    );
    const loadHandler = () => {
      GetConfig().then((res) => {
        setConfig(res);
      });
      settingCache.get().then((res) => {
        if (res) {
          const c = res.musicServices.find((m) => m.name === NAME)?.config;
          setData(c);
        }
      });
    };
    useEffect(() => {
      loadHandler();
    }, []);
    const createProps = (key: keyof typeof data, isSwitch?: boolean) => {
      return {
        [isSwitch ? 'checked' : 'value']: data[key],
        onChange: (e: any) => {
          setData((s) => ({
            ...s,
            [key]: isSwitch ? e : e.target.value,
          }));
        },
      };
    };
    const saveHandler = async () => {
      await updateMusicServicesSetting(NAME, data);
      onChange?.(data);
      message.success('已保存');
    };
    return (
      <>
        <SettingItem label='开启/关闭'>
          <Switch {...createProps('enabled', true)} />
        </SettingItem>
        <div style={{ display: data.enabled ? 'block' : 'none' }}>
          <SettingItem label='代理开启/关闭'>
            <Switch {...createProps('proxyEnabled', true)} />
          </SettingItem>
          <div style={{ display: data.proxyEnabled ? 'block' : 'none' }}>
            <SettingItem label='代理地址'>
              <Input {...createProps('proxyAddress')} />
            </SettingItem>
            <SettingItem label='代理秘钥'>
              <Input {...createProps('proxyToken')} />
            </SettingItem>
          </div>
          <div style={{ display: !data.proxyEnabled ? 'block' : 'none' }}>
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
          </div>
        </div>
        <div style={{ marginBottom: 15, display: 'flex', gap: '15px' }}>
          <Button
            style={{ display: !data.proxyEnabled ? '' : 'none' }}
            onClick={() => {
              InitConfig().then((res) => {
                loadHandler();
              });
            }}
          >
            刷新源配置
          </Button>
          <Button onClick={saveHandler}>保存</Button>
        </div>
      </>
    );
  };
  action = new BiliAction();
  hooks = new BiliHooks();
}

async function updateMusicServicesSetting(serviceName: string, data: any) {
  const setting = await settingCache.get();
  let list = setting?.musicServices || [];
  if (list.find((n) => n.name === serviceName)) {
    list = list.map((l) => {
      if (l.name === serviceName) {
        l.config = data;
      }
      return l;
    });
  } else {
    list.push({
      name: serviceName,
      config: data,
    });
  }
  settingCache.update('musicServices', list);
}

async function getBiliService() {
  const config = await settingCache.get();
  const service = config?.musicServices.find((m) => m.name === NAME);
  return service;
}
