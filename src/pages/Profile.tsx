import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import CoverOne from "../images/cover/cover-01.png";

interface CustomClaims {
  adBudget: number;
  costPerAcquisition: number;
  dailySpendingLimit: number;
  marketingChannels: string;
  monthlyBudget: number;
  preferredPlatforms: string;
  notificationPreferences: boolean;
  roiTarget: number;
  roles: string[];
}

const Profile = () => {
  const { user, isLoading, isAuthenticated, getIdTokenClaims } = useAuth0();
  const navigate = useNavigate();
  const [claimsData, setClaimsData] = useState<CustomClaims | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('User not authenticated, redirecting to home');
      navigate('/');
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    const fetchCustomClaims = async () => {
      try {
        const claims = await getIdTokenClaims();
        const namespace = 'https://dev-uizu7j8qzflxzjpy.jr.com';
        
        if (!claims) {
          throw new Error('Failed to fetch claims');
        }

        const customClaims = {
          adBudget: claims[`${namespace}/adBudget`],
          costPerAcquisition: claims[`${namespace}/costPerAcquisition`],
          dailySpendingLimit: claims[`${namespace}/dailySpendingLimit`],
          marketingChannels: claims[`${namespace}/marketingChannels`],
          monthlyBudget: claims[`${namespace}/monthlyBudget`],
          preferredPlatforms: claims[`${namespace}/preferredPlatforms`],
          notificationPreferences: claims[`${namespace}/notificationPreferences`],
          roiTarget: claims[`${namespace}/roiTarget`],
          roles: claims[`${namespace}/roles`],
        };

        setClaimsData(customClaims);
        setError(null);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('Error fetching custom claims:', errorMessage);
        setError(errorMessage);
      }
    };

    if (isAuthenticated) {
      fetchCustomClaims();
    }
  }, [isAuthenticated, getIdTokenClaims]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Breadcrumb pageName="Profile" />
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
              <img src={user.picture} alt="profile" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              {user.name}
            </h3>
            <p className="font-medium">{user.email}</p>

            {error ? (
              <p className="text-danger">{error}</p>
            ) : claimsData && (
              <div className="mx-auto max-w-180 mt-4">
                <h4 className="font-semibold text-black dark:text-white">Custom Claims</h4>
                <div className="mt-4 grid gap-2">
                  <div><strong>Ad Budget:</strong> ${claimsData.adBudget?.toLocaleString()}</div>
                  <div><strong>Cost Per Acquisition:</strong> ${claimsData.costPerAcquisition?.toLocaleString()}</div>
                  <div><strong>Daily Spending Limit:</strong> ${claimsData.dailySpendingLimit?.toLocaleString()}</div>
                  <div><strong>Marketing Channels:</strong> {claimsData.marketingChannels}</div>
                  <div><strong>Monthly Budget:</strong> ${claimsData.monthlyBudget?.toLocaleString()}</div>
                  <div><strong>Preferred Platforms:</strong> {claimsData.preferredPlatforms}</div>
                  <div><strong>Notification Preferences:</strong> {claimsData.notificationPreferences ? 'Enabled' : 'Disabled'}</div>
                  <div><strong>ROI Target:</strong> {(claimsData.roiTarget * 100).toFixed(1)}%</div>
                  <div><strong>Roles:</strong> {Array.isArray(claimsData.roles) ? claimsData.roles.join(', ') : claimsData.roles}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
