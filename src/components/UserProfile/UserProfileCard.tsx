import React from "react";
import { UserMetadata } from "../../types/user";

interface UserProfileCardProps {
  metadata: UserMetadata;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ metadata }) => {
  if (!metadata) return null;

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
        <h4 className="font-semibold text-black dark:text-white">
          Profile Information
        </h4>
      </div>
      <div className="p-7">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <span className="font-medium text-black dark:text-white">Date of Birth</span>
            <span>{metadata.profile?.dateOfBirth ? new Date(metadata.profile.dateOfBirth).toLocaleDateString() : 'Not set'}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-black dark:text-white">Gender</span>
            <span>{metadata.profile?.gender || 'Not set'}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-black dark:text-white">Company</span>
            <span>{metadata.profile?.company || 'Not set'}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-black dark:text-white">Position</span>
            <span>{metadata.profile?.position || 'Not set'}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-black dark:text-white">Bio</span>
            <span>{metadata.profile?.bio || 'Not set'}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-black dark:text-white">Profile Picture URL</span>
            <span className="truncate">{metadata.profile?.profilePictureUrl || 'Not set'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;