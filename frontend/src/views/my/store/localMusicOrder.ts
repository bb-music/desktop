import { create } from 'zustand';
import { MusicItem } from '@/player';
import { persist, createJSONStorage } from 'zustand/middleware';
import { indexedDBStorage } from '@/utils';
import { nanoid } from 'nanoid';
import { MusicOrderItem } from '@/interface';

interface LocalMusicOrderState {
  /** 我的歌单列表 */
  list: MusicOrderItem[];
}
interface LocalMusicOrderHandler {
  /** 创建歌单 */
  create: (params: Omit<MusicOrderItem, 'list' | 'id'>) => Promise<void>;
  /** 修改歌单 */
  update: (id: string, params: Pick<MusicOrderItem, 'name' | 'desc'>) => Promise<void>;
  /** 删除歌单 */
  remove: (id: string) => Promise<void>;
  /** 添加歌曲 */
  appendMusic: (id: string, list: MusicItem[]) => Promise<void>;
}

/** 本地歌单 */
type LocalMusicOrder = LocalMusicOrderState & LocalMusicOrderHandler;

export const localMusicOrder = create(
  persist<LocalMusicOrder>(
    (set, get) => {
      return {
        list: [],
        create: async (params) => {
          const store = get();
          const name = params.name?.trim();
          if (!name) {
            return Promise.reject(new Error('歌单名称不能为空'));
          }
          if (store.list?.find((l) => l.name === name)) {
            return Promise.reject(new Error('歌单已存在'));
          }
          const newItem: MusicOrderItem = {
            name,
            desc: params.desc,
            author: params.author,
            list: [],
            id: nanoid(),
          };
          set({
            list: [...store.list, newItem],
          });
        },
        update: async (id, params) => {
          const store = get();
          const name = params.name?.trim();
          if (!name) {
            return Promise.reject(new Error('歌单名称不能为空'));
          }
          if (store.list?.find((l) => l.name === name && l.id !== id)) {
            return Promise.reject(new Error('歌单名称已存在'));
          }
          if (!store.list?.find((l) => l.id === id)) {
            return Promise.reject(new Error('歌单不存在'));
          }
          set({
            list: store.list.map((l) => {
              if (l.id === id) {
                return {
                  ...l,
                  name: name,
                  desc: params.desc,
                };
              }
              return l;
            }),
          });
        },
        remove: async (id) => {
          const store = get();
          if (!store.list?.find((l) => l.id === id)) {
            return Promise.reject(new Error('歌单不存在'));
          }
          set({
            list: store.list.filter((l) => l.id === id),
          });
        },
        appendMusic: async (id, musicList) => {
          const store = get();
          if (!store.list?.find((l) => l.id === id)) {
            return Promise.reject(new Error('歌单不存在'));
          }
          const ids = musicList.map((m) => m.id);
          set({
            list: store.list.map((l) => {
              if (l.id === id) {
                return {
                  ...l,
                  list: [...l.list.filter((l) => !ids.includes(l.id)), ...musicList],
                };
              }
              return l;
            }),
          });
        },
      };
    },
    {
      name: 'local-music-order',
      storage: createJSONStorage(() => indexedDBStorage),
    }
  )
);

export const useLocalMusicOrder = localMusicOrder;
