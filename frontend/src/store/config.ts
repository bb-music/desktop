import { create } from 'zustand';
import { bb_client } from '@wails/go/models';
import { GetConfig, LoadSignData, SetDownloadDir, UpdateClientSignData } from '@wails/go/app/App';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserMusicOrderOrigin, UserMusicOrderOriginType } from '@/utils/userMusicOrder/common';

interface ConfigStoreState {
  initLoading?: boolean;
  signData?: bb_client.SignData;
  videoProxyPort?: number;
  downloadDir?: string;
  /** 歌单广场来源 */
  musicOrderOpenOrigin: string[];
  /** 个人歌单同步 */
  userMusicOrderOrigin: UserMusicOrderOrigin.Config[];
}
interface ConfigStoreHandler {
  init: () => Promise<void>;
  load: () => Promise<void>;
  /** 更新歌单广场源 */
  updateMusicOrderOpenOrigin: (list: string[]) => void;
  /** 更新用户同步源 */
  updateUserMusicOrderOrigin: (list: UserMusicOrderOrigin.Config[]) => void;
}

type ConfigStore = ConfigStoreState & ConfigStoreHandler;

export const configStore = create(
  persist<ConfigStore>(
    (set, get) => {
      return {
        musicOrderOpenOrigin: [],
        userMusicOrderOrigin: [
          // {
          //   type: UserMusicOrderOriginType.Gitee,
          //   username: '975794403@qq.com',
          //   password: 'ff27b634a51eaa5b36ddb702ce4a2a1a',
          //   repoName: 'bb-music-order-open',
          // },
        ],
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
        updateUserMusicOrderOrigin: (list) => {
          set({ userMusicOrderOrigin: list });
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
