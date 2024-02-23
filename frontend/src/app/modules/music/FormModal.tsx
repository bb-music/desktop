import { Input } from '@/app/components/ui/input';

import { useMusicFormModalStore } from './store';
import { useUserMusicOrderStore } from '../musicOrderList';
import { api } from '@/app/api';
import { Modal } from '@/app/components/ui/modal';
import { FormItem } from '@/app/components/ui/form';
import { useSettingStore } from '../setting';
import { message } from '@/app/components/ui/message';

export function MusicFormModal() {
  const store = useMusicFormModalStore();
  const musicOrderStore = useUserMusicOrderStore();
  const setting = useSettingStore();
  const origin = api.userMusicOrder.find((u) => u.name === store.originName);
  const config = setting.userMusicOrderOrigin.find((u) => u.name === store.originName)?.config;
  const musicOrderId = store.musicOrderId;
  const music = store.music;
  if (!musicOrderId || !music) return null;
  return (
    <Modal
      title='修改音乐信息'
      open={store.open}
      onOk={() => {
        const newData = { ...music, name: store.form.name };
        // 远程歌单
        origin?.action.updateMusic(musicOrderId, newData, config).then(() => {
          musicOrderStore.load();
          message.success('已修改');
        });
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
