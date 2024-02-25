import { userMusicOrderStore } from '../musicOrderList';
import { api } from '@/app/api';
import { message } from '@/app/components/ui/message';
import { MusicItem } from '@/app/api/music';
import { musicFormModalStore } from './store';
import { getMusicOrder, getMusicService } from '@/app/utils';

export * from './store';
export * from './FormModal';

// 删除歌曲
export function deleteMusic({
  music,
  musicOrderId,
  originName,
}: {
  musicOrderId: string;
  music: MusicItem;
  originName: string;
}) {
  const order = getMusicOrder(originName);
  order?.action.deleteMusic(musicOrderId, [music]).then(() => {
    userMusicOrderStore.getState().load();
    message.success('已删除');
  });
}

// 下载歌曲
export async function downloadMusic(item: MusicItem) {
  message.success('开始下载');
  try {
    const service = getMusicService(item.origin);
    await service?.action.download(item);
    message.success('下载成功');
  } catch (e: any) {
    message.error(e?.message || '下载失败');
  }
}

// 修改歌曲信息
export const updateMusicInfo = musicFormModalStore.getState().show;
