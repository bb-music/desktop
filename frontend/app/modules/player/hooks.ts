import { useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '.';
import { useShallow } from 'zustand/react/shallow';
import { api } from '../../api';
import { PlayerStatus } from './constants';
import { message } from '../../components';

const ProgressCacheKey = 'BBPlayerProgress';

export function usePlayer() {
  const player = usePlayerStore(
    useShallow((s) => ({
      init: s.init,
      audio: s.audio,
      setPlayerStatus: s.setPlayerStatus,
      setPlayerLoading: s.setPlayerLoading,
      endNext: s.endNext,
      play: s.play,
    })),
  );
  const [currentTime, setCurrentTime] = useState(0);
  const progressTimer = useRef<number>(0);
  useEffect(() => {
    player.init();
  }, []);
  useEffect(() => {
    if (!player.audio || !player.audio.addEventListener) return;
    (async () => {
      const d = Number(await api.cacheStorage.getItem(ProgressCacheKey));
      const t = isNaN(d) ? 0 : d;
      setCurrentTime(t);
      setCurrentTime(t);
      player.audio?.setCurrentTime(t);
    })();
    // 监听播放进度
    player.audio.addEventListener('timeupdate', async (e) => {
      const d = player.audio?.getCurrentTime() || 0;
      setCurrentTime(d);
      if (progressTimer.current + 3000 < Date.now()) {
        // 3s 缓存一次进度
        await api.cacheStorage.setItem(ProgressCacheKey, d.toString());
        progressTimer.current = Date.now();
      }
    });
    player.audio?.addEventListener('pause', () => {
      // console.log('暂停播放');
      player.setPlayerStatus(PlayerStatus.Pause);
    });
    player.audio?.addEventListener('play', (e) => {
      // console.log('开始播放', e);
      player.setPlayerLoading(player.audio?.getReadyState() !== 4);
      player.setPlayerStatus(PlayerStatus.Play);
    });
    player.audio?.addEventListener('ended', () => {
      // console.log('播放结束, 下一首');
      setCurrentTime(0);
      player.endNext();
    });
    player.audio?.addEventListener('error', (err) => {
      // console.log('播放失败 error: ', err);
      message.error('播放失败');
      setCurrentTime(0);
      player.endNext();
    });
    player.audio?.addEventListener('canplay', (e) => {
      // console.log('可以播放: ', e);
      player.setPlayerLoading(false);
    });
    document.addEventListener('keydown', (e) => {
      const target = e.target as HTMLElement;
      if (target?.tagName.toLocaleLowerCase() === 'input') return;
      if (e.code === 'Space') {
        player.play();
      }
    });
  }, [player.audio]);

  return {
    currentTime,
  };
}
