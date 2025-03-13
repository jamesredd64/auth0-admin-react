import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import CoverOne from "../images/cover/cover-01.png";
import "../App.css";

const Profile = () => {
  const { user, isLoading, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isLoading, isAuthenticated, navigate]);

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
          <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
            <label
              htmlFor="cover"
              className="flex cursor-pointer items-center justify-center gap-2 rounded bg-primary py-1 px-2 text-sm font-medium text-white hover:bg-opacity-90 xsm:px-4"
            >
              <input type="file" name="cover" id="cover" className="sr-only" />
              <span>Edit Cover</span>
            </label>
          </div>
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:-mt-24">
            <div className="relative drop-shadow-2">
              <img
               src={user.picture}
               alt="profile"
               className="rounded-full-profile-img"
             />
              <label
                htmlFor="profile"
                className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
              >
                <input
                  type="file"
                  name="profile"
                  id="profile"
                  className="sr-only"
                />
                <svg
                  className="fill-current"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.20247 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.20247 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                    fill=""
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7 5.83329C6.03350 5.83329 5.25 6.61679 5.25 7.58329C5.25 8.54979 6.03350 9.33329 7 9.33329C7.96650 9.33329 8.75 8.54979 8.75 7.58329C8.75 6.61679 7.96650 5.83329 7 5.83329ZM4.08333 7.58329C4.08333 5.97246 5.38917 4.66663 7 4.66663C8.61083 4.66663 9.91667 5.97246 9.91667 7.58329C9.91667 9.19412 8.61083 10.5 7 10.5C5.38917 10.5 4.08333 9.19412 4.08333 7.58329Z"
                    fill=""
                  />
                </svg>
              </label>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              {user?.name}
            </h3>
            <p className="font-medium">{user?.email}</p>
            {user?.email_verified && (
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-success py-1.5 px-3 text-sm font-medium text-white">
                <span className="w-2 h-2 rounded-full bg-white"></span>
                Verified
              </span>
            )}
          </div>
        </div>
      </div>
    </>
    // <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
    //   <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
    //     <div className="relative z-30 mx-auto mt-4">
    //       {
    //         <img
    //           src={user.picture}
    //           alt="profile"
    //           className="w-[120px] h-[120px] rounded-full object-cover mx-auto"
    //         />

    //         /* <img
    //         src={user.picture}
    //         alt="profile"
    //         className="rounded-[100px] min-w-[48px] min-h-[72px] w-[72px !important] h-[72px !important] mx-auto object-cover"
    //       /> */
    //       }
    //     </div>
    //     <div className="mt-4">
    //       <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
    //         {user.name}
    //       </h3>
    //       <p className="font-medium text-gray-500">{user.email}</p>
    //       {user.email_verified && (
    //         <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-success py-1.5 px-3 text-sm font-medium text-white">
    //           <span className="w-2 h-2 rounded-full bg-white"></span>
    //           Verified
    //         </span>
    //       )}
    //     </div>
    //     <div className="mt-6">
    //       <Link
    //         to="/"
    //         className="inline-flex items-center justify-center bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all"
    //       >
    //         Back to Dashboard
    //       </Link>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Profile;
