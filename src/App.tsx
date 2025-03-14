import { Route, Routes } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Loader from './common/Loader';
import HomePage from './pages/HomePage';
import MainPage from './pages/MainPage';

function App() {
  const { isLoading, isAuthenticated, error, user } = useAuth0();
  const namespace = 'https://myapp.example.com';

  console.log("App render - Auth state:", { isLoading, isAuthenticated, error });

  if (isLoading) {
    console.log("Loading...");
    return <Loader />;
  }

  if (error) {
    console.log("Error:", error.message);
    return <div>Oops... {error.message}</div>;
  }

  if (isAuthenticated && user) {
    console.log("User Metadata:", {
      adBudget: user[`${namespace}/adBudget`],
      costPerAcquisition: user[`${namespace}/costPerAcquisition`],
      dailySpendingLimit: user[`${namespace}/dailySpendingLimit`],
      marketingChannels: user[`${namespace}/marketingChannels`],
      monthlyBudget: user[`${namespace}/monthlyBudget`],
      preferredPlatforms: user[`${namespace}/preferredPlatforms`],
      notificationPreferences: user[`${namespace}/notificationPreferences`],
      roiTarget: user[`${namespace}/roiTarget`]
    });
  }

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/main/*" element={
              isAuthenticated ? <MainPage /> : <HomePage />
            } />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
