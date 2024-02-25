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
import { useEffect, useRef, useState } from 'react';
import { Table } from '@/app/components/ui/table';
import { useShallow } from 'zustand/react/shallow';
import { api } from '@/app/api';
import { ContextMenu } from '@/app/components/ui/contextMenu';
import { musicCollect } from '../musicOrderList';
import { downloadMusic } from '../music';
import { seconds2mmss } from '@/app/utils';

export * from './store';

const ProgressCacheKey = 'BBPlayerProgress';

export function Player() {
  const player = usePlayerStore();
  const [listShow, setListShow] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressTimer = useRef<number>(0);
  useEffect(() => {
    player.init();
  }, []);
  useEffect(() => {
    if (!player.audio || !player.audio.addEventListener) return;
    (async () => {
      const d = Number(await api.cacheStorage.getItem(ProgressCacheKey));
      const t = isNaN(d) ? 0 : d;
      setProgress(t);
      player.audio?.setCurrentTime(t);
    })();
    player.audio.addEventListener('timeupdate', async (e) => {
      const d = player.audio?.getCurrentTime() || 0;
      setProgress(d);
      if (progressTimer.current + 3000 < Date.now()) {
        // 3s 缓存一次进度
        await api.cacheStorage.setItem(ProgressCacheKey, d.toString());
        progressTimer.current = Date.now();
      }
    });
    player.audio?.addEventListener('ended', () => {
      player.endNext();
    });
    const handler = (e: MouseEvent) => {
      setListShow(false);
    };
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
    };
  }, [player.audio]);

  if (!player.audio) return null;

  return (
    <div className={styles.player}>
      <PlayerProgress progress={progress} />
      <div className={styles.info}>
        <Image
          src={api.utils.imgUrlTransform(player.current?.cover || '')}
          className={styles.cover}
          mode='cover'
        />
        <div>
          <div className={styles.name}>{player.current?.name}</div>
          <div className={styles.duration}>
            <span>{seconds2mmss(progress)}</span>
            <span>/</span>
            <span>{seconds2mmss(player.current?.duration || 0)}</span>
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
            theme='filled'
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
            <span
              className={styles.operateBtn}
              onClick={() => {
                musicCollect(player.playerList);
              }}
            >
              收藏全部
            </span>
            <span
              className={styles.clear}
              onClick={() => {
                player.clearPlayerList();
              }}
            >
              清空列表
            </span>
          </div>
        </div>
      </div>
      <div className={styles.list}>
        <Table>
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
                <ContextMenu
                  asChild
                  items={[
                    {
                      label: '播放',
                      key: '播放',
                      onClick: () => {
                        player.play(item);
                      },
                    },
                    {
                      label: '从列表中移除',
                      key: '移除',
                      onClick: () => {
                        player.removePlayerList([item.id]);
                      },
                    },
                    {
                      label: '收藏到歌单',
                      key: '收藏到歌单',
                      onClick: () => {
                        musicCollect(item);
                      },
                    },
                    {
                      label: '下载',
                      key: '下载',
                      onClick: () => {
                        downloadMusic(item);
                      },
                    },
                  ]}
                  key={item.id}
                >
                  <tr
                    onDoubleClick={() => {
                      player.play(item);
                    }}
                  >
                    <td
                      className={cls(styles.name, player.current?.id === item.id && styles.active)}
                    >
                      <div className={styles.icon}>
                        <RightOne
                          theme='filled'
                          strokeWidth={2}
                        />
                      </div>
                      <span className={styles.nameText}>{item.name}</span>
                    </td>
                    <td>{seconds2mmss(item.duration)}</td>
                  </tr>
                </ContextMenu>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

function PlayerProgress({ progress }: { progress: number }) {
  const player = usePlayerStore(
    useShallow((state) => ({
      current: state.current,
      audio: state.audio,
    }))
  );
  const duration = player.current?.duration || 0;
  const [width, setWidth] = useState(0);
  const statusRef = useRef({
    mouseDown: false,
  });

  useEffect(() => {
    if (!statusRef.current.mouseDown) {
      const width = duration + progress === 0 ? 0 : (progress / duration) * 100;
      setWidth(width);
    }
  }, [progress]);

  return (
    <div
      className={styles.progress}
      onMouseDown={(e) => {
        statusRef.current.mouseDown = true;
      }}
      onMouseUp={(e) => {
        statusRef.current.mouseDown = false;
        const target = e.target as HTMLDivElement;
        const { width, left } = target.getBoundingClientRect();
        const p = (e.clientX - left) / width;
        setWidth(p * 100);
        const duration = player.current?.duration || 0;
        player.audio?.setCurrentTime(duration * p);
      }}
      onMouseMove={(e) => {
        if (statusRef.current.mouseDown) {
          // TODO
        }
      }}
    >
      <div
        className={styles.loaded}
        style={{ width: `${width}%` }}
      >
        <div className={styles.dot}></div>
      </div>
    </div>
  );
}
