import {
  MusicServiceApi,
  MusicServiceApiAction,
  MusicServiceApiHooks,
  SearchType,
  SettingItem,
  Input,
  Button,
  Switch,
  message,
  MusicInter,
} from '@bb-music/web-app';
import {
  getMusicServiceConfig,
  html2text,
  mergeUrl,
  proxyMusicService,
  transformImgUrl,
} from '@/utils';
import { app_bili } from '@wails/go/models';
import { settingCache } from './setting';
import { DownloadMusic, Search, InitConfig, SearchDetail, GetConfig } from '@wails/go/app_bili/App';
import { useEffect, useState } from 'react';
import { GetMusicPlayerUrl } from '@wails/go/app_base/App';

type SearchItem = MusicInter.SearchItem;
type SearchParams = MusicInter.SearchParams;
type MusicItem = MusicInter.MusicItem;

class BiliMusicServiceConfigValue {
  enabled = true;
  proxyEnabled = false;
  proxyAddress = '';
  proxyToken = '';
}

const NAME = 'bili';
const CNAME = '哔哩哔哩';

class BiliAction implements MusicServiceApiAction {
  searchList: MusicServiceApiAction['searchList'] = async (params) => {
    const page = params.current || 1;
    const query = {
      page: page + '',
      keyword: params.keyword,
    };

    const res = await proxyMusicService(NAME, {
      proxy: {
        url: `/api/search/${NAME}`,
        params: query,
      },
      handler: async () => await Search(query),
    });

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
  searchItemDetail: MusicServiceApiAction['searchItemDetail'] = async (item) => {
    const info = await proxyMusicService(NAME, {
      proxy: {
        url: `/api/search/${NAME}/${item.id}`,
      },
      handler: async () => await SearchDetail(item.id),
    });
    return {
      ...info,
      type: info.type as SearchType,
    };
  };
  getMusicPlayerUrl: MusicServiceApiAction['getMusicPlayerUrl'] = async (music) => {
    const config = await getMusicServiceConfig(NAME);
    if (config.proxyEnabled) {
      return mergeUrl(config.proxyAddress, `/api/music/file/${NAME}/${music.id}`);
    }
    const url = await GetMusicPlayerUrl(music.id, music.origin);
    return url || '';
  };
  download: MusicServiceApiAction['download'] = async (music) => {
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
class BiliHooks implements MusicServiceApiHooks {
  init = async () => {
    await InitConfig();
  };
}

type BiliMusicServiceApi = MusicServiceApi<BiliMusicServiceConfigValue>;

export class BiliMusicServiceInstance implements BiliMusicServiceApi {
  name = NAME;
  cname = CNAME;
  ConfigElement: BiliMusicServiceApi['ConfigElement'] = ({ onChange }) => {
    const [config, setConfig] = useState<app_bili.Config>();
    const [data, setData] = useState<BiliMusicServiceConfigValue>(
      new BiliMusicServiceConfigValue()
    );
    const loadHandler = async () => {
      const res = await proxyMusicService(NAME, {
        proxy: {
          url: `/api/config/${NAME}`,
        },
        handler: () => GetConfig(),
      });
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
