
export const API_CONFIG = {
  BASE_URL: import.meta.env.PROD 
    ? 'https://your-production-url/api'
    : 'http://localhost:5000/api',
  ENDPOINTS: {
    USERS: '/users',
    USER_BY_ID: (id) => `/users/${id}`,
    USER_BY_EMAIL: (email) => `/users/email/${email}`,
    HEALTH: '/health'
  }
};