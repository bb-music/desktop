import { BBMusicApp } from '@/app';
import { PcContainer } from './app/modules/container';
import { apiInstance } from './api';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { settingCache } from './api/setting';
import { cacheStorage } from './lib/cacheStorage';
import './style.scss';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(<Root />);

function Root() {
  const [initLoading, setInitLoading] = useState(true);

  const init = async () => {
    setInitLoading(true);
    const res = await settingCache.get();
    if (!res?.signData?.imgKey || !res?.signData?.subKey) {
      await apiInstance.setting.updateSignData();
    }
    if (!res?.spiData?.uuid_v3 || !res?.spiData?.uuid_v4) {
      await apiInstance.setting.updateSpiData();
    }
    setInitLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        borderRadius: 4,
        overflow: 'hidden',
      }}
    >
      {!initLoading && (
        <BBMusicApp
          apiInstance={apiInstance}
          cacheStorage={cacheStorage}
        >
          <PcContainer />
        </BBMusicApp>
      )}
    </div>
  );
}
