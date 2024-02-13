import { isJson } from '@/utils';
import { MusicOrderOriginLoader } from '../common';
import { MusicOrderItem } from '@/interface';

interface ListFileItem {
  type: string;
  size?: any;
  name: string;
  path: string;
  sha: string;
  url: string;
  html_url: string;
  download_url: string;
}

interface FileInfo {
  type: string;
  encoding: string;
  size: number;
  name: string;
  path: string;
  content: string;
  sha: string;
  url: string;
  html_url: string;
  download_url: string;
}

export class GiteeOriginLoader implements MusicOrderOriginLoader {
  owner: string;
  repo: string;

  // https://gitee.com/lvyueyang/bb-music-order-open
  constructor(origin: string) {
    const { owner, repo } = this.format(origin);
    this.owner = owner;
    this.repo = repo;
  }

  // 解析源地址
  format(origin: string) {
    const [, , , owner, repo] = origin.split('/');
    return {
      owner,
      repo,
    };
  }

  /** 获取歌单列表 */
  async getList() {
    // https://gitee.com/api/v5/repos/lvyueyang/bb-music-order-open/contents/list
    // 先取仓库中 list 文件夹下的 json 文件
    const fileListUrl = `https://gitee.com/api/v5/repos/${this.owner}/${this.repo}/contents/list`;
    const fileList: ListFileItem[] = await fetch(fileListUrl).then((res) => res.json());

    // 根据文件地址取文件内容
    const list = await Promise.all(
      fileList
        .filter((f) => f.name.endsWith('.json'))
        .map((item) => {
          return fetch(item.url)
            .then((r) => {
              return r.json() as Promise<FileInfo>;
            })
            .then((r) => {
              return isJson<MusicOrderItem>(decode(r.content))!;
            });
        })
    );
    return list;
  }
}

// 对 gbk 编码的 base64 解码
function decode(value: string) {
  const bytes = Uint8Array.from(atob(value), (c) => c.charCodeAt(0));
  const decodedString = new TextDecoder().decode(bytes);
  return decodedString;
}
