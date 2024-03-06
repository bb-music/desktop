import { useShallow } from 'zustand/react/shallow';
import { useSearchStore } from '../../store';
import styles from './index.module.scss';
import { CloseOne } from '@icon-park/react';
import { Input, Button } from '../../../../components';
import { useEffect } from 'react';
import { BaseElementProps } from '../../../../interface';
import { cls } from '../../../../utils';

export function SearchHistory() {
  const searchStore = useSearchStore(
    useShallow((s) => ({
      history: s.history,
      setParams: s.setParams,
      load: s.load,
      deleteHistory: s.deleteHistory,
      loadHistoryList: s.loadHistoryList,
    })),
  );
  useEffect(() => {
    searchStore.loadHistoryList();
  }, []);
  return (
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
  );
}

export function SearchInput({ className, style }: BaseElementProps) {
  const searchStore = useSearchStore(
    useShallow((s) => ({
      params: s.params,
      setParams: s.setParams,
      load: s.load,
    })),
  );
  const searchHandler = () => {
    if (!searchStore.params.keyword.trim()) return;
    searchStore.setParams({ current: 1 });
    searchStore.load();
  };

  return (
    <div className={cls(styles.searchForm, className)} style={style}>
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
  );
}
