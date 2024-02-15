import { create } from 'zustand';
import { MusicOrderItem } from '@/app/api/music';

interface MusicOrderDetailStoreState {
  data?: MusicOrderItem;
}
interface MusicOrderDetailStoreHandler {
  setData: (data: MusicOrderItem) => void;
}

type MusicOrderDetailStore = MusicOrderDetailStoreState & MusicOrderDetailStoreHandler;

export const musicOrderDetailStore = create<MusicOrderDetailStore>()((set, get) => {
  return {
    setData: (data) => {
      set({ data });
    },
  };
});

export const useMusicOrderDetailStore = musicOrderDetailStore;
