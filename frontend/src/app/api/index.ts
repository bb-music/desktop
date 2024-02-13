import { Search } from './search';
import { Setting } from './setting';
import { Music } from './music';
import { OpenMusicOrder } from './openMusicOpen';
import { UserLocalMusicOrder, UserRemoteMusicOrder } from './userMusicOrder';

export let api: Api;

export interface Api {
  setting: Setting;
  search: Search;
  music: Music;
  openMusicOrder: OpenMusicOrder;
  userLocalMusicOrder: UserLocalMusicOrder;
  userRemoteMusicOrder: UserRemoteMusicOrder[];
}

export function registerApiInstance(instance: Api) {
  if (!api) {
    api = instance;
  }
}
