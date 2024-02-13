import { Image } from '@/app/components/ui/image';
import styles from './index.module.scss';
import {
  GoEnd,
  GoStart,
  MusicList,
  PauseOne,
  Play,
  PlayCycle,
  PlayOnce,
  RightOne,
  ShuffleOne,
  SortAmountDown,
} from '@icon-park/react';
import { usePlayerStore } from './store';
import { cls } from '@/utils';
import { PlayerMode, PlayerModeMap, PlayerStatus } from './constants';
import { useEffect, useState } from 'react';
import { seconds2mmss } from './utils';
import { Table } from '@/app/components/ui/table';

export function Player() {
  const player = usePlayerStore();
  const [listShow, setListShow] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setListShow(false);
    };
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
    };
  }, []);

  return (
    <div className={styles.player}>
      <div className={styles.progress}>
        <div className={styles.loaded}></div>
      </div>
      <div className={styles.info}>
        <Image
          src=''
          className={styles.cover}
        ></Image>
        <div>
          <div className={styles.name}>歌曲名</div>
          <div className={styles.duration}>
            <span>03:22</span>
            <span>/</span>
            <span>03:22</span>
          </div>
        </div>
      </div>
      <div className={styles.playerOperate}>
        <GoStart
          strokeWidth={3}
          className={cls(styles.icon, styles.prev)}
          title='上一首'
          onClick={() => {
            player.prev();
          }}
        />
        {player.playerStatus === PlayerStatus.Play ? (
          <PauseOne
            strokeWidth={2}
            className={cls(styles.icon, styles.play)}
            title='暂停'
            onClick={() => {
              player.pause();
            }}
          />
        ) : (
          <Play
            theme='filled'
            strokeWidth={2}
            title='播放'
            className={cls(styles.icon, styles.play)}
            onClick={() => {
              player.play();
            }}
          />
        )}
        <GoEnd
          strokeWidth={3}
          title='下一首'
          className={cls(styles.icon, styles.next)}
          onClick={() => {
            player.next();
          }}
        />
      </div>
      <div className={styles.operate}>
        <div
          className={cls(styles.modeIcon, styles.icon)}
          onClick={() => player.togglePlayerMode()}
          title={PlayerModeMap.get(player.playerMode)?.label}
        >
          {player.playerMode === PlayerMode.ListLoop && <PlayCycle strokeWidth={2} />}
          {player.playerMode === PlayerMode.SignalLoop && <PlayOnce strokeWidth={2} />}
          {player.playerMode === PlayerMode.Random && <ShuffleOne strokeWidth={2} />}
          {player.playerMode === PlayerMode.ListOrder && <SortAmountDown strokeWidth={2} />}
        </div>
        <div
          className={cls(styles.icon, styles.musicListIcon)}
          onClick={(e) => {
            e.stopPropagation();
            setListShow(!listShow);
          }}
        >
          <MusicList strokeWidth={2} />
        </div>
      </div>
      <PlayerList open={listShow} />
    </div>
  );
}

function PlayerList({ open }: { open: boolean }) {
  const player = usePlayerStore();
  return (
    <div
      className={styles.playerListContainer}
      style={{ display: open ? '' : 'none' }}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className={styles.headerInfo}>
        <div className={styles.title}>当前播放</div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className={styles.total}>总{player.playerList.length}首</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span className={styles.operateBtn}>收藏全部</span>
            <span className={styles.clear}>清空列表</span>
          </div>
        </div>
      </div>
      <Table className={styles.list}>
        <thead style={{ display: 'none' }}>
          <tr>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {player.playerList.map((item, index) => {
            return (
              <tr
                onDoubleClick={() => {
                  player.play(item);
                }}
              >
                <td className={cls(styles.name, player.current?.id === item.id && styles.active)}>
                  <div className={styles.icon}>
                    <RightOne
                      theme='filled'
                      strokeWidth={2}
                    />
                  </div>
                  <span>{item.name}</span>
                </td>
                <td>{seconds2mmss(item.duration)}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
