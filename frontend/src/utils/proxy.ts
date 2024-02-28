import { settingCache } from '@/api/setting';
import axios, { AxiosRequestConfig } from 'axios';

export interface Resp<T = any> {
  code: number;
  message: string;
  data: T;
}
export class ProxyConfig {
  enabled = true;
  proxyEnabled = false;
  proxyAddress = '';
  proxyToken = '';
}

interface ProxyServiceOptions<T> {
  proxy: AxiosRequestConfig;
  handler: () => Promise<T>;
}

export async function proxyMusicService<T = any>(
  origin: string,
  { proxy, handler }: ProxyServiceOptions<T>
) {
  const config = (await getMusicServiceConfig(origin)) as ProxyConfig;
  if (!config.proxyEnabled) {
    return await handler();
  }
  const baseURL = config.proxyAddress;
  const res = await axios<Resp<T>>({
    baseURL,
    ...proxy,
  }).then((res) => res.data.data);
  return res;
}

// 是否开启了代理
export async function musicServiceEnabledProxy(origin: string) {
  const config = await getMusicServiceConfig<ProxyConfig>(origin);
  return config.proxyEnabled;
}

// 获取源服务的配置信息
export async function getMusicServiceConfig<T extends ProxyConfig>(name: string) {
  const setting = await settingCache.get();
  if (!Array.isArray(setting?.musicServices)) {
    return {} as T;
  }
  const s = setting?.musicServices?.find((s) => s.name === name);
  return s?.config as ProxyConfig & T;
}

export function mergeUrl(a: string, b: string) {
  let a1 = a.endsWith('/') ? a : a + '/';
  let b1 = b.startsWith('/') ? b.substring(1) : b;
  return a1 + b1;
}
