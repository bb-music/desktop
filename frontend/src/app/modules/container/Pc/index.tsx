/** 适用与大屏设备的 APP 容器 */
import { cls } from '@/app/utils';
import styles from './index.module.scss';
import { UIPrefix } from '@/app/consts';
import { BaseElementProps } from '@/app/interface';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { useGlobalStore } from '@/app/store/global';
import { PageViewMap, useContainerStore } from '../store';
import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

export interface PcContainerProps extends BaseElementProps {
  header?: React.ReactNode;
  player?: React.ReactNode;
}

export function PcContainer({ className, style, header, player }: PcContainerProps) {
  const { theme } = useGlobalStore();
  return (
    <div
      className={cls(styles.container, `${UIPrefix}-container`, className, theme)}
      style={style}
    >
      {!header && <Header />}
      <main className={styles.main}>
        <Sidebar />
        <ContainerContent />
      </main>
      {!player && <div className={styles.player}></div>}
    </div>
  );
}

function ContainerContent() {
  const active = useContainerStore(useShallow((state) => state.active));

  const component = useMemo(() => {
    const View = PageViewMap.get(active)?.Component;
    if (!View) return null;
    return <View />;
  }, [active]);

  return <div className={styles.content}>{component}</div>;
}
