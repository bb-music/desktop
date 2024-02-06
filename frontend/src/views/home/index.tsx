import { useEffect, useState } from 'react';
import styles from './index.module.scss';
import { useConfigStore } from '@/store/config';
import { MusicOrderItem } from '@/interface';
import { JsonOriginLoader } from '@/utils/originLoader';
import PageTitle from '@/components/PageTitle';
import { toMusicOrderDetail } from '@/utils';

interface OriginItem {
  origin: string;
  list: MusicOrderItem[];
}

export default function Home() {
  const config = useConfigStore();
  const [list, setList] = useState<OriginItem[]>([]);

  const initList = async () => {
    const origins = config.musicOrderOpenOrigin.map((origin) => new JsonOriginLoader(origin));
    const all = await Promise.all(origins.map((o) => o.getList()));
    const res: OriginItem[] = all.map((list, index) => {
      return {
        origin: config.musicOrderOpenOrigin[index],
        list,
      };
    });
    setList(res);
  };

  useEffect(() => {
    initList();
  }, [config.musicOrderOpenOrigin]);
  return (
    <div style={{ width: '100%' }}>
      <PageTitle>歌单广场</PageTitle>
      {list.map((item) => {
        return (
          <div>
            {/* <div>{item.origin}</div> */}
            <div className={styles.list}>
              {item.list.map((i) => {
                return (
                  <div
                    className={styles.item}
                    key={i.id}
                    onClick={() => {
                      toMusicOrderDetail(i);
                    }}
                  >
                    <div>
                      <div className={styles.name}>{i.name}</div>
                      <div className={styles.desc}>{i.desc}</div>
                    </div>
                    <div className={styles.total}>{i.list.length}首</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
