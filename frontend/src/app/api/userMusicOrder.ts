import { MusicItem, MusicOrderItem } from './music';

export abstract class Action<T = any> {
  /** 获取我的歌单 */
  public abstract getList(config: T): Promise<MusicOrderItem[]>;
  /** 创建歌单 */
  public abstract create(data: MusicOrderItem, config: T): Promise<void>;
  /** 更新歌单 */
  public abstract update(data: MusicOrderItem, config: T): Promise<void>;
  /** 删除歌单 */
  public abstract delete(data: MusicOrderItem, config: T): Promise<void>;
  /** 歌单详情 */
  public abstract getDetail(id: string, config: T): Promise<MusicOrderItem>;
  /** 添加歌曲 */
  public abstract appendMusic: (id: string, musics: MusicItem[], config: T) => Promise<void>;
  /** 更新歌曲 */
  public abstract updateMusic: (id: string, musics: MusicItem, config: T) => Promise<void>;
  /** 移除歌曲 */
  public abstract deleteMusic: (id: string, musics: MusicItem[], config: T) => Promise<void>;
}

/** 远程歌单源 */
export abstract class UserRemoteMusicOrder<T = any> {
  public abstract name: string;
  public abstract ConfigElement(p: { value: T; onChange: (v: T) => void }): React.ReactElement;
  public abstract action: Action;
}

/** 本地歌单 */
export abstract class UserLocalMusicOrder {
  /** 歌单列表 */
  public abstract getList: () => Promise<MusicOrderItem[]>;
  /** 创建歌单 */
  public abstract create: (data: Omit<MusicOrderItem, 'id'>) => Promise<void>;
  /** 修改歌单 */
  public abstract update: (data: MusicOrderItem) => Promise<void>;
  /** 删除歌单 */
  public abstract delete: (data: MusicOrderItem) => Promise<void>;
  /** 歌单详情 */
  public abstract getDetail(id: string): Promise<MusicOrderItem>;
  /** 添加歌曲 */
  public abstract appendMusic: (id: string, musics: MusicItem[]) => Promise<void>;
  /** 添加歌曲 */
  public abstract updateMusic: (id: string, musics: MusicItem) => Promise<void>;
  /** 移除歌曲 */
  public abstract deleteMusic: (id: string, musics: MusicItem[]) => Promise<void>;
}
