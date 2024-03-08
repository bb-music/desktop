/** 当前播放的歌曲信息 */
import { seconds2mmss } from '../../../utils';
import { usePlayerStore } from '..';
import { api } from '../../../api';
import { Image } from '../../../components';
import styles from '../index.module.scss';
import { useShallow } from 'zustand/react/shallow';

export function PlayerCurrentInfo({
  currentTime,
  hideCover = false,
}: {
  currentTime: number;
  hideCover?: boolean;
}) {
  const player = usePlayerStore(useShallow((s) => ({ current: s.current })));
  return (
    <div className={styles.info}>
      {player.current?.cover && !hideCover && (
        <Image
          src={api.utils.imgUrlTransform(player.current.cover)}
          className={styles.cover}
          mode="cover"
        />
      )}
      <div>
        <div className={styles.name}>{player.current?.name}</div>
        <div className={styles.duration}>
          <span>{seconds2mmss(currentTime)}</span>
          <span>/</span>
          <span>{seconds2mmss(player.current?.duration || 0)}</span>
        </div>
      </div>
    </div>
  );
}
