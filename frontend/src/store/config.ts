import { create } from 'zustand';
import { biliClient } from '@wails/go/models';
import { GetConfig, LoadSignData, SetDownloadDir, UpdateClientSignData } from '@wails/go/app/App';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ConfigStoreState {
  initLoading?: boolean;
  signData?: biliClient.SignData;
  videoProxyPort?: number;
  downloadDir?: string;
  /** 歌单广场来源 */
  musicOrderOpenOrigin: string[];
}
interface ConfigStoreHandler {
  init: () => Promise<void>;
  load: () => Promise<void>;
  /** 更新歌单广场源 */
  updateMusicOrderOpenOrigin: (list: string[]) => void;
}

type ConfigStore = ConfigStoreState & ConfigStoreHandler;

export const configStore = create(
  persist<ConfigStore>(
    (set, get) => {
      return {
        musicOrderOpenOrigin: [],
        load: async () => {
          const res = await GetConfig();
          set({
            signData: res.sign_data,
            videoProxyPort: res.video_proxy_port,
            downloadDir: res.download_dir,
          });
        },
        init: async () => {
          set({ initLoading: true });
          const signData = get().signData;
          const { img_key, sub_key } = signData || {};
          if (get().downloadDir) {
            await SetDownloadDir(get().downloadDir!);
          }
          if (signData && img_key && sub_key) {
            await UpdateClientSignData({
              img_key,
              sub_key,
            });
          } else {
            await LoadSignData();
            await get().load();
          }
          set({ initLoading: false });
        },
        updateMusicOrderOpenOrigin: (list) => {
          set({ musicOrderOpenOrigin: list });
        },
      };
    },
    {
      name: 'config-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useConfigStore = configStore;
