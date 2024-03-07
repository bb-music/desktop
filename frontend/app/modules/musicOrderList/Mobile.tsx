import { useShallow } from 'zustand/react/shallow';
import { useMusicOrderFormModalStore, useUserMusicOrderStore } from './store';
import { MusicOrderFormModal, MusicOrderItemCard, MusicOrderListProps } from './common';
import { useEffect } from 'react';
import { Plus } from '@icon-park/react';
import { getMusicOrder } from '../../utils';
import styles from './index.module.scss';
import { showActionSheet } from '../../components';
import { usePlayerStore } from '../player';
import { MusicInter } from 'interface';

// 歌单 移动端
export function MusicOrderFormMobile({ gotoMusicOrderDetail }: MusicOrderListProps) {
  const player = usePlayerStore();
  const userMusicOrderStore = useUserMusicOrderStore(
    useShallow((state) => ({ load: state.load, list: state.list })),
  );
  useEffect(() => {
    userMusicOrderStore.load();
  }, []);
  const modalStore = useMusicOrderFormModalStore();

  return (
    <div className={styles.MusicOrderListFormMobile}>
      {userMusicOrderStore.list.map((m) => {
        return (
          <div key={m.name}>
            <div className={styles.OriginHeader}>
              <div>{m.cname}</div>
              <Plus
                className={styles.CreateBtn}
                title="创建歌单"
                onClick={() => {
                  const origin = getMusicOrder(m.name);
                  modalStore.openHandler(null, async (value) => {
                    await origin?.action.create(value).then((res) => {
                      userMusicOrderStore.load();
                    });
                  });
                }}
              />
            </div>
            {m.list.map((item) => {
              return (
                <div className={styles.List}>
                  <MusicOrderItemForMobile
                    data={item}
                    originName={m.name}
                    gotoMusicOrderDetail={gotoMusicOrderDetail}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
      <MusicOrderFormModal />
    </div>
  );
}

export function MusicOrderItemForMobile({
  data,
  originName,
  gotoMusicOrderDetail,
}: {
  data: MusicInter.MusicOrderItem;
  originName?: string;
  gotoMusicOrderDetail: MusicOrderListProps['gotoMusicOrderDetail'];
}) {
  const player = usePlayerStore();
  const userMusicOrderStore = useUserMusicOrderStore(
    useShallow((state) => ({ load: state.load, list: state.list })),
  );
  useEffect(() => {
    userMusicOrderStore.load();
  }, []);
  const modalStore = useMusicOrderFormModalStore();
  const origin = getMusicOrder(originName || '');

  return (
    <MusicOrderItemCard
      data={data}
      onClick={() => {
        showActionSheet({
          cancelText: '取消',
          items: [
            {
              label: '查看详情',
              key: 0,
              onClick: () => {
                gotoMusicOrderDetail({
                  data: data,
                  canEditMusic: true,
                  originName,
                });
              },
            },
            {
              label: '播放全部',
              key: 1,
              onClick: () => {
                player.clearPlayerList();
                player.addPlayerList(data.musicList || []);
                player.play();
              },
            },
            {
              label: '追加到播放列表',
              key: 2,
              onClick: () => {},
            },
            {
              label: '编辑',
              key: 3,
              onClick: () => {
                modalStore.openHandler(data, (value) => {
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
              key: 4,
              onClick: () => {
                origin?.action.delete({ ...data }).then((res) => {
                  userMusicOrderStore.load();
                });
              },
            },
          ],
        });
      }}
    />
  );
}
