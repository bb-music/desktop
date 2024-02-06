import { MusicOrderItem } from '@/interface';
import { router } from '@/router';
import { musicOrderDetailStore } from '@/views/musicOrderDetail/store';

export * from './catchStore';
/** 合并 className */
export function cls(...classList: Array<string | undefined>) {
  return classList.filter((i) => !!i).join(' ');
}

export function transformImgUrl(url: string) {
  let r = url;
  if (!r.startsWith('https://') && !r.startsWith('http://')) {
    r = 'http:' + r;
  }
  return `https://image.baidu.com/search/down?url=${r}`;
}

export function string2Number(val: string | number) {
  const r = Number(val);
  if (isNaN(r)) return;
  return r;
}

export function isJson<T = Array<any> | Record<string, any>>(val: string): T | undefined {
  try {
    return JSON.parse(val);
  } catch (e) {
    return;
  }
}

/** 跳转歌单详情 */
export function toMusicOrderDetail(data: MusicOrderItem) {
  musicOrderDetailStore.getState().setData(data);
  router.push('/music-order-detail');
}
