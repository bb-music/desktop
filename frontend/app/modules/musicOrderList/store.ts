import { create } from 'zustand';
import { api } from '../../api';
import { MusicInter } from '../../interface';

type MusicItem = MusicInter.MusicItem;
type MusicOrderItem = MusicInter.MusicOrderItem;

interface MusicOrderOriginItem {
  name: string;
  cname: string;
  list: MusicOrderItem[];
}
interface UserMusicOrderState {
  list: MusicOrderOriginItem[];
}
interface UserMusicOrderHandler {
  load: () => Promise<void>;
}

type UserMusicOrderStore = UserMusicOrderState & UserMusicOrderHandler;

export const userMusicOrderStore = create<UserMusicOrderStore>()((set, get) => {
  return {
    list: [],
    load: async () => {
      const res = await Promise.all(
        api.userMusicOrder.map((r) => {
          return r.action.getList().catch(() => []);
        }),
      );
      const result: MusicOrderOriginItem[] = res.map((r, i) => {
        return {
          name: api.userMusicOrder[i].name,
          cname: api.userMusicOrder[i].cname,
          list: r,
        };
      });

      set({ list: result });
    },
  };
});

export const useUserMusicOrderStore = userMusicOrderStore;

interface MusicOrderFormModalState {
  form: {
    name: string;
    desc: string;
    cover: string;
    id?: string;
  };
  type: 'create' | 'update';
  open: boolean;
}
interface MusicOrderFormModalHandler {
  openHandler: (
    item?: MusicOrderItem | null,
    onOk?: (value: MusicOrderFormModalState['form']) => Promise<void>,
  ) => void;
  closeHandler: () => void;
  onOk?: (value: MusicOrderFormModalState['form']) => Promise<void>;
  setFormValue: (value: Partial<MusicOrderFormModalState['form']>) => void;
}

type MusicOrderFormModalStore = MusicOrderFormModalState & MusicOrderFormModalHandler;

export const musicOrderFormModalStore = create<MusicOrderFormModalStore>()((set, get) => {
  return {
    open: false,
    type: 'create',
    form: {
      name: '',
      desc: '',
      cover: '',
    },
    openHandler: (item, onOk) => {
      if (item?.id) {
        set({
          open: true,
          type: 'update',
          form: {
            name: item.name,
            desc: item.desc || '',
            cover: item.cover || '',
            id: item.id,
          },
          onOk,
        });
      } else {
        set({
          open: true,
          type: 'update',
          form: {
            name: '',
            desc: '',
            cover: '',
          },
          onOk,
        });
      }
    },
    closeHandler: () => {
      set({
        open: false,
      });
    },
    setFormValue: (value) => {
      set({
        form: {
          ...get().form,
          ...value,
        },
      });
    },
  };
});

export const useMusicOrderFormModalStore = musicOrderFormModalStore;

// 收藏到歌单
interface MusicOrderCollectModalState {
  open: boolean;
  musicList: MusicItem[];
}
interface MusicOrderCollectModalHandler {
  show: (v: MusicItem[] | MusicItem) => void;
  close: () => void;
}

type MusicOrderCollectModalStore = MusicOrderCollectModalState & MusicOrderCollectModalHandler;

export const musicOrderCollectModalStore = create<MusicOrderCollectModalStore>()((set, get) => {
  return {
    open: false,
    musicList: [],
    show: (m) => {
      set({
        open: true,
        musicList: Array.isArray(m) ? m : [m],
      });
    },
    close: () => {
      set({
        open: false,
        musicList: [],
      });
    },
  };
});

export const useMusicOrderCollectModalStore = musicOrderCollectModalStore;

// 收藏歌曲
export function musicCollect(m: MusicItem[] | MusicItem) {
  return musicOrderCollectModalStore.getState().show(m);
}
