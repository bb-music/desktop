/** 音乐 API */
export namespace MusicApi {
  export interface BaseResp<T> {
    data: T;
  }

  export interface BaseListResp<T> {
    page: number;
    pageSize: number;
    data: T[];
  }

  export const enum SearchItemType {
    Music = 1, // 歌曲
    Order = 2, // 歌单
  }

  /** 搜索 */
  export namespace Search {
    /** 请求参数 */
    export interface Params {
      keyword: string;
      page?: number;
    }
    /** 结果 */
    export type Resp<T> = MusicApi.BaseListResp<RespItem<T>[]>;

    export type DetailResp<T> = MusicApi.BaseResp<RespItem<T>>;

    export interface RespItem<T = any> {
      id: string | number;
      /** 封面 */
      cover?: string;
      /** 名称 */
      name: string;
      /** 发布者 */
      author?: string;
      /** 时长 */
      duration?: number;
      type?: SearchItemType;
      /** 如果是歌单的话 */
      partList?: any[];
      /** 歌单歌曲数 */
      partTotal?: number;
      /** 扩展信息 */
      extraData?: T;
    }
  }

  /** 歌曲 */
  export interface MusicItem<T = any> {
    id: string | number; // ID
    cover?: string; // 封面
    name: string; // 名称
    duration: number; // 时长
    author?: string; // 作者
    extraData?: T; // 扩展数据
  }

  /** 歌单 */
  export interface MusicOrderItem<E = any, T = any> {
    id: string | number; // ID
    cover?: string; // 封面
    name: string; // 名称
    author?: string; // 作者
    extraData?: E; // 扩展数据
    desc?: string; // 描述
    musicList?: MusicItem<T>[]; // 音乐列表
  }
}
