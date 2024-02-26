/**
 * 歌单列表
 */
import { MusicMenu, Plus } from '@icon-park/react';
import { useEffect } from 'react';
import { Modal } from '@/app/components/ui/modal';
import { FormItem } from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import {
  useMusicOrderCollectModalStore,
  useMusicOrderFormModalStore,
  useUserMusicOrderStore,
} from './store';
import { useShallow } from 'zustand/react/shallow';
import { MusicOrderItem } from '@/app/api/music';
import { useSettingStore } from '../setting';
import { ContextMenu } from '@/app/components/ui/contextMenu';
import { usePlayerStore } from '../player';
import { message } from '@/app/components/ui/message';
import styles from './index.module.scss';
import { Image } from '@/app/components/ui/image';
import { MusicOrderDetailProps } from '../musicOrderDetail';
import { getMusicOrder } from '@/app/utils';

export * from './origin';
export * from './store';

export interface MusicOrderListProps {
  gotoMusicOrderDetail: ListProps['gotoMusicOrderDetail'];
}

// 歌单
export function MusicOrder({ gotoMusicOrderDetail }: MusicOrderListProps) {
  const store = useUserMusicOrderStore(
    useShallow((state) => ({ load: state.load, list: state.list }))
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
                  className='ui-icon'
                  title='创建歌单'
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

interface ListProps {
  list: MusicOrderItem[];
  originName?: string;
  gotoMusicOrderDetail: (opt: MusicOrderDetailProps) => void;
}

export function MusicOrderList({ list, originName, gotoMusicOrderDetail }: ListProps) {
  const player = usePlayerStore();
  const userMusicOrderStore = useUserMusicOrderStore();
  const modalStore = useMusicOrderFormModalStore();
  const origin = getMusicOrder(originName || '');

  return (
    <ul className='item-list'>
      {list.map((item) => {
        return (
          <ContextMenu
            items={[
              {
                label: '播放全部',
                key: '播放全部',
                onClick: () => {
                  player.clearPlayerList();
                  player.addPlayerList(item.musicList || []);
                  player.play();
                },
              },
              {
                label: '追加到播放列表',
                key: '追加到播放列表',
                onClick: () => {
                  player.addPlayerList(item.musicList || []);
                },
              },
              {
                label: '显示',
                key: '显示',
                onClick() {
                  message.loading('加载中');
                },
              },
              {
                type: 'divider',
                key: 'divider1',
              },
              {
                label: '编辑',
                key: '2',
                onClick: () => {
                  modalStore.openHandler(item, (value) => {
                    const id = value.id;
                    if (id && origin) {
                      return origin.action.update({ ...value, id }).then((res) => {
                        userMusicOrderStore.load();
                      });
                    } else {
                      console.error('id为空');
                      return Promise.reject('id为空');
                    }
                  });
                },
              },
              {
                label: '删除',
                key: '删除',
                onClick: () => {
                  origin?.action.delete({ ...item }).then((res) => {
                    userMusicOrderStore.load();
                  });
                },
              },
            ]}
            tag='li'
            className='item'
            key={item.id}
            onClick={() => {
              gotoMusicOrderDetail({ data: item, canEditMusic: true, originName });
            }}
          >
            <MusicMenu
              className='ui-icon'
              strokeWidth={3}
            />
            <span className='name'>{item.name}</span>
          </ContextMenu>
        );
      })}
    </ul>
  );
}

export function MusicOrderFormModal() {
  const store = useMusicOrderFormModalStore();

  return (
    <Modal
      title='创建歌单'
      open={store.open}
      onOk={() => {
        store.onOk?.(store.form);
      }}
      onClose={() => {
        store.closeHandler();
      }}
    >
      <FormItem label='名称'>
        <Input
          value={store.form.name}
          onChange={(e) => {
            store.setFormValue({
              name: e.target.value.trim(),
            });
          }}
        />
      </FormItem>
      <FormItem label='描述'>
        <Input
          value={store.form.desc}
          onChange={(e) => {
            store.setFormValue({
              desc: e.target.value.trim(),
            });
          }}
        />
      </FormItem>
    </Modal>
  );
}

export function MusicOrderModal() {
  const musicOrderStore = useUserMusicOrderStore(
    useShallow((state) => ({ load: state.load, list: state.list }))
  );
  const store = useMusicOrderCollectModalStore();

  return (
    <Modal
      title='收藏到歌单'
      open={store.open}
      onClose={() => {
        store.close();
      }}
      footer={<></>}
    >
      <div className={styles.MusicOrderList}>
        <div>
          {musicOrderStore.list.map((r) => {
            return (
              <div key={r.name}>
                {r.list.map((item) => {
                  return (
                    <CollectItem
                      key={item.id}
                      data={item}
                      originName={r.name}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}

function CollectItem({ data, originName }: { data: MusicOrderItem; originName?: string }) {
  const store = useMusicOrderCollectModalStore();
  const musicOrderStore = useUserMusicOrderStore(
    useShallow((state) => ({ load: state.load, list: state.list }))
  );
  const origin = getMusicOrder(originName || '');

  return (
    <div
      className={styles.MusicOrderItem}
      onClick={() => {
        store.close();
        origin?.action.appendMusic(data.id, store.musicList).then(() => {
          musicOrderStore.load();
          message.success('已添加');
        });
      }}
    >
      <Image
        src={data.cover}
        className={styles.cover}
        mode='cover'
      />
      <div className={styles.info}>
        <div className={styles.name}>{data.name}</div>
        <div className={styles.total}>{data.musicList?.length}首音乐</div>
      </div>
    </div>
  );
}
