import styles from '../../index.module.scss';
import { Image, showActionSheet } from '../../../../components';
import { usePlayerStore } from '../../../player';
import { musicCollect, downloadMusic } from '../../..';
import { cls, seconds2mmss } from '../../../../utils';
import { api } from '../../../../api';
import { SearchItemProps, useSearchItem } from './hooks';

export function SearchItemForMobile({ data, gotoMusicOrderDetail }: SearchItemProps) {
  const player = usePlayerStore();
  const { getDetailHandler, loading, music } = useSearchItem({
    data,
    onDetailIsMusic: () => {
      showActionSheet({
        cancelText: '取消',
        items: [
          {
            label: '立即播放',
            key: 1,
            onClick: () => {
              player.play(music!);
            },
          },
          {
            label: '加入歌单',
            key: 2,
            onClick: () => {
              musicCollect(music!);
            },
          },
          {
            label: '添加至播放列表',
            key: 3,
            onClick: () => {
              player.addPlayerList(music!);
            },
          },
          {
            label: '下载',
            key: 4,
            onClick: () => {
              downloadMusic(music!);
            },
          },
        ],
      });
    },
    onDetailIsMusicOrder(info) {
      gotoMusicOrderDetail({ data: info });
    },
  });
  const name = data.name;
  return (
    <div
      className={cls(styles.searchItem, styles.MobileSearchItem)}
      onClick={getDetailHandler}
      title={name}
    >
      <Image
        className={styles.cover}
        src={api.utils.imgUrlTransform(data.cover)}
        alt=""
        mode="cover"
      />
      <div className={styles.info}>
        <div className={styles.title}>{name}</div>
        <div className={styles.tags}>
          <span>{seconds2mmss(data.duration)}</span>
          <span>·</span>
          <span>{data.origin}</span>
          <span>·</span>
          <span>{data.author}</span>
        </div>
      </div>
      {loading && <div className={styles.loading}>加载中...</div>}
    </div>
  );
}
