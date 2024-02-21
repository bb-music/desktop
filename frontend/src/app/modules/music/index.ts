import { userLocalMusicOrderStore, userRemoteMusicOrderStore } from '../musicOrderList';
import { api } from '@/app/api';
import { settingStore } from '../setting/store';
import { message } from '@/app/components/ui/message';
import { MusicItem } from '@/app/api/music';

// 删除歌曲
export function deleteMusic({
  music,
  musicOrderId,
  remoteName,
}: {
  musicOrderId: string;
  music: MusicItem;
  remoteName?: string;
}) {
  if (!remoteName) {
    // 本地歌单
    api.userLocalMusicOrder.deleteMusic(musicOrderId, [music]).then(() => {
      userLocalMusicOrderStore.getState().load();
      message.success('已删除');
    });
  } else {
    // 远程歌单
    const remote = api.userRemoteMusicOrder.find((u) => u.name === remoteName);
    const config = settingStore
      .getState()
      .userMusicOrderOrigin.find((u) => u.name === remoteName)?.config;

    remote?.action.deleteMusic(musicOrderId, [music], config).then(() => {
      userRemoteMusicOrderStore.getState().load();
      message.success('已删除');
    });
  }
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
