import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import Header from '../components/Header';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth0();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/main" replace />;
  }

  return (
    <>
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-black dark:text-white">
            Welcome to Admin Dashboard
          </h1>
          <p className="mb-8 text-lg text-black dark:text-white">
            Please use the login button in the header to access the dashboard
          </p>
        </div>
      </div>
    </>
  );
};

export default HomePage;