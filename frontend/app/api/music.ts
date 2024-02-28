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

export abstract class MusicApi {
  /** 播放器实例 */
  abstract createAudio(): AudioInstance;
}
