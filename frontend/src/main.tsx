import { createRoot } from 'react-dom/client';
import './style.scss';
import { BBMusicApp } from '@/app';
import { PcContainer } from './app/modules/container';
import { cacheStorage } from './lib/cacheStorage';
import { apiInstance, settingCache } from './api';
import { useEffect, useState } from 'react';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(<Root />);

function Root() {
  const [initLoading, setInitLoading] = useState(true);

  const init = async () => {
    setInitLoading(true);
    const res = await settingCache.get();
    if (!res?.signData) {
      await apiInstance.setting.updateSignData();
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
          cacheStorage={cacheStorage}
          apiInstance={apiInstance}
        >
          <PcContainer />
        </BBMusicApp>
      )}
    </div>
  );
}
