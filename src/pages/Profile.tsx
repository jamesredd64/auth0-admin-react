import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import CoverOne from "../images/cover/cover-01.png";

const Profile = () => {
  const { user, isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('User not authenticated, redirecting to home');
      navigate('/');
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    const getUserMetadata = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        console.log('Access token obtained:', accessToken.substring(0, 10) + '...');
        
        if (user?.sub) {
          const userDetailUrl = `${import.meta.env.VITE_AUTH0_AUDIENCE}users/${user.sub}`;
          const metadataResponse = await fetch(userDetailUrl, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          
          const metadata = await metadataResponse.json();
          console.log('User metadata:', metadata);
        }
      } catch (error) {
        console.error('Error fetching user metadata:', error);
      }
    };

    if (user?.sub) {
      getUserMetadata();
    }
  }, [getAccessTokenSilently, user?.sub]);

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
            <div className="mx-auto max-w-180">
              <h4 className="font-semibold text-black dark:text-white">
                About Me
              </h4>
              <p className="mt-4.5">
                {user.nickname}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
