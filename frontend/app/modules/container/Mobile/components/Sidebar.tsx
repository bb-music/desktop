import { PageView, openPage } from '../../store';
import styles from '../index.module.scss';
import { MusicOrder } from '../../../musicOrderList';

export function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <MusicOrder
        gotoMusicOrderDetail={(opt) => {
          openPage(PageView.MusicOrderDetail, opt);
        }}
      />
    </div>
  );
}
