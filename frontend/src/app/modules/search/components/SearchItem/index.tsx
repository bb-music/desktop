import styles from './index.module.scss';
import { cls, transformImgUrl } from '@/utils';
import { useState } from 'react';
import { Image } from '@/app/components/ui/image';
import { usePlayerStore } from '../../../player';
import { Button } from '@/app/components/ui/button';
import { musicCollect } from '@/app/modules/musicOrderList';
import { downloadMusic } from '@/app/modules/music';
import { getMusicService, seconds2mmss } from '@/app/utils';
import { MusicOrderDetailProps } from '@/app/modules/musicOrderDetail';
import { SearchType, SearchItem as SearchItemInter } from '@/app/api/musicService';

interface SearchItemProps {
  data: SearchItemInter;
  gotoMusicOrderDetail: (opt: MusicOrderDetailProps) => void;
}
export default function SearchItem({ data, gotoMusicOrderDetail }: SearchItemProps) {
  const player = usePlayerStore();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [music, setMusic] = useState<SearchItemInter>();
  const getDetailHandler = async () => {
    setLoading(true);
    try {
      const service = getMusicService(data.origin);
      if (!service) return;
      const info = await service?.action.searchItemDetail(data);
      setMusic(info);
      if (info.type === SearchType.Order) {
        gotoMusicOrderDetail({ data: info });
        // openPage(PageView.MusicOrderDetail, { data: info });
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
      <div
        className={cls(styles.operate, show ? styles.show : '')}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Button
          type='primary'
          onClick={() => {
            player.play(music!);
          }}
        >
          立即播放
        </Button>
        <Button
          type='primary'
          onClick={() => {
            musicCollect(music!);
          }}
        >
          加入歌单
        </Button>
        <Button
          type='primary'
          onClick={() => {
            player.addPlayerList(music!);
          }}
        >
          添加至播放列表
        </Button>
        <Button
          type='primary'
          onClick={() => {
            downloadMusic(music!);
          }}
        >
          下载
        </Button>
      </div>
    </div>
  );
}
