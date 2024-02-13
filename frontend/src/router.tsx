import { Routes, Route, useNavigate, NavigateOptions, To } from 'react-router-dom';
// import Home from './views/home';
// // import Search from './views/search';
// import PartList from './views/parts';
// import MyMusicList from './views/my';
// import Config from './views/config';
// import MusicOrderDetail from './views/musicOrderDetail';

export let router: {
  push: (to: To, options?: NavigateOptions) => void;
  replace: (to: To, options?: Omit<NavigateOptions, 'replace'>) => void;
};

export function AppRoutes() {
  const navigate = useNavigate();
  router = {
    push: (to: To, options?: NavigateOptions) => navigate(to, options),
    replace: (to: To, options?: NavigateOptions) => navigate(to, { replace: true, ...options }),
  };

  return (
    <Routes>
      {/* <Route
        path='/'
        Component={Home}
      />
      <Route
        path='/search'
        Component={Search}
      />
      <Route
        path='/parts'
        Component={PartList}
      />
      <Route
        path='/my'
        Component={MyMusicList}
      />
      <Route
        path='/config'
        Component={Config}
      />
      <Route
        path='/music-order-detail'
        Component={MusicOrderDetail}
      /> */}
    </Routes>
  );
}
