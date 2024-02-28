import { useEffect } from 'react';
import styles from './theme/dark.module.scss';
import { GlobalStoreState, useGlobalStore } from './store/global';
import { Api, registerApiInstance } from './api';

export interface BBMusicAppProps extends GlobalStoreState {
  /** api */
  apiInstance: Api;
}

export function BBMusicApp({
  children,
  theme = styles.dark,
  apiInstance,
}: React.PropsWithChildren<BBMusicAppProps>) {
  // 这个在 store 注册之前注册
  registerApiInstance(apiInstance);
  const globalStore = useGlobalStore();

  useEffect(() => {
    console.log('BBMusicApp Start');
    globalStore.setState({ theme });
  }, [theme]);

  useEffect(() => {
    Promise.all(apiInstance.musicServices.map((s) => s.hooks?.init?.())).then(() => {
      console.log('配置初始化完成');
    });
  }, []);

  if (!apiInstance) return null;
  return <>{children}</>;
}
