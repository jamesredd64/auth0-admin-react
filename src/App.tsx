
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

  // Handle authentication state changes
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Clear any existing user data
        setUserMetadata(null);
        navigate('/signed-out');
      }
    }
  }, [isLoading, isAuthenticated, navigate, setUserMetadata]);

  // Only attempt to initialize user data when authenticated
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
            adBudget: userData.adBudget || 0,
            costPerAcquisition: userData.costPerAcquisition || 0,
            dailySpendingLimit: userData.dailySpendingLimit || 0,
            marketingChannels: userData.marketingChannels || '',
            monthlyBudget: userData.monthlyBudget || 0,
            preferredPlatforms: userData.preferredPlatforms || '',
            notificationPreferences: userData.notificationPreferences || false,
            roiTarget: userData.roiTarget || 0,
            name: userData.name || '',
            email: userData.email || '',
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            phoneNumber: userData.phoneNumber || '',
            dateOfBirth: userData.dateOfBirth || '',
            gender: userData.gender || '',
            profilePictureUrl: userData.profilePictureUrl || '',
            marketingBudget: {
              amount: userData.marketingBudget?.amount || 0,
              frequency: userData.marketingBudget?.frequency || 'monthly',
              adCosts: userData.marketingBudget?.adCosts || 0
            },
            address: {
              street: userData.address?.street || '',
              city: userData.address?.city || '',
              state: userData.address?.state || '',
              zipCode: userData.address?.zipCode || '',
              country: userData.address?.country || ''
            },
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
  }, [isAuthenticated, user, checkAndInsertUser, setUserMetadata]);

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
