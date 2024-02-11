/**
 * 设置页
 */
import { Plus } from '@icon-park/react';
import styles from './index.module.scss';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { ReactNode } from 'react';
import { useSettingStore } from './store';
import { api } from '@/app/api';

export interface SettingProps {}

export function Setting() {
  return (
    <div
      className={styles.container}
      style={{ '--input-default-width': '460px' } as any}
    >
      <MainSetting />

      <div className={styles.divider}></div>

      <OpenSetting />

      <div className={styles.divider}></div>

      <OrderSyncSetting />
    </div>
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
                console.log(api);
                api.setting.selectDownloadDir?.().then((res) => {
                  api.setting.updateDownloadDir?.(res).then(() => {
                    store.load();
                  });
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

export function OpenSetting() {
  return (
    <>
      <SubTitle
        title='歌单广场源'
        extra={
          <Button type='text'>
            <Plus />
            <span>添加源</span>
          </Button>
        }
      />
      <SettingItem label='广场源1'>
        <Input value='download_tempdownload_tempdownload_tempdownload_temp' />
        <Button type='text'>删除</Button>
      </SettingItem>
      <SettingItem label='广场源2'>
        <Input value='download_tempdownload_tempdownload_tempdownload_temp' />
        <Button type='text'>删除</Button>
      </SettingItem>
    </>
  );
}

export function OrderSyncSetting() {
  return (
    <>
      <SubTitle title='歌单同步' />
    </>
  );
}

interface SettingItemProps {
  label?: string;
  children?: React.ReactNode;
}
function SettingItem({ label, children }: SettingItemProps) {
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
