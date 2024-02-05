import { create } from 'zustand';
import { MusicOrderItem } from '@/interface';

interface MusicOrderDetailState {
  /** 歌单详情 */
  data?: MusicOrderItem;
}
interface MusicOrderDetailHandler {
  setData: (params: MusicOrderItem) => void;
}

/** 歌单详情 */
type MusicOrderDetailStore = MusicOrderDetailState & MusicOrderDetailHandler;

export const musicOrderDetailStore = create<MusicOrderDetailStore>((set, get) => {
  return {
    setData: (data) => {
      set({ data });
    },
  };
});

export const useMusicOrderDetailStore = musicOrderDetailStore;
