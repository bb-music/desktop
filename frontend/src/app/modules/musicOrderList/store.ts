import { create } from 'zustand';
import { api } from '@/app/api';
import { MusicItem, MusicOrderItem } from '@/app/api/music';
import { settingStore } from '../setting';

interface UserLocalMusicOrderState {
  list: MusicOrderItem[];
}
interface UserLocalMusicOrderHandler {
  load: () => Promise<void>;
}

type UserLocalMusicOrderStore = UserLocalMusicOrderState & UserLocalMusicOrderHandler;

export const userLocalMusicOrderStore = create<UserLocalMusicOrderStore>()((set, get) => {
  return {
    list: [],
    load: async () => {
      const res = await api.userLocalMusicOrder.getList();
      set({ list: res || [] });
    },
  };
});

export const useUserLocalMusicOrderStore = userLocalMusicOrderStore;

interface RemoteMusicOrderItem {
  name: string;
  list: MusicOrderItem[];
}
interface UserRemoteMusicOrderState {
  list: RemoteMusicOrderItem[];
}
interface UserRemoteMusicOrderHandler {
  load: () => Promise<void>;
}

type UserRemoteMusicOrderStore = UserRemoteMusicOrderState & UserRemoteMusicOrderHandler;

export const userRemoteMusicOrderStore = create<UserRemoteMusicOrderStore>()((set, get) => {
  return {
    list: [],
    load: async () => {
      const setting = settingStore.getState();
      const res = await Promise.all(
        api.userRemoteMusicOrder.map((r) => {
          const config = setting.userMusicOrderOrigin.find((u) => u.name === r.name);
          return r.action.getList(config?.config);
        })
      );
      const result: RemoteMusicOrderItem[] = res.map((r, i) => {
        return {
          name: api.userRemoteMusicOrder[i].name,
          list: r,
        };
      });

      set({ list: result });
    },
  };
});

export const useUserRemoteMusicOrderStore = userRemoteMusicOrderStore;

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
    onOk?: (value: MusicOrderFormModalState['form']) => Promise<void>
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
