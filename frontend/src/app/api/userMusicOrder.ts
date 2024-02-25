import { MusicItem, MusicOrderItem } from './music';

export abstract class UserMusicOrderAction {
  /** 获取我的歌单 */
  public abstract getList(): Promise<MusicOrderItem[]>;
  /** 创建歌单 */
  public abstract create(data: Omit<MusicOrderItem, 'id'>): Promise<void>;
  /** 更新歌单 */
  public abstract update(data: MusicOrderItem): Promise<void>;
  /** 删除歌单 */
  public abstract delete(data: MusicOrderItem): Promise<void>;
  /** 歌单详情 */
  public abstract getDetail(id: string): Promise<MusicOrderItem>;
  /** 添加歌曲 */
  public abstract appendMusic: (id: string, musics: MusicItem[]) => Promise<void>;
  /** 更新歌曲 */
  public abstract updateMusic: (id: string, musics: MusicItem) => Promise<void>;
  /** 移除歌曲 */
  public abstract deleteMusic: (id: string, musics: MusicItem[]) => Promise<void>;
}

/** 歌单源 */
export abstract class UserMusicOrder<T = any> {
  public abstract name: string; // 歌单源的唯一标识
  public abstract cname: string; // 显示名
  public abstract ConfigElement?(p: { onChange?: (v: T) => void }): React.ReactElement;
  public abstract action: UserMusicOrderAction;
}
