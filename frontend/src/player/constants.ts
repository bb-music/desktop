/** 播放器状态 */
export const enum PlayerStatus {
  Stop = 0,
  Play = 1,
  Pause = 2,
}
export const PlayerStatusMap = new Map([
  [
    [PlayerStatus.Stop],
    {
      label: '停止',
    },
  ],
  [
    [PlayerStatus.Play],
    {
      label: '播放中',
    },
  ],
  [
    [PlayerStatus.Pause],
    {
      label: '暂停中',
    },
  ],
]);

/** 播放模式 */
export const enum PlayerMode {
  /** 单曲循环 */
  SignalLoop = 1,
  /** 随机 */
  Random = 2,
  /** 列表循环 */
  ListLoop = 3,
  /** 顺序播放 */
  ListOrder = 4,
}
export const PlayerModeMap = new Map([
  [
    PlayerMode.SignalLoop,
    {
      label: '单曲循环',
    },
  ],
  [
    PlayerMode.Random,
    {
      label: '随机播放',
    },
  ],
  [
    PlayerMode.ListLoop,
    {
      label: '列表循环',
    },
  ],
  [
    PlayerMode.ListOrder,
    {
      label: '顺序播放',
    },
  ],
]);
