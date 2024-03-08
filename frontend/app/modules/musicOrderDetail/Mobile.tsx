/**
 * 歌单详情 移动端
 */
import { showActionSheet, ContextMenu, Button, Input } from '../../components';
import { Download, MoreOne } from '@icon-park/react';
import { Table } from '../../components';
import { usePlayerStore } from '../player';
import { musicCollect } from '../musicOrderList';
import { deleteMusic, downloadMusic } from '../music';
import { updateMusicInfo } from '../music';
import { cls, seconds2mmss } from '../../utils';
import { MusicOrderDetailProps, useMusicOrderDetail } from '.';
import { api } from '../../api';
import styles from './index.module.scss';

export function MusicOrderDetailForMobile({}: MusicOrderDetailProps) {
  const player = usePlayerStore();
  const { data, originName, canEditMusic, searchKeyword, setSearchKeyword } = useMusicOrderDetail();
  if (!data) return null;
  return (
    <div className={cls(styles.container, styles.MobileContainer)}>
      <div
        className={styles.MusicOrderInfo}
        style={{ backgroundImage: `url(${api.utils.imgUrlTransform(data.cover!)})` }}
      >
        <div className={styles.info}>
          <div className={styles.title}>{data?.name}</div>
          <div className={styles.desc}>
            <label>歌曲数</label>
            <span>{data?.musicList?.length}</span>
          </div>
          <div className={styles.desc}>
            <label>描述</label>
            <span>{data?.desc || '-'}</span>
          </div>
        </div>
      </div>
      <div className={styles.operateList}>
        <Button
          type="primary"
          title="替换当前播放列表"
          onClick={() => {
            if (data?.musicList) {
              player.clearPlayerList();
              player.addPlayerList(data.musicList);
              player.play(data.musicList[0]);
            }
          }}
        >
          播放全部
        </Button>
        {!canEditMusic && (
          <Button
            onClick={() => {
              if (!data) return;
              if (data.musicList?.length) {
                musicCollect(data.musicList || []);
              }
            }}
          >
            收藏歌单
          </Button>
        )}
        <Button
          onClick={() => {
            player.addPlayerList(data?.musicList || []);
          }}
        >
          追加到播放列表
        </Button>
        {/* <Button>下载全部</Button> */}
      </div>
      <div className={styles.searchMusic}>
        <Input
          placeholder="搜索歌单音乐"
          onChange={(e) => {
            setSearchKeyword(e.target.value.trim());
          }}
        />
      </div>

      <div className={styles.musicList}>
        {data?.musicList?.map((m, index) => {
          return (
            <div
              className={styles.MusicItem}
              style={{ display: m.name.includes(searchKeyword) ? '' : 'none' }}
              key={m.id}
              onClick={() => {
                player.play(m);
              }}
            >
              <div className={styles.Index}>{index + 1}</div>
              <div className={styles.MusicInfo}>
                <div className={styles.Name}>{m.name}</div>
                <div className={styles.Tags}>
                  <span>{seconds2mmss(m.duration)}</span>
                  <span>·</span>
                  <span>{m.origin}</span>
                </div>
              </div>
              <div
                className={styles.Operate}
                onClick={(e) => {
                  e.stopPropagation();
                  showActionSheet({
                    cancelText: '取消',
                    items: [
                      {
                        label: '播放',
                        key: '播放',
                        onClick: () => {
                          player.play(m);
                        },
                      },
                      {
                        label: '添加到播放列表',
                        key: '添加到播放列表',
                        onClick: () => {
                          player.addPlayerList(m);
                        },
                      },
                      {
                        label: '下一首播放',
                        key: '下一首播放',
                        onClick: () => {
                          player.nextPlayer(m);
                        },
                      },
                      {
                        label: '下载',
                        key: '下载',
                        onClick: () => {
                          downloadMusic(m);
                        },
                      },
                      {
                        label: '修改',
                        disabled: !canEditMusic,
                        key: '修改',
                        onClick: () => {
                          if (data) {
                            updateMusicInfo(m, data.id, originName);
                          }
                        },
                      },
                      {
                        label: '收藏到歌单',
                        key: '收藏到歌单',
                        onClick: () => {
                          musicCollect(m);
                        },
                      },
                      {
                        label: '从歌单中删除',
                        disabled: !canEditMusic,
                        key: '从歌单中删除',
                        onClick: () => {
                          const musicOrderId = data?.id;
                          if (!musicOrderId) return null;
                          deleteMusic({
                            musicOrderId,
                            music: m,
                            originName: originName!,
                          });
                        },
                      },
                    ],
                  });
                }}
              >
                <MoreOne />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
