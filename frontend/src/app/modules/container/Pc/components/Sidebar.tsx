import styles from '../index.module.scss';
import { LocalMusicOrder, RemoteMusicOrder } from '@/app/modules/musicOrderList';

export function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <LocalMusicOrder />
      <RemoteMusicOrder />
    </div>
  );
}
