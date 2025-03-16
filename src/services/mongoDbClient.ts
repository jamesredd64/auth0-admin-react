import { useState, useCallback, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { UserMetadata } from '../types/user';

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

interface ApiError {
  message: string;
  status?: number;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useMongoDbClient = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);
  const requestInProgress = useRef<boolean>(false);

  const getAuthHeaders = useCallback(async () => {
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: 'https://dev-uizu7j8qzflxzjpy.us.auth0.com/api/v2/',
        scope: 'openid profile email'
      }
    });
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }, [getAccessTokenSilently]);

  const getUserById = async (userId: string) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/users/${encodeURIComponent(userId)}`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  };

  // Add retry logic for failed requests
  const fetchWithRetry = async (url: string, options: RequestInit, retries = MAX_RETRIES) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        await delay(RETRY_DELAY * Math.pow(2, i));
      }
    }
  };

  const updateUser = useCallback(async (userId: string, userData: Partial<UserMetadata>) => {
    setLoading(true);
    setError(null);
    
    try {
      const headers = await getAuthHeaders();
      const response = await fetchWithRetry(`/api/users/${userId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(userData)
      });
      return response;
    } catch (err) {
      const apiError: ApiError = {
        message: err instanceof Error ? err.message : 'An unknown error occurred',
      };
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [getAccessTokenSilently]);

  const getUserByEmail = useCallback(async (email: string) => {
    setLoading(true);
    try {
      setError(null);
      
      const headers = await getAuthHeaders();
      const response = await fetchWithRetry(`/api/users/email/${email}`, { headers });
      const data = await response.json();
      return data;
    } catch (err) {
      const apiError: ApiError = {
        message: err instanceof Error ? err.message : 'An unknown error occurred',
      };
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders, fetchWithRetry]);

  const createUser = useCallback(async (userData: Partial<UserMetadata>) => {
    setLoading(true);
    try {
      setError(null);
      const headers = await getAuthHeaders();
      const response = await fetch(`/api/users`, {
        method: 'POST',
        headers,
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (err) {
      const apiError: ApiError = {
        message: err instanceof Error ? err.message : 'An unknown error occurred',
      };
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  return {
    getUserById,
    updateUser,
    error,
    loading,
    getUserByEmail,
    createUser
  };
};