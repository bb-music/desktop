import styles from '../index.module.scss';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { partItem2MusicItem, usePlayerStore } from '@/player';
import { bb_client } from '@wails/go/models';
import { transformImgUrl } from '@/utils';
import { useLocalMusicOrder } from '@/views/my/store/localMusicOrder';

dayjs.extend(duration);

export function PartItem({
  data,
  aid,
  bvid,
  style,
}: {
  data: bb_client.VideoDetailPage;
  aid: number;
  bvid: string;
  style?: React.CSSProperties;
}) {
  const player = usePlayerStore();
  const musicLocalOrder = useLocalMusicOrder();
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
        <span
          onClick={() => {
            musicLocalOrder.appendMusic(musicLocalOrder.list[0].id, [
              partItem2MusicItem({ ...data, aid, bvid }),
            ]);
          }}
        >
          加入歌单
        </span>
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
