/**
 * 设置页
 */
import { Help, Plus } from '@icon-park/react';
import styles from './index.module.scss';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { ReactNode, useEffect, useState } from 'react';
import { useSettingStore } from './store';
import { api } from '@/app/api';
import { Modal } from '@/app/components/ui/modal';
import { userMusicOrderStore } from '../musicOrderList';

export * from './store';

export interface SettingProps {}

export function Setting() {
  const store = useSettingStore();
  useEffect(() => {
    store.load();
  }, []);
  return (
    <div
      className={styles.container}
      style={{ '--input-default-width': '460px' } as any}
    >
      <MainSetting />
      <ServiceSetting />
      <OpenSetting />
      <MusicOrderSetting />
    </div>
  );
}

export function ServiceSetting() {
  const store = useSettingStore();
  return (
    <>
      {api.musicServices.map((service) => {
        const Comp = service.ConfigElement;
        if (!Comp) return null;
        return (
          <div key={service.name}>
            <SubTitle title={`${service.cname} 源设置`} />
            <Comp
              onChange={() => {
                store.load();
              }}
            />
          </div>
        );
      })}
      <div className={styles.divider}></div>
    </>
  );
}

export function MainSetting() {
  const store = useSettingStore();
  if (!api.setting.updateDownloadDir && !store.proxyServerPort) return null;

  return (
    <>
      <SubTitle title='系统设置' />
      {api.setting.updateDownloadDir && (
        <SettingItem label='下载位置'>
          <Input
            value={store.downloadDir}
            disabled
          />
          {api.setting.selectDownloadDir && (
            <Button
              type='link'
              onClick={() => {
                api.setting.selectDownloadDir?.().then((res) => {
                  if (res) {
                    api.setting.updateDownloadDir?.(res).then(() => {
                      store.load();
                    });
                  }
                });
              }}
            >
              更改位置
            </Button>
          )}
        </SettingItem>
      )}
      <SettingItem label='视频代理服务端口'>
        <Input
          style={{ width: 100 }}
          disabled
          value={store.proxyServerPort?.toString() || ''}
        />
      </SettingItem>
      <div className={styles.divider}></div>
    </>
  );
}

class OpenMusicOrderModal {
  open = false;
  value = '';
}
export function OpenSetting() {
  const store = useSettingStore();
  const [modal, setModal] = useState(new OpenMusicOrderModal());

  return (
    <>
      <SubTitle
        title='歌单广场源'
        extra={
          <Button
            type='text'
            onClick={() => {
              setModal({
                ...new OpenMusicOrderModal(),
                open: true,
              });
            }}
          >
            <Plus />
            <span>添加源</span>
          </Button>
        }
      />
      {store.openMusicOrderOrigin.map((item, index) => {
        return (
          <SettingItem
            label='广场源1'
            key={index}
          >
            <Input value={item} />
            <Button type='text'>删除</Button>
          </SettingItem>
        );
      })}
      <div className={styles.divider}></div>
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>添加歌单广场源</span>
            <Help />
          </div>
        }
        open={modal.open}
        onClose={() => {
          setModal(new OpenMusicOrderModal());
        }}
        onOk={async () => {
          const v = modal.value.trim();
          if (v) {
            await api.setting.updateOpenMusicOrderOrigin([...store.openMusicOrderOrigin, v]);
            store.load();
          }
        }}
      >
        <>
          <Input
            placeholder='请输入地址'
            value={modal.value}
            style={{ width: '100%' }}
            onChange={(e) => {
              setModal((s) => ({
                ...s,
                value: e.target.value,
              }));
            }}
          />
        </>
      </Modal>
    </>
  );
}

export function MusicOrderSetting() {
  const store = useSettingStore();

  return (
    <>
      <SubTitle title='歌单同步设置' />
      {api.userMusicOrder.map((m, index) => {
        const Comp = m.ConfigElement;
        if (!Comp) return null;
        return (
          <div key={index}>
            <SubTitle title={<span style={{ color: 'rgb(var(--main-color))' }}>{m.name}</span>} />
            <Comp
              onChange={() => {
                store.load();
                userMusicOrderStore.getState().load();
              }}
            />
          </div>
        );
      })}
    </>
  );
}

interface SettingItemProps {
  label?: React.ReactNode;
  children?: React.ReactNode;
}
export function SettingItem({ label, children }: SettingItemProps) {
  return (
    <div className={styles.settingItem}>
      <label>{label}</label>
      <div className={styles.content}>{children}</div>
    </div>
  );
}

function SubTitle({ title, extra }: { title: ReactNode; extra?: ReactNode }) {
  return (
    <div className={styles.subTitle}>
      <div className={styles.name}>{title}</div>
      <div className={styles.operate}>{extra}</div>
    </div>
  );
}
