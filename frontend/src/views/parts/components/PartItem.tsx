import styles from '../index.module.scss';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { partItem2MusicItem, usePlayerStore } from '@/player';
import { biliClient } from '@wails/go/models';
import { transformImgUrl } from '@/utils';

dayjs.extend(duration);

export function PartItem({
  data,
  aid,
  bvid,
  style,
}: {
  data: biliClient.VideoDetailPage;
  aid: number;
  bvid: string;
  style?: React.CSSProperties;
}) {
  const player = usePlayerStore();
  return (
    <div
      className={styles.partItem}
      style={style}
    >
      <img
        className={styles.cover}
        src={transformImgUrl(data.first_frame)}
        alt=''
      />
      <div className={styles.info}>
        <div className={styles.name}>
          {data.page}. {data.part}
        </div>
        <div className={styles.duration}>
          {dayjs.duration(data.duration, 'seconds').format('mm:ss')}
        </div>
      </div>

      <div className={styles.operate}>
        <span
          onClick={(e) => {
            e.stopPropagation();
            player.play(partItem2MusicItem({ ...data, aid, bvid }));
          }}
        >
          立即播放
        </span>
        <span>加入歌单</span>
        <span
          onClick={() => {
            player.addPlayerList([partItem2MusicItem({ ...data, aid, bvid })]);
          }}
        >
          添加至播放列表
        </span>
      </div>
    </div>
  );
}
