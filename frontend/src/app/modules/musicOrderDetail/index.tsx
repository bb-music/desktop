/**
 * 歌单详情
 */
import { Image } from '@/app/components/ui/image';
import styles from './index.module.scss';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Download, Search } from '@icon-park/react';
import { Table } from '@/app/components/ui/table';
import { MusicOrderItem } from '@/app/api/music';
import { seconds2mmss } from '@/player';
import { useState } from 'react';
import { usePlayerStore } from '../player/store';
import { useShallow } from 'zustand/react/shallow';
import { useMusicOrderDetailStore } from './store';

export interface MusicOrderDetailProps {
  data?: MusicOrderItem;
}

export function MusicOrderDetail({}: MusicOrderDetailProps) {
  const player = usePlayerStore(useShallow((s) => ({ addPlayerList: s.addPlayerList })));
  const data = useMusicOrderDetailStore(useShallow((state) => state.data));
  const [searchKeyword, setSearchKeyword] = useState('');
  return (
    <div className={styles.container}>
      <div className={styles.headerCard}>
        {data?.cover && (
          <Image
            className={styles.cover}
            src={data.cover}
          />
        )}
        <div className={styles.info}>
          <div className={styles.title}>{data?.name}</div>
          <div className={styles.operateList}>
            <Button type='primary'>播放全部</Button>
            <Button
              onClick={() => {
                player.addPlayerList(data?.musicList || []);
              }}
            >
              追加到播放列表
            </Button>
            <Button>收藏歌单</Button>
            <Button>下载全部</Button>
          </div>
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
                <tr
                  key={m.id}
                  style={{ display: m.name.includes(searchKeyword) ? '' : 'none' }}
                >
                  <td>{index + 1}</td>
                  <td
                    className={styles.name}
                    title={m.name}
                  >
                    {m.name}
                  </td>
                  <td>
                    <Download title='下载' />
                  </td>
                  <td>{seconds2mmss(m.duration)}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
