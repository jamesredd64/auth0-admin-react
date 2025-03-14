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
    <div className="min-h-screen w-full">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex min-h-[calc(100vh-64px)] w-full items-center justify-center">
        <div className="text-center px-4">
          <h1 className="mb-4 text-4xl font-bold text-black dark:text-white">
            Welcome to Admin Dashboard
          </h1>
          <p className="mb-8 text-lg text-black dark:text-white">
            Please use the login button in the header to access the dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;