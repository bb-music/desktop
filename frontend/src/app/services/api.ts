import { MusicApi } from '../interface/api';

/** 音乐搜索服务 API */
export abstract class BBMusicSearchApi<ExtData> {
  /** 搜索 */
  abstract search(params: MusicApi.Search.Params): Promise<MusicApi.Search.Resp<ExtData>>;

  /** 搜索详情 */
  abstract searchDetail(
    data: MusicApi.Search.RespItem<ExtData>
  ): Promise<MusicApi.Search.Resp<ExtData>>;
}
