import { Input, Button } from '../../../../components';
import { useSearchStore } from '../../store';
import styles from '../../index.module.scss';
import { CloseOne } from '@icon-park/react';
import { useEffect } from 'react';

export default function SearchForm({ isMobile }: { siMobile?: boolean }) {
  const searchStore = useSearchStore();
  const searchHandler = () => {
    if (!searchStore.params.keyword.trim()) return;
    searchStore.setParams({ current: 1 });
    searchStore.load();
  };
  useEffect(() => {
    searchStore.loadHistoryList();
  }, []);
  return (
    <>
      <div className={styles.searchForm}>
        <Input
          type="text"
          value={searchStore.params.keyword}
          onChange={(e) => {
            searchStore.setParams({ keyword: e.target.value });
          }}
          placeholder="请输入要搜索的歌曲名称"
          onKeyUp={(e) => {
            if (e.code === 'Enter') {
              searchHandler();
            }
          }}
        />
        <Button type="primary" onClick={searchHandler}>
          搜索
        </Button>
      </div>
      <div className={styles.searchHistory}>
        {searchStore.history.map((item) => {
          return (
            <div
              className={styles.item}
              key={item}
              onClick={() => {
                searchStore.setParams({ keyword: item, current: 1 });
                searchStore.load();
              }}
            >
              <span>{item}</span>
              <span
                className={styles.close}
                onClick={(e) => {
                  e.stopPropagation();
                  searchStore.deleteHistory(item);
                }}
              >
                <CloseOne theme="filled" />
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}
