import { Api } from '@bb-music/app';
import { SettingInstance } from './setting';
import { MusicInstance } from './music';
import { OpenMusicOrderInstance } from './openMusicOrder';
import { cacheStorage } from '../lib/cacheStorage';
import { UtilsInstance } from './utils';
import { BiliMusicServiceInstance } from './musicServiceBili';
import { UserLocalMusicOrderInstance } from './userLocalMusicOrder';
import { UserGithubMusicOrderInstance } from './userGithubMusicOrder';

export const apiInstance: Api = {
  utils: new UtilsInstance(),
  cacheStorage,
  setting: new SettingInstance(),
  music: new MusicInstance(),
  openMusicOrder: new OpenMusicOrderInstance(),
  userMusicOrder: [new UserLocalMusicOrderInstance(), new UserGithubMusicOrderInstance()],
  musicServices: [new BiliMusicServiceInstance()],
};
