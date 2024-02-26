import { BBMusicApp } from 'bb-music-ui/app';
import { PcContainer } from 'bb-music-ui/app/modules';
import { apiInstance } from './api';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Close, Minus } from '@icon-park/react';
import { Quit, WindowMinimise } from '@wails/runtime';
import './style.scss';

const container = document.getElementById('root');
const root = createRoot(container!);

function Root() {
  const [initLoading, setInitLoading] = useState(false);

  const init = async () => {
    setInitLoading(true);
    try {
      await Promise.all(apiInstance.musicServices.map((s) => s.hooks?.init?.()));
    } catch (error) {
      console.log('error: ', error);
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
