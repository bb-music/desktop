/**
 * 歌单列表
 */
import { MusicMenu, Plus } from '@icon-park/react';
import { Modal } from '../../components/ui/modal';
import { FormItem } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import {
  useMusicOrderCollectModalStore,
  useMusicOrderFormModalStore,
  useUserMusicOrderStore,
} from './store';
import { useShallow } from 'zustand/react/shallow';
import { ContextMenu } from '../../components/ui/contextMenu';
import { usePlayerStore } from '../player';
import { message } from '../../components/ui/message';
import styles from './index.module.scss';
import { Image } from '../../components/ui/image';
import { MusicOrderDetailProps } from '../musicOrderDetail';
import { cls, getMusicOrder } from '../../utils';
import { BaseElementProps, MusicInter } from '../../interface';

type MusicOrderItem = MusicInter.MusicOrderItem;

export interface MusicOrderListProps {
  gotoMusicOrderDetail: ListProps['gotoMusicOrderDetail'];
}

export function SubTitle({
  extra,
  children,
}: React.PropsWithChildren<{ extra?: React.ReactNode }>) {
  return (
    <div className="sub-title">
      <div className="name">{children}</div>
      <div className="operate">{extra}</div>
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
    <ul className="item-list">
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
            tag="li"
            className="item"
            key={item.id}
            onClick={() => {
              gotoMusicOrderDetail({ data: item, canEditMusic: true, originName });
            }}
          >
            <MusicMenu className="ui-icon" strokeWidth={3} />
            <span className="name">{item.name}</span>
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
      title="创建歌单"
      open={store.open}
      onOk={() => {
        store.onOk?.(store.form);
      }}
      onClose={() => {
        store.closeHandler();
      }}
    >
      <FormItem label="名称">
        <Input
          value={store.form.name}
          onChange={(e) => {
            store.setFormValue({
              name: e.target.value.trim(),
            });
          }}
        />
      </FormItem>
      <FormItem label="描述">
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
    useShallow((state) => ({ load: state.load, list: state.list })),
  );
  const store = useMusicOrderCollectModalStore();

  return (
    <Modal
      title="收藏到歌单"
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
                  return <CollectItem key={item.id} data={item} originName={r.name} />;
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
    useShallow((state) => ({ load: state.load, list: state.list })),
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
      <Image src={data.cover} className={styles.cover} mode="cover" />
      <div className={styles.info}>
        <div className={styles.name}>{data.name}</div>
        <div className={styles.total}>{data.musicList?.length}首音乐</div>
      </div>
    </div>
  );
}

export function MusicOrderItemCard({
  data,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  data: MusicInter.MusicOrderItem;
  onClick?: () => void;
}) {
  return (
    <div className={cls(styles.MusicOrderItemCard, className)} {...props}>
      <div className={styles.Cover} style={{ backgroundImage: `url(${data.cover})` }}>
        <div>
          <div className={styles.Name}>{data.name}</div>
          {data.musicList?.length && <div className={styles.Total}>{data.musicList?.length}首</div>}
        </div>
      </div>
      <div className={styles.Musics}>
        {data.musicList
          ?.filter((_, i) => i < 3)
          .map((music) => {
            return (
              <div>
                <span>{music.name}</span>
              </div>
            );
          })}
        {!data.musicList?.length && <div>暂无歌曲</div>}
      </div>
    </div>
  );
}
