import { JsonCacheStorage } from '@/lib/cacheStorage';
import { MusicOrderItem } from '@/app/api/music';
import {
  UserLocalMusicOrder,
  UserMusicOrderDB,
  UserRemoteMusicOrder,
} from '@/app/api/userMusicOrder';
import { GithubUserMusicOrderAction } from '@/lib/userMusicOrder';
import { Input } from '@/app/components/ui/input';
import { SettingItem } from '@/app/modules/setting';
import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';

const emptyMusicOrder = {
  created_at: Date.now(),
  updated_at: 0,
  list: [],
};

export const userLocalMusicOrderCache = new JsonCacheStorage<UserMusicOrderDB>(
  'bb-music-local-order'
);

export class UserLocalMusicOrderInstance implements UserLocalMusicOrder {
  getList = async () => {
    const res = (await userLocalMusicOrderCache.get()) || { ...emptyMusicOrder };
    return res;
  };
  create = async (data: Omit<MusicOrderItem, 'id'>) => {
    const res = (await userLocalMusicOrderCache.get()) || { ...emptyMusicOrder };
    if (res.list.find((l) => l.name.trim() === data.name.trim())) {
      return Promise.reject(new Error('歌单名称重复'));
    }
    await userLocalMusicOrderCache.set({
      ...res,
      updated_at: Date.now(),
      list: [{ ...data, id: nanoid() }, ...res.list],
    });
  };
  update = async (data: MusicOrderItem) => {
    const res = (await userLocalMusicOrderCache.get()) || { ...emptyMusicOrder };
    await userLocalMusicOrderCache.set({
      ...res,
      updated_at: Date.now(),
      list: res.list.map((l) => {
        if (l.id === data.id) {
          return data;
        }
        return l;
      }),
    });
  };
  delete = async (data: MusicOrderItem) => {
    const res = (await userLocalMusicOrderCache.get()) || { ...emptyMusicOrder };
    await userLocalMusicOrderCache.set({
      ...res,
      updated_at: Date.now(),
      list: res.list.filter((l) => l.id !== data.id),
    });
  };
}

interface GithubSyncValue {
  repo: string;
  token: string;
}
export class UserRemoteGithubMusicOrderInstance implements UserRemoteMusicOrder<GithubSyncValue> {
  name = 'Github';
  ConfigElement = ({
    value = {
      repo: '',
      token: '',
    },
    onChange,
  }: {
    value: GithubSyncValue;
    onChange: (v: GithubSyncValue) => void;
  }) => {
    const [data, setData] = useState<GithubSyncValue>({
      repo: '',
      token: '',
    });
    useEffect(() => {
      console.log('useEffectvalue: ', value);
      if (value.repo !== data.repo || value.token !== data.token) {
        setData(value);
      }
    }, [value]);
    const changeHandler = (key: keyof GithubSyncValue, value: string) => {
      const newValue = {
        ...data,
        [key]: value,
      };
      setData(newValue);
      onChange(newValue);
    };
    return (
      <>
        <SettingItem label='仓库地址'>
          <Input
            value={data.repo}
            onChange={(e) => {
              changeHandler('repo', e.target.value);
            }}
          />
        </SettingItem>
        <SettingItem label='token'>
          <Input
            value={data.token}
            onChange={(e) => {
              changeHandler('token', e.target.value);
            }}
          />
        </SettingItem>
      </>
    );
  };
  action = new GithubUserMusicOrderAction();
}
