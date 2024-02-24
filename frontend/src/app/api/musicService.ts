// 音乐服务源

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

export abstract class MusicServiceAction {
  // 搜索
  abstract searchList: (params: SearchParams) => Promise<ListResult<SearchItem>>;
  // 搜索结果的详情
  abstract searchItemDetail: (item: SearchItem) => Promise<SearchItem>;
  /** 获取音乐播放地址 */
  abstract getMusicPlayerUrl(item: MusicItem): Promise<string>;
  /** 下载音乐 */
  abstract download(item: MusicItem): Promise<unknown>;
}

export abstract class MusicServiceHooks {
  // 应用启动初始化
  abstract init?(): Promise<void>;
}

export abstract class MusicService {
  /** 源的唯一名称 */
  abstract name: string;
  /** 源的显示名称 */
  abstract cname: string;
  /** 源的配置项 */
  abstract ConfigElement: () => React.ReactElement;
  /** 源的操作 */
  abstract action: MusicServiceAction;
  /** 钩子 */
  abstract hooks?: MusicServiceHooks;
}
