interface UserMusicOrderOriginItem<T = Record<string, any>> {
  name: string;
  config: T;
}

export class SettingInfo {
  /** 签名信息 */
  signData: {
    imgKey: string;
    subKey: string;
  } = {
    imgKey: '',
    subKey: '',
  };
  /** 风控 */
  spiData: {
    uuid_v3: string;
    uuid_v4: string;
  } = {
    uuid_v3: '',
    uuid_v4: '',
  };
  /** 视频代理地址 */
  videoProxyPort?: number;
  /** 文件下载目录 */
  downloadDir?: string;
  /** 歌单广场来源 */
  openMusicOrderOrigin: string[] = [];
  /** 个人歌单同步源 */
  userMusicOrderOrigin: UserMusicOrderOriginItem[] = [];
}

export abstract class Setting {
  /** 获取配置信息 */
  abstract getInfo: () => Promise<SettingInfo>;
  /** 更新签名数据 */
  abstract updateSignData: () => Promise<void>;
  /** 更新 Spi 风控数据 */
  abstract updateSpiData: () => Promise<void>;
  /** 选中下载目录 */
  abstract selectDownloadDir?: () => Promise<string>;
  /** 更新下载目录 */
  abstract updateDownloadDir?: (dir: string) => Promise<void>;
  /** 更新歌单广场来源 */
  abstract updateOpenMusicOrderOrigin: (value: string[]) => Promise<void>;
  /** 更新个人歌单同步源 */
  abstract updateUserMusicOrderOrigin: (value: UserMusicOrderOriginItem[]) => Promise<void>;
}
