/**
 * 设置页 移动端
 */
import styles from './index.module.scss';
import { useEffect } from 'react';
import { useSettingStore } from './store';
import { MainSetting, ServiceSetting, OpenSetting, MusicOrderSetting } from './common';

export function SettingForMobile() {
  const store = useSettingStore();
  useEffect(() => {
    store.load();
  }, []);
  return (
    <div className={styles.ContainerForMobile} style={{ '--input-default-width': '100%' } as any}>
      <MainSetting />
      <ServiceSetting />
      <OpenSetting />
      <MusicOrderSetting />
    </div>
  );
}
