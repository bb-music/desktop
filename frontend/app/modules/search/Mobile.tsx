import SearchForm from './components/SearchForm';
import { SearchItemForMobile } from './components/SearchItem';
import { useSearchStore } from './store';
import styles from './index.module.scss';
import { useEffect } from 'react';
import { SearchProps } from './hooks';

export function SearchForMobile({ gotoMusicOrderDetail }: SearchProps) {
  const store = useSearchStore();
  useEffect(() => {
    store.init();
  }, []);

  return (
    <div className={styles.MobileSearchPage}>
      <SearchForm />
      <div className={styles.searchList}>
        {store.data?.map((item) => {
          return (
            <SearchItemForMobile
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
    </div>
  );
}
