import React, { useState } from "react";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import UserMarketingCard from "../components/UserProfile/UserMarketingCard";
import { useGlobalStorage } from "../hooks/useGlobalStorage";
import { UserMetadata } from "../types/user";
import { useMongoDbClient } from '../services/mongoDbClient';
import Loader from "../components/common/Loader";

export default function UserProfiles() {
  const [userMetadata, setUserMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);
  const mongoDbapiClient = useMongoDbClient();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!userMetadata) return <div>Loading...</div>;

  const handleAddressUpdate = async (newAddress: UserMetadata['address']) => {
    try {
      setError(null);
      
      if (!userMetadata.email) {
        throw new Error('User email not found');
      }

      const response = await mongoDbapiClient.createOrUpdateUser({
        email: userMetadata.email,
        firstName: userMetadata.firstName || '',
        lastName: userMetadata.lastName || '',
        phoneNumber: userMetadata.phoneNumber || '',
        profile: {
          profilePictureUrl: userMetadata.profile?.profilePictureUrl || userMetadata.picture || ''
        },
        address: newAddress
      });

      // Update local state
      setUserMetadata({
        ...userMetadata,
        address: newAddress
      });

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update address';
      setError(errorMessage);
      throw err;
    }
  };

  const handleMetaUpdate = async (newMeta: Partial<UserMetadata>) => {
    try {
      setError(null);
      // Add your update logic here
      setUserMetadata({
        ...userMetadata,
        ...newMeta
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      throw err;
    }
  };

  const handleMarketingUpdate = async (newMarketing: Partial<UserMetadata>) => {
    try {
      setError(null);
      // Add your update logic here
      setUserMetadata({
        ...userMetadata,
        ...newMarketing
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update marketing info';
      setError(errorMessage);
      throw err;
    }
  };
  {isLoading ? (
    <div className="flex justify-center p-4">
      <Loader size="medium" className="border-gray-900 dark:border-gray-100" />
    </div>
  ) : null}

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        {error && (
          <div className="mb-4 text-red-500">
            {error}
          </div>
        )}
        <div className="space-y-6">
          <UserMetaCard 
            metadata={userMetadata} 
            onUpdate={handleMetaUpdate}
          />
          <UserInfoCard 
            metadata={userMetadata}
            onUpdate={handleMetaUpdate}
          /> 
          <UserAddressCard 
            metadata={userMetadata} 
            onUpdate={handleAddressUpdate}
          />
          <UserMarketingCard 
            metadata={userMetadata}
            onUpdate={handleMarketingUpdate}
          />
        </div>
      </div>
    </>
  );
}