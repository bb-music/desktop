/** 切换播放模式 */
import { usePlayerStore } from '..';
import { PlayCycle, PlayOnce, ShuffleOne, SortAmountDown, VolumeNotice } from '@icon-park/react';
import { PlayerMode, PlayerModeMap } from '../constants';

export function SwitchPlayMode({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const player = usePlayerStore((s) => ({
    togglePlayerMode: s.togglePlayerMode,
    playerMode: s.playerMode,
  }));

  return (
    <div
      className={className}
      onClick={() => player.togglePlayerMode()}
      title={PlayerModeMap.get(player.playerMode)?.label}
    >
      {player.playerMode === PlayerMode.ListLoop && <PlayCycle strokeWidth={2} />}
      {player.playerMode === PlayerMode.SignalLoop && <PlayOnce strokeWidth={2} />}
      {player.playerMode === PlayerMode.Random && <ShuffleOne strokeWidth={2} />}
      {player.playerMode === PlayerMode.ListOrder && <SortAmountDown strokeWidth={2} />}
    </div>
  );
}
