/**
 * 歌单广场
 */
import { Image } from '@/app/components/ui/image';
import styles from './index.module.scss';
import { User } from '@icon-park/react';
import { PageView, openPage } from '../container/store';
import { useSettingStore } from '../setting/store';
import { useEffect } from 'react';
import { MusicOrderItem } from '@/app/api/music';
import { useShallow } from 'zustand/react/shallow';
import { useOpenMusicOrderStore } from './store';
import { ContextMenu, Menu } from '@/app/components/ui/contextMenu';

export interface OpenMusicOrderProps {}

export function OpenMusicOrder() {
  const store = useOpenMusicOrderStore();
  const origins = useSettingStore(useShallow((state) => state.openMusicOrderOrigin));

  useEffect(() => {
    store.load();
  }, [origins]);

  return (
    <div className={styles.container}>
      <div className={styles.musicOrderList}>
        {store.list.map((i) => {
          return (
            <ContextMenu key={i.id + i.name}>
              <MusicOrderItemComp data={i} />
            </ContextMenu>
          );
        })}
      </div>
    </div>
  );
}

export function MusicOrderItemComp({ data }: { data: MusicOrderItem }) {
  return (
    <div
      className={styles.orderItem}
      onClick={() => {
        openPage(PageView.MusicOrderDetail, { data });
      }}
    >
      <div className={styles.cover}>
        <Image
          className={styles.coverImg}
          mode='cover'
          src={data.cover}
        />
        {data.author && (
          <div className={styles.author}>
            <User />
            {data.author}
          </div>
        )}

        <div className={styles.total}>{data.musicList?.length}</div>
      </div>
      <div className={styles.name}>{data.name}</div>
    </div>
  );
}
