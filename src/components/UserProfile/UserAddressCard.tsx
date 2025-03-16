import React, { useState } from "react";
import { UserMetadata } from "../../types/user.js";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal/index";
import { useAuth0 } from "@auth0/auth0-react";
import { useMongoDbClient } from '../../services/mongoDbClient';
// import { useGlobalStorage } from '../../utils/globalStorage';
import { useGlobalStorage } from "../../hooks/useGlobalStorage";

interface UserAddressCardProps {
  metadata: UserMetadata;
  onUpdate: (newAddress: UserMetadata['address']) => void;
}

const defaultAddress = {
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: ''
};

const UserAddressCard = ({ metadata = { address: defaultAddress } as UserMetadata, onUpdate }: UserAddressCardProps) => {
  const { user } = useAuth0();
  const mongoDbapiClient = useMongoDbClient();
  const [userMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedAddress, setEditedAddress] = useState(metadata?.address || defaultAddress);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEditClick = () => {
    setEditedAddress(metadata?.address || defaultAddress);
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user?.sub) {
        throw new Error('User ID not found');
      }

      // Merge with existing data
      const updateData = {
        ...userMetadata, // Include all existing user data
        email: userMetadata?.email, // Ensure required field is included
        address: editedAddress // Update only the address portion
      };

      // Convert dateOfBirth to Date if it exists
      const formattedData = {
        ...updateData,
        profile: updateData.profile ? {
          ...updateData.profile,
          dateOfBirth: updateData.profile.dateOfBirth ? new Date(updateData.profile.dateOfBirth) : undefined
        } : undefined
      };
      
      const response = await mongoDbapiClient.updateUser(user.sub, formattedData);

      if (response.ok) {
        onUpdate?.(editedAddress);
        setIsEditModalOpen(false);
      } else {
        throw new Error(response.error || 'Failed to update address');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update address');
      console.error('Error updating address:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-black dark:text-white">
            Address Information
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
              <span className="font-medium text-black dark:text-white">Street</span>
              <span>{metadata?.address?.street || 'Not set'}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-medium text-black dark:text-white">City</span>
              <span>{metadata?.address?.city || 'Not set'}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-medium text-black dark:text-white">State</span>
              <span>{metadata?.address?.state || 'Not set'}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-medium text-black dark:text-white">ZIP Code</span>
              <span>{metadata?.address?.zipCode || 'Not set'}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-medium text-black dark:text-white">Country</span>
              <span>{metadata?.address?.country || 'Not set'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen} className="!w-[50vw]"
        onClose={() => setIsEditModalOpen(false)}
      >
        <div className="space-y-4 p-6">
          <h2 className="text-xl font-semibold mb-4">Edit Address</h2>
          {error && (
            <div className="text-red-500 text-sm mb-4">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Street</label>
            <input
              type="text"
              value={editedAddress.street}
              onChange={(e) => setEditedAddress({ ...editedAddress, street: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              value={editedAddress.city}
              onChange={(e) => setEditedAddress({ ...editedAddress, city: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              value={editedAddress.state}
              onChange={(e) => setEditedAddress({ ...editedAddress, state: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
            <input
              type="text"
              value={editedAddress.zipCode}
              onChange={(e) => setEditedAddress({ ...editedAddress, zipCode: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              value={editedAddress.country}
              onChange={(e) => setEditedAddress({ ...editedAddress, country: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsEditModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UserAddressCard;
