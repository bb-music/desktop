import { MusicItem } from '@/player';

export interface MusicOrderItem {
  id: string;
  /** 歌单名称 */
  name: string;
  /** 描述 */
  desc?: string;
  /** 作者 */
  author?: string;
  /** 歌曲列表 */
  list: MusicItem[];
}
