/** 适用于移动设备的 APP 容器 */
import { cls } from '../../../utils';
import styles from './index.module.scss';
import { UIPrefix } from '../../../consts';
import { BaseElementProps } from '../../../interface';
import { useGlobalStore } from '../../../store/global';
import { PageView, useContainerStore } from '../store';
import { useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { SettingForMobile, useSettingStore } from '../../setting';
import { MessageRoot, setMobileEnv } from '../../../components';
import { MusicOrderFormMobile, MusicOrderModal } from '../../musicOrderList';
import { MusicFormModal } from '../../music';
import { PlayerForMobile } from '../../player';
import { OpenMusicOrderProps, OpenMusicOrderViewForMobile } from '../../openMusicOrder';
import { MusicOrderDetailForMobile, MusicOrderDetailProps } from '../../musicOrderDetail';
import { SearchForMobile, SearchProps } from '../../search';
import { SettingProps } from '../../setting';
import { Header } from './components/Header';

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
      Component: OpenMusicOrderViewForMobile,
      label: '广场',
      props: {
        gotoMusicOrderDetail,
      },
    },
  ],
  [
    PageView.UserMusicOrder,
    {
      Component: MusicOrderFormMobile,
      label: '广场',
      props: {
        gotoMusicOrderDetail,
      },
    },
  ],
  [
    PageView.MusicOrderDetail,
    {
      Component: MusicOrderDetailForMobile,
      label: '歌单详情',
    },
  ],
  [
    PageView.Search,
    {
      Component: SearchForMobile,
      label: '搜索',
      props: {
        gotoMusicOrderDetail,
      },
    },
  ],
  [
    PageView.Setting,
    {
      Component: SettingForMobile,
      label: '设置',
    },
  ],
]);

export interface MobileContainerProps extends BaseElementProps {}

export function MobileContainer({ className, style }: MobileContainerProps) {
  const theme = useGlobalStore(useShallow((state) => state.theme));
  const settingLoad = useSettingStore(useShallow((state) => state.load));

  useEffect(() => {
    settingLoad();
    setMobileEnv(true);
  }, []);
  return (
    <div className={cls(styles.container, `${UIPrefix}-container`, className, theme)} style={style}>
      <Header openPage={openPage} />
      <ContainerContent />
      <PlayerForMobile />
      <MusicOrderModal />
      <MessageRoot />
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

  return <div className={styles.main}>{component}</div>;
}
