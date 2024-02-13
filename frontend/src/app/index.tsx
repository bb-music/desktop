import { useEffect } from 'react';
import styles from './theme/dark.module.scss';
import { GlobalStoreState, useGlobalStore } from './store/global';
import { StateStorage } from 'zustand/middleware';
import { Api, registerApiInstance } from './api';
import { registerPlayerStore } from './modules/player/store';

export interface BBMusicAppConfigProps extends GlobalStoreState {
  /** api */
  apiInstance: Api;
  /** 缓存 */
  cacheStorage: StateStorage;
}

export function BBMusicApp({
  children,
  theme = styles.dark,
  apiInstance,
  cacheStorage,
}: React.PropsWithChildren<BBMusicAppConfigProps>) {
  registerApiInstance(apiInstance);
  registerPlayerStore(cacheStorage);
  const globalStore = useGlobalStore();

  useEffect(() => {
    console.log('BBMusicApp Start');
    globalStore.setState({ theme });
  }, [theme]);

  return <>{children}</>;
}
