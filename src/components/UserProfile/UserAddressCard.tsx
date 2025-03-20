import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useModal } from '../../hooks/useModal';
import { useUserProfileStore } from '../../stores/userProfileStore';

interface UserAddressCardProps {
  onUpdate: (data: any) => void;
  initialData: {
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
  };
}

export const UserAddressCard: React.FC<UserAddressCardProps> = ({ onUpdate, initialData }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const { user } = useAuth0();
  const userProfile = useUserProfileStore();
  const [saveResult, setSaveResult] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    address: {
      street: initialData.address?.street || '',
      city: initialData.address?.city || '',
      state: initialData.address?.state || '',
      zipCode: initialData.address?.zipCode || '',
      country: initialData.address?.country || ''
    }
  });

  useEffect(() => {
    const newFormData = {
      address: {
        street: initialData.address?.street || '',
        city: initialData.address?.city || '',
        state: initialData.address?.state || '',
        zipCode: initialData.address?.zipCode || '',
        country: initialData.address?.country || ''
      }
    };

    // Only update if the data has actually changed
    if (JSON.stringify(formData) !== JSON.stringify(newFormData)) {
      setFormData(newFormData);
    }
  }, [initialData]);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      address: {
        ...prev.address,
        [field]: e.target.value
      }
    }));
    userProfile.setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    try {
      if (!user?.sub) return;
      onUpdate(formData);
      // setSaveResult('Address saved successfully');
      closeModal();
    } catch (error) {
      console.error('Error saving address info:', error);
      setSaveResult('Error saving address');
    }
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 group">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <h3 className="font-medium text-black dark:text-white">
            Address Information
          </h3>
          <button
            onClick={openModal}
            className="flex items-center justify-center gap-1 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            Edit Address
          </button>
        </div>

        <div className="mt-4">
          <p className="text-gray-600 dark:text-gray-400">
            {formData.address.street}, {formData.address.city}
            <br />
            {formData.address.state} {formData.address.zipCode}
            <br />
            {formData.address.country}
          </p>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Edit Address</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Street"
                value={formData.address.street}
                onChange={handleInputChange('street')}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="City"
                value={formData.address.city}
                onChange={handleInputChange('city')}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="State"
                value={formData.address.state}
                onChange={handleInputChange('state')}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Zip Code"
                value={formData.address.zipCode}
                onChange={handleInputChange('zipCode')}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Country"
                value={formData.address.country}
                onChange={handleInputChange('country')}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {saveResult && (
        <div className="mt-4 p-4 rounded-lg bg-green-100 dark:bg-green-900">
          <p className="text-green-700 dark:text-green-300">{saveResult}</p>
        </div>
      )}
    </>
  );
};

export default UserAddressCard;
