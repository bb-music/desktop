import { useSearchStore } from '../../store';
import styles from './index.module.scss';

export default function SearchForm() {
  const searchStore = useSearchStore();
  const searchHandler = () => {
    if (!searchStore.params.keyword) return;
    searchStore.run();
  };
  return (
    <div className={styles.searchForm}>
      <input
        type='text'
        value={searchStore.params.keyword}
        onChange={(e) => {
          searchStore.setParams({ keyword: e.target.value.trim() });
        }}
        placeholder='请输入要搜索的歌曲名称'
        onKeyUp={(e) => {
          if (e.code === 'Enter') {
            searchHandler();
          }
        }}
      />
      <button onClick={searchHandler}>搜索</button>
    </div>
  );
}
