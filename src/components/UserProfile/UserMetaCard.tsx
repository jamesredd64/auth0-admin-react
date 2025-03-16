import React, { useState } from "react";
import { UserMetadata } from "../../types/user.js";
import Button from "../ui/button/Button.js";
import UserMetaEditForm from "./UserMetaEditForm";

interface UserMetaCardProps {
  metadata: UserMetadata;
  onUpdate?: (newInfo: Partial<UserMetadata>) => void;
}

const UserMetaCard = ({ metadata, onUpdate }: UserMetaCardProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!metadata) return null;

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleSave = (updatedData: Partial<UserMetadata>) => {
    onUpdate?.(updatedData);
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="flex justify-between items-center mb-4">Profile Overview</h4>
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

      <UserMetaEditForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        metadata={metadata}
        onSave={handleSave}
      />
    </div>
  );
};

export default UserMetaCard;
