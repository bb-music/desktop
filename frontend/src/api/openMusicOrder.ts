import { OpenMusicOrder } from '@/app/api/openMusicOpen';
import { MusicItem, MusicOrderItem } from '@/app/api/music';
import { GetOpenMusicOrderList } from '@wails/go/app_bili/App';

export class OpenMusicOrderInstance implements OpenMusicOrder {
  useOriginGetMusicOrder = async (url: string) => {
    const res = await GetOpenMusicOrderList(url);
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
