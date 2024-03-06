import { isJson } from '../../../utils';
import { UserMusicOrderOrigin } from '../common';
import axios from 'axios';
import { MusicInter, UserMusicOrderApiAction } from '../../..';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { Base64 } from 'js-base64';

type MusicOrderItem = MusicInter.MusicOrderItem;

interface ListResponse {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content: string;
  encoding: string;
}

export class GithubUserMusicOrderAction implements UserMusicOrderApiAction {
  constructor(public getConfig: () => Promise<UserMusicOrderOrigin.GithubConfig>) {}

  public getList: UserMusicOrderApiAction['getList'] = async () => {
    const config = await this.getConfig();
    let list: MusicOrderItem[] = [];
    try {
      const res = await this.getData(config);
      list = res.data;
    } catch (e: any) {
      if (e.response.status === 404) {
        // 没有同步文件, 创建
        await this.createMyJson(config);
        const res = await this.getData(config);
        list = res.data;
      }
    }
    return list;
  };
  public create: UserMusicOrderApiAction['create'] = async (data) => {
    const config = await this.getConfig();
    const { request, filePath } = this.createConfig(config);
    const res = await this.getDataAndRsa(config);
    let list = res.data;
    if (list.find((l) => l.name === data.name)) {
      return Promise.reject(new Error('歌单已存在'));
    }
    const id = nanoid();
    list.push({
      id,
      name: data.name,
      desc: data.desc,
      cover: data.cover,
      musicList: data.musicList,
      created_at: dayjs().format(),
      updated_at: '',
    });
    const content = Base64.encode(JSON.stringify(list));
    await request.put(filePath, {
      message: `创建歌单${data.name}(${id})`,
      content,
      sha: res.sha,
    });
  };
  public update: UserMusicOrderApiAction['update'] = async (data) => {
    const config = await this.getConfig();
    await this.updateItem(
      data.id,
      config,
      () => {
        return {
          name: data.name,
          desc: data.desc,
          cover: data.cover,
        };
      },
      (c) => `更新歌单${c.name}(${c.id})`,
    );
  };
  public delete: UserMusicOrderApiAction['delete'] = async (data) => {
    const config = await this.getConfig();
    const { request, filePath } = this.createConfig(config);
    const res = await this.getDataAndRsa(config);
    let list = res.data;
    const current = list.find((l) => l.id === data.id);
    if (!current) {
      return Promise.reject(new Error('歌单不存在'));
    }
    list = list.filter((l) => l.id !== data.id);
    const content = Base64.encode(JSON.stringify(list));
    await request.put(filePath, {
      message: `删除歌单${current.name}(${current.id})`,
      content,
      sha: res.sha,
    });
  };
  public getDetail: UserMusicOrderApiAction['getDetail'] = async (id) => {
    const res = await this.getList();
    const info = res.find((r) => r.id === id);
    if (!info) {
      return Promise.reject(new Error('歌单不存在'));
    }
    return info;
  };
  public appendMusic: UserMusicOrderApiAction['appendMusic'] = async (id, musics) => {
    const config = await this.getConfig();

    await this.updateItem(
      id,
      config,
      (l) => {
        const newList = l.musicList?.filter((i) => !musics.find((m) => m.id === i.id));
        return {
          musicList: [...(newList || []), ...musics],
        };
      },
      () => `新增歌曲`,
    );
  };
  public updateMusic: UserMusicOrderApiAction['updateMusic'] = async (id, music) => {
    const config = await this.getConfig();

    await this.updateItem(
      id,
      config,
      (l) => {
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
      },
      () => `修改歌曲信息`,
    );
  };
  public deleteMusic: UserMusicOrderApiAction['deleteMusic'] = async (id, musics) => {
    const config = await this.getConfig();

    await this.updateItem(
      id,
      config,
      (l) => {
        const newList = l.musicList?.filter((i) => {
          return !musics.map((m) => m.id).includes(i.id);
        });
        return {
          musicList: newList || [],
        };
      },
      () => `移除歌曲`,
    );
  };

  private async getDataAndRsa(config: UserMusicOrderOrigin.GithubConfig) {
    try {
      const res = await this.getData(config);
      return res;
    } catch (e: any) {
      if (e.response.status === 404) {
        // 没有同步文件, 创建
        await this.createMyJson(config);
        const res = await this.getData(config);
        return res;
      }
      return Promise.reject(e);
    }
  }
  private createConfig(config: UserMusicOrderOrigin.GithubConfig) {
    const { owner, repo } = transformRepoUrl(config.repo);
    const filePath = `/repos/${owner}/${repo}/contents/my.json`;

    return {
      request: axios.create({
        baseURL: 'https://api.github.com',
        headers: {
          Authorization: `Bearer ${config.token}`,
          'X-GitHub-Api-Version': '2022-11-28',
          Accept: 'application/vnd.github+json',
        },
      }),
      filePath,
    };
  }
  private async getData(config: UserMusicOrderOrigin.GithubConfig) {
    const { request, filePath } = this.createConfig(config);
    const res = await request.get<ListResponse>(filePath);
    const data = isJson<MusicOrderItem[]>(Base64.decode(res.data.content));
    return {
      data: data || [],
      sha: res.data.sha,
    };
  }
  private async createMyJson(config: UserMusicOrderOrigin.GithubConfig) {
    const { request, filePath } = this.createConfig(config);
    // 字符串转 base64
    const content = Base64.atob('[]');
    await request.put(filePath, {
      message: '初始化歌单文件',
      content,
    });
  }
  private async updateItem(
    id: string,
    config: UserMusicOrderOrigin.GithubConfig,
    cb: (l: MusicOrderItem) => Partial<MusicOrderItem>,
    message: (l: MusicOrderItem) => string,
  ) {
    const { request, filePath } = this.createConfig(config);
    const res = await this.getDataAndRsa(config);
    let list = res.data;
    const current = list.find((l) => l.id === id);
    if (!current) {
      return Promise.reject(new Error('歌单不存在'));
    }
    list = list.map((l) => {
      if (l.id === id) {
        return {
          ...l,
          ...cb(l),
          updated_at: dayjs().format(),
        };
      }
      return l;
    });

    const content = Base64.encode(JSON.stringify(list));
    await request.put(filePath, {
      message: message(current),
      content,
      sha: res.sha,
    });
  }
}

function transformRepoUrl(url: string) {
  const [, , , owner, repo] = url.split('/');
  return {
    owner,
    repo: url.endsWith('.git') ? repo.replace(/\.git/gi, '') : repo,
  };
}
