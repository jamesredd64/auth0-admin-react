import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import './css/style.css';
import './css/satoshi.css';
import 'jsvectormap/dist/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: "openid profile email read:current_user read:roles"
        }}
        cacheLocation="localstorage"
        useRefreshTokens={false}
      >
        <App />
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
);
