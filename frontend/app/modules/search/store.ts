import { create } from 'zustand';
import { MusicServiceApi, api } from '../../api';
import { JsonCacheStorage } from '../../lib/cacheStorage';
import { getMusicService } from '../../utils';
import { MusicInter } from '../../interface';

const searchHistoryCache = new JsonCacheStorage<string[]>('bb-music-search-history');

interface SearchStoreState {
  params: MusicInter.SearchParams;
  data: MusicInter.SearchItem[];
  loading: boolean;
  history: string[];
  pagination?: {
    total: number;
    pageSize: number;
    current: number;
  };
  originList: Pick<MusicServiceApi, 'name' | 'cname'>[];
  originActive: string;
}
interface SearchStoreHandler {
  init: () => Promise<void>;
  setParams: (params: Partial<MusicInter.SearchParams>) => void;
  load: () => Promise<void>;
  loadHistoryList: () => Promise<void>;
  deleteHistory: (keyword: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  next: () => Promise<void>;
  prev: () => Promise<void>;
}

type SearchStore = SearchStoreState & SearchStoreHandler;

export const searchStore = create<SearchStore>()((set, get) => {
  const loadHistoryList = () => {
    return getHistoryList().then((res) => {
      set({ history: res });
    });
  };

  return {
    params: {
      keyword: '',
      current: 1,
    },
    data: [],
    loading: false,
    history: [],
    originList: [],
    originActive: '',
    init: async () => {
      const originList = api.musicServices.map((m) => ({
        name: m.name,
        cname: m.cname,
      }));
      set({
        originActive: originList[0].name,
        originList,
      });
    },
    load: async () => {
      const params = get().params;
      const origin = get().originActive;
      set({
        loading: true,
      });
      try {
        const service = getMusicService(origin);
        if (!service) return;
        const query = {
          ...params,
          keyword: params.keyword.trim(),
        };
        const res = await service?.action.searchList(query);
        appendHistory(query.keyword).then(() => {
          loadHistoryList();
        });
        set({
          data: res.data,
          loading: false,
          pagination: {
            current: res.current,
            total: res.total,
            pageSize: res.pageSize,
          },
        });
      } catch (e) {
        set({
          loading: false,
        });
      }
    },
    setParams: (params) => {
      const oldParams = get().params;
      set(() => ({
        params: {
          ...oldParams,
          ...params,
        },
      }));
    },
    loadHistoryList: async () => {
      await loadHistoryList();
    },
    deleteHistory: async (name) => {
      const res = await getHistoryList();
      const list = res.filter((r) => r !== name);
      await searchHistoryCache.set(list);
      loadHistoryList();
    },
    clearHistory: async () => {
      await searchHistoryCache.set([]);
      loadHistoryList();
    },
    prev: async () => {
      const store = get();
      if (!store.pagination) return;
      const { current } = store.pagination;
      if (current && current > 1) {
        set({ params: { ...store.params, current: current - 1 } });
        await store.load();
      }
    },
    next: async () => {
      const store = get();
      if (!store.pagination) return;
      const { current, total, pageSize } = store.pagination;
      if (current && current < total / pageSize) {
        set({ params: { ...store.params, current: current + 1 } });
        await store.load();
      }
    },
  };
});

export const useSearchStore = searchStore;

async function getHistoryList() {
  const res = (await searchHistoryCache.get()) || [];
  return res;
}

async function appendHistory(name: string) {
  const res = await getHistoryList();
  let list = res.filter((r) => r !== name);
  list.unshift(name);
  if (list.length > 40) {
    list = list.splice(0, 40);
  }
  await searchHistoryCache.set(list);
}
async function deleteHistory(name: string) {
  const res = await getHistoryList();
  const list = res.filter((r) => r !== name);
  await searchHistoryCache.set(list);
}
