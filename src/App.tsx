import { useAuth0 } from '@auth0/auth0-react';
import Profile from './components/Profile';

function App() {
  const { 
    isLoading, 
    isAuthenticated, 
    error, 
    user, 
    loginWithRedirect, 
    logout 
  } = useAuth0();

  console.log("App render - Auth state:", { isLoading, isAuthenticated, error });

  if (isLoading) {
    console.log("Loading...");
    return <div>Loading...</div>;
  }

  if (error) {
    console.log("Error:", error.message);
    return <div>Oops... {error.message}</div>;
  }

  if (isAuthenticated) {
    console.log("User authenticated:", user);
    return (
      <div>
        <h1>Hello {user?.name}</h1>
        <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
          Log out
        </button>
        <Profile />
      </div>
    );
  } else {
    console.log("User not authenticated");
    return <button onClick={() => loginWithRedirect()}>Log in</button>;
  }
}

export default App;

/* Original complex version - commented out
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
*/
