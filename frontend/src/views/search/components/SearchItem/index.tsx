import styles from './index.module.scss';
import { cls, transformImgUrl } from '@/utils';
import { biliClient } from '@wails/go/models';
import { GetVideoDetail } from '@wails/go/app/App';
import { useState } from 'react';
import { router } from '@/router';
import { useVideoStore } from '@/store/video';

export default function SearchItem({ data }: { data: biliClient.SearchResultItem }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const videoStore = useVideoStore();
  const getDetailHandler = async () => {
    setLoading(true);
    try {
      const info = await GetVideoDetail({
        aid: data.aid + '',
        bvid: data.bvid,
      });
      console.log(info);
      if (info.videos > 1) {
        videoStore.setData(info);
        router.push(`/parts`);
      } else {
        setShow(true);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div
      className={styles.searchItem}
      onClick={getDetailHandler}
    >
      <img
        className={styles.cover}
        src={transformImgUrl(data.pic)}
        alt=''
      />
      <div className={styles.info}>
        <div
          className={styles.title}
          dangerouslySetInnerHTML={{ __html: data.title }}
        />
        <div className={styles.tags}>
          <span>发布者：{data.author}</span>
          <span>时长：{data.duration}</span>
        </div>
      </div>
      {loading && <div className={styles.loading}>加载中...</div>}
      <div className={cls(styles.operate, show ? styles.show : '')}>
        <span>立即播放</span>
        <span>加入歌单</span>
        <span>添加至播放列表</span>
      </div>
    </div>
  );
}
