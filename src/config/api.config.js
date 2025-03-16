
export const API_CONFIG = {
  BASE_URL: import.meta.env.PROD 
    ? 'https://auth0-admin-react-server-1c6czddjr-jamesredd64s-projects.vercel.app/api'  
    : 'http://localhost:3001/api',  // Updated port to match server.js
  ENDPOINTS: {
    USERS: '/users',
    USER_BY_EMAIL: (email) => `/users/email/${email}`,
    HEALTH: '/health',
    HELLO: '/hello'  // Added new endpoint
  }
};