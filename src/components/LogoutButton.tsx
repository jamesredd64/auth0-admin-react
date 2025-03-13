import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button
      onClick={() => {
        console.log('Logging out...', {
          returnTo: window.location.origin
        });
        logout({ 
          logoutParams: { 
            returnTo: window.location.origin 
          } 
        });
      }}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Log Out
    </button>
  );
};

export default LogoutButton;