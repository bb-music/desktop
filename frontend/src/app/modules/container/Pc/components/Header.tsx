import { SettingTwo } from '@icon-park/react';
import styles from '../index.module.scss';
import { PageView, openPage } from '../../store';

export interface HeaderProps {
  operateRender?: React.ReactNode;
}

export function Header({ operateRender }: HeaderProps) {
  return (
    <div
      className={styles.header}
      style={{ '--wails-draggable': 'drag' } as any}
    >
      <div className={styles.logo}>哔哔音乐</div>
      <div className={styles.menu}>
        <a
          onClick={() => {
            openPage(PageView.OpenMusicOrder);
          }}
        >
          广场
        </a>
        <a
          onClick={() => {
            openPage(PageView.Search);
          }}
        >
          搜索
        </a>
      </div>
      <div className={styles.operate}>
        <SettingTwo
          title='系统配置'
          className={styles.btnIcon}
          onClick={() => {
            openPage(PageView.Setting);
          }}
        />
        {operateRender}
      </div>
    </div>
  );
}
