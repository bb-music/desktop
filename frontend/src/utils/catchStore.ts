import { isJson } from '.';
import { get, set, del } from 'idb-keyval';
import { StateStorage } from 'zustand/middleware';

export class CacheStorage<T = any> {
  constructor(private key: string) {}
  set(state: T) {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.key, JSON.stringify(state));
    }
  }
  get() {
    if (typeof window !== 'undefined') {
      return isJson(window.localStorage.getItem(this.key) || '') as T | undefined;
    }
  }
  remove() {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(this.key);
    }
  }
}

export const indexedDBStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};
