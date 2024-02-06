import PageTitle from '@/components/PageTitle';
import { useLocalMusicOrder } from './store/localMusicOrder';
import styles from './index.module.scss';
import { Modal } from '@/components/Modal';
import { useState } from 'react';
import { FormItem } from '@/components/Form';
import { router } from '@/router';
import { MusicOrderItem } from '@/interface';
import { musicOrderDetailStore } from '../musicOrderDetail/store';
import { toMusicOrderDetail } from '@/utils';

export default function MyMusicList() {
  return (
    <div
      className={styles.musicOrder}
      style={{ width: '100%' }}
    >
      <PageTitle>我的歌单</PageTitle>
      <LocalMusicOrder></LocalMusicOrder>
    </div>
  );
}

class FormModal {
  open = false;
  values = {
    id: '',
    name: '',
    desc: '',
  };
}

export function LocalMusicOrder() {
  const localMusicOrder = useLocalMusicOrder();
  const [formModal, setFormModal] = useState(new FormModal());
  return (
    <>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.title}>本地歌单</div>
          <div className={styles.operate}>
            <button
              onClick={() => {
                setFormModal({
                  ...new FormModal(),
                  open: true,
                });
              }}
            >
              创建歌单
            </button>
          </div>
        </div>
        <div className={styles.cardBody}>
          {localMusicOrder.list.map((item) => {
            return (
              <div
                className={styles.musicOrderItem}
                key={item.id}
                onClick={() => {
                  toMusicOrderDetail(item);
                }}
              >
                <div className={styles.info}>
                  <div className={styles.name}>{item.name}</div>
                  <div className={styles.desc}>{item.desc}</div>
                </div>
                <div className={styles.operate}>
                  <span>播放</span>
                  <span>删除</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Modal
        title='这是标题'
        width={400}
        open={formModal.open}
        onClose={() => {
          setFormModal(new FormModal());
        }}
        onOk={async () => {
          if (formModal.values.id) {
            localMusicOrder.update(formModal.values.id, {
              name: formModal.values.name,
              desc: formModal.values.desc,
            });
          } else {
            localMusicOrder.create({
              name: formModal.values.name,
              desc: formModal.values.desc,
            });
          }
        }}
      >
        <FormItem label='歌单名称'>
          <input
            type='text'
            value={formModal.values.name}
            onChange={(e) => {
              setFormModal((s) => ({
                ...s,
                values: {
                  ...s.values,
                  name: e.target.value,
                },
              }));
            }}
          />
        </FormItem>
        <FormItem label='歌单描述'>
          <textarea
            value={formModal.values.desc}
            onChange={(e) => {
              setFormModal((s) => ({
                ...s,
                values: {
                  ...s.values,
                  desc: e.target.value,
                },
              }));
            }}
          />
        </FormItem>
      </Modal>
    </>
  );
}
