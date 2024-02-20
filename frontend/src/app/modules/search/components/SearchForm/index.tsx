import { Input } from '@/app/components/ui/input';
import { useSearchStore } from '../../store';
import styles from './index.module.scss';
import { Button } from '@/app/components/ui/button';

export default function SearchForm() {
  const searchStore = useSearchStore();
  const searchHandler = () => {
    if (!searchStore.params.keyword) return;
    searchStore.load();
  };
  return (
    <div className={styles.searchForm}>
      <Input
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
      <Button
        type='primary'
        onClick={searchHandler}
      >
        搜索
      </Button>
    </div>
  );
}
