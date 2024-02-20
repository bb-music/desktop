/** 适用与大屏设备的 APP 容器 */
import { cls } from '@/app/utils';
import styles from './index.module.scss';
import { UIPrefix } from '@/app/consts';
import { BaseElementProps } from '@/app/interface';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { useGlobalStore } from '@/app/store/global';
import { PageViewMap, useContainerStore } from '../store';
import { useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useSettingStore } from '../../setting/store';
import { Player } from '../../player';
import { MessageRoot } from '@/app/components/ui/message';
import { usePlayerStore } from '../../player/store';

export interface PcContainerProps extends BaseElementProps {
  header?: React.ReactNode;
  player?: React.ReactNode;
}

export function PcContainer({ className, style, header, player }: PcContainerProps) {
  const { theme } = useGlobalStore();
  const playerStore = usePlayerStore();
  const settingLoad = useSettingStore(useShallow((state) => state.load));

  useEffect(() => {
    playerStore.init();
    settingLoad();
  }, []);
  return (
    <div
      className={cls(styles.container, `${UIPrefix}-container`, className, theme)}
      style={style}
    >
      <MessageRoot />
      {!header && <Header />}
      <main className={styles.main}>
        <Sidebar />
        <ContainerContent />
      </main>
      {!player && playerStore.audio && <Player />}
    </div>
  );
}

function ContainerContent() {
  const { active, props } = useContainerStore(
    useShallow((state) => ({ active: state.active, props: state.props }))
  );
  const component = useMemo(() => {
    const View = PageViewMap.get(active)?.Component;
    if (!View) return null;
    return <View {...props} />;
  }, [active]);

  return <div className={styles.content}>{component}</div>;
}
