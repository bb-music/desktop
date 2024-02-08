import { Page, Setting } from '@icon-park/react';
import styles from '../index.module.scss';
import { PageView, openPage } from '../../store';

export function Header() {
  return (
    <div
      className={styles.header}
      style={{ '--wails-draggable': 'drag' } as any}
    >
      <div className={`logo`}>哔哔音乐</div>
      <div className='menu'>
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
      <div className='operate'>
        <Setting
          className='bb-icon'
          onClick={() => {
            openPage(PageView.Setting);
          }}
        />
      </div>
    </div>
  );
}
