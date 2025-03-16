import { useState, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://auth0-admin-react-server-1c6czddjr-jamesredd64s-projects.vercel.app/api'
    : 'http://localhost:3001/api',
  ENDPOINTS: {
    USERS: '/users',
    USER_BY_ID: (id: string) => `/users/${id}`,
    USER_CREATE_OR_UPDATE: '/users/createOrUpdate'
  }
};

interface ApiError {
  message: string;
  status?: number;
}

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profile?: {
    dateOfBirth?: Date;
    gender?: string;
    profilePictureUrl?: string;
    marketingBudget?: {
      amount: number;
      frequency: 'daily' | 'monthly' | 'quarterly' | 'yearly';
      adCosts: number;
    };
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

export const useMongoDbClient = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = async () => {
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
  };

  const handleError = (err: any) => {
    console.error('MongoDB API Error:', err);
    const apiError: ApiError = {
      message: err instanceof Error ? err.message : 'An unknown error occurred',
    };
    setError(apiError);
    setLoading(false);
  };

  const createUser = useCallback(async (userData: UserData) => {
    setLoading(true);
    setError(null);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      handleError(err);
      throw err;
    }
  }, [getAccessTokenSilently]);

  const getAllUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}`, {
        headers,
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      handleError(err);
      throw err;
    }
  }, [getAccessTokenSilently]);

  const getUserById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_BY_ID(id)}`, {
        headers,
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      handleError(err);
      throw err;
    }
  }, [getAccessTokenSilently]);

  const updateUser = useCallback(async (id: string, userData: Partial<UserData>) => {
    setLoading(true);
    setError(null);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_BY_ID(id)}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      handleError(err);
      throw err;
    }
  }, [getAccessTokenSilently]);

  const deleteUser = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_BY_ID(id)}`, {
        method: 'DELETE',
        headers,
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      handleError(err);
      throw err;
    }
  }, [getAccessTokenSilently]);

  const deleteAllUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}`, {
        method: 'DELETE',
        headers,
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      handleError(err);
      throw err;
    }
  }, [getAccessTokenSilently]);

  const createOrUpdateUser = useCallback(async (userData: UserData) => {
    setLoading(true);
    setError(null);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_CREATE_OR_UPDATE}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      setLoading(false);
      return data;
    } catch (err) {
      console.error('Detailed error:', err);
      handleError(err);
      throw err;
    }
  }, [getAccessTokenSilently]);

  const getUserByEmail = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}/email/${email}`, {
        method: 'GET',
        headers,
      });
      
      // Return null for 404 (user not found) instead of throwing an error
      if (response.status === 404) {
        setLoading(false);
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      handleError(err);
      throw err;
    }
  }, [getAccessTokenSilently]);

  return {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    deleteAllUsers,
    createOrUpdateUser,
    getUserByEmail,
    error,
    loading,
  };
};