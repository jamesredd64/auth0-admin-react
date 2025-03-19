
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import { useGlobalStorage } from './hooks/useGlobalStorage';
import AppLayout from "./layout/AppLayout";
import { useEffect, useRef } from 'react';
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/ProfilePage";
import Calendar from "./pages/Calendar";
import Home from "./pages/Dashboard/Home";
import TestP from "./pages/test";
import TestPage from "./pages/TestPage";
import React from "react";
import SignedOut from "./pages/SignedOut";
import Loader from './components/common/Loader';
import { useMongoDbClient } from './services/mongoDbClient';
import MongoInitializer from './components/MongoInitializer';
import ErrorBoundary from './components/ErrorBoundary';

interface UserMetadata {
  adBudget: number;
  costPerAcquisition: number;
  dailySpendingLimit: number;
  marketingChannels: string;
  monthlyBudget: number;
  preferredPlatforms: string;
  notificationPreferences: boolean;
  roiTarget: number;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string; 
  dateOfBirth: string;
  gender: string;
  profilePictureUrl: string;
  marketingBudget: {
    adBudget: number;
      costPerAcquisition: number;
      dailySpendingLimit: number;
      marketingChannels: string;
      monthlyBudget: number;
      preferredPlatforms: string;
      notificationPreferences: string[]; // Changed from boolean to string[]
      roiTarget: number;
      frequency: "daily" | "monthly" | "quarterly" | "yearly";      
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;    
  };
  auth0Id: string;
}

function App() {
  const { isLoading, isAuthenticated, error, user } = useAuth0();
  const navigate = useNavigate();
  const [userMetadata, setUserMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);
  const { checkAndInsertUser } = useMongoDbClient();
  const initializationAttempted = useRef(false);

  // Update profile picture only when user data changes
  useEffect(() => {
    if (user?.picture && userMetadata && userMetadata.profilePictureUrl !== user.picture) {
      setUserMetadata({
        ...userMetadata,
        profilePictureUrl: user.picture
      });
    }
  }, [user?.picture]); // Remove setUserMetadata and userMetadata from dependencies

  // Handle authentication state changes
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setUserMetadata(null);
      navigate('/signed-out');
    }
  }, [isLoading, isAuthenticated, navigate]); // Remove setUserMetadata from dependencies

  // Initialize user data
  useEffect(() => {
    const initializeUserData = async () => {
      if (!isAuthenticated || !user?.sub || initializationAttempted.current) {
        return;
      }
      initializationAttempted.current = true;
      try {
        const userData = await checkAndInsertUser(user.sub);
        if (userData) {
          setUserMetadata({
            ...userData,
            profilePictureUrl: user?.picture || '',
            auth0Id: userData.auth0Id || user.sub
          });
        }
      } catch (error) {
        console.error('Error initializing user data:', error);
      }
    };

    if (isAuthenticated && user?.sub) {
      initializeUserData();
    }
  }, [isAuthenticated, user?.sub, checkAndInsertUser]); // Only depend on these values

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Routes>
            <Route path="/signed-out" element={<SignedOut />} />
            {isAuthenticated ? (
              <Route element={<AppLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/test" element={
                  <ErrorBoundary>
                    <TestPage />
                  </ErrorBoundary>
                } />
                <Route path="/lg" element={<TestP />} />
                <Route path="/dashboard" element={<Home />} />
                <Route path="/profile" element={<UserProfiles />} />
                <Route path="/calendar" element={<Calendar />} />
              </Route>
            ) : (
              <Route path="*" element={<Navigate to="/signed-out" replace />} />
            )}
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
// Removed unused functions at the bottom
