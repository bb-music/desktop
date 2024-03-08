/** 播放进度 */
import { useShallow } from 'zustand/react/shallow';
import { usePlayerStore } from '..';
import { useEffect, useRef, useState } from 'react';
import styles from '../index.module.scss';

export function PlayerProgress({ progress }: { progress: number }) {
  const player = usePlayerStore(
    useShallow((state) => ({
      current: state.current,
      audio: state.audio,
    })),
  );
  const duration = player.current?.duration || 0;
  const [width, setWidth] = useState(0);
  const statusRef = useRef({
    mouseDown: false,
  });

  useEffect(() => {
    if (!statusRef.current.mouseDown) {
      const width = duration + progress === 0 ? 0 : (progress / duration) * 100;
      setWidth(width);
    }
  }, [progress]);

  return (
    <div
      className={styles.progress}
      onMouseDown={(e) => {
        statusRef.current.mouseDown = true;
      }}
      onMouseUp={(e) => {
        statusRef.current.mouseDown = false;
        const target = e.target as HTMLDivElement;
        const { width, left } = target.getBoundingClientRect();
        const p = (e.clientX - left) / width;
        setWidth(p * 100);
        const duration = player.current?.duration || 0;
        player.audio?.setCurrentTime(duration * p);
      }}
      onMouseMove={(e) => {
        if (statusRef.current.mouseDown) {
          // TODO
        }
      }}
    >
      <div className={styles.loaded} style={{ width: `${width}%` }}>
        <div className={styles.dot}></div>
      </div>
    </div>
  );
}
