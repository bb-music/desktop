import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { api } from '../api';
dayjs.extend(duration);

/** 合并 className */
export function cls(...classList: Array<string | undefined | boolean>) {
  return classList.filter((i) => !!i).join(' ');
}

/** 秒转 mm:ss */
export function seconds2mmss(duration: number) {
  return dayjs.duration(duration, 'seconds').format('mm:ss');
}

/** 根据歌曲源的 name 获取歌曲源的服务 */
export function getMusicService(name: string) {
  const service = api.musicServices.find((i) => i.name === name);
  if (!service) {
    console.error(`歌曲源 ${name} 服务不存在`);
  }
  return service;
}
