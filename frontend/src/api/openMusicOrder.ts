import { GetJsonOrigin } from '@wails/go/app/App';
import { OpenMusicOrder } from '@/app/api/openMusicOpen';
import { MusicOrderItem } from '@/app/api/music';

export class OpenMusicOrderInstance implements OpenMusicOrder {
  useOriginGetMusicOrder = async (url: string) => {
    const res = await GetJsonOrigin(url);
    const newList: MusicOrderItem[] = [];
    res.forEach((r) => {
      const item: MusicOrderItem = {
        ...r,
        musicList: r.musicList.map((m) => ({
          id: m.id,
          name: m.name,
          duration: m.duration,
          extraData: m,
        })),
      };
      newList.push(item);
    });
    return newList;
  };
}
