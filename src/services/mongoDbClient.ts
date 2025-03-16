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

  const fetchWithRetry = useCallback(async (url: string, options: RequestInit): Promise<Response> => {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      console.log(`[MongoDB Client] Attempt ${attempt + 1}/${MAX_RETRIES + 1}`, {
        url,
        method: options.method || 'GET',
        requestInProgress: requestInProgress.current
      });

      try {
        if (attempt > 0) {
          await delay(RETRY_DELAY);
        }
        
        const response = await fetch(url, options);
        console.log('[MongoDB Client] Response:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url
        });
        
        if (!response.ok) {
          const errorBody = await response.text();
          console.error('[MongoDB Client] Error response body:', errorBody);
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
        }
        return response;
      } catch (err) {
        lastError = err as Error;
        console.error('[MongoDB Client] Request failed:', {
          error: err,
          message: err instanceof Error ? err.message : 'Unknown error',
          url,
          attempt
        });
        
        if (attempt === MAX_RETRIES) {
          throw new Error(`Request failed after ${MAX_RETRIES + 1} attempts: ${lastError.message}`);
        }
      }
    }
    
    throw lastError;
  }, []);

  const getUserById = useCallback(async (userId: string) => {
    if (requestInProgress.current) {
      console.log('[MongoDB Client] Request already in progress, skipping');
      return;
    }

    try {
      requestInProgress.current = true;
      setLoading(true);
      setError(null);
      
      const headers = await getAuthHeaders();
      const response = await fetchWithRetry(`/api/users/${userId}`, { headers });
      const data = await response.json();
      console.log('[MongoDB Client] Successfully fetched user data:', { userId, data });
      return data;
    } catch (err) {
      const apiError: ApiError = {
        message: err instanceof Error ? err.message : 'An unknown error occurred',
      };
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
      requestInProgress.current = false;
    }
  }, [getAuthHeaders, fetchWithRetry]);

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

  return {
    getUserById,
    updateUser,
    error,
    loading,
  };
};