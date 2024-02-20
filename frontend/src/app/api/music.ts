export interface MusicItem<T = any> {
  id: string; // ID
  cover?: string; // 封面
  name: string; // 名称
  duration: number; // 时长
  author?: string; // 作者
  extraData?: T; // 扩展数据
  origin: string; //来源
  created_at?: string; // 创建时间
  updated_at?: string; // 更新时间
}

export interface MusicOrderItem<E = any, T = any> {
  id: string; // ID
  cover?: string; // 封面
  name: string; // 名称
  author?: string; // 作者
  extraData?: E; // 扩展数据
  desc?: string; // 描述
  musicList?: MusicItem<T>[]; // 音乐列表
  created_at?: string; // 创建时间
  updated_at?: string; // 更新时间
}

export abstract class AudioInstance {
  /** 设置播放地址 */
  abstract setSrc(src: string): void;
  /** 设置播放进度 */
  abstract setCurrentTime(time: number): void;
  /** 获取播放进度 */
  abstract getCurrentTime(): number;
  /** 播放 */
  abstract play(): void;
  /** 暂停 */
  abstract pause(): void;
  /** 监听事件 */
  abstract addEventListener(event: 'timeupdate' | 'ended', callback: (e: any) => void): void;
  abstract removeEventListener(event: 'timeupdate' | 'ended', callback: (e: any) => void): void;
}

export abstract class Music<E = any, T = any> {
  /** 歌单详情 */
  abstract getMusicOrderInfo(item: MusicOrderItem<E, T>): Promise<MusicOrderItem<E, T>>;
  /** 获取音乐播放地址 */
  abstract getMusicPlayerUrl(item: MusicItem): Promise<string>;
  /** 下载音乐 */
  abstract download(item: MusicItem<T>): Promise<unknown>;
  /** 播放器实例 */
  abstract createAudio(): AudioInstance;
}