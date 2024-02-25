import { MusicOrderItem } from '@/app/api/music';

export const enum UserMusicOrderOriginType {
  ExtendClass = 'ExtendClass', // https://extendsclass.com/
  Github = 'Github',
}

export namespace UserMusicOrderOrigin {
  interface BaseConfig {
    enabled: boolean;
  }

  export interface ExtendClassConfig extends BaseConfig {
    secret: string;
    id?: string;
  }
  export interface GithubConfig extends BaseConfig {
    token: string;
    repo: string;
  }
  export type Config = ExtendClassConfig | GithubConfig;

  export abstract class Template {
    constructor(config: Config) {}

    /** 获取我的歌单 */
    public abstract getList(): Promise<MusicOrderItem[]>;

    /** 更新我的歌单 */
    public abstract update(data: MusicOrderItem[]): Promise<void>;
  }
}
