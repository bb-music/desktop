import { create } from 'zustand';
import { MusicItem, MusicOrderItem } from '@/app/api/music';

export interface MusicOrderDetailStoreState {
  data?: MusicOrderItem;
  remoteName?: string;
  canEditMusic?: boolean;
}
interface MusicOrderDetailStoreHandler {
  setData: (data: MusicOrderItem) => void;
}

type MusicOrderDetailStore = MusicOrderDetailStoreState & MusicOrderDetailStoreHandler;

export const musicOrderDetailStore = create<MusicOrderDetailStore>()((set, get) => {
  return {
    canEditMusic: false,
    setData: (data) => {
      set({ data });
    },
  };
});

export const useMusicOrderDetailStore = musicOrderDetailStore;
