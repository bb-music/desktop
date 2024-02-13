/**
 * 歌单广场
 */
import { Image } from '@/app/components/ui/image';
import styles from './index.module.scss';
import { User } from '@icon-park/react';
import { PageView, openPage } from '../container/store';
import { useSettingStore } from '../setting/store';
import { useEffect, useState } from 'react';
import { api } from '@/app/api';
import { MusicOrderItem } from '@/app/api/music';
import { useShallow } from 'zustand/react/shallow';

export interface OpenMusicOrderProps {}

interface MapListItem {
  origin: string;
  list: MusicOrderItem[];
}

export function OpenMusicOrder() {
  const origins = useSettingStore(useShallow((state) => state.openMusicOrderOrigin));
  const [mapList, setMapList] = useState<MapListItem[]>([]);
  const initHandler = async () => {
    const urls = origins.map((u) => u.trim()).filter((u) => !!u);
    const res = await Promise.all(
      urls.map((url) => api.openMusicOrder.useOriginGetMusicOrder(url))
    );
    setMapList(
      res.map((list, k) => {
        return {
          origin: urls[k],
          list,
        };
      })
    );
  };
  useEffect(() => {
    initHandler();
  }, [origins]);
  return (
    <div className={styles.container}>
      <div className={styles.musicOrderList}>
        {mapList.map((item) => {
          return (
            <>
              {item.list.map((i) => (
                <MusicOrderItemComp data={i} />
              ))}
            </>
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
