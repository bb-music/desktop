import styles from '../../index.module.scss';
import { cls } from '../../../../utils';
import { useState } from 'react';
import { Image, Button } from '../../../../components';
import { usePlayerStore } from '../../../player';
import { musicCollect, downloadMusic } from '../../..';
import { seconds2mmss } from '../../../../utils';
import { api } from '../../../../api';
import { SearchItemProps, useSearchItem } from './hooks';

export function SearchItem({ data, gotoMusicOrderDetail }: SearchItemProps) {
  const player = usePlayerStore();
  const [show, setShow] = useState(false);
  const { loading, music, getDetailHandler } = useSearchItem({
    data,
    onDetailIsMusic: () => {
      setShow(true);
    },
    onDetailIsMusicOrder: (info) => {
      gotoMusicOrderDetail({ data: info });
    },
  });

  const name = data.name;
  return (
    <div className={styles.searchItem} onClick={getDetailHandler} title={name}>
      <Image
        className={styles.cover}
        src={api.utils.imgUrlTransform(data.cover)}
        alt=""
        mode="cover"
      />
      <div className={styles.title}>
        <span>{name}</span>
        {/* <span>{data.author}</span> */}
      </div>
      <div className={styles.author} title={data.author}>
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
          type="primary"
          onClick={() => {
            player.play(music!);
          }}
        >
          立即播放
        </Button>
        <Button
          type="primary"
          onClick={() => {
            musicCollect(music!);
          }}
        >
          加入歌单
        </Button>
        <Button
          type="primary"
          onClick={() => {
            player.addPlayerList(music!);
          }}
        >
          添加至播放列表
        </Button>
        <Button
          type="primary"
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
