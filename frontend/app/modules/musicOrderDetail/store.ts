import { create } from 'zustand';
import { MusicInter } from '../../interface';

type MusicOrderItem = MusicInter.MusicOrderItem;

export interface MusicOrderDetailStoreState {
  data?: MusicOrderItem;
  originName?: string;
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
