import { useConfigStore } from '@/store/config';
import styles from './index.module.scss';
import PageTitle from '@/components/PageTitle';
import { FormItem } from '@/components/Form';
import { LoadSignData, UpdateClientSignData, UpdateDownloadDir } from '@wails/go/app/App';

export default function Config() {
  const config = useConfigStore();
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
        <div className={styles.subTitle}>数据源设置</div>
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
      </div>
    </div>
  );
}
