import React, { useState } from "react";
import Button from "../ui/button/Button.js";
import { Modal } from "../ui/modal/index";
import { useGlobalStorage } from "../../hooks/useGlobalStorage";
import { UserMetadata } from "../../types/user.js";
import { useAuth0 } from "@auth0/auth0-react";
import { useMongoDbClient } from "../../services/mongoDbClient";

interface UserMarketingCardProps {
  metadata?: UserMetadata;
  onUpdate?: (newInfo: Partial<UserMetadata>) => void;
}

const UserMarketingCard = ({ metadata, onUpdate }: UserMarketingCardProps) => {
  const { user } = useAuth0();
  const mongoDbapiClient = useMongoDbClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedMarketingInfo, setEditedMarketingInfo] = useState<
    Partial<UserMetadata>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEditClick = () => {
    if (metadata) {
      setEditedMarketingInfo({
        adBudget: metadata.adBudget,
        costPerAcquisition: metadata.costPerAcquisition,
        dailySpendingLimit: metadata.dailySpendingLimit,
        marketingChannels: metadata.marketingChannels,
        monthlyBudget: metadata.monthlyBudget,
        preferredPlatforms: metadata.preferredPlatforms,
        roiTarget: metadata.roiTarget,
        industry: metadata.industry,
      });
    }
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user?.sub) {
        throw new Error('User ID not found');
      }

      const response = await mongoDbapiClient.updateUser(user.sub, {
        adBudget: editedMarketingInfo.adBudget,
        costPerAcquisition: editedMarketingInfo.costPerAcquisition,
        dailySpendingLimit: editedMarketingInfo.dailySpendingLimit,
        marketingChannels: editedMarketingInfo.marketingChannels,
        monthlyBudget: editedMarketingInfo.monthlyBudget,
        preferredPlatforms: editedMarketingInfo.preferredPlatforms,
        roiTarget: editedMarketingInfo.roiTarget,
        industry: editedMarketingInfo.industry
      });

      if (response.ok) {
        onUpdate?.(editedMarketingInfo);
        setIsEditModalOpen(false);
      } else {
        throw new Error(response.error || 'Failed to update marketing information');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update marketing information');
      console.error('Error updating marketing info:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-black dark:text-white">
            Marketing Information
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
              <span className="font-medium text-black dark:text-white">
                Ad Budget
              </span>
              <span>${metadata?.adBudget?.toLocaleString() ?? 0}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-medium text-black dark:text-white">
                Monthly Budget
              </span>
              <span>${metadata?.monthlyBudget?.toLocaleString() ?? 0}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-medium text-black dark:text-white">
                Daily Spending Limit
              </span>
              <span>
                ${metadata?.dailySpendingLimit?.toLocaleString() ?? 0}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-medium text-black dark:text-white">
                Cost Per Acquisition
              </span>
              <span>
                ${metadata?.costPerAcquisition?.toLocaleString() ?? 0}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-medium text-black dark:text-white">
                ROI Target
              </span>
              <span>
                {metadata?.roiTarget
                  ? `${(metadata.roiTarget * 100).toFixed(1)}%`
                  : "0%"}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-medium text-black dark:text-white">
                Industry
              </span>
              <span>{metadata?.industry ?? "Not specified"}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-medium text-black dark:text-white">
                Marketing Channels
              </span>
              <span>{metadata?.marketingChannels ?? "Not specified"}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-medium text-black dark:text-white">
                Preferred Platforms
              </span>
              <span>{metadata?.preferredPlatforms ?? "Not specified"}</span>
            </div>
          </div>
        </div>

        <Modal
          isOpen={isEditModalOpen}
          className="!w-[50vw]"
          onClose={() => setIsEditModalOpen(false)}
        >
          <div className="space-y-4 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Edit Marketing Information
            </h2>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Ad Budget
                </label>
                <input
                  type="number"
                  value={editedMarketingInfo.adBudget}
                  onChange={(e) =>
                    setEditedMarketingInfo((prev) => ({
                      ...prev,
                      adBudget: Number(e.target.value),
                    }))
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Monthly Budget
                </label>
                <input
                  type="number"
                  value={editedMarketingInfo.monthlyBudget}
                  onChange={(e) =>
                    setEditedMarketingInfo((prev) => ({
                      ...prev,
                      monthlyBudget: Number(e.target.value),
                    }))
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Daily Spending Limit
                </label>
                <input
                  type="number"
                  value={editedMarketingInfo.dailySpendingLimit}
                  onChange={(e) =>
                    setEditedMarketingInfo((prev) => ({
                      ...prev,
                      dailySpendingLimit: Number(e.target.value),
                    }))
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Cost Per Acquisition
                </label>
                <input
                  type="number"
                  value={editedMarketingInfo.costPerAcquisition}
                  onChange={(e) =>
                    setEditedMarketingInfo((prev) => ({
                      ...prev,
                      costPerAcquisition: Number(e.target.value),
                    }))
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  ROI Target (%)
                </label>
                <input
                  type="number"
                  value={
                    editedMarketingInfo.roiTarget
                      ? editedMarketingInfo.roiTarget * 100
                      : ""
                  }
                  onChange={(e) =>
                    setEditedMarketingInfo((prev) => ({
                      ...prev,
                      roiTarget: Number(e.target.value) / 100,
                    }))
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Industry
                </label>
                <input
                  type="text"
                  value={editedMarketingInfo.industry}
                  onChange={(e) =>
                    setEditedMarketingInfo((prev) => ({
                      ...prev,
                      industry: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Marketing Channels
                </label>
                <input
                  type="text"
                  value={editedMarketingInfo.marketingChannels}
                  onChange={(e) =>
                    setEditedMarketingInfo((prev) => ({
                      ...prev,
                      marketingChannels: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Preferred Platforms
                </label>
                <input
                  type="text"
                  value={editedMarketingInfo.preferredPlatforms}
                  onChange={(e) =>
                    setEditedMarketingInfo((prev) => ({
                      ...prev,
                      preferredPlatforms: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default UserMarketingCard;
