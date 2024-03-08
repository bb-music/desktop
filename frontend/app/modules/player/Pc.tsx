import styles from './index.module.scss';
import { MusicList } from '@icon-park/react';
import { usePlayerStore } from './store';
import { cls } from '../../utils';
import { useEffect, useState } from 'react';
import { usePlayer } from './hooks';
import { PlayerList } from './components/PlayerList';
import { PlayerProgress } from './components/PlayerProgress';
import { PlayerCurrentInfo } from './components/PlayerCurrentInfo';
import { PlayerVolume } from './components/PlayerVolume';
import { SwitchPlayMode } from './components/SwitchPlayerMode';
import { NextIconButton, PlayIconButton, PrevIconButton } from './components/PlayerOperate';
import { useShallow } from 'zustand/react/shallow';

export function Player() {
  const player = usePlayerStore(useShallow((s) => ({ audio: s.audio })));
  const [listShow, setListShow] = useState(false);
  const { currentTime } = usePlayer();
  useEffect(() => {
    // 播放列表的显示与隐藏
    const handler = () => {
      setListShow(false);
    };
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
    };
  }, []);

  if (!player.audio) return null;

  return (
    <div className={styles.player}>
      <PlayerProgress progress={currentTime} />
      <PlayerCurrentInfo currentTime={currentTime} />

      <div className={styles.playerOperate}>
        <PrevIconButton />
        <PlayIconButton />
        <NextIconButton />
      </div>
      <div className={styles.operate}>
        <PlayerVolume />
        <SwitchPlayMode className={cls(styles.modeIcon, styles.icon)} />
        <MusicList
          strokeWidth={3}
          className={cls(styles.icon, styles.musicListIcon)}
          onClick={(e) => {
            e.stopPropagation();
            setListShow(!listShow);
          }}
        />
      </div>
      <PlayerList open={listShow} />
    </div>
  );
}
