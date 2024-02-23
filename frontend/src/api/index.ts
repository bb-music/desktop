import { Api } from '../app/api';
import { SettingInstance } from './setting';
import { SearchInstance } from './search';
import { MusicInstance } from './music';
import { OpenMusicOrderInstance } from './openMusicOrder';
import { UserGithubMusicOrderInstance, UserLocalMusicOrderInstance } from './userMusicOrder';
import { cacheStorage } from '@/lib/cacheStorage';
import { UtilsInstance } from './utils';

export const apiInstance: Api = {
  utils: new UtilsInstance(),
  cacheStorage,
  setting: new SettingInstance(),
  search: new SearchInstance(),
  music: new MusicInstance(),
  openMusicOrder: new OpenMusicOrderInstance(),
  userMusicOrder: [new UserLocalMusicOrderInstance(), new UserGithubMusicOrderInstance()],
};
