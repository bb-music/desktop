import { CacheStorage } from '@/utils';
import { MusicItem, createAudio, musicItem2Url } from '.';
import { PlayerMode, PlayerStatus } from './constants';
import { create } from 'zustand';

const cacheStore = new CacheStorage<
  Pick<PlayerStoreState, 'current' | 'playerList' | 'playerMode'>
>('BB_Player');

interface PlayerStoreState {
  /** 播放器 */
  audio: HTMLAudioElement;
  /** 当前歌曲 */
  current?: MusicItem;
  /** 播放进度 */
  playProgress: number;
  /** 播放列表 */
  playerList: MusicItem[];
  /** 已播放，用于计算随机 */
  playerHistory: string[];
  /** 播放器状态 */
  playerStatus: PlayerStatus;
  /** 播放模式 */
  playerMode: PlayerMode;
}
interface PlayerStoreHandler {
  init: () => void;
  /** 播放 */
  play: (music?: MusicItem) => void;
  /** 暂停 */
  pause: () => void;
  /** 上一首 */
  prev: () => void;
  /** 下一首 */
  next: () => void;
  /** 播放完成后下一首 */
  endNext: () => void;
  /** 添加歌曲到播放列表 */
  addPlayerList: (values: MusicItem[]) => void;
  /** 将歌曲从播放列表移除 */
  removePlayerList: (ids: string[]) => void;
  /** 清空播放列表 */
  clearPlayerList: () => void;
  /** 设置播放进度 */
  setPlayerProgress: (progress: number) => void;
  /** 切换播放模式 */
  togglePlayerMode: (mode?: PlayerMode) => void;
  /** 添加至播放历史 */
  addPlayerHistory: () => void;
}

type PlayerStore = PlayerStoreState & PlayerStoreHandler;
const AUDIO_ID = 'BBAudio';
export const playerStore = create<PlayerStore>()((set, get) => {
  const cacheState = cacheStore.get();

  return {
    audio: createAudio(AUDIO_ID)!,
    playerStatus: PlayerStatus.Stop,
    playerList: [],
    current: void 0,
    playProgress: 0,
    playerMode: PlayerMode.ListLoop,
    playerHistory: [],
    init() {
      const audio = get().audio;
      if (typeof document !== 'undefined') {
        if (!document.getElementById(AUDIO_ID)) {
          document.body.appendChild(audio);
        }
        const playerList = cacheState?.playerList ?? [];
        const current = cacheState?.current || playerList[0];
        if (current) {
          audio.setAttribute('src', musicItem2Url(current));
        }
        set({
          playerList,
          playerMode: cacheState?.playerMode ?? PlayerMode.ListLoop,
          current,
          playerHistory: [current?.id].filter((f) => !!f),
        });
      }
    },
    play: (m) => {
      const store = get();

      if (!store.current) {
        set({ current: store.playerList[0] });
      }

      if (m && store.current?.id !== m.id) {
        // 存在歌曲信息，并且不是正在播放的歌曲
        const music = store.playerList?.find((p) => p.id === m.id);
        if (!music) {
          // 不在播放列表时添加进去
          store.addPlayerList([m]);
        }
        set({
          current: m,
          playerStatus: PlayerStatus.Play,
        });

        store.audio.setAttribute('src', musicItem2Url(m));
        store.audio.play();
        store.addPlayerHistory();
      } else {
        console.log(store.playerStatus, store.current, store.audio);
        if (store.playerStatus === PlayerStatus.Play) {
          store.pause();
        } else {
          set({
            playerStatus: PlayerStatus.Play,
          });
          store.audio.play();
          store.addPlayerHistory();
        }
      }
    },
    pause: () => {
      const store = get();
      set({
        playerStatus: PlayerStatus.Pause,
      });
      store.audio.pause();
    },
    prev: () => {
      const store = get();
      if (!store.current) return;
      const cind = store.playerHistory.findIndex((p) => p === store.current?.id);
      const prevId = store.playerHistory[cind - 1];
      if (prevId) {
        const m = store.playerList.find((p) => p.id === prevId);
        store.play(m);
      }

      // return;
      // const index = store.playerList?.findIndex((p) => p.id === store.current?.id);
      // if (index === 0) return;
      // store.play(store.playerList[index - 1]);
    },
    next: () => {
      const store = get();
      if (!store.current) return;
      if (store.playerMode === PlayerMode.Random) {
        store.endNext();
      } else {
        const index = store.playerList?.findIndex((p) => p.id === store.current?.id);
        if (index === store.playerList.length - 1) return;
        store.play(store.playerList[index + 1]);
      }
    },
    endNext: () => {
      const store = get();
      const current = store.current;
      if (!current) return;
      // 随机播放
      if (store.playerMode === PlayerMode.Random) {
        const list = store.playerList.filter((p) => !store.playerHistory.includes(p.id));
        const len = list.length;

        if (len === 0) {
          set({
            playerHistory: [],
          });
          const nn = store.playerList.length;
          const n = Math.floor(Math.random() * nn);
          store.play(store.playerList[n]);
        } else {
          const n = Math.floor(Math.random() * len);
          store.play(list[n]);
        }
      }
      // 单曲循环
      if (store.playerMode === PlayerMode.SignalLoop) {
        store.audio.currentTime = 0;
        store.pause();
        store.play(current);
      }
      // 列表循环 / 列表结尾停止
      if (store.playerMode === PlayerMode.ListLoop || store.playerMode === PlayerMode.ListOrder) {
        const index = store.playerList?.findIndex((p) => p.id === store.current?.id);
        if (index === store.playerList.length - 1) {
          if (store.playerMode === PlayerMode.ListOrder) {
            // 列表顺序结尾停止
            return;
          } else {
            store.play(store.playerList[0]);
          }
        } else {
          store.play(store.playerList[index + 1]);
        }
      }
    },
    addPlayerList: (ms) => {
      const store = get();
      const playerList = store.playerList.filter((p) => !ms.find((m) => m.id === p.id));
      playerList.push(...ms);
      console.log('playerList: ', playerList);
      set({
        playerList,
      });
    },
    removePlayerList: (ids) => {
      const store = get();
      set({
        playerList: store.playerList.filter((p) => !ids.includes(p.id)),
        playerHistory: store.playerHistory.filter((p) => !ids.includes(p)),
      });
    },
    clearPlayerList: () => {
      set({
        playerList: [],
        playerHistory: [],
      });
    },
    setPlayerProgress: (p) => {
      set({
        playProgress: p,
      });
    },
    togglePlayerMode: (mode) => {
      const store = get();
      if (mode) {
        set({
          playerMode: mode,
        });
      } else {
        const l = [
          PlayerMode.SignalLoop,
          PlayerMode.ListLoop,
          PlayerMode.Random,
          PlayerMode.ListOrder,
        ];
        const index = l.findIndex((p) => store.playerMode === p);

        if (index === l.length - 1) {
          set({
            playerMode: l[0],
          });
        } else {
          set({
            playerMode: l[index + 1],
          });
        }
      }
    },
    addPlayerHistory: () => {
      const current = get().current;
      if (current) {
        const list = get().playerHistory.filter((p) => p !== current.id);

        set({
          playerHistory: [...list, current.id],
        });
      }
    },
  };
});

playerStore.subscribe((state) => {
  cacheStore.set({
    playerList: state.playerList,
    current: state.current,
    playerMode: state.playerMode,
  });
});
export const usePlayerStore = playerStore;
