import { MusicItem, MusicOrderItem } from './music';

export abstract class Action<T = any> {
  /** 获取我的歌单 */
  public abstract getList(config: T): Promise<MusicOrderItem[]>;
  /** 创建歌单 */
  public abstract create(data: Omit<MusicOrderItem, 'id'>, config: T): Promise<void>;
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

/** 歌单源 */
export abstract class UserMusicOrder<T = any> {
  public abstract name: string; // 歌单源的唯一标识
  public abstract cname: string; // 显示名
  public abstract ConfigElement?(p: { value: T; onChange: (v: T) => void }): React.ReactElement;
  public abstract action: Action;
}
