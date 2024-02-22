/**
 * 歌单列表
 */
import { MusicMenu, Plus } from '@icon-park/react';
import { useEffect } from 'react';
import { api } from '@/app/api';
import { Modal } from '@/app/components/ui/modal';
import { FormItem } from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import {
  useMusicOrderCollectModalStore,
  useMusicOrderFormModalStore,
  useUserLocalMusicOrderStore,
  useUserRemoteMusicOrderStore,
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

export * from './origin';
export * from './store';

export interface MusicOrderListProps {
  gotoMusicOrderDetail: ListProps['gotoMusicOrderDetail'];
}

// 本地歌单
export function LocalMusicOrder({ gotoMusicOrderDetail }: MusicOrderListProps) {
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
        gotoMusicOrderDetail={gotoMusicOrderDetail}
      />
      <MusicOrderFormModal />
    </>
  );
}

// 远程歌单
export function RemoteMusicOrder({ gotoMusicOrderDetail }: MusicOrderListProps) {
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
            // extra={
            //   <UpdateRotation
            //     className='ui-icon'
            //     title='同步至本地'
            //     onClick={() => {}}
            //   />
            // }
            >
              远程-{m.name}
            </SubTitle>
            <MusicOrderList
              list={m.list}
              type='remote'
              remoteName={m.name}
              gotoMusicOrderDetail={gotoMusicOrderDetail}
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

interface ListProps {
  list: MusicOrderItem[];
  type: 'local' | 'remote';
  remoteName?: string;
  gotoMusicOrderDetail: (opt: MusicOrderDetailProps) => void;
}

export function MusicOrderList({ list, type, remoteName, gotoMusicOrderDetail }: ListProps) {
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
                      message.success('同步中');
                      // 看远端有没有这个歌单，只匹配歌单名称，宁多勿少
                      const remote = userRemoteMusicOrderStore.list.find((l) => l.name === r.name);
                      const { config } =
                        setting.userMusicOrderOrigin.find((u) => u.name === r.name) || {};
                      const server = api.userRemoteMusicOrder.find((r) => r.name === r.name);
                      if (!remote || !config || !server) return;

                      const remoteCurrent = remote.list.find((l) => l.name === item.name);
                      if (!remoteCurrent) {
                        // 没有则创建
                        server.action
                          .create(item, config)
                          .then(() => {
                            message.success('同步成功');
                            userRemoteMusicOrderStore.load();
                          })
                          .finally(() => {
                            message.error('同步失败');
                          });
                      } else {
                        // 有则合并（不会删除）
                        const ms = item.musicList?.filter((m) => {
                          return !remoteCurrent.musicList?.find((r) => r.name === m.name);
                        });
                        if (ms?.length) {
                          server.action
                            .appendMusic(remoteCurrent.id, ms, config)
                            .then(() => {
                              message.success('同步成功');
                              userRemoteMusicOrderStore.load();
                            })
                            .finally(() => {
                              message.error('同步失败');
                            });
                        }
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
              gotoMusicOrderDetail({ data: item, canEditMusic: true, remoteName });
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
  const localStore = useUserLocalMusicOrderStore(
    useShallow((state) => ({ load: state.load, list: state.list }))
  );
  const remoteStore = useUserRemoteMusicOrderStore(
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
        <div className={styles.MusicOrderSubTitle}>本地歌单</div>
        <div>
          {localStore.list.map((item) => {
            return (
              <CollectItem
                key={item.id}
                data={item}
              />
            );
          })}
        </div>
        <br />
        <div className={styles.MusicOrderSubTitle}>远程歌单</div>
        <div>
          {remoteStore.list.map((r) => {
            return (
              <div key={r.name}>
                {r.list.map((item) => {
                  return (
                    <CollectItem
                      key={item.id}
                      data={item}
                      remoteName={r.name}
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

function CollectItem({ data, remoteName }: { data: MusicOrderItem; remoteName?: string }) {
  const store = useMusicOrderCollectModalStore();
  const setting = useSettingStore();
  const localStore = useUserLocalMusicOrderStore(
    useShallow((state) => ({ load: state.load, list: state.list }))
  );
  const remoteStore = useUserRemoteMusicOrderStore(
    useShallow((state) => ({ load: state.load, list: state.list }))
  );
  const origin = api.userRemoteMusicOrder.find((u) => u.name === remoteName);
  const config = setting.userMusicOrderOrigin.find((u) => u.name === remoteName)?.config;

  return (
    <div
      className={styles.MusicOrderItem}
      onClick={() => {
        store.close();
        if (!remoteName) {
          // 本地歌单
          api.userLocalMusicOrder.appendMusic(data.id, store.musicList).then(() => {
            localStore.load();
            message.success('已添加');
          });
        } else {
          // 远程歌单
          origin?.action.appendMusic(data.id, store.musicList, config).then(() => {
            remoteStore.load();
            message.success('已添加');
          });
        }
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
