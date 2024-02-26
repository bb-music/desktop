import {
  MusicService,
  MusicServiceAction,
  MusicServiceHooks,
  SearchItem,
  SearchParams,
  SearchType,
} from '@/app/api/musicService';
import { html2text, transformImgUrl } from '@/utils';
import { app_bili } from '@wails/go/models';
import { settingCache } from './setting';
import { MusicItem } from '@/app/api/music';
import { DownloadMusic, Search, InitConfig, SearchDetail, GetConfig } from '@wails/go/app_bili/App';
import { SettingItem } from '@/app/modules/setting';
import { Input } from '@/app/components/ui/input';
import { useEffect, useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Switch } from '@/app/components/ui/switch';
import { message } from '@/app/components/ui/message';
import { Resp, request } from '@/lib/request';
import { GetMusicPlayerUrl } from '@wails/go/app_base/App';

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
    const query = {
      page: page + '',
      keyword: params.keyword,
    };
    const res = await Search(query);
    // const {
    //   data: { data: res },
    // } = await request<Resp<bb_type.SearchResponse>>(`/api/search/${NAME}`, {
    //   params: {
    //     page: page + '',
    //     keyword: params.keyword,
    //   },
    // });
    return {
      ...res,
      data: res.data.map((item) => ({
        ...item,
        name: html2text(item.name),
        cover: transformImgUrl(item.cover),
        type: item.type as SearchType,
      })),
    };
  };
  searchItemDetail = async (item: SearchItem) => {
    const info = await SearchDetail(item.id);
    // const {
    //   data: { data: info },
    // } = await request<Resp<bb_type.SearchItem>>(`/api/search/${NAME}/${item.id}`);
    return {
      ...info,
      type: info.type as SearchType,
    };
  };
  getMusicPlayerUrl = async (music: MusicItem) => {
    // const setting = await settingCache.get();
    const url = await GetMusicPlayerUrl(music.id, music.origin);
    // const url = `http://localhost:9091/api/music/file/${music.origin}/${music.id}`;
    console.log('url: ', url);
    return url || '';
  };
  download = async (music: MusicItem) => {
    const setting = await settingCache.get();
    const dir = setting?.downloadDir;

    if (!dir) {
      return Promise.reject(new Error('请先设置下载目录'));
    }

    return DownloadMusic({
      id: music.id,
      origin: music.origin,
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
    const loadHandler = async () => {
      // const { data:{data:res}} = await request<Resp<app_bili.Config>>(`/api/config/${NAME}`).then((res) => {
      //   console.log('res: ', res.data.data);
      //   setConfig(res.data.data);
      // });
      const res = await GetConfig();
      setConfig(res);
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
