import { useGlobalStorage } from "../hooks/useGlobalStorage.js";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";
import type { UserMetadata } from "../types/user";
import type { UserProfile } from "../services/userService";
import React from "react";

export default function UserProfiles() {
  const [userMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);
  const [mongoUser] = useGlobalStorage<UserProfile | null>('mongoUser', null);

  if (!userMetadata) {
    return <div>Loading user data...</div>;
  }

  return (
    <>
      <PageMeta
        title="User Profile Dashboard"
        description="User profile and settings management dashboard"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard metadata={userMetadata} />
          <UserInfoCard user={mongoUser} />
          <UserAddressCard address={mongoUser?.address} />
        </div>
      </div>
    </>
  );
}
