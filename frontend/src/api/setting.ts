import { Setting, SettingInfo } from '@/app/api/setting';
import { GetConfig, OpenDirectoryDialog } from '@wails/go/app_base/App';
import { JsonCacheStorage } from '@/lib/cacheStorage';

export const settingCache = new JsonCacheStorage<SettingInfo>('bb-setting');

export class SettingInstance implements Setting {
  getInfo = async () => {
    const config = (await settingCache.get()) || {
      openMusicOrderOrigin: [],
      userMusicOrderOrigin: [],
      musicServices: [],
    };
    const res = await GetConfig();
    return {
      ...config,
      proxyServerPort: res.proxy_server_port,
    };
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
