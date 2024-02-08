import { create } from 'zustand';
import { OpenMusicOrder, OpenMusicOrderProps } from '../openMusicOrder';
import { MusicOrderDetail, MusicOrderDetailProps } from '../musicOrderDetail';
import { Search, SearchProps } from '../search';
import { Setting, SettingProps } from '../setting';
import { BaseStore } from '@/app/interface/store';

export const enum PageView {
  OpenMusicOrder = 'OpenMusicOrder', // 广场
  MusicOrderDetail = 'MusicOrderDetail', // 歌单详情
  Search = 'Search', // 搜索
  Setting = 'Setting', // 设置
}

export const PageViewMap = new Map([
  [
    PageView.OpenMusicOrder,
    {
      Component: OpenMusicOrder,
      label: '广场',
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

export let useContainerStore: BaseStore<ContainerStore>;

export function registerContainerStore() {
  if (!useContainerStore) {
    useContainerStore = create<ContainerStore>()((set, get) => {
      return {
        active: PageView.OpenMusicOrder,
        setActive: (active, props) => {
          set({ active, props });
        },
      };
    });
  }
}

/** 切换视图 */
export function openPage(page: PageView.OpenMusicOrder, props?: OpenMusicOrderProps): void;
export function openPage(page: PageView.MusicOrderDetail, props?: MusicOrderDetailProps): void;
export function openPage(page: PageView.Search, props?: SearchProps): void;
export function openPage(page: PageView.Setting, props?: SettingProps): void;
export function openPage(page: PageView, props?: PageViewProps) {
  useContainerStore.getState().setActive(page, props);
}
