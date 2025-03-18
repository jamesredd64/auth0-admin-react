import { useState, useCallback, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { UserMetadata } from '../types/user';

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TIMEOUT = 5000; // 5 seconds timeout

interface ApiError {
  message: string;
  status?: number;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useMongoDbClient = () => {
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);
  const requestInProgress = useRef<boolean>(false);
  const [userMetadata, setUserMetadata] = useState<UserMetadata | null>(null);

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

  const getUserById = useCallback(async (auth0Id: string) => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE}/users/${auth0Id}`, { headers });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result; // Return the full response which includes user data
    } catch (error) {
      console.error('Error checking user existence:', error);
      return null;  // Return null instead of throwing error
    }
  }, [getAuthHeaders]);

  const fetchWithRetry = async (url: string, options: RequestInit, retries = MAX_RETRIES) => {
    for (let i = 0; i < retries; i++) {
      try {
        // Remove the API_BASE from the url parameter since we're adding it here
        const response = await fetch(`${API_BASE}${url}`, options);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response from server");
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
      // Remove API_BASE from the URL since fetchWithRetry adds it
      const response = await fetchWithRetry(`/users/${userId}`, {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      return response;
    } catch (err) {
      const apiError: ApiError = {
        message: err instanceof Error ? err.message : 'An unknown error occurred',
        status: err instanceof Error ? undefined : 500,
      };
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  const getUserByEmail = useCallback(async (email: string) => {
    setLoading(true);
    try {
      setError(null);
      
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE}/users/email/${email}`, { headers });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response from server");
      }

      return await response.json();
    } catch (err) {
      console.error('Error in getUserByEmail:', err);
      const apiError: ApiError = {
        message: err instanceof Error ? err.message : 'An unknown error occurred',
      };
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  const createUser = useCallback(async (userData: Partial<UserMetadata>) => {
    setLoading(true);
    try {
      setError(null);
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers,
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response from server");
      }
      
      return await response.json();
    } catch (err) {
      console.error('Error in createUser:', err);
      const apiError: ApiError = {
        message: err instanceof Error ? err.message : 'An unknown error occurred',
      };
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  const checkAndInsertUser = useCallback(async (userId: string, initialData: Partial<UserMetadata>) => {
    try {
      // First try to get existing user
      const existingUser = await getUserById(userId);
      if (existingUser) {
        return existingUser;
      }

      // If user doesn't exist, create new user
      const newUserData = {
        ...initialData,
        auth0Id: userId,
        email: user?.email || '',
      };

      const createdUser = await createUser(newUserData);
      return createdUser;
    } catch (error) {
      console.error('Error in checkAndInsertUser:', error);
      throw error;
    }
  }, [getUserById, createUser, user?.email]);

  // const checkUserExists = useCallback(async (userId: string, initialData: Partial<UserMetadata>) => {
  //   try {    
      
      
  //     const existingUser = await getUserById(userId);
  //     if (existingUser) {
  //       setUserData(userDoc);
  //       setCardsData(userDoc.cards);
  //     } else {
  //       // Initialize cards data with default values
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, [getUserById, createUser, user?.email]);     
   
  

  const fetchWithTimeout = async (url: string, options: RequestInit) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  };

  const fetchUserData = useCallback(async (userId: string) => {
    if (requestInProgress.current) return null;
    
    requestInProgress.current = true;
    setLoading(true);
    
    try {
      const headers = await getAuthHeaders();
      console.log('Fetching user data for ID:', userId);
      const response = await fetchWithTimeout(`${API_BASE}/users/${userId}`, {
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('MongoDB Response:', data); // Add this log
      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError({
        message: error instanceof Error ? error.message : 'Failed to fetch user data',
        status: error instanceof Response ? error.status : undefined
      });
      return null;
    } finally {
      setLoading(false);
      requestInProgress.current = false;
    }
  }, [getAccessTokenSilently]);

  return { fetchUserData, error, loading, updateUser, getUserById };
};