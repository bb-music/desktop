import { MusicOrderItem } from './music';

export abstract class OpenMusicOrder<E = any, T = any> {
  /** 使用歌单源获取歌单列表 */
  abstract useOriginGetMusicOrder(url: string): Promise<MusicOrderItem<E, T>[]>;
}
