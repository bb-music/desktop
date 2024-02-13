import { MusicOrderOriginLoader } from '../common';
import { GetJsonOrigin } from '@wails/go/app/App';
export class JsonOriginLoader implements MusicOrderOriginLoader {
  constructor(private origin: string) {}

  async getList() {
    return GetJsonOrigin(this.origin);
  }
}
