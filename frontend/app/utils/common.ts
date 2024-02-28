import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { api } from '../api';
dayjs.extend(duration);

/** 合并 className */
export function cls(...classList: Array<string | undefined | boolean>) {
  return classList.filter((i) => !!i).join(' ');
}

export function isJson<T = Array<any> | Record<string, any>>(val: string): T | undefined {
  try {
    return JSON.parse(val);
  } catch (e) {
    return;
  }
}
/** 秒转 mm:ss */
export function seconds2mmss(duration: number) {
  return dayjs.duration(duration, 'seconds').format('mm:ss');
}

/** 根据歌单源的 name 获取对应的歌单源操作 */
export function getMusicOrder(originName: string) {
  const order = api.userMusicOrder.find((i) => i.name === originName);
  if (!order) {
    console.error(`歌单源 ${originName} 不存在`);
  }
  return order;
}

/** 根据歌曲源的 name 获取歌曲源的服务 */
export function getMusicService(name: string) {
  const service = api.musicServices.find((i) => i.name === name);
  if (!service) {
    console.error(`歌曲源 ${name} 服务不存在`);
  }
  return service;
}
