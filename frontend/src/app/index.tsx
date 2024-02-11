import { useEffect } from 'react';
import styles from './theme/dark.module.scss';
import { GlobalStoreState, useGlobalStore } from './store/global';
import { registerContainerStore } from './modules/container/store';
import { registerSettingStore } from './modules/setting/store';
import { StateStorage } from 'zustand/middleware';
import { Api, registerApiInstance } from './api';

export interface BBMusicAppConfigProps extends GlobalStoreState {
  /** 缓存方式 */
  cacheStorage: StateStorage;
  /** api */
  apiInstance: Api;
}

export function BBMusicApp({
  children,
  theme = styles.dark,
  cacheStorage,
  apiInstance,
}: React.PropsWithChildren<BBMusicAppConfigProps>) {
  registerApiInstance(apiInstance);
  const globalStore = useGlobalStore();

  // 注册容器 store 这个必须放在其他 store 前注册
  registerContainerStore();
  // 设置
  registerSettingStore(cacheStorage);

  useEffect(() => {
    console.log('BBMusicApp Start');
    globalStore.setState({ theme });
  }, [theme]);

  return <>{children}</>;
}
