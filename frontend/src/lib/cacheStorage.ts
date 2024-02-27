import { isJson } from '../utils';
import { GetStorage, RemoveStorage, SetStorage } from '@wails/go/app_base/App';
import { StateStorage } from 'zustand/middleware';

/** 缓存接口 */
export const cacheStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return await GetStorage(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    return await SetStorage(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    return await RemoveStorage(name);
  },
};

export class JsonCacheStorage<T> {
  constructor(private key: string) {}
  get = async (): Promise<T | undefined> => {
    const res = await GetStorage(this.key);
    return isJson<T>(res);
  };
  set = async (value: T): Promise<void> => {
    return await SetStorage(this.key, JSON.stringify(value));
  };
  removeItem = async (): Promise<void> => {
    return await RemoveStorage(this.key);
  };
  async update(key: keyof T, value: T[keyof T]): Promise<void> {
    const res = await this.get();
    const data = { ...res!, [key]: value };
    await this.set(data);
  }
}
