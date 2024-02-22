import { create } from 'zustand';
import { SearchItem, SearchParams } from '@/app/api/search';
import { api } from '@/app/api';
import { JsonCacheStorage } from '@/app/lib/cacheStorage';

const searchHistoryCache = new JsonCacheStorage<string[]>('bb-music-search-history');

interface SearchStoreState {
  params: SearchParams;
  data: SearchItem[];
  loading: boolean;
  history: string[];
  pagination?: {
    total: number;
    pageSize: number;
    current: number;
  };
}
interface SearchStoreHandler {
  setParams: (params: Partial<SearchParams>) => void;
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
    load: async () => {
      const params = get().params;
      set({
        loading: true,
      });
      try {
        const res = await api.search.getList(params);
        console.log('res: ', res);
        appendHistory(params.keyword).then(() => {
          loadHistoryList();
        });
        set({
          data: res.list,
          loading: false,
          pagination: {
            current: res.current,
            total: res.total,
            pageSize: res.pageSize,
          },
        });
      } catch (e) {
        console.log('e: ', e);
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
