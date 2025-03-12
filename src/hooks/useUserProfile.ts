import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';

interface UserMetadata {
  phone?: string;
  address?: string;
  // Add other metadata fields as needed
}

export const useUserProfile = () => {
  const { getAccessTokenSilently, user } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUserMetadata = async (metadata: UserMetadata) => {
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      
      const response = await fetch(`https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/users/${user?.sub}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_metadata: metadata,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user metadata');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateUserMetadata,
    loading,
    error,
  };
};