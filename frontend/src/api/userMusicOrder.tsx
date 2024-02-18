import { JsonCacheStorage } from '@/lib/cacheStorage';
import { MusicOrderItem } from '@/app/api/music';
import { UserLocalMusicOrder, UserRemoteMusicOrder } from '@/app/api/userMusicOrder';
import { GithubUserMusicOrderAction } from '@/lib/userMusicOrder';
import { Input } from '@/app/components/ui/input';
import { SettingItem } from '@/app/modules/setting';
import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';

export const userLocalMusicOrderCache = new JsonCacheStorage<MusicOrderItem[]>(
  'bb-music-local-order'
);

export class UserLocalMusicOrderInstance implements UserLocalMusicOrder {
  getList = async () => {
    const res = (await userLocalMusicOrderCache.get()) || [];
    return res;
  };
  create = async (data: Omit<MusicOrderItem, 'id'>) => {
    const res = await this.getList();
    if (res.find((l) => l.name.trim() === data.name.trim())) {
      return Promise.reject(new Error('歌单名称重复'));
    }
    await userLocalMusicOrderCache.set([{ ...data, id: nanoid() }, ...res]);
  };
  update = async (data: Omit<MusicOrderItem, 'musicList'>) => {
    const res = await this.getList();
    await userLocalMusicOrderCache.set(
      res.map((l) => {
        if (l.id === data.id) {
          return {
            ...l,
            name: data.name,
            desc: data.desc,
            cover: data.cover,
            updated_at: dayjs().format(),
          };
        }
        return l;
      })
    );
  };
  delete = async (data: MusicOrderItem) => {
    const res = await this.getList();
    await userLocalMusicOrderCache.set(res.filter((l) => l.id !== data.id));
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
