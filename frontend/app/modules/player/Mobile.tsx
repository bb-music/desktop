import styles from './index.module.scss';
import { MusicList } from '@icon-park/react';
import { usePlayerStore } from './store';
import { cls } from '../../utils';
import { useEffect, useState } from 'react';
import { usePlayer } from './hooks';
import { PlayerCurrentInfo } from './components/PlayerCurrentInfo';
import { NextIconButton, PlayIconButton } from './components/PlayerOperate';
import { PlayerListForMobile } from './components/PlayerList';
import { PlayerProgress } from './components/PlayerProgress';
import { SwitchPlayMode } from './components/SwitchPlayerMode';

export function PlayerForMobile() {
  const player = usePlayerStore((s) => ({ audio: s.audio }));
  const [listShow, setListShow] = useState(false);
  const { currentTime } = usePlayer();

  if (!player.audio) return null;

  return (
    <div className={cls(styles.player, styles.playerMobile)}>
      <PlayerProgress progress={currentTime} />
      <PlayerCurrentInfo currentTime={currentTime} hideCover />

      <div className={styles.playerOperate}>
        <PlayIconButton />
        <NextIconButton />
        <SwitchPlayMode className={cls(styles.modeIcon, styles.icon)} />
        <MusicList
          onClick={(e) => {
            e.stopPropagation();
            setListShow(!listShow);
          }}
          title="播放列表"
          strokeWidth={3}
          className={cls(styles.icon)}
        />
      </div>
      <PlayerListForMobile open={listShow} onOpenChange={setListShow} />
    </div>
  );
}
