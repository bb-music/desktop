import SearchForm from './components/SearchForm';
import SearchItem from './components/SearchItem';
import { useSearchStore } from './store';
import styles from './index.module.scss';

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
      </div>
    </>
  );
}
