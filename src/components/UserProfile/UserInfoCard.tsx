import { UserProfile } from "../../services/userService";

interface UserInfoCardProps {
  user: UserProfile | null;
}

const UserInfoCard = ({ user }: UserInfoCardProps) => {
  if (!user) return null;

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
            <span>{user.firstName}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-black dark:text-white">Last Name</span>
            <span>{user.lastName}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-black dark:text-white">Email</span>
            <span>{user.email}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-black dark:text-white">Phone</span>
            <span>{user.phoneNumber}</span>
          </div>
          {user.profile && (
            <>
              <div className="flex flex-col gap-2">
                <span className="font-medium text-black dark:text-white">Date of Birth</span>
                <span>{user.profile.dateOfBirth?.toLocaleDateString()}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-medium text-black dark:text-white">Gender</span>
                <span>{user.profile.gender}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;
