import React from "react";
// import { UserProfile } from "../../services/userService";
import { UserMetadata } from "../../types/user.js";

interface UserInfoCardProps {
  metadata: UserMetadata;
}


const UserInfoCard = ({ metadata }: UserInfoCardProps) => {
  if (!metadata) return null;

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
        <h4 className="font-semibold text-black dark:text-white">
          Personal Information
        </h4>
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
          <div className="flex flex-col gap-2">
            <span className="font-medium text-black dark:text-white">Date of Birth</span>
            <span>{metadata.dateOfBirth}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-black dark:text-white">Gender</span>
            <span>{metadata.gender}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-black dark:text-white">Company</span>
            <span>{metadata.company}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-black dark:text-white">Position</span>
            <span>{metadata.position}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;
