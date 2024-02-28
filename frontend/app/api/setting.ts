interface UserMusicOrderOriginItem<T = Record<string, any>> {
  name: string;
  config: T;
}

type MusicServiceItem<T = any> = UserMusicOrderOriginItem<T>;

export class SettingInfo {
  /** 视频代理地址 */
  proxyServerPort?: number;
  /** 文件下载目录 */
  downloadDir?: string;
  /** 歌单广场来源 */
  openMusicOrderOrigin: string[] = [];
  /** 个人歌单同步源 */
  userMusicOrderOrigin: UserMusicOrderOriginItem[] = [];
  /** 歌曲服务 */
  musicServices: MusicServiceItem[] = [];
}

export abstract class SettingApi {
  /** 获取配置信息 */
  abstract getInfo: () => Promise<SettingInfo>;
  /** 选中下载目录 */
  abstract selectDownloadDir?: () => Promise<string>;
  /** 更新下载目录 */
  abstract updateDownloadDir?: (dir: string) => Promise<void>;
  /** 更新歌单广场来源 */
  abstract updateOpenMusicOrderOrigin: (value: string[]) => Promise<void>;
  /** 更新个人歌单同步源 */
  abstract updateUserMusicOrderOrigin: (value: UserMusicOrderOriginItem[]) => Promise<void>;
}
