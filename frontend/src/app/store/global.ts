import { create } from 'zustand';
import { bb_client } from '@wails/go/models';
import { GetConfig, LoadSignData, SetDownloadDir, UpdateClientSignData } from '@wails/go/app/App';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserMusicOrderOrigin } from '@/utils/userMusicOrder/common';

interface GlobalStoreState {
  theme: string;
}
interface GlobalStoreHandler {
  init: (state: GlobalStoreState) => Promise<void>;
}

type GlobalStore = GlobalStoreState & GlobalStoreHandler;

export const globalStore = create(
  persist<GlobalStore>(
    (set, get) => {
      return {
        theme: 'dark',
        init: async (state: GlobalStoreState) => {
          set(state);
        },
      };
    },
    {
      name: 'config-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useGlobalStore = globalStore;
