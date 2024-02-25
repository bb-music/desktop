import { MusicOrderItem } from './music';

export abstract class OpenMusicOrder {
  /** 使用歌单源获取歌单列表 */
  abstract useOriginGetMusicOrder(url: string): Promise<MusicOrderItem[]>;
}
