import { create } from 'zustand';
import { api } from '@/app/api';
import { MusicOrderItem } from '@/app/api/music';
import { settingStore } from '../setting/store';

interface UserLocalMusicOrderState {
  list: MusicOrderItem[];
}
interface UserLocalMusicOrderHandler {
  run: () => Promise<void>;
}

type UserLocalMusicOrderStore = UserLocalMusicOrderState & UserLocalMusicOrderHandler;

export const userLocalMusicOrderStore = create<UserLocalMusicOrderStore>()((set, get) => {
  return {
    list: [],
    run: async () => {
      const res = await api.userLocalMusicOrder.getList();
      set({ list: res.list });
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
  run: () => Promise<void>;
}

type UserRemoteMusicOrderStore = UserRemoteMusicOrderState & UserRemoteMusicOrderHandler;

export const userRemoteMusicOrderStore = create<UserRemoteMusicOrderStore>()((set, get) => {
  return {
    list: [],
    run: async () => {
      const setting = settingStore.getState();
      console.log('setting: ', setting);

      const res = await Promise.all(
        api.userRemoteMusicOrder.map((r) => {
          const config = setting.userMusicOrderOrigin.find((u) => u.name === r.name);
          return r.action.getList(config?.config);
        })
      );
      console.log('res: ', res);

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
