import { GetVideoDetail } from '@wails/go/app/App';
import { Search as BBSearch, SearchItem, SearchParams, SearchType } from '@/app/api/search';
import { Search } from '@wails/go/app/App';
import { getAuth } from './setting';
import { createMusicId, html2text, mmss2seconds, transformImgUrl } from '@/utils';
import { bb_client } from '@wails/go/models';

export class SearchInstance implements BBSearch {
  getList = async (params: SearchParams) => {
    const auth = await getAuth();
    const page = params.current || 1;
    const res = await Search(
      {
        page: page + '',
        keyword: params.keyword,
      },
      auth
    );
    return {
      current: page,
      total: res.numResults,
      pageSize: res.numPages,
      list: res.result
        .filter((r) => !['ketang'].includes(r.type))
        .map((item) => ({
          id: item.id,
          name: html2text(item.title),
          cover: transformImgUrl(item.pic),
          duration: mmss2seconds(item.duration),
          author: item.author,
          type: SearchType.Order,
          extraData: {
            aid: item.aid,
            bvid: item.bvid,
          },
        })),
    };
  };
  getItemInfo = async (item: SearchItem<bb_client.SearchResultItem>) => {
    const auth = await getAuth();
    const data = item.extraData!;
    const info = await GetVideoDetail(
      {
        aid: data.aid + '',
        bvid: data.bvid,
      },
      auth
    );
    if (info.videos > 1) {
      return {
        ...item,
        musicList: info.pages.map((p) => {
          const f = { aid: info.aid, bvid: info.bvid, cid: p.cid };
          return {
            id: createMusicId(f),
            cover: p.first_frame,
            name: p.part,
            duration: p.duration,
            author: item.author,
            origin: 'bili',
            extraData: {
              aid: f.aid,
              bvid: f.bvid,
              cid: p.cid,
            },
          };
        }),
        type: SearchType.Order,
        extraData: {
          aid: info.aid,
          bvid: info.bvid,
          cid: info.cid,
        },
      };
    } else {
      return {
        ...item,
        type: SearchType.Music,
        extraData: {
          aid: info.aid,
          bvid: info.bvid,
          cid: info.cid,
        },
      };
    }
  };
}
