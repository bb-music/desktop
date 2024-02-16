import { Api } from '../app/api';
import { SettingInstance } from './setting';
import { SearchInstance } from './search';
import { MusicInstance } from './music';
import { OpenMusicOrderInstance } from './openMusicOrder';
import { UserLocalMusicOrderInstance, UserRemoteGithubMusicOrderInstance } from './userMusicOrder';
import { cacheStorage } from '@/lib/cacheStorage';

export const apiInstance: Api = {
  cacheStorage,
  setting: new SettingInstance(),
  search: new SearchInstance(),
  music: new MusicInstance(),
  openMusicOrder: new OpenMusicOrderInstance(),
  userLocalMusicOrder: new UserLocalMusicOrderInstance(),
  userRemoteMusicOrder: [new UserRemoteGithubMusicOrderInstance()],
};
