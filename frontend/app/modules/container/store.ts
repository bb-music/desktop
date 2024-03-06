import { create } from 'zustand';
import { MusicOrderDetailProps } from '../musicOrderDetail';
import { musicOrderDetailStore } from '../musicOrderDetail/store';

export const enum PageView {
  OpenMusicOrder = 'OpenMusicOrder', // 歌单广场
  UserMusicOrder = 'UserMusicOrder', // 个人歌单
  MusicOrderDetail = 'MusicOrderDetail', // 歌单详情
  Search = 'Search', // 搜索
  Setting = 'Setting', // 设置
}

type PageViewProps = Record<string, any>;
// OpenMusicOrderProps | MusicOrderDetailProps | SearchProps | SettingProps

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
    active: PageView.Search,
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
