import { create } from 'zustand';
import { MusicInter } from '../../interface';

type MusicItem = MusicInter.MusicItem;

// 修改音乐信息
interface MusicFormModalModalState {
  open: boolean;
  form: {
    name: string;
  };
  music?: MusicItem;
  originName?: string;
  musicOrderId?: string;
}
interface MusicFormModalModalHandler {
  show: (m: MusicItem, musicOrderId: string, originName?: string) => void;
  setForm: (v: MusicFormModalModalState['form']) => void;
  close: () => void;
}

type MusicFormModalModalStore = MusicFormModalModalState & MusicFormModalModalHandler;

export const musicFormModalStore = create<MusicFormModalModalStore>()((set, get) => {
  return {
    open: false,
    form: {
      name: '',
    },
    show: (m, musicOrderId, originName) => {
      set({
        open: true,
        music: m,
        originName,
        musicOrderId,
        form: {
          name: m.name,
        },
      });
    },
    close: () => {
      set({
        open: false,
      });
    },
    setForm: (data) => {
      set({
        form: {
          ...get().form,
          ...data,
        },
      });
    },
  };
});

export const useMusicFormModalStore = musicFormModalStore;
