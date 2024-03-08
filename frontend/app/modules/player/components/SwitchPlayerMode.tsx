/** 切换播放模式 */
import { usePlayerStore } from '..';
import { PlayCycle, PlayOnce, ShuffleOne, SortAmountDown, VolumeNotice } from '@icon-park/react';
import { PlayerMode, PlayerModeMap } from '../constants';

export function SwitchPlayMode({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const player = usePlayerStore((s) => ({
    togglePlayerMode: s.togglePlayerMode,
    playerMode: s.playerMode,
  }));

  const props = {
    className,
    strokeWidth: 3,
    title: PlayerModeMap.get(player.playerMode)?.label,
    onClick: () => player.togglePlayerMode(),
  };

  return (
    <>
      {player.playerMode === PlayerMode.ListLoop && <PlayCycle {...props} />}
      {player.playerMode === PlayerMode.SignalLoop && <PlayOnce {...props} />}
      {player.playerMode === PlayerMode.Random && <ShuffleOne {...props} />}
      {player.playerMode === PlayerMode.ListOrder && <SortAmountDown {...props} />}
    </>
  );
}
