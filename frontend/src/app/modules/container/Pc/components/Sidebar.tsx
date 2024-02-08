import { MusicMenu, Plus } from '@icon-park/react';
import styles from '../index.module.scss';

export function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <div className='sub-title'>
        <div className='name'>本地歌单</div>
        <div className='operate'>
          <Plus
            className='ui-icon'
            title='创建歌单'
          />
        </div>
      </div>
      <ul className='item-list'>
        <li className='item'>
          <MusicMenu
            className='ui-icon'
            strokeWidth={3}
          />
          <span className='name'>歌单1</span>
        </li>
        <li className='item active'>
          <span className='ui-icon'>
            <MusicMenu strokeWidth={3} />
          </span>
          <span className='name'>歌单歌单歌单歌单歌单歌单歌单歌单2</span>
        </li>
      </ul>
    </div>
  );
}
