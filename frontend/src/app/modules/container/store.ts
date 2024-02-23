import { create } from 'zustand';
import { OpenMusicOrder, OpenMusicOrderProps } from '../openMusicOrder';
import { MusicOrderDetail, MusicOrderDetailProps } from '../musicOrderDetail';
import { Search, SearchProps } from '../search';
import { Setting, SettingProps } from '../setting';
import { musicOrderDetailStore } from '../musicOrderDetail/store';

export const enum PageView {
  OpenMusicOrder = 'OpenMusicOrder', // 广场
  MusicOrderDetail = 'MusicOrderDetail', // 歌单详情
  Search = 'Search', // 搜索
  Setting = 'Setting', // 设置
}

const gotoMusicOrderDetail = (props: OpenMusicOrderProps) => {
  openPage(PageView.MusicOrderDetail, props);
};

export const PageViewMap = new Map([
  [
    PageView.OpenMusicOrder,
    {
      Component: OpenMusicOrder,
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

type PageViewProps = OpenMusicOrderProps | MusicOrderDetailProps | SearchProps | SettingProps;

interface ContainerStoreState {
  /** 当前展示的页面视图 */
  active: PageView;
  /** 页面视图的props */
  props?: PageViewProps;
}
interface ContainerStoreHandler {
  setActive: (active: PageView, props?: PageViewProps) => void;
}

type ContainerStore = ContainerStoreState & ContainerStoreHandler;

export const useContainerStore = create<ContainerStore>()((set, get) => {
  return {
    active: PageView.OpenMusicOrder,
    setActive: (active, props) => {
      if (active === PageView.MusicOrderDetail) {
        const { data, canEditMusic, originName } = (props as MusicOrderDetailProps) || {};
        musicOrderDetailStore.setState({
          data,
          canEditMusic,
          originName,
        });
      }
      set({ active, props });
    },
  };
});

/** 切换视图 */

export function openPage(page: PageView, props?: PageViewProps) {
  useContainerStore.getState().setActive(page, props);
}
