// 音乐服务源
import { MusicInter } from '../interface';

export const enum SearchType {
  Music = 'music', // 歌曲
  Order = 'order', // 歌单
}

export abstract class MusicServiceApiAction {
  // 搜索
  abstract searchList: (params: MusicInter.SearchParams) => Promise<MusicInter.SearchResult>;
  // 搜索结果的详情
  abstract searchItemDetail: (item: MusicInter.SearchItem) => Promise<MusicInter.SearchItem>;
  /** 获取音乐播放地址 */
  abstract getMusicPlayerUrl(item: MusicInter.MusicItem): Promise<string>;
  /** 下载音乐 */
  abstract download(item: MusicInter.MusicItem): Promise<unknown>;
}

export abstract class MusicServiceApiHooks {
  // 应用启动初始化
  abstract init?(): Promise<void>;
}

export abstract class MusicServiceApi<T = any> {
  /** 源的唯一名称 */
  abstract name: string;
  /** 源的显示名称 */
  abstract cname: string;
  /** 源的配置项 */
  public abstract ConfigElement?(p: { onChange?: (v: T) => void }): React.ReactElement;
  /** 源的操作 */
  abstract action: MusicServiceApiAction;
  /** 钩子 */
  abstract hooks?: MusicServiceApiHooks;
}
