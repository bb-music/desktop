/**
 * 设置页
 */
import { Help, Plus } from '@icon-park/react';
import styles from './index.module.scss';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useSettingStore } from './store';
import { api } from '@/app/api';
import { Modal } from '@/app/components/ui/modal';

export * from './store';

export interface SettingProps {}

export function Setting() {
  return (
    <div
      className={styles.container}
      style={{ '--input-default-width': '460px' } as any}
    >
      <MainSetting />

      <div className={styles.divider}></div>

      <ServiceSetting />

      <div className={styles.divider}></div>

      <OpenSetting />

      <div className={styles.divider}></div>

      <OrderSyncSetting />
    </div>
  );
}

export function ServiceSetting() {
  return (
    <>
      {api.musicServices.map((service) => {
        return (
          <div key={service.name}>
            <SubTitle title={`「${service.cname}」源设置`} />
            {service.ConfigElement?.()}
          </div>
        );
      })}
    </>
  );
}

export function MainSetting() {
  const store = useSettingStore();
  const signUpdateButton = (
    <Button
      type='link'
      onClick={() => {
        api.setting.updateSignData().then(() => {
          store.load();
        });
      }}
    >
      刷新
    </Button>
  );
  const spiUpdateButton = (
    <Button
      type='link'
      onClick={() => {
        api.setting.updateSpiData().then(() => {
          store.load();
        });
      }}
    >
      刷新
    </Button>
  );

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
      <SettingItem label='imgKey'>
        <Input
          value={store.signData.imgKey}
          disabled
        />
        {signUpdateButton}
      </SettingItem>
      <SettingItem label='subKey'>
        <Input
          value={store.signData.subKey}
          disabled
        />
        {signUpdateButton}
      </SettingItem>
      <SettingItem label='UUID_V3'>
        <Input
          value={store.spiData.uuid_v3}
          disabled
        />
        {spiUpdateButton}
      </SettingItem>
      <SettingItem label='UUID_V4'>
        <Input
          value={store.spiData.uuid_v4}
          disabled
        />
        {spiUpdateButton}
      </SettingItem>
      <SettingItem label='视频代理服务端口'>
        <Input
          style={{ width: 100 }}
          disabled
          value={store.videoProxyPort?.toString() || ''}
        />
      </SettingItem>
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

export function OrderSyncSetting() {
  const setting = useSettingStore();
  const timerRef = useRef<Record<string, NodeJS.Timeout>>({});
  useEffect(() => {
    setting.load();
  }, []);

  return (
    <>
      <SubTitle title='歌单同步' />
      {api.userMusicOrder.map((m, index) => {
        const Comp = m.ConfigElement;
        if (!Comp) return null;
        const value = setting.userMusicOrderOrigin?.find((u) => u.name === m.name)!;
        return (
          <div key={index}>
            <SubTitle title={<span style={{ color: 'rgb(var(--main-color))' }}>{m.name}</span>} />
            <Comp
              value={value?.config}
              onChange={(value: any) => {
                let newList = setting.userMusicOrderOrigin || [];
                if (newList.find((n) => n.name === m.name)) {
                  newList = setting.userMusicOrderOrigin.map((item) => {
                    if (item.name !== m.name) return item;
                    return {
                      ...item,
                      config: value,
                    };
                  });
                } else {
                  newList.push({
                    name: m.name,
                    config: value,
                  });
                }
                clearTimeout(timerRef.current?.[m.name]);
                if (timerRef.current) {
                  timerRef.current[m.name] = setTimeout(() => {
                    api.setting.updateUserMusicOrderOrigin(newList);
                  }, 500);
                }
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
