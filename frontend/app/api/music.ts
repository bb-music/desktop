export interface PlayerAudioAddEventListener {
  (type: 'canplay', cb: (event: Event) => void): void;
  (type: 'timeupdate', cb: (event: Event) => void): void;
  (type: 'ended', cb: (event: Event) => void): void;
  (type: 'error', cb: (event: ErrorEvent) => void): void;
  (type: 'play', cb: (event: Event) => void): void;
  (type: 'pause', cb: (event: Event) => void): void;
  (type: 'volumechange', cb: (event: Event) => void): void;
  (type: 'canplay', cb: (event: Event) => void): void;
  (type: 'stalled', cb: (event: Event) => void): void;
  (type: 'load', cb: (event: Event) => void): void;
}

export abstract class AudioInstance {
  /** 获取音量 */
  abstract getVolume(): number;
  /** 设置音量 */
  abstract setVolume(volume: number): void;
  /** 设置播放地址 */
  abstract setSrc(src: string): void;
  /** 设置播放进度 */
  abstract setCurrentTime(time: number): void;
  /** 获取播放进度 */
  abstract getCurrentTime(): number;
  /**
   * 获取歌曲准备状态
   * https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement/readyState
   * @return 0 没有关于音频/视频是否就绪的信息
   * @return 1 音频/视频已初始化
   * @return 2 数据已经可以播放 (当前位置已经加载) 但没有数据能播放下一帧的内容
   * @return 3 当前及至少下一帧的数据是可用的 (换句话来说至少有两帧的数据)
   * @return 4 可用数据足以开始播放 - 如果网速得到保障 那么视频可以一直播放到底
   *  */
  abstract getReadyState(): number;
  /** 播放 */
  abstract play(): void;
  /** 暂停 */
  abstract pause(): void;
  /** 监听事件 */
  abstract addEventListener: PlayerAudioAddEventListener;
  abstract removeEventListener: PlayerAudioAddEventListener;
}

export abstract class MusicApi {
  /** 播放器实例 */
  abstract createAudio(): AudioInstance;
}
