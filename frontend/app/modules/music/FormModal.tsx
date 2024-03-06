import { Input } from '../../components/ui/input';
import { useMusicFormModalStore } from './store';
import { useUserMusicOrderStore } from '../musicOrderList';
import { Modal } from '../../components/ui/modal';
import { FormItem } from '../../components/ui/form';
import { message } from '../../components/ui/message';
import { getMusicOrder } from '../../utils';

export function MusicFormModal() {
  const store = useMusicFormModalStore();
  const musicOrderStore = useUserMusicOrderStore();
  const musicOrderId = store.musicOrderId;
  const music = store.music;
  if (!musicOrderId || !music) return null;
  return (
    <Modal
      title="修改音乐信息"
      open={store.open}
      onOk={() => {
        const newData = { ...music, name: store.form.name };
        const origin = getMusicOrder(store.originName!);
        // 远程歌单
        origin?.action.updateMusic(musicOrderId, newData).then(() => {
          musicOrderStore.load();
          message.success('已修改');
        });
      }}
      onClose={store.close}
    >
      <FormItem label="名称">
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
