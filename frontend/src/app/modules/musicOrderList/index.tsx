/**
 * 歌单列表
 */
import { MusicMenu, Plus, UpdateRotation } from '@icon-park/react';
import { useEffect } from 'react';
import { api } from '@/app/api';
import { Modal } from '@/app/components/ui/modal';
import { FormItem } from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import {
  useMusicOrderFormModalStore,
  useUserLocalMusicOrderStore,
  useUserRemoteMusicOrderStore,
} from './store';
import { useShallow } from 'zustand/react/shallow';
import { MusicOrderItem } from '@/app/api/music';
import { useSettingStore } from '../setting/store';
import { PageView, openPage } from '../container/store';
import { ContextMenu } from '@/app/components/ui/contextMenu';
import { usePlayerStore } from '../player/store';
import { message } from '@/app/components/ui/message';

export * from './origin';

export interface MusicOrderListProps {}

// 本地歌单
export function LocalMusicOrder() {
  const store = useUserLocalMusicOrderStore(
    useShallow((state) => ({ load: state.load, list: state.list }))
  );
  const modalStore = useMusicOrderFormModalStore();
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
              modalStore.openHandler(null, (value) => {
                return api.userLocalMusicOrder.create(value).then((res) => {
                  store.load();
                });
              });
            }}
          />
        }
      >
        本地歌单
      </SubTitle>
      <MusicOrderList
        list={store.list}
        type='local'
      />
      <MusicOrderFormModal />
    </>
  );
}

// 远程歌单
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
                <UpdateRotation
                  className='ui-icon'
                  title='同步至本地'
                  onClick={() => {}}
                />
              }
            >
              远程-{m.name}
            </SubTitle>
            <MusicOrderList
              list={m.list}
              type='remote'
              remoteName={m.name}
            />
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

export function MusicOrderList({
  list,
  type,
  remoteName,
}: {
  list: MusicOrderItem[];
  type: 'local' | 'remote';
  remoteName?: string;
}) {
  const player = usePlayerStore();
  const userLocalMusicOrderStore = useUserLocalMusicOrderStore();
  const userRemoteMusicOrderStore = useUserRemoteMusicOrderStore();
  const modalStore = useMusicOrderFormModalStore();
  const setting = useSettingStore();
  const origin = api.userRemoteMusicOrder.find((u) => u.name === remoteName);
  const config = setting.userMusicOrderOrigin.find((u) => u.name === remoteName)?.config;

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
                  if (type === 'local') {
                    modalStore.openHandler(item, (value) => {
                      const id = value.id;
                      if (id) {
                        return api.userLocalMusicOrder.update({ ...value, id }).then((res) => {
                          userLocalMusicOrderStore.load();
                        });
                      } else {
                        console.error('id为空');
                        return Promise.reject('id为空');
                      }
                    });
                  }
                  if (type === 'remote') {
                    modalStore.openHandler(item, (value) => {
                      const id = value.id;

                      if (id && origin) {
                        return origin.action.update({ ...value, id }, config).then((res) => {
                          userRemoteMusicOrderStore.load();
                        });
                      } else {
                        console.error('id为空');
                        return Promise.reject('id为空');
                      }
                    });
                  }
                },
              },
              {
                label: '删除',
                key: '删除',
                onClick: () => {
                  console.log(type);
                  if (type === 'local') {
                    api.userLocalMusicOrder.delete(item).then((res) => {
                      userLocalMusicOrderStore.load();
                    });
                  }
                  if (type === 'remote') {
                    origin?.action.delete({ ...item }, config).then((res) => {
                      userRemoteMusicOrderStore.load();
                    });
                  }
                },
              },
              {
                type: 'divider',
                key: 'divider2',
                hide: type === 'remote',
              },
              {
                label: '同步到远端',
                key: '同步到远端',
                hide: type === 'remote',
                children: api.userRemoteMusicOrder.map((r) => {
                  return {
                    label: r.name,
                    key: r.name,
                    onClick: () => {
                      // 看远端有没有这个歌单，只匹配歌单名称，宁多勿少
                      const remote = userRemoteMusicOrderStore.list.find((l) => l.name === r.name);
                      const { config } =
                        setting.userMusicOrderOrigin.find((u) => u.name === r.name) || {};
                      const server = api.userRemoteMusicOrder.find((r) => r.name === r.name);
                      if (!remote || !config || !server) return;
                      // 没有则创建
                      if (!remote.list.find((l) => l.name === item.name)) {
                        server.action.create(item, config).then(() => {
                          userRemoteMusicOrderStore.load();
                        });
                      }
                    },
                  };
                }),
              },
            ]}
            tag='li'
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