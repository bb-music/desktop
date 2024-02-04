import { isJson } from '.';

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
