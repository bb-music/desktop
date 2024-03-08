import { GoEnd, GoStart, Loading, PauseOne, Play } from '@icon-park/react';
import { usePlayerStore } from '..';
import { cls } from '../../../utils';
import styles from '../index.module.scss';
import { PlayerStatus } from '../constants';
import { useShallow } from 'zustand/react/shallow';

export function PlayIconButton() {
  const player = usePlayerStore(
    useShallow((s) => ({
      playerStatus: s.playerStatus,
      playerLoading: s.playerLoading,
      pause: s.pause,
      play: s.play,
    })),
  );
  return (
    <>
      {player.playerLoading ? (
        <Loading
          theme="filled"
          title="加载中"
          strokeWidth={2}
          className={cls(styles.icon, styles.play, styles.loading)}
        />
      ) : (
        <>
          {player.playerStatus === PlayerStatus.Play ? (
            <PauseOne
              theme="filled"
              strokeWidth={2}
              className={cls(styles.icon, styles.play)}
              title="暂停"
              onClick={() => {
                player.pause();
              }}
            />
          ) : (
            <Play
              theme="filled"
              strokeWidth={2}
              title="播放"
              className={cls(styles.icon, styles.play)}
              onClick={() => {
                player.play();
              }}
            />
          )}
        </>
      )}
    </>
  );
}

export function PrevIconButton() {
  const player = usePlayerStore(
    useShallow((s) => ({
      prev: s.prev,
    })),
  );
  return (
    <GoStart
      strokeWidth={3}
      className={cls(styles.icon)}
      title="上一首"
      onClick={() => {
        player.prev();
      }}
    />
  );
}

export function NextIconButton() {
  const player = usePlayerStore(
    useShallow((s) => ({
      next: s.next,
    })),
  );
  return (
    <GoEnd
      strokeWidth={3}
      title="下一首"
      className={cls(styles.icon)}
      onClick={() => {
        player.next();
      }}
    />
  );
}
