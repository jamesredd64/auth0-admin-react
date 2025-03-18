export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  AUTH0_AUDIENCE: import.meta.env.VITE_AUTH0_AUDIENCE || 'https://dev-uizu7j8qzflxzjpy.us.auth0.com/api/v2/',
  ENDPOINTS: {
    USERS: '/users',
    USER_BY_EMAIL: (email: string) => `/users/email/${email}`,
  }
};