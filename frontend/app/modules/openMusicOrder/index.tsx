/**
 * 歌单广场
 */
import styles from './index.module.scss';
import { useSettingStore } from '../setting';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useOpenMusicOrderStore } from './store';
import { MusicOrderDetailProps } from '../musicOrderDetail';
import { MusicOrderItemCard } from '../musicOrderList';

export * from './store';

export interface OpenMusicOrderProps {
  gotoMusicOrderDetail: (opt: MusicOrderDetailProps) => void;
}

export function OpenMusicOrderView({ gotoMusicOrderDetail }: OpenMusicOrderProps) {
  const store = useOpenMusicOrderStore();
  const origins = useSettingStore(useShallow((state) => state.openMusicOrderOrigin));

  useEffect(() => {
    store.load();
  }, [origins]);

  return (
    <div className={styles.Container}>
      {store.list.map((i) => {
        return (
          <MusicOrderItemCard
            data={i}
            key={i.id}
            className={styles.Item}
            onClick={() => {
              gotoMusicOrderDetail({ data: i });
            }}
          />
        );
      })}
    </div>
  );
}

export function OpenMusicOrderViewForMobile({ gotoMusicOrderDetail }: OpenMusicOrderProps) {
  const store = useOpenMusicOrderStore();
  const origins = useSettingStore(useShallow((state) => state.openMusicOrderOrigin));

  useEffect(() => {
    store.load();
  }, [origins]);

  return (
    <div className={styles.ContainerForMobile}>
      {store.list.map((i) => {
        return (
          <MusicOrderItemCard
            data={i}
            key={i.id}
            className={styles.ItemForMobile}
            onClick={() => {
              gotoMusicOrderDetail({ data: i });
            }}
          />
        );
      })}
    </div>
  );
}
