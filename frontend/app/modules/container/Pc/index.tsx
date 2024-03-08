/** 适用与大屏设备的 APP 容器 */
import { cls } from '../../../utils';
import styles from './index.module.scss';
import { UIPrefix } from '../../../consts';
import { BaseElementProps } from '../../../interface';
import { Header, HeaderProps } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { useGlobalStore } from '../../../store/global';
import { PageView, useContainerStore } from '../store';
import { useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useSettingStore } from '../../setting';
import { Player } from '../../player';
import { MessageRoot } from '../../../components/ui/message';
import { MusicOrderModal } from '../../musicOrderList';
import { MusicFormModal } from '../../music';

import { OpenMusicOrderView, OpenMusicOrderProps } from '../../openMusicOrder';
import { MusicOrderDetail, MusicOrderDetailProps } from '../../musicOrderDetail';
import { Search, SearchProps } from '../../search';
import { Setting, SettingProps } from '../../setting';

type PageViewProps = OpenMusicOrderProps | MusicOrderDetailProps | SearchProps | SettingProps;

const gotoMusicOrderDetail = (props: MusicOrderDetailProps) => {
  openPage(PageView.MusicOrderDetail, props);
};

/** 切换视图 */
function openPage(page: PageView, props?: PageViewProps) {
  useContainerStore.getState().setActive(page, props);
}
const PageViewMap = new Map([
  [
    PageView.OpenMusicOrder,
    {
      Component: OpenMusicOrderView,
      label: '广场',
      props: {
        gotoMusicOrderDetail,
      },
    },
  ],
  [
    PageView.MusicOrderDetail,
    {
      Component: MusicOrderDetail,
      label: '歌单详情',
    },
  ],
  [
    PageView.Search,
    {
      Component: Search,
      label: '搜索',
      props: {
        gotoMusicOrderDetail,
      },
    },
  ],
  [
    PageView.Setting,
    {
      Component: Setting,
      label: '设置',
    },
  ],
]);

export interface PcContainerProps extends BaseElementProps {
  header?: React.ReactNode;
  headerProps?: Omit<HeaderProps, 'openPage'>;
}

export function PcContainer({ className, style, header, headerProps }: PcContainerProps) {
  const theme = useGlobalStore(useShallow((state) => state.theme));
  const settingLoad = useSettingStore(useShallow((state) => state.load));

  useEffect(() => {
    settingLoad();
  }, []);
  return (
    <div className={cls(styles.container, `${UIPrefix}-container`, className, theme)} style={style}>
      <MessageRoot />
      {!header && <Header {...headerProps} openPage={openPage} />}
      <main className={styles.main}>
        <Sidebar
          gotoMusicOrderDetail={(o) => {
            gotoMusicOrderDetail(o);
          }}
        />
        <ContainerContent />
      </main>
      <Player />
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
