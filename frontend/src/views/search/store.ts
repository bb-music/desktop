import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { bb_client } from '@wails/go/models';
import { Search } from '@wails/go/app/App';

interface SearchParams {
  keyword: string;
  page: number;
}

interface SearchStoreState {
  params: SearchParams;
  data: bb_client.SearchResultItem[];
  loading: boolean;
}
interface SearchStoreHandler {
  setParams: (params: Partial<SearchParams>) => void;
  run: () => Promise<bb_client.SearchResponse>;
}

type SearchStore = SearchStoreState & SearchStoreHandler;

export const searchStore = create(
  persist<SearchStore>(
    (set, get) => {
      return {
        params: {
          keyword: '',
          page: 1,
        },
        data: [],
        loading: false,
        run: async () => {
          const params = get().params;
          set({
            loading: true,
          });
          try {
            const res = await Search({
              keyword: params.keyword,
              page: params.page + '',
            });
            set({
              data: res.result,
              loading: false,
            });
            return res;
          } catch (e) {
            set({
              loading: false,
            });
            return Promise.reject(e);
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
    },
    {
      name: 'search-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useSearchStore = searchStore;
