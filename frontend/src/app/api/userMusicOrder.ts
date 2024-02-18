import { MusicOrderItem } from './music';

export abstract class Action<T = any> {
  /** 获取我的歌单 */
  public abstract getList(config: T): Promise<MusicOrderItem[]>;

  /** 创建 */
  public abstract create(data: MusicOrderItem, config: T): Promise<void>;

  /** 更新 */
  public abstract update(data: MusicOrderItem, config: T): Promise<void>;

  /** 删除 */
  public abstract delete(data: MusicOrderItem, config: T): Promise<void>;
}

/** 远程歌单源 */
export abstract class UserRemoteMusicOrder<T = any> {
  abstract name: string;
  abstract ConfigElement(p: { value: T; onChange: (v: T) => void }): React.ReactElement;
  abstract action: Action;
}

/** 本地歌单 */
export abstract class UserLocalMusicOrder {
  abstract getList: () => Promise<MusicOrderItem[]>;
  abstract create: (data: Omit<MusicOrderItem, 'id'>) => Promise<void>;
  abstract update: (data: MusicOrderItem) => Promise<void>;
  abstract delete: (data: MusicOrderItem) => Promise<void>;
}
