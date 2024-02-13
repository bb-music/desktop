import { MusicOrderItem } from '@/app/api/music';

export abstract class MusicOrderOriginLoader {
  constructor(origin: string) {}
  getList(): Promise<MusicOrderItem[]> {
    return Promise.resolve([]);
  }
}
