import { OpenMusicOrderApi } from '@bb-music/app';
import { GetOpenMusicOrderList } from '@wails/go/app_bili/App';

export class OpenMusicOrderInstance implements OpenMusicOrderApi {
  useOriginGetMusicOrder: OpenMusicOrderApi['useOriginGetMusicOrder'] = async (origin) => {
    const res = await GetOpenMusicOrderList(origin);
    return res;
  };
}
