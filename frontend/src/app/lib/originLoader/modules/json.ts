import { GetOpenMusicOrderList } from '@wails/go/app_bili/App';
import { MusicOrderOriginLoader } from '../common';

export class JsonOriginLoader implements MusicOrderOriginLoader {
  constructor(private origin: string) {}

  async getList() {
    return GetOpenMusicOrderList(this.origin);
  }
}
