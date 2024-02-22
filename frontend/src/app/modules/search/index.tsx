import SearchForm from './components/SearchForm';
import SearchItem from './components/SearchItem';
import { useSearchStore } from './store';
import styles from './index.module.scss';

export * from './store';
export * from './components/SearchForm';
export * from './components/SearchItem';

export interface SearchProps {}

export function Search() {
  const store = useSearchStore();

  return (
    <>
      <SearchForm />
      <div className={styles.searchList}>
        {store.data?.map((item) => {
          return (
            <SearchItem
              data={item}
              key={item.id}
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
