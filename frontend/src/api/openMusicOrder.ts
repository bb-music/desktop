import { GetJsonOrigin } from '@wails/go/app/App';
import { OpenMusicOrder } from '@/app/api/openMusicOpen';
import { MusicItem, MusicOrderItem } from '@/app/api/music';

export class OpenMusicOrderInstance implements OpenMusicOrder {
  useOriginGetMusicOrder = async (url: string) => {
    const res = await GetJsonOrigin(url);
    console.log('useOriginGetMusicOrder: ', res);
    const newList: MusicOrderItem[] = [];
    res.forEach((r) => {
      const item: MusicOrderItem = {
        ...r,
        musicList: r.musicList.map((m: MusicItem) => {
          // console.log('MusicItem: ', m);
          return {
            id: m.id,
            name: m.name,
            duration: m.duration,
            extraData: m.extraData,
            origin: 'bili',
          };
        }),
      };
      newList.push(item);
    });
    return newList;
  };
}
