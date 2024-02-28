import SearchForm from './components/SearchForm';
import SearchItem from './components/SearchItem';
import { useSearchStore } from './store';
import styles from './index.module.scss';
import { MusicOrderDetailProps } from '../musicOrderDetail';
import { useEffect } from 'react';

export * from './store';
export * from './components/SearchForm';
export * from './components/SearchItem';

export interface SearchProps {
  gotoMusicOrderDetail: (opt: MusicOrderDetailProps) => void;
}

export function Search({ gotoMusicOrderDetail }: SearchProps) {
  const store = useSearchStore();

  useEffect(() => {
    store.init();
  }, []);

  return (
    <>
      <SearchForm />
      <div className={styles.searchList}>
        {store.data?.map((item) => {
          return (
            <SearchItem
              data={item}
              key={item.id}
              gotoMusicOrderDetail={gotoMusicOrderDetail}
            />
          );
        })}
        {store.pagination && (
          <div className={styles.pagination}>
            <span
              onClick={() => {
                store.prev();
              }}
            >
              上一页
            </span>
            <span
              onClick={() => {
                store.next();
              }}
            >
              下一页
            </span>
          </div>
        )}
      </div>
    </>
  );
}
