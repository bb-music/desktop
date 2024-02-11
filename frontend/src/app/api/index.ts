import { Setting } from './setting';

export let api: Api;

export interface Api {
  setting: Setting;
}

export function registerApiInstance(instance: Api) {
  if (!api) {
    api = instance;
  }
}
