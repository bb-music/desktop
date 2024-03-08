import { useEffect, useState } from 'react';
import { MusicOrderDetailStoreState, useMusicOrderDetailStore } from './store';
import { useUserMusicOrderStore } from '../musicOrderList';
import { useShallow } from 'zustand/react/shallow';

export type MusicOrderDetailProps = Partial<MusicOrderDetailStoreState>;

export function useMusicOrderDetail() {
  const store = useMusicOrderDetailStore(
    useShallow((s) => ({
      data: s.data,
      canEditMusic: s.canEditMusic,
      originName: s.originName,
    })),
  );
  const [data, setData] = useState(store.data);
  const musicOrderList = useUserMusicOrderStore(useShallow((s) => s.list));
  const [searchKeyword, setSearchKeyword] = useState('');
  useEffect(() => {
    if (store.canEditMusic) {
      const r = musicOrderList
        .find((l) => l.name === store.originName)
        ?.list.find((l) => l.id === store.data?.id);
      if (r) {
        setData(r);
      }
    }
  }, [store.canEditMusic, store.data, musicOrderList]);
  return {
    searchKeyword,
    setSearchKeyword,
    data,
    canEditMusic: store.canEditMusic,
    originName: store.originName,
  };
}
