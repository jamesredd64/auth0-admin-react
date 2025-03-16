import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserMetaCard from '../components/UserProfile/UserMetaCard';
import UserAddressCard from '../components/UserProfile/UserAddressCard';
import UserInfoCard from '../components/UserProfile/UserInfoCard';
import UserMarketingCard from '../components/UserProfile/UserMarketingCard';
import Button from '../components/ui/button/Button';
import { Modal } from '../components/ui/modal';
import { useAuth0 } from '@auth0/auth0-react';
import { useMongoDbClient } from '../services/mongoDbClient';
import { UserMetadata } from '../types/user';

const UserProfiles = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth0();
  const mongoDbapiClient = useMongoDbClient();
  
  const [userData, setUserData] = useState<UserMetadata | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Partial<UserMetadata>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [navigationPath, setNavigationPath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data function
  const fetchUserData = async () => {
    if (!user?.sub) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await mongoDbapiClient.getUserById(user.sub);
      console.log('user sub ' + user.sub);
      setUserData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch when component mounts
  if (!userData && !isLoading && !error && user?.sub) {
    fetchUserData();
  }

  // Track changes from any card
  const handleChange = (changes: Partial<UserMetadata>) => {
    setPendingChanges(prev => ({
      ...prev,
      ...changes
    }));
    setHasUnsavedChanges(true);
  };

  // Save all changes
  const handleSaveAll = async () => {
    if (!user?.sub) {
      setError('User ID not found');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const validFrequencies = ["daily", "monthly", "quarterly", "yearly"] as const;
      const frequency = pendingChanges.profile?.marketingBudget?.frequency;

      const transformedChanges = {
        ...pendingChanges,
        profile: pendingChanges.profile ? {
          dateOfBirth: pendingChanges.profile.dateOfBirth ? new Date(pendingChanges.profile.dateOfBirth) : undefined,
          gender: pendingChanges.profile.gender,
          profilePictureUrl: pendingChanges.profile.profilePictureUrl,
          marketingBudget: pendingChanges.profile.marketingBudget ? {
            amount: pendingChanges.profile.marketingBudget.amount,
            frequency: validFrequencies.includes(frequency as any) 
              ? (frequency as "daily" | "monthly" | "quarterly" | "yearly")
              : "monthly",
            adCosts: pendingChanges.profile.marketingBudget.adCosts
          } : undefined
        } : undefined
      };

      const response = await mongoDbapiClient.updateUser(user.sub, transformedChanges);
      
      if (response.ok) {
        setUserData(prev => ({
          ...prev,
          ...pendingChanges
        } as UserMetadata));
        setPendingChanges({});
        setHasUnsavedChanges(false);
      } else {
        throw new Error('Failed to save changes');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error saving changes');
      console.error('Error saving all changes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle navigation attempts
  const handleNavigation = (path: string) => {
    if (hasUnsavedChanges) {
      setNavigationPath(path);
      setShowUnsavedModal(true);
    } else {
      navigate(path);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Profile</h1>
        <div className="flex gap-3">
          <Button
            onClick={fetchUserData}
            className="bg-secondary text-white"
            disabled={isLoading}
          >
            Refresh
          </Button>
          {hasUnsavedChanges && (
            <Button
              onClick={handleSaveAll}
              className="bg-primary text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save All Changes'}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        <UserInfoCard
          metadata={userData || {} as UserMetadata}
          onUpdate={handleChange}
        />
        <UserMetaCard
          metadata={userData || {} as UserMetadata}
          onUpdate={handleChange}
        />
        <UserAddressCard
          metadata={userData || {} as UserMetadata}
          onUpdate={handleChange}
        />
        <UserMarketingCard
          metadata={userData || {} as UserMetadata}
          onUpdate={handleChange}
        />
      </div>

      <Modal
        isOpen={showUnsavedModal}
        onClose={() => setShowUnsavedModal(false)}
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Unsaved Changes</h3>
          <p className="mb-4">You have unsaved changes. Would you like to save them before leaving?</p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowUnsavedModal(false);
                if (navigationPath) navigate(navigationPath);
              }}
            >
              Discard Changes
            </Button>
            <Button
              onClick={async () => {
                await handleSaveAll();
                setShowUnsavedModal(false);
                if (navigationPath) navigate(navigationPath);
              }}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserProfiles;
