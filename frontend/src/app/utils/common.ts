import { api } from '../api';
import { MusicItem } from '../api/music';
import { message } from '../components/ui/message';

/** 合并 className */
export function cls(...classList: Array<string | undefined | boolean>) {
  return classList.filter((i) => !!i).join(' ');
}

/** 下载歌曲 */
export async function downloadMusic(item: MusicItem) {
  message.success('开始下载');
  try {
    await api.music.download(item);
    message.success('下载成功');
  } catch (e: any) {
    message.error(e?.message || '下载失败');
  }
}
