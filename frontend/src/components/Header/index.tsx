import { NavLink } from 'react-router-dom';
import styles from './index.module.scss';

export function Header() {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.menu}>
        <NavLink href='/'>歌单广场</NavLink>
        <NavLink href='/my'>我的歌单</NavLink>
        <NavLink href='/config'>设置</NavLink>
        <NavLink href='/search'>搜索</NavLink>
      </div>
    </div>
  );
}
