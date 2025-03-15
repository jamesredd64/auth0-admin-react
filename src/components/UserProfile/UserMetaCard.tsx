// import { useModal } from "../../hooks/useModal";
import React from "react";
import { UserMetadata } from "../../types/user.js";

interface UserMetaCardProps {
  metadata: UserMetadata;
}

const UserMetaCard = ({ metadata }: UserMetaCardProps) => {
  // const { closeModal } = useModal();
  
  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <img src={metadata.picture} alt={metadata.name} />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-white-800 dark:text-white/90 xl:text-left">
                {metadata.roles[0]}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {metadata.email}
                </p>
              </div>
            </div>
            {/* <div className="mt-4 grid gap-2">
              <div><strong>Ad Budget:</strong> ${metadata.adBudget?.toLocaleString()}</div>
              <div><strong>Monthly Budget:</strong> ${metadata.monthlyBudget?.toLocaleString()}</div>
              <div><strong>Daily Limit:</strong> ${metadata.dailySpendingLimit?.toLocaleString()}</div>
              <div><strong>ROI Target:</strong> {(metadata.roiTarget * 100).toFixed(1)}%</div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default UserMetaCard;
