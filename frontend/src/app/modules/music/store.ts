import { create } from 'zustand';
import { MusicItem } from '@/app/api/music';

// 修改音乐信息
interface MusicFormModalModalState {
  open: boolean;
  form: {
    name: string;
  };
  music?: MusicItem;
  remoteName?: string;
  musicOrderId?: string;
}
interface MusicFormModalModalHandler {
  show: (m: MusicItem, musicOrderId: string, remoteName?: string) => void;
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
    show: (m, musicOrderId, remoteName) => {
      set({
        open: true,
        music: m,
        remoteName,
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
