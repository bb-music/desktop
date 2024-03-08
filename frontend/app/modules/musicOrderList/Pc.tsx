import { useShallow } from 'zustand/react/shallow';
import { MusicOrderFormModal, MusicOrderList, MusicOrderListProps, SubTitle } from './common';
import { useMusicOrderFormModalStore, useUserMusicOrderStore } from './store';
import { useEffect } from 'react';
import { Plus } from '@icon-park/react';
import { getMusicOrder } from '../../utils';

// 歌单
export function MusicOrder({ gotoMusicOrderDetail }: MusicOrderListProps) {
  const store = useUserMusicOrderStore(
    useShallow((state) => ({ load: state.load, list: state.list })),
  );
  useEffect(() => {
    store.load();
  }, []);
  const modalStore = useMusicOrderFormModalStore();

  return (
    <>
      {store.list.map((m) => {
        return (
          <div key={m.name}>
            <SubTitle
              extra={
                <Plus
                  className="ui-icon"
                  title="创建歌单"
                  onClick={() => {
                    const origin = getMusicOrder(m.name);
                    modalStore.openHandler(null, async (value) => {
                      await origin?.action.create(value).then((res) => {
                        store.load();
                      });
                    });
                  }}
                />
              }
            >
              {m.cname}
            </SubTitle>
            <MusicOrderList
              list={m.list}
              originName={m.name}
              gotoMusicOrderDetail={gotoMusicOrderDetail}
            />
          </div>
        );
      })}
      <MusicOrderFormModal />
    </>
  );
}
