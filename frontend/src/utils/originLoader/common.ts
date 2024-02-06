import { MusicOrderItem } from '@/interface';

export abstract class MusicOrderOriginLoader {
  constructor(origin: string) {}
  getList(): Promise<MusicOrderItem[]> {
    return Promise.resolve([]);
  }
}
