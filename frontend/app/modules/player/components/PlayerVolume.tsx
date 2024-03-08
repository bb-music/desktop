/** 音量调节 */
import { useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '..';
import { api } from '../../../api';
import { Popover, Slider } from '../../../components';
import styles from '../index.module.scss';
import { VolumeNotice } from '@icon-park/react';
import { cls } from '../../../utils';

const VolumeCacheKey = 'BBPlayerVolume';

export function PlayerVolume() {
  const [volume, setVolume] = useState(1);
  const player = usePlayerStore((s) => ({ audio: s.audio }));
  const timer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    (async () => {
      const v = await api.cacheStorage.getItem(VolumeCacheKey);
      const num = Number(v || '1');
      if (isNaN(num)) return;
      setVolume(num);
      player.audio?.setVolume(num);
    })();
  }, []);
  return (
    <Popover
      content={
        <div style={{ padding: '10px 0' }}>
          <Slider
            orientation="vertical"
            value={[volume]}
            onValueChange={([v]) => {
              setVolume(v);
              player.audio?.setVolume(volume);
              clearTimeout(timer.current);
              timer.current = setTimeout(() => {
                api.cacheStorage.setItem(VolumeCacheKey, v + '');
              }, 500);
            }}
            min={0}
            max={1}
            step={0.1}
          />
        </div>
      }
      asChild
    >
      <button className={cls(styles.modeIcon, styles.icon)} title="调节音量">
        <VolumeNotice strokeWidth={3} />
      </button>
    </Popover>
  );
}
