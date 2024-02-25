import { OpenMusicOrder } from '@/app/api/openMusicOpen';
import { MusicItem, MusicOrderItem } from '@/app/api/music';
import { GetOpenMusicOrderList } from '@wails/go/app_bili/App';
import { Resp, request } from '@/lib/request';
import { bb_type } from '@wails/go/models';

export class OpenMusicOrderInstance implements OpenMusicOrder {
  useOriginGetMusicOrder = async (url: string) => {
    // const res = await GetOpenMusicOrderList(url);
    const {
      data: { data: res },
    } = await request<Resp<bb_type.MusicOrderItem[]>>(`/api/open-music-order`, {
      params: {
        origin: url,
      },
    });
    const newList: MusicOrderItem[] = [];
    res.forEach((r) => {
      const item: MusicOrderItem = {
        ...r,
        musicList: r.musicList.map((m: MusicItem) => {
          return {
            id: m.id,
            name: m.name,
            duration: m.duration,
            origin: 'bili',
          };
        }),
      };
      newList.push(item);
    });
    return newList;
  };
}
