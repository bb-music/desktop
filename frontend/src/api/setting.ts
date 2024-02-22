import { Setting, SettingInfo } from '@/app/api/setting';
import { GetConfig, GetSignData, GetSpiData, OpenDirectoryDialog } from '@wails/go/app/App';
import { JsonCacheStorage } from '@/lib/cacheStorage';
import { app } from '@wails/go/models';

export const settingCache = new JsonCacheStorage<SettingInfo>('bb-setting');

export class SettingInstance implements Setting {
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
      openMusicOrderOrigin: [],
      userMusicOrderOrigin: [],
    };
    const res = await GetConfig();
    return {
      ...config,
      videoProxyPort: res.video_proxy_port,
      // 歌单源
      openMusicOrderOrigin: config.openMusicOrderOrigin,
      // 个人歌单同步源
      userMusicOrderOrigin: config.userMusicOrderOrigin,
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
  updateOpenMusicOrderOrigin: Setting['updateOpenMusicOrderOrigin'] = async (value) => {
    return settingCache.update('openMusicOrderOrigin', value);
  };
  updateUserMusicOrderOrigin: Setting['updateUserMusicOrderOrigin'] = async (value) => {
    return settingCache.update('userMusicOrderOrigin', value);
  };
}

export async function getAuth() {
  const res = await settingCache.get();
  return {
    sign_data: {
      img_key: res?.signData.imgKey!,
      sub_key: res?.signData.subKey!,
    },
    spi_data: {
      b_3: res?.spiData.uuid_v3!,
      b_4: res?.spiData.uuid_v4!,
    },
  } as app.AuthParams;
}
