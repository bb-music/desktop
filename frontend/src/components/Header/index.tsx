import { NavLink } from 'react-router-dom';
import styles from './index.module.scss';

export function Header() {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.menu}>
        <NavLink to='/'>歌单广场</NavLink>
        <NavLink to='/my'>我的歌单</NavLink>
        <NavLink to='/config'>设置</NavLink>
        <NavLink to='/search'>搜索</NavLink>
      </div>
    </div>
  );
}
