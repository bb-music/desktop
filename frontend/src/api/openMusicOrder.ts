import { GetJsonOrigin } from '@wails/go/app/App';
import { OpenMusicOrder } from '@/app/api/openMusicOpen';

export class OpenMusicOrderInstance implements OpenMusicOrder {
  useOriginGetMusicOrder = (url: string) => {
    return GetJsonOrigin(url);
  };
}
