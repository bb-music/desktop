import { create } from 'zustand';
import styles from '../theme/dark.module.scss';

export interface GlobalStoreState {
  /** 主题 */
  theme?: string;
}
interface GlobalStoreHandler {
  setState: (state: Partial<GlobalStoreState>) => void;
}

type GlobalStore = GlobalStoreState & GlobalStoreHandler;

export const globalStore = create<GlobalStore>()((set, get) => {
  return {
    theme: styles.dark,
    setState: set,
  };
});

export const useGlobalStore = globalStore;
