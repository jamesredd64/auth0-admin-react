import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { auth0ManagementService } from '../services/auth0Management';

interface UserMetadata {
  roles?: string[];
  permissions?: string[];
  user_metadata?: {
    [key: string]: unknown;
  };
  app_metadata?: {
    [key: string]: unknown;
  };
  email?: string;
  email_verified?: boolean;
  name?: string;
  nickname?: string;
  picture?: string;
  sub?: string;
  updated_at?: string;
  [key: string]: unknown;  // For any additional fields
}

export function useAuth0UserMetadata() {
  const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [userMetadata, setUserMetadata] = useState<UserMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getUserMetadata = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!isAuthenticated || !user?.sub) {
          return;
        }

        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/`,
            scope: 'read:current_user read:roles',
          },
        });

        const metadata = await auth0ManagementService.getUserMetadata(accessToken, user.sub);
        setUserMetadata(metadata);
      } catch (error) {
        console.error('Error fetching user metadata:', error);
        setError(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    getUserMetadata();
  }, [getAccessTokenSilently, user?.sub, isAuthenticated]);

  return { userMetadata, isLoading, error };
}