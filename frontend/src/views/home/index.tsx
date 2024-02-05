import { useEffect, useState } from 'react';
import styles from './index.module.scss';
import { useConfigStore } from '@/store/config';
import { MusicOrderItem } from '@/interface';
import { GiteeOriginLoader } from '@/utils/originLoader/modules/gitee';

interface OriginItem {
  origin: string;
  list: MusicOrderItem[];
}

export default function Home() {
  const config = useConfigStore();
  const [list, setList] = useState<OriginItem[]>([]);

  const initList = async () => {
    const origins = config.musicOrderOpenOrigin.map((origin) => new GiteeOriginLoader(origin));
    const res = await Promise.all(origins.map((o) => o.getList()));
    console.log('res: ', res);
  };

  useEffect(() => {
    initList();
  }, [config.musicOrderOpenOrigin]);

  useEffect(() => {
    fetch(`https://gitee.com/api/v5/repos/lvyueyang/bb-music-order-open/contents/list`)
      .then((res) => res.json())
      .then((res) => {
        console.log('Home', res);
      });
  }, []);
  return <div></div>;
}
