import { StoreApi, UseBoundStore } from 'zustand';
import { PersistOptions } from 'zustand/middleware';

type PersistListener<S> = (state: S) => void;

type Write<T, U> = Omit<T, keyof U> & U;
type StorePersist<S, Ps> = {
  persist: {
    setOptions: (options: Partial<PersistOptions<S, Ps>>) => void;
    clearStorage: () => void;
    rehydrate: () => Promise<void> | void;
    hasHydrated: () => boolean;
    onHydrate: (fn: PersistListener<S>) => () => void;
    onFinishHydration: (fn: PersistListener<S>) => () => void;
    getOptions: () => Partial<PersistOptions<S, Ps>>;
  };
};

export type PersistStore<S> = UseBoundStore<Write<StoreApi<S>, StorePersist<S, S>>>;

export type BaseStore<S> = UseBoundStore<StoreApi<S>>;
