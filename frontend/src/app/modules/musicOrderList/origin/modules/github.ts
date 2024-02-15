import { isJson } from '@/utils';
import { UserMusicOrderOrigin } from '../common';
import axios, { AxiosInstance } from 'axios';
import { MusicOrderItem } from '@/app/api/music';

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

export class GithubUserMusicOrderOrigin implements UserMusicOrderOrigin.Template {
  private filePath: string;
  private request: AxiosInstance;

  constructor(config: UserMusicOrderOrigin.GithubConfig) {
    const { owner, repo } = transformRepoUrl(config.repo);
    this.filePath = `/repos/${owner}/${repo}/contents/my.json`;

    this.request = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        Authorization: `Bearer ${config.token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        Accept: 'application/vnd.github+json',
      },
    });

    this.getList();
  }

  async getList() {
    let list: MusicOrderItem[] = [];
    try {
      list = await this.getData();
    } catch (e: any) {
      if (e.response.status === 404) {
        // 没有同步文件, 创建
        await this.createMyJson();
        list = await this.getData();
      }
    }
    return list;
  }
  async update(data: MusicOrderItem[]) {
    const content = btoa(JSON.stringify(data));
    await this.request.put(this.filePath, {
      message: '同步歌单文件',
      content,
    });
  }

  private async getData() {
    const res = await this.request.get<ListResponse>(this.filePath);
    const data = isJson<MusicOrderItem[]>(decode(res.data.content));
    return data || [];
  }
  private async createMyJson() {
    // 字符串转 base64
    const content = btoa('[]');
    await this.request.put(this.filePath, {
      message: '初始化歌单文件',
      content,
    });
  }
}

function transformRepoUrl(url: string) {
  const [, , , owner, repo] = url.split('/');
  return {
    owner,
    repo,
  };
}

// 对 gbk 编码的 base64 解码
function decode(value: string) {
  const bytes = Uint8Array.from(atob(value), (c) => c.charCodeAt(0));
  const decodedString = new TextDecoder().decode(bytes);
  return decodedString;
}
