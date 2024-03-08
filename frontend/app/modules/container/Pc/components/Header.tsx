import { Remind, SettingTwo } from '@icon-park/react';
import styles from '../index.module.scss';
import { PageView, useContainerStore } from '../../store';
import { cls } from '../../../../utils';

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
];

export function Header({ operateRender, openPage }: HeaderProps) {
  const container = useContainerStore();

  return (
    <div className={styles.header} style={{ '--wails-draggable': 'drag' } as any}>
      <div className={styles.logo}>哔哔音乐</div>
      <div className={styles.menu}>
        {MENU_LIST.map((m) => {
          return (
            <a
              className={container.active === m.key ? styles.active : ''}
              key={m.key}
              onClick={() => {
                openPage(m.key);
              }}
            >
              {m.title}
            </a>
          );
        })}
      </div>
      <div className={styles.operate}>
        <Remind title="消息通知 （开发中）" className={styles.btnIcon} />
        <SettingTwo
          title="系统配置"
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
