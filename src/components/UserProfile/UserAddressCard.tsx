import React, { useState, useEffect } from "react";
import { UserMetadata } from "../../types/user.js";
import Button from "../ui/button/Button.js";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserProfileStore } from '../../stores/userProfileStore';
import Input from "../form/input/InputField.js";
import Label from "../form/Label.js";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";

interface UserAddressCardProps {
  onUpdate: (newInfo: Partial<UserMetadata>) => void;
  initialData: {
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
}

export const UserAddressCard: React.FC<UserAddressCardProps> = ({ onUpdate, initialData }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const { user } = useAuth0();
  const userProfile = useUserProfileStore();
  
  const [formData, setFormData] = useState({
    address: {
      street: initialData.address?.street || '',
      city: initialData.address?.city || '',
      state: initialData.address?.state || '',
      zipCode: initialData.address?.zipCode || '',
      country: initialData.address?.country || ''
    }
  });

  const [saveResult, setSaveResult] = useState<string>('');

  useEffect(() => {
    setFormData({
      address: {
        street: initialData.address?.street || '',
        city: initialData.address?.city || '',
        state: initialData.address?.state || '',
        zipCode: initialData.address?.zipCode || '',
        country: initialData.address?.country || ''
      }
    });
  }, [initialData]);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      address: {
        ...prev.address,
        [field]: e.target.value
      }
    }));
  };

  const handleSave = async () => {
    try {
      if (!user?.sub) return;
      onUpdate(formData);
      const result = JSON.stringify(formData, null, 2);
      console.log('Save result:', result); // Debug log
      setSaveResult(result);
      closeModal();
    } catch (error) {
      console.error('Error saving address info:', error);
      setSaveResult(`Error: ${error}`);
    }
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 group">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <h3 className="font-medium text-black dark:text-white">
            Address Information
          </h3>
        </div>
        
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Column */}
            <div className="space-y-4">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Street Address</span>
                <p className="text-gray-600 dark:text-gray-400">
                  {formData.address.street || 'Not set'}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">City</span>
                <p className="text-gray-600 dark:text-gray-400">
                  {formData.address.city || 'Not set'}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">State</span>
                <p className="text-gray-600 dark:text-gray-400">
                  {formData.address.state || 'Not set'}
                </p>
              </div>
            </div>

            {/* Second Column */}
            <div className="space-y-4">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">ZIP Code</span>
                <p className="text-gray-600 dark:text-gray-400">
                  {formData.address.zipCode || 'Not set'}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Country</span>
                <p className="text-gray-600 dark:text-gray-400">
                  {formData.address.country || 'Not set'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button 
              onClick={openModal} 
              className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <svg
                className="fill-current"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206Z"
                  fill=""
                />
              </svg>
              Edit
            </button>
          </div>
        </div>

        <Modal isOpen={isOpen} onClose={closeModal}>
          <div className="p-6 bg-white rounded-lg dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4">Edit Address Information</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label>Street Address</Label>
                  <Input
                    type="text"
                    value={formData.address.street}
                    onChange={handleInputChange('street')}
                  />
                </div>
                <div>
                  <Label>City</Label>
                  <Input
                    type="text"
                    value={formData.address.city}
                    onChange={handleInputChange('city')}
                  />
                </div>
                <div>
                  <Label>State</Label>
                  <Input
                    type="text"
                    value={formData.address.state}
                    onChange={handleInputChange('state')}
                  />
                </div>
                <div>
                  <Label>ZIP Code</Label>
                  <Input
                    type="text"
                    value={formData.address.zipCode}
                    onChange={handleInputChange('zipCode')}
                  />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input
                    type="text"
                    value={formData.address.country}
                    onChange={handleInputChange('country')}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <Button onClick={closeModal} variant="outline">
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      </div>

      {/* Save Result Card - Separate from main address card */}
      {saveResult && (
        <div className="mt-4 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
            {/* <h3 className="font-medium text-black dark:text-white">
              Last Save Result
            </h3> */}
          </div>
          {/* <div className="p-7">
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-auto max-h-60 text-sm whitespace-pre-wrap">
              {saveResult}
            </pre>
          </div> */}
        </div>
      )}
    </>
  );
};

export default UserAddressCard;
