import { createContext, useContext, useEffect } from 'react';
import styles from './theme/dark.module.scss';
import { useGlobalStore } from './store/global';
import { registerContainerStore } from './modules/container/store';
import { registerSettingStore } from './modules/setting/store';

interface BBMusicAppConfigProps {
  /** 主题 */
  theme?: string;
  /** 缓存方式 */
}

export const AppConfigContext = createContext<BBMusicAppConfigProps>({});
export function useAppConfig() {
  const context = useContext(AppConfigContext);
  return context;
}

export function BBMusicApp({
  theme = styles.dark,
  children,
}: React.PropsWithChildren<BBMusicAppConfigProps>) {
  const globalStore = useGlobalStore();

  // 注册容器 store 这个必须放在其他 store 前注册
  registerContainerStore();
  registerSettingStore();

  useEffect(() => {
    globalStore.setState({ theme });
  }, [theme]);

  return <>{children}</>;
}
