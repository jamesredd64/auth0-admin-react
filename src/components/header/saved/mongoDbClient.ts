import { useState, useCallback, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { UserMetadata } from '../types/user';
import User from '../../server/src/models/user';

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
        // Remove the /api prefix from the URL construction since it's already in API_BASE
        const fullUrl = `${API_BASE}${url}`;
        const response = await fetch(fullUrl, options);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Server response:', errorData);
          throw new Error(`HTTP error! status: ${response.status}. ${errorData.message || ''}`);
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

  const createUser = useCallback(async (userData: Partial<UserMetadata>) => {
    setLoading(true);
    try {
      setError(null);
      const headers = await getAuthHeaders();
      
      console.log("Sending user data to server:", {
        marketingBudget: userData.profile?.marketingBudget,
        fullUserData: userData
      });

      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server response error:', {
          status: response.status,
          errorData
        });
        throw new Error(`HTTP error! status: ${response.status}. ${errorData.message || ''}`);
      }

      const responseData = await response.json();
      console.log("Server response in createUser:", {
        monthlyBudget: responseData?.profile?.marketingBudget?.monthlyBudget,
        fullResponse: responseData
      });

      return responseData;
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

  const checkAndInsertUser = useCallback(async (auth0Id: string) => {
    try {
      // First try to get existing user
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE}/users/${auth0Id}`, { headers });
      
      let existingUser = null;
      if (response.ok) {
        existingUser = await response.json();
        console.log("User found:", existingUser);
        return existingUser;
      }

      // If user doesn't exist or any other error, create a new one
      console.log("user doesn't exist:", existingUser);
      const newUserData = {
        auth0Id,
        email: user?.email || '',
        name: user?.name || '',
        profile: {
          marketingBudget: {
            frequency: 'monthly',
            adBudget: 0,
            costPerAcquisition: 0,
            dailySpendingLimit: 0,
            monthlyBudget: 0, // This is the field in question
            roiTarget: 0,
            marketingChannels: '',
            preferredPlatforms: '',
            notificationPreferences: []
          }
        },
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      };

      console.log("Creating new user with data:", {
        ...newUserData,
        profile: {
          marketingBudget: {
            monthlyBudget: newUserData.profile.marketingBudget.monthlyBudget,
            // Log other budget fields for context
            adBudget: newUserData.profile.marketingBudget.adBudget,
            frequency: newUserData.profile.marketingBudget.frequency
          }
        }
      });

      const createdUser = await createUser({
        ...newUserData,
        profile: {
          ...newUserData.profile,
          marketingBudget: {
            ...newUserData.profile.marketingBudget,
            frequency: 'monthly' as 'daily' | 'monthly' | 'quarterly' | 'yearly'
          }
        }
      });
      
      console.log("Server response after user creation:", {
        monthlyBudget: createdUser?.profile?.marketingBudget?.monthlyBudget,
        fullMarketingBudget: createdUser?.profile?.marketingBudget
      });
      return createdUser;
    } catch (error) {
      console.error("Error in checkAndInsertUser:", error);
      throw error;
    }
  }, [getAuthHeaders, createUser, user?.email, user?.name]);

  const checkUserExists = async (auth0Id: string) => {
    // Query MongoDB directly using User.findOne
    const user = await User?.findOne({ auth0Id }); // Assuming you have a User model
    return user;
  };
  
  // Then, replace the fetch logic with this direct database query
  const updateUser = useCallback(async (auth0Id: string, userData: Partial<UserMetadata>) => {
    setLoading(true);
    setError(null);
  
    try {
      const headers = await getAuthHeaders();
  
      // Check if user exists
      const user = await checkUserExists(auth0Id);
  
      if (user) {
        // User exists, update their information
        user.set({ ...userData });
        await user.save();
        console.log('User successfully updated!');
      } else {
        // User does not exist, create a new one
        console.log('User not found. Attempting to create a new user...');
  
        const newUser = new User({
          auth0Id,
          ...userData,
        });
        await newUser.save();
        console.log('User successfully created!');
      }
    } catch (err) {
      console.error('Error handling user update/creation:', err);
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
 


// const updateUser = useCallback(async (auth0Id: string, userData: Partial<UserMetadata>) => {
//   setLoading(true);
//   setError(null);

//   try {
//     const headers = await getAuthHeaders();

//     // Send the update request without fetching or processing the response
//     const updateUser = useCallback(async (auth0Id: string, userData: Partial<UserMetadata>) => {
//       setLoading(true);
//       setError(null);
    
//       try {
//         const headers = await getAuthHeaders();
    
//         // Send the update request
//         const response = await fetch(`/users/${encodeURIComponent(auth0Id)}`, {
//           method: 'PUT',
//           headers: {
//             ...headers,
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             auth0Id,
//             ...userData,
//           }),
//         });
    
//         // If the user does not exist, insert them
//         if (response.status === 404 || response.status === 500) {
//           console.log('User not found. Attempting to create a new user...');
    
//           const createResponse = await fetch(`/users/${encodeURIComponent(auth0Id)}`, {
//             method: 'POST',
//             headers: {
//               ...headers,
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               auth0Id,
//               ...userData,
//             }),
//           });
    
//           if (!createResponse.ok) {
//             throw new Error(`Failed to create user. Status: ${createResponse.status}`);
//           }
    
//           console.log('User successfully created!');
//         } else if (!response.ok) {
//           throw new Error(`Request failed with status ${response.status}`);
//         }
    
//       } catch (err) {
//         console.error('Error handling user update/creation:', err);
//         const apiError: ApiError = {
//           message: err instanceof Error ? err.message : 'An unknown error occurred',
//           status: err instanceof Error ? undefined : 500,
//         };
//         setError(apiError);
//         throw apiError;
//       } finally {
//         setLoading(false);
//       }
//     }, [getAuthHeaders]);
    
//     // await fetch(`/users/${encodeURIComponent(auth0Id)}`, {
//     //   method: 'PUT',
//     //   headers: {
//     //     ...headers,
//     //     'Content-Type': 'application/json',
//     //   },
//     //   body: JSON.stringify({
//     //     auth0Id,
//     //     ...userData,
//     //   }),
//     // });
//   } catch (err) {
//     console.error('Error updating user:', err);
//     const apiError: ApiError = {
//       message: err instanceof Error ? err.message : 'An unknown error occurred',
//       status: err instanceof Error ? undefined : 500,
//     };
//     setError(apiError);
//     throw apiError;
//   } finally {
//     setLoading(false);
//   }
// }, [getAuthHeaders]);

  
  // const updateUser = useCallback(async (auth0Id: string, userData: Partial<UserMetadata>) => {
  //   setLoading(true);
  //   setError(null);
    
  //   try {
  //     const headers = await getAuthHeaders();
  //     const currentUser = await getUserById(auth0Id);
      
  //     if (!currentUser) {
  //       await checkAndInsertUser(auth0Id);
  //     }
      
  //     const mergedData = {
  //       ...currentUser,
  //       ...userData,
  //       auth0Id,
  //       profile: {
  //         ...currentUser?.profile,
  //         ...(userData.profile || {}),
  //         marketingBudget: {
  //           ...currentUser?.profile?.marketingBudget,
  //           ...(userData.profile?.marketingBudget || {})
  //         }
  //       }
  //     };

  //     const response = await fetchWithRetry(`/users/${encodeURIComponent(auth0Id)}`, {
  //       method: 'PUT',
  //       headers: {
  //         ...headers,
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(mergedData)
  //     });

  //     if (!response) {
  //       throw new Error('Failed to update user in MongoDB');
  //     }

  //     return response;
  //   } catch (err) {
  //     console.error('Error updating user:', err);
  //     const apiError: ApiError = {
  //       message: err instanceof Error ? err.message : 'An unknown error occurred',
  //       status: err instanceof Error ? undefined : 500,
  //     };
  //     setError(apiError);
  //     throw apiError;
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [getAuthHeaders, getUserById, checkAndInsertUser]);

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

  return { fetchUserData, error, loading, updateUser, getUserById, checkAndInsertUser };
};
