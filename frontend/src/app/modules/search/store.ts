import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SearchItem, SearchParams } from '@/app/api/search';
import { api } from '@/app/api';

interface SearchStoreState {
  params: SearchParams;
  data: SearchItem[];
  loading: boolean;
}
interface SearchStoreHandler {
  setParams: (params: Partial<SearchParams>) => void;
  load: () => Promise<void>;
}

type SearchStore = SearchStoreState & SearchStoreHandler;

export const searchStore = create<SearchStore>()((set, get) => {
  return {
    params: {
      keyword: '',
      current: 1,
    },
    data: [],
    loading: false,
    load: async () => {
      const params = get().params;
      set({
        loading: true,
      });
      try {
        const res = await api.search.getList(params);
        console.log('res: ', res);
        set({
          data: res.list,
          loading: false,
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
  };
});

export const useSearchStore = searchStore;
