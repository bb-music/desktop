import PageTitle from '@/components/PageTitle';
import { string2Number } from '@/utils';
import { PartItem } from './components/PartItem';
import styles from './index.module.scss';
import { useVideoStore } from '@/store/video';
import { useEffect, useState } from 'react';
import { router } from '@/router';
import { partItem2MusicItem, usePlayerStore } from '@/player';

export default function PartList() {
  const { data } = useVideoStore();
  const player = usePlayerStore();
  const [search, setSearch] = useState('');
  useEffect(() => {
    if (!data?.aid && !data?.bvid) {
      router.replace('/search');
    }
  }, []);

  if (!data) return null;
  const { aid, bvid } = data;
  return (
    <>
      <PageTitle>{data.title}</PageTitle>
      <div className={styles.allOperate}>
        <div className={styles.btns}>
          <span
            title='将会替换播放列表'
            onClick={() => {
              player.clearPlayerList();
              console.log(data.pages);
              player.addPlayerList(
                data.pages.map((item) => partItem2MusicItem({ ...item, aid, bvid }))
              );
              player.play(player.playerList[0]);
            }}
          >
            播放
          </span>
          <span>加入歌单</span>
          <span
            onClick={() => {
              player.addPlayerList(
                data.pages.map((item) => partItem2MusicItem({ ...item, aid, bvid }))
              );
            }}
          >
            添加至播放列表
          </span>
        </div>
        <input
          placeholder='输入歌曲名称搜索'
          value={search}
          onChange={(e) => {
            setSearch(e.target.value.trim());
          }}
        />
      </div>
      <div className={styles.partList}>
        {data.pages.map((item) => {
          return (
            <PartItem
              style={{ display: item.part.includes(search) ? '' : 'none' }}
              key={item.cid}
              data={item}
              aid={string2Number(data.aid)!}
              bvid={data.bvid}
            />
          );
        })}
      </div>
    </>
  );
}
