import { BBMusicApp } from '@/app';
import { PcContainer } from './app/modules/container';
import { apiInstance } from './api';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.scss';
import { Close, Minus } from '@icon-park/react';
import { Quit, WindowMinimise } from '@wails/runtime';

const container = document.getElementById('root');
const root = createRoot(container!);

function Root() {
  const [initLoading, setInitLoading] = useState(true);

  const init = async () => {
    setInitLoading(true);
    // const res = await settingCache.get();
    // if (!res?.signData?.imgKey || !res?.signData?.subKey) {
    //   await apiInstance.setting.updateSignData();
    // }
    // if (!res?.spiData?.uuid_v3 || !res?.spiData?.uuid_v4) {
    //   await apiInstance.setting.updateSpiData();
    // }
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
        <BBMusicApp apiInstance={apiInstance}>
          <PcContainer
            headerProps={{
              operateRender: (
                <>
                  <Minus
                    title='最小化'
                    onClick={() => {
                      WindowMinimise();
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                  <Close
                    title='退出'
                    onClick={() => {
                      Quit();
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                </>
              ),
            }}
          />
        </BBMusicApp>
      )}
    </div>
  );
}

root.render(<Root />);
