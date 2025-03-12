import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

interface UserMetadata {
  roles?: string[];
  permissions?: string[];
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

function App() {
  const [count, setCount] = useState(0);
  const [userMetadata, setUserMetadata] = useState<UserMetadata | null>(null);
  const { 
    isAuthenticated, 
    loginWithRedirect, 
    logout, 
    user, 
    isLoading, 
    error,
    getAccessTokenSilently 
  } = useAuth0();

  // Log all auth state changes
  useEffect(() => {
    console.log('Auth0 State Changed:', {
      isLoading,
      isAuthenticated,
      user,
      error
    });
  }, [isLoading, isAuthenticated, user, error]);

  // Fetch additional user metadata
  useEffect(() => {
    const getUserMetadata = async () => {
      try {
        console.log('Fetching user metadata...');
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/`,
            scope: 'read:current_user read:roles',
          },
        });
        
        console.log('Access Token received:', accessToken.substring(0, 20) + '...');

        const userDetailsByIdUrl = `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/users/${user?.sub}`;
        console.log('Fetching from:', userDetailsByIdUrl);

        const metadataResponse = await fetch(userDetailsByIdUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const metadata = await metadataResponse.json();
        console.log('Full User Metadata Response:', metadata);
        
        // Log specific parts we're interested in
        console.log('User Roles:', metadata.roles);
        console.log('User Permissions:', metadata.permissions);
        console.log('User Metadata:', metadata.user_metadata);
        console.log('App Metadata:', metadata.app_metadata);
        
        setUserMetadata(metadata);

      } catch (error: unknown) {
        const e = error as Error;
        console.error('Error fetching user metadata:', e);
        console.error('Error details:', {
          message: e.message,
          stack: e.stack,
          response: (e as { response?: unknown }).response // Type the potential response property safely
        });
      }
    };

    if (isAuthenticated && user?.sub) {
      console.log('User authenticated, fetching metadata for sub:', user.sub);
      getUserMetadata();
    }
  }, [getAccessTokenSilently, user?.sub, isAuthenticated]);

  if (error) {
    console.error('Auth0 Error:', error);
    return <div>Auth0 Error: {error.message}</div>;
  }

  if (isLoading) {
    console.log('Auth0 is still loading...');
    return <div>Loading Auth0 configuration...</div>;
  }

  return (
    <div className="app-container">
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        {isAuthenticated ? (
          <div>
            <h3>User Profile</h3>
            <p>Name: {user?.name}</p>
            <p>Email: {user?.email}</p>
            
            <h4>Raw User Object:</h4>
            <pre style={{ fontSize: '12px', maxWidth: '300px', overflow: 'auto' }}>
              {JSON.stringify(user, null, 2)}
            </pre>
            
            <h4>Full Metadata:</h4>
            <pre style={{ fontSize: '12px', maxWidth: '300px', overflow: 'auto' }}>
              {JSON.stringify(userMetadata, null, 2)}
            </pre>
            
            <button
              onClick={() => {
                console.log('Logging out...', {
                  returnTo: window.location.origin,
                  currentUser: user?.email
                });
                logout({ logoutParams: { returnTo: window.location.origin } });
              }}
              style={{ padding: '8px 16px', cursor: 'pointer' }}
            >
              Log Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              console.log('Initiating login...', {
                returnTo: window.location.origin,
                currentPath: window.location.pathname
              });
              loginWithRedirect();
            }}
            style={{ padding: '8px 16px', cursor: 'pointer' }}
          >
            Log In
          </button>
        )}
      </div>

      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </div>
  );
}

export default App;
