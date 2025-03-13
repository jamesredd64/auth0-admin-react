import { Auth0Provider, AppState, User } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthTokenHandler } from './AuthTokenHandler';

export const Auth0ProviderWithNavigate = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Auth0ProviderWithNavigate mounted');
    // Log environment variables to verify they're loaded
    console.log('Environment Variables:', {
      domain: import.meta.env.VITE_AUTH0_DOMAIN,
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      // Don't log client secret in production
      clientId: import.meta.env.VITE_AUTH0_CLIENT_ID?.substring(0, 8) + '...',
    });
  }, []);

  const domain = import.meta.env.VITE_AUTH0_DOMAIN || '';
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || '';
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE || '';

  const onRedirectCallback = async (appState?: AppState, user?: User) => {
    console.log('🚀 Auth0 Redirect Callback Triggered');
    
    if (user) {
      console.log('👤 User authenticated:', {
        email: user.email,
        name: user.name,
        nickname: user.nickname
      });
    }

    if (appState?.returnTo) {
      console.log('↩️ Returning to:', appState.returnTo);
      navigate(appState.returnTo);
    } else {
      console.log('↩️ No return path specified, navigating to:', window.location.pathname);
      navigate(window.location.pathname);
    }
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
        scope: "openid profile email read:current_user read:roles"
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <AuthTokenHandler />
      {children}
    </Auth0Provider>
  );
};