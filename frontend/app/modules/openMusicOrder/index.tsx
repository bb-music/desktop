/**
 * 歌单广场
 */
import { Image, ContextMenu } from '../../components';
import styles from './index.module.scss';
import { User } from '@icon-park/react';
import { useSettingStore } from '../setting';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useOpenMusicOrderStore } from './store';
import { MusicOrderDetailProps } from '../musicOrderDetail';
import { MusicInter } from '../../interface';

type MusicOrderItem = MusicInter.MusicOrderItem;

export * from './store';

export interface OpenMusicOrderProps {
  gotoMusicOrderDetail: (opt: MusicOrderDetailProps) => void;
}

export function OpenMusicOrderComp({ gotoMusicOrderDetail }: OpenMusicOrderProps) {
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
            <ContextMenu
              key={i.id + i.name}
              items={[]}
              asChild
            >
              <MusicOrderItemComp
                data={i}
                gotoMusicOrderDetail={gotoMusicOrderDetail}
              />
            </ContextMenu>
          );
        })}
      </div>
    </div>
  );
}

export function MusicOrderItemComp({
  data,
  gotoMusicOrderDetail,
}: {
  data: MusicOrderItem;
  gotoMusicOrderDetail: OpenMusicOrderProps['gotoMusicOrderDetail'];
}) {
  return (
    <div
      className={styles.orderItem}
      onClick={() => {
        gotoMusicOrderDetail({ data });
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
