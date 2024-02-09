/**
 * 设置页
 */
import { Plus } from '@icon-park/react';
import styles from './index.module.scss';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { ReactNode } from 'react';

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
  return (
    <>
      <SubTitle title='系统设置' />
      <SettingItem label='下载位置'>
        <Input
          value='E:project\bb-music-desktop/download_temp'
          disabled
        />
        <Button type='link'>更改位置</Button>
      </SettingItem>
      <SettingItem label='imgKey'>
        <Input
          value='download_tempdownload_tempdownload_tempdownload_temp'
          disabled
        />
        <Button type='link'>刷新</Button>
      </SettingItem>
      <SettingItem label='subKey'>
        <Input
          value='download_tempdownload_tempdownload_tempdownload_temp'
          disabled
        />
        <Button type='link'>刷新</Button>
      </SettingItem>
      <SettingItem label='视频代理服务端口'>
        <Input
          value='8080'
          style={{ width: 100 }}
          disabled
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
