import { create } from 'zustand';
import { StateStorage } from 'zustand/middleware';
import { BaseStore } from '@/app/interface/store';
import { SettingInfo } from '@/app/api/setting';
import { api } from '@/app/api';

interface SettingStoreState extends SettingInfo {}

interface SettingStoreHandler {
  load: () => Promise<void>;
}

type SettingStore = SettingStoreState & SettingStoreHandler;

export let useSettingStore: BaseStore<SettingStore>;

export function registerSettingStore(storage: StateStorage) {
  if (!useSettingStore) {
    useSettingStore = create<SettingStore>()((set, get) => {
      return {
        ...new SettingInfo(),
        load: async () => {
          const res = await api.setting.getInfo();
          set({
            signData: res.signData,
            videoProxyPort: res.videoProxyPort,
            downloadDir: res.downloadDir,
            musicOrderOpenOrigin: res.musicOrderOpenOrigin,
            userMusicOrderOrigin: res.userMusicOrderOrigin,
          });
        },
      };
    });
    useSettingStore.getState().load();
  }
}
