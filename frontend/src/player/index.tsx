import { cls } from '@/utils';
import {
  Close,
  GoEnd,
  GoStart,
  MusicList,
  PauseOne,
  Play,
  PlayCycle,
  PlayOnce,
  PlayOne,
  Right,
  RightOne,
  ShuffleOne,
  SortAmountDown,
} from '@icon-park/react';
import styles from './index.module.scss';
import { usePlayerStore, PlayerMode, seconds2mmss } from '.';
import { useEffect, useState } from 'react';
import { musicItem2Url } from '.';
import { PlayerStatus } from '.';
import { PlayerModeMap } from '.';
import { DownloadMusic, UpdateDownloadDir } from '@wails/go/app/App';
import { useConfigStore } from '@/store/config';

export * from './types';
export * from './utils';
export * from './store';
export * from './constants';

export function Player({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const player = usePlayerStore();
  const config = useConfigStore();
  const [listShow, setListShow] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  useEffect(() => {
    player.init();
    player.audio.addEventListener('ended', () => {
      player.endNext();
    });
  }, []);
  return (
    <div
      className={cls(styles.playerContainer, className)}
      style={style}
    >
      <div className={styles.player}>
        <div className={styles.operateButtons}>
          <div
            className={cls(styles.icon, styles.prev)}
            onClick={() => {
              player.prev();
            }}
          >
            <GoStart strokeWidth={3} />
          </div>
          {player.playerStatus === PlayerStatus.Play ? (
            <div
              className={cls(styles.icon, styles.play)}
              onClick={() => {
                player.pause();
              }}
            >
              <PauseOne strokeWidth={2} />
            </div>
          ) : (
            <div
              className={cls(styles.icon, styles.play)}
              onClick={() => {
                player.play();
              }}
            >
              <Play strokeWidth={2} />
            </div>
          )}
          <div
            className={cls(styles.icon, styles.next)}
            onClick={() => {
              player.next();
            }}
          >
            <GoEnd strokeWidth={3} />
          </div>
        </div>
        <PlayerInfo />
        <div className={styles.operateButtons}>
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
            <span className={styles.total}>{player.playerList.length}</span>
          </div>
        </div>
      </div>
      <div className={cls(styles.playerList, listShow ? styles.show : '')}>
        <div className={styles.header}>
          <div className={styles.title}>
            <span>播放列表</span>
          </div>
          <input
            className={styles.searchInput}
            type='text'
            placeholder='输入歌曲名称过滤'
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value?.trim() || '');
            }}
          />
          <div className={styles.operateButtons}>
            <span
              className={styles.operateLink}
              onClick={() => {
                player.clearPlayerList();
              }}
            >
              清除
            </span>
            <span
              className={styles.close}
              onClick={() => {
                setListShow(false);
              }}
            >
              <Close />
            </span>
          </div>
        </div>
        <div className={styles.list}>
          {player.playerList.map((item, index) => {
            return (
              <div
                className={cls(styles.item, player.current?.id === item.id ? styles.active : '')}
                key={item.id}
                style={{ display: item.name.includes(searchValue) ? 'flex' : 'none' }}
                onClick={() => {
                  player.play(item);
                }}
              >
                <div className={styles.icon}>
                  {player.current?.id === item.id && (
                    <RightOne
                      theme='filled'
                      strokeWidth={2}
                    />
                  )}
                </div>
                <div className={styles.name}>
                  {index + 1}. {item.name}
                </div>
                <div
                  className={styles.operate}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <span
                    className={styles.operateLink}
                    onClick={async (e) => {
                      if (!config.downloadDir) {
                        await UpdateDownloadDir();
                        await config.load();
                        return;
                      }
                      DownloadMusic({
                        aid: item.aid + '',
                        cid: item.cid + '',
                        bvid: item.bvid + '',
                        name: item.name,
                      }).then((res) => {
                        console.log(res);
                      });
                    }}
                  >
                    下载
                  </span>
                  <span
                    className={styles.operateLink}
                    onClick={(e) => {
                      player.removePlayerList([item.id]);
                    }}
                  >
                    删除
                  </span>
                </div>
                <div className={styles.duration}>{seconds2mmss(item.duration)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PlayerInfo() {
  const player = usePlayerStore();
  const [progress, setProgress] = useState(player.playProgress);
  const duration = player.current?.duration || 0;

  useEffect(() => {
    player.audio.addEventListener('timeupdate', (e) => {
      const target = e.target as HTMLAudioElement;
      setProgress(target.currentTime);
    });
  }, [player.audio]);

  const width = duration + progress === 0 ? 0 : (progress / duration) * 100;

  return (
    <div className={styles.info}>
      <div className={styles.name}>{player.current?.name || '-'}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
        <div className={styles.progress}>
          <div
            className={styles.current}
            style={{ width: width + '%' }}
          >
            <div className={styles.btn}></div>
          </div>
        </div>
        <div className={styles.duration}>
          <span>{seconds2mmss(progress)}</span>/<span>{seconds2mmss(duration)}</span>
        </div>
      </div>
    </div>
  );
}
