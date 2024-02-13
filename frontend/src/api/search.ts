import { GetVideoDetail } from '@wails/go/app/App';
import { Search as BBSearch, SearchItem, SearchParams, SearchType } from '@/app/api/search';
import { Search } from '@wails/go/app/App';
import { getAuth } from './setting';
import { html2text, mmss2seconds, transformImgUrl } from '@/utils';
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
          extraData: item,
        })),
    };
  };
  getItemInfo = async (item: SearchItem<bb_client.SearchResultItem>) => {
    console.log('item: ', item);
    const auth = await getAuth();
    const data = item.extraData!;
    console.log('data: ', data);
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
        type: SearchType.Order,
      };
    } else {
      return {
        ...item,
        type: SearchType.Music,
      };
    }
  };
}
