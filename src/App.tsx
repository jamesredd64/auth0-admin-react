
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import { useGlobalStorage } from './hooks/useGlobalStorage';
import AppLayout from "./layout/AppLayout";
import { useEffect, useRef } from 'react';
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles-old-new";
import Calendar from "./pages/Calendar";
import Home from "./pages/Dashboard/Home";
import TestPage from "./pages/TestPage";
import React from "react";
import SignedOut from "./pages/SignedOut";
import Loader from './components/common/Loader';
import { useMongoDbClient } from './services/mongoDbClient';
import MongoInitializer from './components/MongoInitializer';

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
  nickname: string;
  roles: string[];
  email: string;
  picture: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  industry: string;
  dateOfBirth: string;
  gender: string;
  bio: string;
  company: string;
  position: string;
  profilePictureUrl: string;
  marketingBudget: {
    amount: number;
    frequency: string;
    adCosts: number;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    taxId: string;
  };
  auth0Id: string;
}

function App() {
  const { isLoading, isAuthenticated, error, user } = useAuth0();
  const navigate = useNavigate();
  const [userMetadata, setUserMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);
  const { fetchUserData } = useMongoDbClient();
  const initializationAttempted = useRef(false);

  useEffect(() => {
    const initializeUserData = async () => {
      if (!isAuthenticated || !user?.sub || initializationAttempted.current) {
        console.log("Not Initialized");
        return;
      }

      initializationAttempted.current = true;

      try {
        const userData = await fetchUserData(user.sub);
        if (userData) {
          setUserMetadata({
            ...userData,
            bio: userData.bio || '',
            company: userData.company || '',
            position: userData.position || '',
            industry: userData.industry || '',
            dateOfBirth: userData.dateOfBirth || '',
            gender: userData.gender || '',
            profilePictureUrl: userData.profilePictureUrl || '',
          });
        }
      } catch (error) {
        console.error('Error initializing user data:', error);
      }
    };

    initializeUserData();
  }, [isAuthenticated, user, fetchUserData, setUserMetadata]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/signed-out');
    }
  }, [isLoading, isAuthenticated, navigate]);

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
                <Route path="/test" element={<TestPage />} />
                <Route path="/dashboard" element={<Home />} />
                <Route path="/profile" element={<UserProfiles />} />
                <Route path="/calendar" element={<Calendar />} />
              </Route>
            ) : null}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
// Removed unused functions at the bottom
