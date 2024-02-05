import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './style.scss';
import { AppRoutes } from './router';
import { SideBar } from './components/SideBar';
import { useEffect, useState } from 'react';
import { LoadSignData, UpdateClientSignData, GetSignData } from '@wails/go/app/App';
import { Player } from './player';
import { useConfigStore } from './store/config';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<Root />);

const IMG_KEY = 'imgKey';
const SUB_KEY = 'subKey';

function Root() {
  const configStore = useConfigStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    configStore.init();
  }, []);

  return (
    <BrowserRouter>
      <main className='mainLayout'>
        <SideBar />
        <div className='mainContainer'>
          <AppRoutes />
        </div>
        <Player />
      </main>
    </BrowserRouter>
  );
}
