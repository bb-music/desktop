/**
 * 设置页
 */
import { Plus } from '@icon-park/react';
import styles from './index.module.scss';

export interface SettingProps {}

export function Setting() {
  return (
    <div className={styles.container}>
      <div className={styles.subTitle}>
        <div className={styles.name}>系统设置</div>
        <div className={styles.operate}>系统设置</div>
      </div>

      <div className={styles.subTitle}>
        <div className={styles.name}>歌单广场源</div>
        <div className={styles.operate}>
          <Plus></Plus>
          <span>添加源</span>
        </div>
      </div>

      <div className={styles.subTitle}>
        <div className={styles.name}>歌单同步</div>
        <div className={styles.operate}>
          <Plus></Plus>
          <span>添加源</span>
        </div>
      </div>
    </div>
  );
}
