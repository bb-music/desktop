export interface MusicItem {
  aid?: number;
  bvid?: string;
  cid: number;
  /** 歌曲名称 */
  name: string;
  /** 时长 */
  duration: number;
  /** aid + bvid + cid */
  id: string;
}
