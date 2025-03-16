import React, { useState } from "react";
import { UserMetadata } from "../../types/user.js";
import Button from "../ui/button/Button.js";
import UserMetaEditForm from "./UserMetaEditForm";
import { useAuth0 } from "@auth0/auth0-react";
import { useMongoDbClient } from '../../services/mongoDbClient';

interface UserMetaCardProps {
  metadata: UserMetadata;
  onUpdate?: (newInfo: Partial<UserMetadata>) => void;
}

const UserMetaCard = ({ metadata, onUpdate }: UserMetaCardProps) => {
  const { user } = useAuth0();
  const mongoDbapiClient = useMongoDbClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!metadata) return null;

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleSave = async (updatedData: Partial<UserMetadata>) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user?.sub) {
        throw new Error('User ID not found');
      }

      const formattedData = {
        ...updatedData,
        profile: updatedData.profile ? {
          ...updatedData.profile,
          dateOfBirth: updatedData.profile.dateOfBirth ? new Date(updatedData.profile.dateOfBirth) : undefined,
          marketingBudget: updatedData.profile.marketingBudget || undefined
        } : undefined
      };

      const response = await mongoDbapiClient.updateUser(user.sub, formattedData);

      if (response.ok) {
        onUpdate?.(updatedData);
        setIsEditModalOpen(false);
      } else {
        throw new Error(response.error || 'Failed to update profile information');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile information');
      console.error('Error updating profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (   
    
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <img src={metadata.picture} alt={metadata.name} className="w-full h-full object-cover" />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-white-800 dark:text-white/90 xl:text-left">
                {metadata.name}
              </h4>
              <p className="text-center text-gray-600 dark:text-gray-400 xl:text-left">
                {metadata.email}
              </p>
              {metadata.roles && metadata.roles.length > 0 && (
                <p className="text-center text-gray-600 dark:text-gray-400 xl:text-left">
                  Role: {metadata.roles[0]}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  

      <UserMetaEditForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        metadata={metadata}
        onSave={handleSave}
      />
  
};

export default UserMetaCard;
