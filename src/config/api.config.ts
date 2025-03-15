export const API_CONFIG = {
  BASE_URL: import.meta.env.PROD 
    ? 'auth0-admin-react-server-1c6czddjr-jamesredd64s-projects.vercel.app'  // Replace with your Vercel deployment URL
    : 'http://localhost:5000/api',
  ENDPOINTS: {
    USERS: '/users',
    USER_BY_EMAIL: (email: string) => `/users/email/${email}`,
    HEALTH: '/health'
  }
};