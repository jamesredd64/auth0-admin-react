import React, { useState } from "react";
import { UserMetadata } from "../../types/user.js";
import Button from "../ui/button/Button.js";
import { Modal } from "../ui/modal/index";
import { useAuth0 } from "@auth0/auth0-react";
import { useMongoDbClient } from '../../services/mongoDbClient';

interface UserInfoCardProps {
  metadata: UserMetadata;
  onUpdate?: (newInfo: Partial<UserMetadata>) => void;
}

const defaultUserInfo = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: ''
};

const UserInfoCard = ({ metadata, onUpdate }: UserInfoCardProps) => {
  const { user } = useAuth0();
  const mongoDbapiClient = useMongoDbClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedUserInfo, setEditedUserInfo] = useState(defaultUserInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEditClick = () => {
    setEditedUserInfo({
      firstName: metadata.firstName || '',
      lastName: metadata.lastName || '',
      email: metadata.email || '',
      phoneNumber: metadata.phoneNumber || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user?.sub) {
        throw new Error('User ID not found');
      }

      const response = await mongoDbapiClient.updateUser(user.sub, {
        firstName: editedUserInfo.firstName,
        lastName: editedUserInfo.lastName,
        email: editedUserInfo.email,
        phoneNumber: editedUserInfo.phoneNumber
      });

      if (response.ok) {
        onUpdate?.(editedUserInfo);
        setIsEditModalOpen(false);
      } else {
        throw new Error(response.error || 'Failed to update user information');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error updating user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!metadata) return null;

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-black dark:text-white">
            Contact Information
          </h4>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEditClick}
            startIcon={
              <svg
                className="fill-current"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.8196 3.06667L12.9329 3.95333L11.0663 2.08667L11.9529 1.2C12.0996 1.05333 12.2796 0.98 12.4929 0.98C12.7063 0.98 12.8863 1.05333 13.0329 1.2L13.8196 1.98667C13.9663 2.13333 14.0396 2.31333 14.0396 2.52667C14.0396 2.74 13.9663 2.92 13.8196 3.06667ZM2.66626 10.4867L10.3996 2.75333L12.2663 4.62L4.53292 12.3533H2.66626V10.4867Z"
                  fill=""
                />
              </svg>
            }
          >
            Edit
          </Button>
        </div>
        <div className="p-7">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <span className="font-medium text-black dark:text-white">First Name</span>
                <span>{metadata.firstName}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-medium text-black dark:text-white">Last Name</span>
                <span>{metadata.lastName}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-medium text-black dark:text-white">Email</span>
                <span>{metadata.email}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-medium text-black dark:text-white">Phone</span>
                <span>{metadata.phoneNumber}</span>
              </div>
            </div>
          </div>

        <Modal
          isOpen={isEditModalOpen}
          className="!w-[50vw]"
          onClose={() => setIsEditModalOpen(false)}
        >
          <div className="space-y-4 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Edit Personal Information
          </h2>
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                First Name
              </label>
              <input
                type="text"
                value={editedUserInfo.firstName}
                onChange={(e) => setEditedUserInfo(prev => ({ ...prev, firstName: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Last Name
              </label>
              <input
                type="text"
                value={editedUserInfo.lastName}
                onChange={(e) => setEditedUserInfo(prev => ({ ...prev, lastName: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Email
              </label>
              <input
                type="email"
                value={editedUserInfo.email}
                onChange={(e) => setEditedUserInfo(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Phone Number
              </label>
              <input
                type="tel"
                value={editedUserInfo.phoneNumber}
                onChange={(e) => setEditedUserInfo(prev => ({ ...prev, phoneNumber: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
        </Modal>
      </div>
    </div>
     
    
      );
      };


export default UserInfoCard;
