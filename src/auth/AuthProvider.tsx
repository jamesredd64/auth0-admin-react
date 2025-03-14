import { Auth0Provider } from '@auth0/auth0-react';
import React from 'react';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Auth0Provider
      domain="https://dev-uizu7j8qzflxzjpy.us.auth0.com"
      clientId="XFt8FzJrPByvX5WFaBj9wMS2yFXTjji6"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      {children}
    </Auth0Provider>
  );
};

export default AuthProvider;
