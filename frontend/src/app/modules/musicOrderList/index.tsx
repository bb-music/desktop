/**
 * 歌单列表
 */
import { MusicMenu, Plus } from '@icon-park/react';
import { useEffect, useState } from 'react';
import { api } from '@/app/api';
import { Modal } from '@/app/components/ui/modal';
import { FormItem } from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import { useUserLocalMusicOrderStore, useUserRemoteMusicOrderStore } from './store';
import { useShallow } from 'zustand/react/shallow';
import { MusicOrderItem } from '@/app/api/music';
import { useSettingStore } from '../setting/store';
import { PageView, openPage } from '../container/store';

export * from './origin';

export interface MusicOrderListProps {}

class MusicOrderModal {
  open = false;
  form = {
    name: '',
    desc: '',
    cover: '',
  };
}

// 本地歌单
export function LocalMusicOrder() {
  const store = useUserLocalMusicOrderStore(
    useShallow((state) => ({ load: state.load, list: state.list }))
  );
  const [modal, setModal] = useState(new MusicOrderModal());
  useEffect(() => {
    store.load();
  }, []);
  return (
    <>
      <SubTitle
        extra={
          <Plus
            className='ui-icon'
            title='创建歌单'
            onClick={() => {
              setModal({
                ...new MusicOrderModal(),
                open: true,
              });
            }}
          />
        }
      >
        本地歌单
      </SubTitle>
      <MusicOrderList list={store.list} />
      <Modal
        title='创建歌单'
        open={modal.open}
        onOk={() => {
          api.userLocalMusicOrder.create(modal.form).then((res) => {
            console.log('res: ', res);
            store.load();
          });
        }}
        onClose={() => {
          setModal({
            ...new MusicOrderModal(),
          });
        }}
      >
        <FormItem label='名称'>
          <Input
            value={modal.form.name}
            onChange={(e) => {
              setModal((s) => ({
                ...s,
                form: {
                  ...s.form,
                  name: e.target.value.trim(),
                },
              }));
            }}
          />
        </FormItem>
        <FormItem label='描述'>
          <Input
            value={modal.form.desc}
            onChange={(e) => {
              setModal((s) => ({
                ...s,
                form: {
                  ...s.form,
                  desc: e.target.value.trim(),
                },
              }));
            }}
          />
        </FormItem>
      </Modal>
    </>
  );
}

export function RemoteMusicOrder() {
  const setting = useSettingStore(
    useShallow((s) => ({ userMusicOrderOrigin: s.userMusicOrderOrigin }))
  );
  const store = useUserRemoteMusicOrderStore(
    useShallow((state) => ({ load: state.load, list: state.list }))
  );
  useEffect(() => {
    if (setting.userMusicOrderOrigin.length) {
      store.load();
    }
  }, [setting.userMusicOrderOrigin]);
  return (
    <>
      {store.list.map((m) => {
        return (
          <div key={m.name}>
            <SubTitle
              extra={
                <Plus
                  className='ui-icon'
                  title='创建歌单'
                  onClick={() => {}}
                />
              }
            >
              {m.name}
            </SubTitle>
            <MusicOrderList list={m.list} />
          </div>
        );
      })}
    </>
  );
}

export function SubTitle({
  extra,
  children,
}: React.PropsWithChildren<{ extra?: React.ReactNode }>) {
  return (
    <div className='sub-title'>
      <div className='name'>{children}</div>
      <div className='operate'>{extra}</div>
    </div>
  );
}

export function MusicOrderList({ list }: { list: MusicOrderItem[] }) {
  return (
    <ul className='item-list'>
      {list.map((item) => {
        return (
          <li
            className='item'
            key={item.id}
            onClick={() => {
              openPage(PageView.MusicOrderDetail, { data: item });
            }}
          >
            <MusicMenu
              className='ui-icon'
              strokeWidth={3}
            />
            <span className='name'>{item.name}</span>
          </li>
        );
      })}
    </ul>
  );
}
