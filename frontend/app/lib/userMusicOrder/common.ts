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
}
