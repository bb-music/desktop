import { PageView, openPage } from '../../store';
import styles from '../index.module.scss';
import { LocalMusicOrder, RemoteMusicOrder } from '@/app/modules/musicOrderList';

export function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <LocalMusicOrder
        gotoMusicOrderDetail={(opt) => {
          openPage(PageView.MusicOrderDetail, opt);
        }}
      />
      <RemoteMusicOrder
        gotoMusicOrderDetail={(opt) => {
          openPage(PageView.MusicOrderDetail, opt);
        }}
      />
    </div>
  );
}
