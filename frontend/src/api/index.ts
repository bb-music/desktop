import { Setting, SettingInfo } from '@/app/api/setting';
import { Api } from '../app/api';
import { GetConfig, GetSignData, GetSpiData, OpenDirectoryDialog } from '@wails/go/app/App';
import { JsonCacheStorage } from '@/lib/cacheStorage';

export const settingCache = new JsonCacheStorage<SettingInfo>('setting');

class SettingInstance implements Setting {
  getInfo = async () => {
    const config = (await settingCache.get()) || {
      signData: {
        imgKey: '',
        subKey: '',
      },
      spiData: {
        uuid_v3: '',
        uuid_v4: '',
      },
    };
    const res = await GetConfig();
    return {
      ...config,
      videoProxyPort: res.video_proxy_port,
      // 歌单源
      musicOrderOpenOrigin: [],
      // 个人歌单同步源
      userMusicOrderOrigin: [],
    };
  };
  updateSignData = async () => {
    const res = await GetSignData();
    await settingCache.update('signData', {
      imgKey: res.img_key,
      subKey: res.sub_key,
    });
  };
  updateSpiData = async () => {
    const res = await GetSpiData();
    await settingCache.update('spiData', {
      uuid_v3: res.b_3,
      uuid_v4: res.b_4,
    });
  };
  selectDownloadDir = async () => {
    return OpenDirectoryDialog('选择下载目录');
  };
  updateDownloadDir = async (dir: string) => {
    return settingCache.update('downloadDir', dir);
  };
  updateMusicOrderOpenOrigin: Setting['updateMusicOrderOpenOrigin'] = async (value) => {
    return settingCache.update('musicOrderOpenOrigin', value);
  };
  updateUserMusicOrderOrigin: Setting['updateUserMusicOrderOrigin'] = async (value) => {
    return settingCache.update('userMusicOrderOrigin', value);
  };
}

export const apiInstance: Api = {
  setting: new SettingInstance(),
};
