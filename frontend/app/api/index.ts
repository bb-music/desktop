import { SettingApi } from './setting';
import { MusicApi } from './music';
import { OpenMusicOrderApi } from './openMusicOpen';
import { UserMusicOrderApi } from './userMusicOrder';
import { StateStorage } from 'zustand/middleware';
import { UtilsApi } from './utils';
import { MusicServiceApi } from './musicService';

export * from './music';
export * from './musicService';
export * from './openMusicOpen';
export * from './setting';
export * from './userMusicOrder';
export * from './utils';

export let api: Api;

export interface Api {
  music: MusicApi;
  musicServices: MusicServiceApi[];
  setting: SettingApi;
  userMusicOrder: UserMusicOrderApi[];
  openMusicOrder: OpenMusicOrderApi;
  utils: UtilsApi;
  cacheStorage: StateStorage;
}

export function registerApiInstance(instance: Api) {
  if (!api) {
    api = instance;
  }
}
