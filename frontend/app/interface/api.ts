import { SearchType } from '../api';

/** 音乐 API 接口类型 */
export namespace MusicInter {
  export interface BaseListResp<T> {
    page: number;
    pageSize: number;
    data: T[];
  }

  // 搜索结果条目
  export interface SearchItem {
    id: string; // ID
    cover: string; // 封面
    name: string; // 名称
    duration: number; // 时长
    author: string; // 作者
    type?: SearchType; // 类型
    musicList?: MusicItem[]; // 歌单中的歌曲列表
    origin: string;
  }

  // 搜索参数
  export interface SearchParams {
    keyword: string;
    current: number;
  }

  // 搜索结果
  export interface SearchResult {
    current: number;
    total: number;
    pageSize: number;
    data: SearchItem[];
  }

  /** 歌曲 */
  export interface MusicItem {
    id: string; // ID
    cover?: string; // 封面
    name: string; // 名称
    duration: number; // 时长
    author?: string; // 作者
    origin: string; //来源
    created_at?: string; // 创建时间
    updated_at?: string; // 更新时间
  }

  /** 歌单 */
  export interface MusicOrderItem {
    id: string; // ID
    cover?: string; // 封面
    name: string; // 名称
    author?: string; // 作者
    desc?: string; // 描述
    musicList?: MusicItem[]; // 音乐列表
    created_at?: string; // 创建时间
    updated_at?: string; // 更新时间
  }
}
