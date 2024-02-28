import { SettingApi, SettingInfo } from '@bb-music/web-app';
import { GetConfig, OpenDirectoryDialog } from '@wails/go/app_base/App';
import { JsonCacheStorage } from '@/lib/cacheStorage';

export const settingCache = new JsonCacheStorage<SettingInfo>('bb-setting');

export class SettingInstance implements SettingApi {
  getInfo = async () => {
    const config = await settingCache.get();
    const res = await GetConfig();
    return {
      openMusicOrderOrigin: [],
      userMusicOrderOrigin: [],
      musicServices: [],
      ...config,
      proxyServerPort: res.proxy_server_port,
    };
  };
  selectDownloadDir = async () => {
    return OpenDirectoryDialog('选择下载目录');
  };
  updateDownloadDir: SettingApi['updateDownloadDir'] = async (dir: string) => {
    return settingCache.update('downloadDir', dir);
  };
  updateOpenMusicOrderOrigin: SettingApi['updateOpenMusicOrderOrigin'] = async (value) => {
    return settingCache.update('openMusicOrderOrigin', value);
  };
  updateUserMusicOrderOrigin: SettingApi['updateUserMusicOrderOrigin'] = async (value) => {
    return settingCache.update('userMusicOrderOrigin', value);
  };
}
