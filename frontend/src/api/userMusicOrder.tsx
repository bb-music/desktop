import { JsonCacheStorage } from '@/lib/cacheStorage';
import { MusicItem, MusicOrderItem } from '@/app/api/music';
import { GithubUserMusicOrderAction } from '@/lib/userMusicOrder';
import { Input } from '@/app/components/ui/input';
import { SettingItem } from '@/app/modules/setting';
import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';
import { UserMusicOrder, UserMusicOrderAction } from '@/app/api/userMusicOrder';

export const userLocalMusicOrderCache = new JsonCacheStorage<MusicOrderItem[]>(
  'bb-music-local-order'
);

export class UserLocalMusicOrderAction implements UserMusicOrderAction {
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
    await this.updateItem(data.id, () => {
      return {
        name: data.name,
        desc: data.desc,
        cover: data.cover,
      };
    });
  };
  delete = async (data: MusicOrderItem) => {
    const res = await this.getList();
    await userLocalMusicOrderCache.set(res.filter((l) => l.id !== data.id));
  };
  getDetail = async (id: string) => {
    const res = await this.getList();
    const info = res.find((l) => l.id === id);
    if (!info) {
      return Promise.reject(new Error('歌单不存在'));
    }
    return info;
  };
  appendMusic = async (id: string, musics: MusicItem<any>[]) => {
    await this.updateItem(id, (l) => {
      const newList = l.musicList?.filter((i) => !musics.find((m) => m.id === i.id));
      return {
        musicList: [...(newList || []), ...musics],
      };
    });
  };
  updateMusic = async (id: string, music: MusicItem<any>) => {
    await this.updateItem(id, (l) => {
      const newList = l.musicList?.map((i) => {
        if (i.id === music.id) {
          return {
            ...i,
            name: music.name,
            cover: music.cover,
          };
        }
        return i;
      });
      return {
        musicList: newList || [],
      };
    });
  };
  deleteMusic = async (id: string, musics: MusicItem<any>[]) => {
    await this.updateItem(id, (l) => {
      const newList = l.musicList?.filter((i) => {
        return !musics.map((m) => m.id).includes(i.id);
      });
      return {
        musicList: newList || [],
      };
    });
  };
  private updateItem = async (id: string, cb: (l: MusicOrderItem) => Partial<MusicOrderItem>) => {
    const res = await this.getList();
    await userLocalMusicOrderCache.set(
      res.map((l) => {
        if (l.id === id) {
          return {
            ...l,
            ...cb(l),
            updated_at: dayjs().format(),
          };
        }
        return l;
      })
    );
  };
}

interface GithubSyncValue {
  repo: string;
  token: string;
}
export class UserGithubMusicOrderInstance implements UserMusicOrder<GithubSyncValue> {
  name = 'Github';
  cname = 'Github 歌单';
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

export class UserLocalMusicOrderInstance implements UserMusicOrder<null> {
  name = 'Local';
  cname = '本地歌单';
  action = new UserLocalMusicOrderAction();
}
