import { BBMusicApp, MobileContainer, PcContainer } from '@bb-music/web-app';
import { apiInstance } from '../../api';
import { useEffect, useState } from 'react';
import { Close, Minus } from '@icon-park/react';
import { Quit, WindowMinimise } from '../../../wailsjs/runtime';
import '../../style.scss';

export default function Root() {
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
                    title="最小化"
                    onClick={() => {
                      WindowMinimise();
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                  <Close
                    title="退出"
                    onClick={() => {
                      Quit();
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                </>
              ),
            }}
          />
          {/* <MobileContainer /> */}
        </BBMusicApp>
      )}
    </div>
  );
}
