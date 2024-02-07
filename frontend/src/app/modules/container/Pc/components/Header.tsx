import { UIPrefix } from '@/app/consts';
import styles from '../index.module.scss';

export function Header() {
  return (
    <div className={styles.header}>
      <div className={`logo`}>哔哔音乐</div>
    </div>
  );
}
