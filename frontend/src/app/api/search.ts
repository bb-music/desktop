import { ListResult } from './common';
import { MusicItem } from './music';
export const enum SearchType {
  Music = 1, // 歌曲
  Order = 2, // 歌单
}

export interface SearchItem<T = any> {
  id: string; // ID
  cover: string; // 封面
  name: string; // 名称
  duration: number; // 时长
  author: string; // 作者
  type?: SearchType; // 类型
  musicList?: MusicItem[]; // 歌单中的歌曲列表
  extraData?: T; // 扩展数据
  origin: string;
}
export interface SearchParams {
  keyword: string;
  current: number;
}

export abstract class Search<T = any> {
  /** 搜索 */
  abstract getList: (params: SearchParams) => Promise<ListResult<SearchItem<T>>>;
  /** 搜索单个结果的详情 */
  abstract getItemInfo: (item: SearchItem) => Promise<SearchItem>;
}
