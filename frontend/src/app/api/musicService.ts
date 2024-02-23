// 音乐服务源

import { ListResult } from './common';
import { MusicItem } from './music';
import { SearchItem, SearchParams } from './search';

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

export abstract class MusicService {
  /** 源的唯一名称 */
  abstract name: string;
  /** 源的显示名称 */
  abstract cname: string;
  /** 源的配置项 */
  abstract ConfigElement: () => React.ReactElement;
  /** 源的操作 */
  abstract action: MusicServiceAction;
}
