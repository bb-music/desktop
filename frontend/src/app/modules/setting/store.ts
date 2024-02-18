import { create } from 'zustand';
import { SettingInfo } from '@/app/api/setting';
import { api } from '@/app/api';

interface SettingStoreState extends SettingInfo {}

interface SettingStoreHandler {
  load: () => Promise<void>;
}

type SettingStore = SettingStoreState & SettingStoreHandler;

export const settingStore = create<SettingStore>()((set, get) => {
  return {
    ...new SettingInfo(),
    load: async () => {
      const res = await api.setting.getInfo();
      set({
        signData: res.signData,
        spiData: res.spiData,
        videoProxyPort: res.videoProxyPort,
        downloadDir: res.downloadDir,
        openMusicOrderOrigin: res.openMusicOrderOrigin || [],
        userMusicOrderOrigin: res.userMusicOrderOrigin || [],
      });
    },
  };
});

export const useSettingStore = settingStore;
