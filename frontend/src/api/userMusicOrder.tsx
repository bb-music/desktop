import { JsonCacheStorage } from '@/lib/cacheStorage';
import { MusicItem, MusicOrderItem } from '@/app/api/music';
import {
  GithubUserMusicOrderAction,
  UserMusicOrderOrigin,
  UserMusicOrderOriginType,
} from '@/lib/userMusicOrder';
import { Input } from '@/app/components/ui/input';
import { SettingItem } from '@/app/modules/setting';
import { useEffect, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';
import { UserMusicOrder, UserMusicOrderAction } from '@/app/api/userMusicOrder';
import { settingCache } from './setting';
import { Button } from '@/app/components/ui/button';
import { message } from '@/app/components/ui/message';

const NAME = UserMusicOrderOriginType.Github;
const CNAME = 'Github 歌单';

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
  appendMusic = async (id: string, musics: MusicItem[]) => {
    await this.updateItem(id, (l) => {
      const newList = l.musicList?.filter((i) => !musics.find((m) => m.id === i.id));
      return {
        musicList: [...(newList || []), ...musics],
      };
    });
  };
  updateMusic = async (id: string, music: MusicItem) => {
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
  deleteMusic = async (id: string, musics: MusicItem[]) => {
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
  name = NAME;
  cname = CNAME;
  ConfigElement = ({ onChange }: { onChange?: (v: GithubSyncValue) => void }) => {
    const [data, setData] = useState<GithubSyncValue>({
      repo: '',
      token: '',
    });
    const loadHandler = async () => {
      const setting = await settingCache.get();
      if (setting) {
        const config = setting.userMusicOrderOrigin.find((u) => u.name === NAME)?.config;
        if (config) {
          setData({
            repo: config.repo,
            token: config.token,
          });
        }
      }
    };
    useEffect(() => {
      loadHandler();
    }, []);
    const changeHandler = (key: keyof GithubSyncValue, value: string) => {
      const newValue = {
        ...data,
        [key]: value,
      };
      setData(newValue);
    };
    const savaHandler = async () => {
      await updateUserMusicOrderOriginConfig(NAME, data);
      console.log('updateUserMusicOrderOriginConfig', data);
      onChange?.(data);
      message.success('已保存');
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
        <Button onClick={savaHandler}>保存</Button>
      </>
    );
  };
  action = new GithubUserMusicOrderAction(async () => {
    const setting = await settingCache.get();
    return {
      ...setting?.userMusicOrderOrigin.find((n) => n.name === NAME)?.config,
    } as UserMusicOrderOrigin.GithubConfig;
  });
}

export class UserLocalMusicOrderInstance implements UserMusicOrder<null> {
  name = 'Local';
  cname = '本地歌单';
  action = new UserLocalMusicOrderAction();
}

async function updateUserMusicOrderOriginConfig(originName: string, data: any) {
  const setting = await settingCache.get();
  let list = setting?.userMusicOrderOrigin || [];
  if (list.find((n) => n.name === originName)) {
    list = list.map((l) => {
      if (l.name === originName) {
        l.config = data;
      }
      return l;
    });
  } else {
    list.push({
      name: originName,
      config: data,
    });
  }
  await settingCache.update('userMusicOrderOrigin', list);
}
