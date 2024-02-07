import { PcContainer, AppContainer } from './modules/container';
import styles from './theme/dark.module.scss';

interface BBMusicAppOptions {
  /** 主题 */
  theme: string;
  /** 缓存方式 */
}

export class BBMusicApp {
  constructor(public options: BBMusicAppOptions) {}

  createGlobalStore() {}

  createApp() {
    return (
      <AppContainer>
        <PcContainer />
      </AppContainer>
    );
  }
}

interface BBMusicAppConfigProps {
  /** 主题 */
  theme: string;
  /** 缓存方式 */
}

export function BBMusicAppConfig({ children }: React.PropsWithChildren<BBMusicAppConfigProps>) {
  return <>{children}</>;
}
