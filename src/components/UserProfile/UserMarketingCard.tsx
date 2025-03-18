import React, { useState, useEffect } from "react";
import { UserMetadata } from "../../types/user.js";
import Button from "../ui/button/Button.js";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserProfileStore } from '../../stores/userProfileStore';
import Input from "../form/input/InputField.js";
import Label from "../form/Label.js";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";

interface UserMarketingCardProps {
  onUpdate: (newInfo: Partial<UserMetadata>) => void;
  initialData: {
    marketingBudget: {
      amount: number;
      frequency: 'daily' | 'monthly' | 'quarterly' | 'yearly';
      adCosts: number;
    };
  };
}

export const UserMarketingCard: React.FC<UserMarketingCardProps> = ({ onUpdate, initialData }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const { user } = useAuth0();
  const userProfile = useUserProfileStore();
  
  const [formData, setFormData] = useState({
    marketingBudget: {
      amount: initialData.marketingBudget?.amount || 0,
      frequency: initialData.marketingBudget?.frequency || 'monthly',
      adCosts: initialData.marketingBudget?.adCosts || 0
    }
  });

  useEffect(() => {
    setFormData({
      marketingBudget: {
        amount: initialData.marketingBudget?.amount || 0,
        frequency: initialData.marketingBudget?.frequency || 'monthly',
        adCosts: initialData.marketingBudget?.adCosts || 0
      }
    });
  }, [initialData]);

  const handleUpdate = (newData: Partial<UserMetadata>) => {
    userProfile.setHasUnsavedChanges(true);
    // ... rest of your update logic
  };
  
  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    // Set the form data
    setFormData(prev => ({
      marketingBudget: {
        ...prev.marketingBudget,
        [field]: field === 'frequency' ? e.target.value : Number(e.target.value)
      }
    }));
    
    // Set global unsaved changes flag
    userProfile.setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    try {
      if (!user?.sub) return;
      onUpdate(formData);
      closeModal();
    } catch (error) {
      console.error('Error saving marketing info:', error);
    }
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 group">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <h3 className="font-medium text-black dark:text-white">
          Marketing Information
        </h3>
      </div>
      
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                Marketing Budget 
              </h4>
              <p className="text-center text-gray-600 dark:text-gray-400 xl:text-left">
                Budget Amount: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(formData.marketingBudget.amount)}
              </p>
              <p className="text-center text-gray-600 dark:text-gray-400 xl:text-left">
                Frequency: {formData.marketingBudget.frequency}
              </p>
              <p className="text-center text-gray-600 dark:text-gray-400 xl:text-left">
                Ad Costs: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(formData.marketingBudget.adCosts)}
              </p>
            </div>
          </div>
          <button 
            onClick={openModal} 
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
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

      <Modal isOpen={isOpen} onClose={closeModal} className="!w-[33vw]">
        <div className="p-6 bg-white rounded-lg dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4">Edit Marketing Information</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>Budget Amount</Label>
                <Input
                  type="number"
                  value={formData.marketingBudget.amount}
                  onChange={handleInputChange('amount')}
                  step={0.01}
                  min="0"
                  placeholder="0.00"
                  className="pl-7"
                  prefix="$"
                  isCurrency={true}
                />
              </div>
              <div>
                <Label>Frequency</Label>
                <select
                  className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  value={formData.marketingBudget.frequency}
                  onChange={handleInputChange('frequency')}
                >
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div>
                <Label>Ad Costs</Label>
                <Input
                  type="number"
                  value={formData.marketingBudget.adCosts}
                  onChange={handleInputChange('adCosts')}
                  step={0.01}
                  min="0"
                  placeholder="0.00"
                  className="pl-7"
                  prefix="$"
                  isCurrency={true}
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
  );
};

export default UserMarketingCard;
