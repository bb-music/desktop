import { api } from '../api';
import { MusicItem } from '../api/music';
import { message } from '../components/ui/message';

/** 合并 className */
export function cls(...classList: Array<string | undefined | boolean>) {
  return classList.filter((i) => !!i).join(' ');
}
