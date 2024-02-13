import { MusicApi } from '../interface/api';

/** 音乐搜索服务 API */
export abstract class BBMusicSearchApi<ExtraData> {
  /** 搜索 */
  abstract search(params: MusicApi.Search.Params): Promise<MusicApi.Search.Resp<ExtraData>>;

  /** 搜索详情 */
  abstract searchDetail(
    data: MusicApi.Search.RespItem<ExtraData>
  ): Promise<MusicApi.Search.Resp<ExtraData>>;
}
