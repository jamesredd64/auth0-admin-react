import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalStorage } from "../hooks/useGlobalStorage";
import Breadcrumb from "../components/common/PageBreadCrumb";
import CoverOne from "../images/cover/cover-01.png";
import { userService, UserProfile } from "../services/userService";
import React from "react";

interface UserMetadata {
  adBudget: number;
  costPerAcquisition: number;
  dailySpendingLimit: number;
  marketingChannels: string;
  monthlyBudget: number;
  preferredPlatforms: string;
  notificationPreferences: boolean;
  roiTarget: number;
  name: string;
  nickname: string;
  roles: string[];
  email: string;
  picture: string;
}

const Profile = () => {
  const { user, isLoading, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [userMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);
  const [mongoUser, setMongoUser] = useGlobalStorage<UserProfile | null>('mongoUser', null);
  const [error, setError] = useState<string | null>(null);

  const formatUserData = (userData: UserProfile): UserProfile => ({
    email: userData.email,
    firstName: userData.firstName || undefined,
    lastName: userData.lastName || undefined,
    phoneNumber: userData.phoneNumber || undefined,
    profile: userData.profile ? {
      profilePictureUrl: userData.profile.profilePictureUrl || undefined,
      dateOfBirth: userData.profile.dateOfBirth ? new Date(userData.profile.dateOfBirth) : undefined,
      gender: userData.profile.gender || undefined,
      marketingBudget: userData.profile.marketingBudget ? {
        amount: userData.profile.marketingBudget.amount || 0,
        frequency: userData.profile.marketingBudget.frequency || 'monthly',
        adCosts: userData.profile.marketingBudget.adCosts || 0
      } : undefined
    } : undefined,
    address: userData.address ? {
      street: userData.address.street || undefined,
      city: userData.address.city || undefined,
      state: userData.address.state || undefined,
      zipCode: userData.address.zipCode || undefined,
      country: userData.address.country || undefined
    } : undefined
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('User not authenticated, redirecting to home');
      navigate('/');
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchMongoUser = async () => {
      if (!user?.email) return;
      
      try {
        const userData = await userService.getUserByEmail(user.email);
        if (userData) {
          setMongoUser(formatUserData({
            email: userData.email,
            firstName: userData.firstName || undefined,
            lastName: userData.lastName || undefined,
            phoneNumber: userData.phoneNumber || undefined,
            profile: userData.profile ? {
              profilePictureUrl: userData.profile.profilePictureUrl || undefined,
              dateOfBirth: userData.profile.dateOfBirth ? new Date(userData.profile.dateOfBirth) : undefined,
              gender: userData.profile.gender || undefined,
              marketingBudget: userData.profile.marketingBudget ? {
                amount: userData.profile.marketingBudget.amount || 0,
                frequency: userData.profile.marketingBudget.frequency || 'monthly',
                adCosts: userData.profile.marketingBudget.adCosts || 0
              } : undefined
            } : undefined,
            address: userData.address ? {
              street: userData.address.street || undefined,
              city: userData.address.city || undefined,
              state: userData.address.state || undefined,
              zipCode: userData.address.zipCode || undefined,
              country: userData.address.country || undefined
            } : undefined
          }));
        } else {
          // Create new user in MongoDB if they don't exist
          const newUser = await userService.createUser({
            email: user.email,
            firstName: user.given_name || undefined,
            lastName: user.family_name || undefined,
            profile: {
              profilePictureUrl: user.picture || undefined
            }
          });
          setMongoUser(formatUserData({
            email: newUser.email,
            firstName: newUser.firstName || undefined,
            lastName: newUser.lastName || undefined,
            phoneNumber: newUser.phoneNumber || undefined,
            profile: newUser.profile ? {
              profilePictureUrl: newUser.profile.profilePictureUrl || undefined,
              dateOfBirth: newUser.profile.dateOfBirth ? new Date(newUser.profile.dateOfBirth) : undefined,
              gender: newUser.profile.gender || undefined,
              marketingBudget: newUser.profile.marketingBudget ? {
                amount: newUser.profile.marketingBudget.amount || 0,
                frequency: newUser.profile.marketingBudget.frequency || 'monthly',
                adCosts: newUser.profile.marketingBudget.adCosts || 0
              } : undefined
            } : undefined,
            address: newUser.address ? {
              street: newUser.address.street || undefined,
              city: newUser.address.city || undefined,
              state: newUser.address.state || undefined,
              zipCode: newUser.address.zipCode || undefined,
              country: newUser.address.country || undefined
            } : undefined
          }));
        }
        setError(null);
      } catch (error) {
        console.error('Error fetching MongoDB user:', error);
        setError('Failed to load profile data. Please try again later.');
      }
    };

    if (user?.email) {
      fetchMongoUser();
    }
  }, [user, setMongoUser]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user || !userMetadata) {
    return null;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb pageTitle="Profile" />
      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="relative z-20 h-35 md:h-65">
          <img
            src={CoverOne}
            alt="profile cover"
            className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
          />
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-30 max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:w-44 sm:max-w-44 sm:p-3">
            <div className="relative drop-shadow-2">
              <img src={userMetadata.picture} alt="profile" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              {userMetadata.name}
            </h3>
            <p className="font-medium">{userMetadata.email}</p>
            <p className="font-medium">Roles: {userMetadata.roles.join(', ')}</p>

            <div className="mx-auto max-w-180 mt-4">
              <h4 className="font-semibold text-black dark:text-white">User Metadata</h4>
              <div className="mt-4 grid gap-2">
                <div><strong>Ad Budget:</strong> ${userMetadata.adBudget?.toLocaleString()}</div>
                <div><strong>Cost Per Acquisition:</strong> ${userMetadata.costPerAcquisition?.toLocaleString()}</div>
                <div><strong>Daily Spending Limit:</strong> ${userMetadata.dailySpendingLimit?.toLocaleString()}</div>
                <div><strong>Marketing Channels:</strong> {userMetadata.marketingChannels}</div>
                <div><strong>Monthly Budget:</strong> ${userMetadata.monthlyBudget?.toLocaleString()}</div>
                <div><strong>Preferred Platforms:</strong> {userMetadata.preferredPlatforms}</div>
                <div><strong>Notification Preferences:</strong> {userMetadata.notificationPreferences ? 'Enabled' : 'Disabled'}</div>
                <div><strong>ROI Target:</strong> {(userMetadata.roiTarget * 100).toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {mongoUser && (
        <div className="mt-4">
          <h4 className="font-semibold text-black dark:text-white">Additional Profile Information</h4>
          <div className="mt-4 grid gap-2">
            <div><strong>Phone:</strong> {mongoUser.phoneNumber}</div>
            {mongoUser.address && (
              <>
                <div><strong>Street:</strong> {mongoUser.address.street}</div>
                <div><strong>City:</strong> {mongoUser.address.city}</div>
                <div><strong>State:</strong> {mongoUser.address.state}</div>
                <div><strong>ZIP:</strong> {mongoUser.address.zipCode}</div>
                <div><strong>Country:</strong> {mongoUser.address.country}</div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
