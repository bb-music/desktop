export class GiteeOriginLoader {
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

  async getList() {
    // https://gitee.com/api/v5/repos/lvyueyang/bb-music-order-open/contents/list
    const fileList = await fetch(
      `https://gitee.com/api/v5/repos/${this.owner}/${this.repo}/contents/list`
    ).then((res) => res.json());
    console.log('fileList: ', fileList);

    const list = await Promise.all(
      fileList.map((item: any) => {
        const url = `https://${this.owner}.gitee.io/${this.repo}/${item.path}`;
        console.log('url: ', url);
        return fetch(item.url).then((r) => {
          return r.json();
        });
      })
    );
    return list;
  }
}
