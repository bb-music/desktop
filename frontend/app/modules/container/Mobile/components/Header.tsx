import styles from '../index.module.scss';
import { PageView, useContainerStore } from '../../store';
import { useGlobalStore } from '../../../../store/global';

export interface HeaderProps {
  operateRender?: React.ReactNode;
  openPage: (p: PageView) => void;
}

const MENU_LIST = [
  {
    title: '广场',
    key: PageView.OpenMusicOrder,
  },
  {
    title: '搜索',
    key: PageView.Search,
  },
  {
    title: '我的',
    key: PageView.UserMusicOrder,
  },
  {
    title: '设置',
    key: PageView.Setting,
  },
];

export function Header({ openPage }: HeaderProps) {
  const container = useContainerStore();
  return (
    <div className={styles.header} style={{ '--wails-draggable': 'drag' } as any}>
      <div className={styles.menu}>
        {MENU_LIST.map((m) => {
          return (
            <a
              className={container.active === m.key ? styles.active : ''}
              onClick={() => {
                openPage(m.key);
              }}
              key={m.key}
            >
              {m.title}
            </a>
          );
        })}
      </div>
    </div>
  );
}
