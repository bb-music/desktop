import { Input } from '@/app/components/ui/input';

import { useMusicFormModalStore } from './store';
import { useUserLocalMusicOrderStore, useUserRemoteMusicOrderStore } from '../musicOrderList';
import { api } from '@/app/api';
import { Modal } from '@/app/components/ui/modal';
import { FormItem } from '@/app/components/ui/form';
import { useSettingStore } from '../setting';
import { message } from '@/app/components/ui/message';

export function MusicFormModal() {
  const store = useMusicFormModalStore();
  const localStore = useUserLocalMusicOrderStore();
  const remoteStore = useUserRemoteMusicOrderStore();
  const setting = useSettingStore();
  const origin = api.userRemoteMusicOrder.find((u) => u.name === store.remoteName);
  const config = setting.userMusicOrderOrigin.find((u) => u.name === store.remoteName)?.config;
  const musicOrderId = store.musicOrderId;
  const music = store.music;
  if (!musicOrderId || !music) return null;
  return (
    <Modal
      title='修改音乐信息'
      open={store.open}
      onOk={() => {
        const newData = { ...music, name: store.form.name };
        if (!store.remoteName) {
          // 本地歌单
          api.userLocalMusicOrder.updateMusic(musicOrderId, newData).then(() => {
            localStore.load();
            message.success('已修改');
          });
        } else {
          // 远程歌单
          origin?.action.updateMusic(musicOrderId, newData, config).then(() => {
            remoteStore.load();
            message.success('已修改');
          });
        }
      }}
      onClose={store.close}
    >
      <FormItem label='名称'>
        <Input
          value={store.form.name}
          onChange={(e) => {
            store.setForm({
              name: e.target.value.trim(),
            });
          }}
        />
      </FormItem>
    </Modal>
  );
}
