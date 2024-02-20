import styles from './index.module.scss';
import { cls, transformImgUrl } from '@/utils';
import { useState } from 'react';
import { api } from '@/app/api';
import { SearchItem as SearchItemInter, SearchType } from '@/app/api/search';
import { Image } from '@/app/components/ui/image';
import { usePlayerStore } from '@/app/modules/player/store';
import { seconds2mmss } from '@/app/modules/player/utils';
import { PageView, openPage } from '@/app/modules/container/store';
import { Button } from '@/app/components/ui/button';

export default function SearchItem({ data }: { data: SearchItemInter }) {
  const player = usePlayerStore();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [music, setMusic] = useState<SearchItemInter>();
  const getDetailHandler = async () => {
    setLoading(true);
    try {
      const info = await api.search.getItemInfo(data);
      setMusic({
        ...info,
        id: info.id.toString(),
      });
      if (info.type === SearchType.Order) {
        openPage(PageView.MusicOrderDetail, { data: info });
      } else {
        setShow(true);
      }
    } catch (e) {
      console.error('e', e);
    }
    setLoading(false);
  };
  const name = data.name;
  return (
    <div
      className={styles.searchItem}
      onClick={getDetailHandler}
      title={name}
    >
      <Image
        className={styles.cover}
        src={transformImgUrl(data.cover)}
        alt=''
        mode='cover'
      />
      <div className={styles.title}>
        <span>{name}</span>
        {/* <span>{data.author}</span> */}
      </div>
      <div
        className={styles.author}
        title={data.author}
      >
        {data.author}
      </div>
      <div className={styles.duration}>
        <span>{seconds2mmss(data.duration)}</span>
      </div>

      {loading && <div className={styles.loading}>加载中...</div>}
      <div className={cls(styles.operate, show ? styles.show : '')}>
        <Button
          type='primary'
          onClick={() => {
            player.play(music!);
          }}
        >
          立即播放
        </Button>
        <Button type='primary'>加入歌单</Button>
        <Button
          type='primary'
          onClick={() => {
            player.addPlayerList(music!);
          }}
        >
          添加至播放列表
        </Button>
      </div>
    </div>
  );
}