// import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Loader from './common/Loader';
import HomePage from './pages/HomePage';
import MainPage from './pages/MainPage';

function App() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/main/*" element={<MainPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
