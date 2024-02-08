import { createRoot } from 'react-dom/client';
import './style.scss';
import { BBMusicApp } from '@/app';
import { PcContainer } from './app/modules/container';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(<Root />);

function Root() {
  // const configStore = useConfigStore();
  // const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   configStore.init();
  // }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        borderRadius: 4,
        overflow: 'hidden',
      }}
    >
      <BBMusicApp>
        <PcContainer />
      </BBMusicApp>
    </div>
  );
}
