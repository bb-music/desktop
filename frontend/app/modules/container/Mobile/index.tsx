/** 适用与大屏设备的 APP 容器 */
import { cls } from '../../../utils';
import styles from './index.module.scss';
import { UIPrefix } from '../../../consts';
import { BaseElementProps } from '../../../interface';
import { Header, HeaderProps } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { useGlobalStore } from '../../../store/global';
import { PageViewMap, useContainerStore } from '../store';
import { useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useSettingStore } from '../../setting';
import { MessageRoot } from '../../../components/ui/message';
import { MusicOrderModal } from '../../musicOrderList';
import { MusicFormModal } from '../../music';
import { PlayerForMobile } from '../../player';

export interface MobileContainerProps extends BaseElementProps {
  header?: React.ReactNode;
  headerProps?: HeaderProps;
}

export function MobileContainer({ className, style, header, headerProps }: MobileContainerProps) {
  const theme = useGlobalStore(useShallow((state) => state.theme));
  const settingLoad = useSettingStore(useShallow((state) => state.load));

  useEffect(() => {
    settingLoad();
  }, []);
  return (
    <div className={cls(styles.container, `${UIPrefix}-container`, className, theme)} style={style}>
      <MessageRoot />
      <main className={styles.main}>
        {/* <Sidebar /> */}
        <ContainerContent />
      </main>
      <PlayerForMobile />
      <MusicOrderModal />
      <MusicFormModal />
    </div>
  );
}

function ContainerContent() {
  const { active, props } = useContainerStore(
    useShallow((state) => ({ active: state.active, props: state.props })),
  );
  const component = useMemo(() => {
    const View = PageViewMap.get(active)?.Component;
    const commonProps = PageViewMap.get(active)?.props as any;
    if (!View) return null;
    return <View {...props} {...commonProps} />;
  }, [active]);

  return <div className={styles.content}>{component}</div>;
}
