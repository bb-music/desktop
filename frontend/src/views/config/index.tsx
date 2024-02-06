import { useConfigStore } from '@/store/config';
import styles from './index.module.scss';
import PageTitle from '@/components/PageTitle';
import { FormItem } from '@/components/Form';
import { LoadSignData, UpdateDownloadDir } from '@wails/go/app/App';
import {
  UserMusicOrderOrigin,
  UserMusicOrderOriginType,
  UserMusicOrderOriginTypeMap,
} from '@/utils/userMusicOrder/common';
import { useEffect } from 'react';
import { GithubUserMusicOrderOrigin } from '@/utils/userMusicOrder';

export default function Config() {
  const config = useConfigStore();

  useEffect(() => {
    config.userMusicOrderOrigin.forEach((c) => {
      if (c.type === UserMusicOrderOriginType.Github) {
        new GithubUserMusicOrderOrigin(c);
      }
    });
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <PageTitle>设置</PageTitle>
      <div className={styles.form}>
        <div className={styles.subTitle}>系统设置</div>
        <FormItem label='下载位置'>
          <input
            type='text'
            value={config.downloadDir}
            disabled
          />
          <button
            onClick={() => {
              UpdateDownloadDir().then(() => {
                config.load();
              });
            }}
          >
            修改
          </button>
        </FormItem>
        <FormItem label='imgKey'>
          <input
            type='text'
            value={config.signData?.img_key}
            disabled
          />
          <button
            onClick={() => {
              LoadSignData().then(() => {
                config.load();
              });
            }}
          >
            修改
          </button>
        </FormItem>
        <FormItem label='subKey'>
          <input
            type='text'
            value={config.signData?.sub_key}
            disabled
          />
        </FormItem>
        <FormItem label='视频代理服务端口号'>
          <input
            type='text'
            value={config.videoProxyPort}
            disabled
          />
        </FormItem>
        <br />
        <div className={styles.subTitle}>歌单广场源</div>
        <button
          onClick={() => {
            config.updateMusicOrderOpenOrigin([...config.musicOrderOpenOrigin, '']);
          }}
        >
          添加源
        </button>
        {config.musicOrderOpenOrigin.map((item, index) => {
          return (
            <FormItem
              label={`歌单广场源${index + 1}`}
              key={index}
            >
              <input
                type='text'
                value={item}
                onChange={(e) => {
                  config.updateMusicOrderOpenOrigin(
                    config.musicOrderOpenOrigin.map((i, ind) => {
                      if (index === ind) {
                        return e.target.value;
                      }
                      return i;
                    })
                  );
                }}
              />
              <a
                style={{ flex: '3em', textAlign: 'right' }}
                onClick={() => {
                  config.updateMusicOrderOpenOrigin(
                    config.musicOrderOpenOrigin.filter((i, ind) => index !== ind)
                  );
                }}
              >
                删除
              </a>
            </FormItem>
          );
        })}
        <br />
        <div className={styles.subTitle}>歌单同步源</div>
        <GithubConfig />
      </div>
    </div>
  );
}

export function GithubConfig() {
  const config = useConfigStore();
  const item = config.userMusicOrderOrigin.find(
    (item) => item.type === UserMusicOrderOriginType.Github
  ) as UserMusicOrderOrigin.GithubConfig | undefined;
  useEffect(() => {
    if (!item) {
      config.updateUserMusicOrderOrigin([
        ...config.userMusicOrderOrigin,
        {
          type: UserMusicOrderOriginType.Github,
          token: '',
          repo: '',
          enabled: false,
        },
      ]);
    }
  }, [config.userMusicOrderOrigin]);
  if (!item) return null;
  console.log('item: ', item);

  const updateHandler = (key: 'repo' | 'token' | 'enabled', value: string | boolean) => {
    config.updateUserMusicOrderOrigin(
      config.userMusicOrderOrigin.map((i) => {
        if (i.type !== UserMusicOrderOriginType.Github) return i;
        return {
          ...i,
          [key]: value,
        };
      })
    );
  };
  return (
    <div>
      <div>{UserMusicOrderOriginTypeMap.get(item.type)?.label}</div>
      <div>
        <FormItem label='仓库地址'>
          <input
            type='text'
            value={item.repo}
            onChange={(e) => {
              updateHandler('repo', e.target.value.trim());
            }}
          />
        </FormItem>
        <FormItem label='token'>
          <input
            type='text'
            value={item.token}
            onChange={(e) => {
              updateHandler('token', e.target.value.trim());
            }}
          />
        </FormItem>
        <FormItem label='是否开启'>
          <input
            type='checkbox'
            checked={item.enabled}
            onChange={(e) => {
              updateHandler('enabled', e.target.checked);
            }}
          />
        </FormItem>
      </div>
    </div>
  );
}
