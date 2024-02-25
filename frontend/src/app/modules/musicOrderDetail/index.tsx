/**
 * 歌单详情
 */
import { Image } from '@/app/components/ui/image';
import styles from './index.module.scss';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Download, Search } from '@icon-park/react';
import { Table } from '@/app/components/ui/table';
import { useState } from 'react';
import { usePlayerStore } from '../player';
import { MusicOrderDetailStoreState, useMusicOrderDetailStore } from './store';
import { musicCollect, useUserMusicOrderStore } from '../musicOrderList';
import { ContextMenu } from '@/app/components/ui/contextMenu';
import { deleteMusic, downloadMusic } from '../music';
import { updateMusicInfo } from '../music';
import { seconds2mmss } from '@/app/utils';

export * from './store';

export type MusicOrderDetailProps = Partial<MusicOrderDetailStoreState>;

export function MusicOrderDetail({}: MusicOrderDetailProps) {
  const player = usePlayerStore();
  const store = useMusicOrderDetailStore();
  const musicOrderStore = useUserMusicOrderStore();
  let data = store.data;
  if (store.canEditMusic) {
    const r = musicOrderStore.list
      .find((l) => l.name === store.originName)
      ?.list.find((l) => l.id === store.data?.id);
    if (r) {
      data = r;
    }
  }
  const [searchKeyword, setSearchKeyword] = useState('');
  if (!data) return null;
  return (
    <div className={styles.container}>
      <div className={styles.headerCard}>
        {data?.cover && (
          <Image
            mode='cover'
            className={styles.cover}
            src={data.cover}
          />
        )}
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
          <div className={styles.operateList}>
            <Button
              type='primary'
              title='替换当前播放列表'
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
            {!store.canEditMusic && (
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
        </div>
      </div>
      <div className={styles.tabHeader}>
        <div className={styles.tab}>
          <div className={styles.active}>歌曲列表</div>
        </div>
        <div className={styles.search}>
          <Search />
          <Input
            placeholder='搜索歌单音乐'
            onChange={(e) => {
              setSearchKeyword(e.target.value.trim());
            }}
          />
        </div>
      </div>
      <div className={styles.musicList}>
        <Table>
          <thead>
            <tr>
              <th style={{ width: 60 }}></th>
              <th>歌曲名</th>
              <th style={{ width: 120 }}>操作</th>
              <th style={{ width: 60 }}>时长</th>
            </tr>
          </thead>
          <tbody>
            {data?.musicList?.map((m, index) => {
              return (
                <ContextMenu
                  asChild
                  key={m.id}
                  items={[
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
                      type: 'divider',
                      key: '1',
                    },
                    {
                      label: '下载',
                      key: '下载',
                      onClick: () => {
                        downloadMusic(m);
                      },
                    },
                    {
                      type: 'divider',
                      key: '2',
                      hide: !store.canEditMusic,
                    },
                    {
                      label: '修改',
                      key: '修改',
                      hide: !store.canEditMusic,
                      onClick: () => {
                        if (data) {
                          updateMusicInfo(m, data.id, store.originName);
                        }
                      },
                    },
                    {
                      type: 'divider',
                      key: '3',
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
                      key: '从歌单中删除',
                      onClick: () => {
                        const musicOrderId = data?.id;
                        if (!musicOrderId) return null;
                        deleteMusic({
                          musicOrderId,
                          music: m,
                          originName: store.originName!,
                        });
                      },
                    },
                  ]}
                >
                  <tr
                    key={m.id}
                    style={{ display: m.name.includes(searchKeyword) ? '' : 'none' }}
                    onDoubleClick={() => {
                      player.play(m);
                    }}
                  >
                    <td>{index + 1}</td>

                    <td
                      className={styles.name}
                      title={m.name}
                    >
                      {m.name}
                    </td>
                    <td
                      style={{ cursor: 'pointer' }}
                      title='下载'
                      onClick={() => {
                        downloadMusic(m);
                      }}
                    >
                      <Download />
                    </td>
                    <td>{seconds2mmss(m.duration)}</td>
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
