import SearchForm from './components/SearchForm';
import SearchItem from './components/SearchItem';
import { useSearchStore } from './store';
import styles from './index.module.scss';

const hideTypes = ['ketang'];

export default function Search() {
  const store = useSearchStore();

  return (
    <>
      <SearchForm />
      <div className={styles.searchList}>
        {store.data.map((item) => {
          if (hideTypes.includes(item.type)) return null;
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
