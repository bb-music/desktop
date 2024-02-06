import PageTitle from '@/components/PageTitle';
import { useMusicOrderDetailStore } from './store';
import styles from './index.module.scss';
import { Download } from '@icon-park/react';
import { downloadMusic, seconds2mmss, usePlayerStore } from '@/player';

export default function MusicOrderDetail() {
  const { data } = useMusicOrderDetailStore();
  const player = usePlayerStore();
  if (!data) return null;
  return (
    <div
      className={styles.musicOrder}
      style={{ width: '100%' }}
    >
      <PageTitle>{data.name}</PageTitle>
      <div>{data.desc}</div>
      <table>
        <thead>
          <tr>
            <th style={{ width: 40 }}>#</th>
            <th>标题</th>
            <th style={{ width: 180 }}>操作</th>
            <th style={{ width: 70 }}>时间</th>
          </tr>
        </thead>
        <tbody>
          {data.list.map((item, index) => {
            return (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td style={{ fontSize: 12, display: 'flex', gap: '5px' }}>
                  <a
                    onClick={() => {
                      player.play(item);
                    }}
                  >
                    播放
                  </a>
                  <a
                    onClick={() => {
                      player.addPlayerList(item);
                    }}
                  >
                    添加到歌单
                  </a>
                  <a
                    onClick={() => {
                      downloadMusic(item);
                    }}
                  >
                    下载
                  </a>
                </td>
                <td>{seconds2mmss(item.duration)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
