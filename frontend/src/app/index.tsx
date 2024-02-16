import { useEffect } from 'react';
import styles from './theme/dark.module.scss';
import { GlobalStoreState, useGlobalStore } from './store/global';
import { Api, registerApiInstance } from './api';
import { registerPlayerStore } from './modules/player/store';

export interface BBMusicAppConfigProps extends GlobalStoreState {
  /** api */
  apiInstance: Api;
}

export function BBMusicApp({
  children,
  theme = styles.dark,
  apiInstance,
}: React.PropsWithChildren<BBMusicAppConfigProps>) {
  // 这个在 store 注册之前注册
  registerApiInstance(apiInstance);
  registerPlayerStore();
  const globalStore = useGlobalStore();

  useEffect(() => {
    console.log('BBMusicApp Start');
    globalStore.setState({ theme });
  }, [theme]);

  return <>{children}</>;
}
