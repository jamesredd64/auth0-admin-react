import { UserProfile } from "../../services/userService";

interface UserAddressCardProps {
  address?: UserProfile['address'];
}

const UserAddressCard = ({ address }: UserAddressCardProps) => {
  if (!address) return null;

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
        <h4 className="font-semibold text-black dark:text-white">
          Address Information
        </h4>
      </div>
      <div className="p-7">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <span className="font-medium text-black dark:text-white">Street</span>
            <span>{address.street}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-black dark:text-white">City</span>
            <span>{address.city}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-black dark:text-white">State</span>
            <span>{address.state}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-black dark:text-white">ZIP Code</span>
            <span>{address.zipCode}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-black dark:text-white">Country</span>
            <span>{address.country}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAddressCard;
