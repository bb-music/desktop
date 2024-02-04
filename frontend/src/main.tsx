import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './style.css';
import { AppRoutes } from './router';
import { SideBar } from './components/SideBar';
import { useEffect, useState } from 'react';
import { LoadSignData, UpdateClientSignData, GetSignData } from '@wails/go/app/App';
import { Player } from './player';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<Root />);

const IMG_KEY = 'imgKey';
const SUB_KEY = 'subKey';

function Root() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const imgKey = localStorage.getItem(IMG_KEY);
    const subKey = localStorage.getItem(SUB_KEY);
    GetSignData().then((res) => {
      if (!res.img_key || !res.sub_key) {
        if (imgKey && subKey) {
          setLoading(true);
          UpdateClientSignData({
            img_key: imgKey,
            sub_key: subKey,
          }).finally(() => {
            setLoading(false);
          });
        } else {
          setLoading(true);
          LoadSignData()
            .then((res) => {
              console.log('res: ', res);
              localStorage.setItem(IMG_KEY, res.img_key);
              localStorage.setItem(SUB_KEY, res.sub_key);
            })
            .finally(() => {
              setLoading(false);
            });
        }
      }
    });
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
