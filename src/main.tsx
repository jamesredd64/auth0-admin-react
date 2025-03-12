import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'
import './index.css'
import App from './App.tsx'

const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID
const auth0Audience = import.meta.env.VITE_AUTH0_AUDIENCE

// Initial configuration logging
console.log('Auth0 Initial Configuration:', {
  domain: auth0Domain,
  clientId: auth0ClientId?.substring(0, 8) + '...',
  audience: auth0Audience,
  redirectUri: window.location.origin,
  environment: import.meta.env.MODE
});

if (!auth0Domain || !auth0ClientId) {
  console.error('Auth0 Configuration Error:', {
    domain: auth0Domain,
    clientId: auth0ClientId,
    audience: auth0Audience
  });
  throw new Error('Missing Auth0 configuration. Check your .env file')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Auth0Provider
        domain={auth0Domain}
        clientId={auth0ClientId}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: auth0Audience,
          scope: 'openid profile email read:roles read:current_user',
        }}
        cacheLocation="localstorage"
        onRedirectCallback={(appState) => {
          console.log('Auth0 Redirect Callback:', {
            appState,
            returnTo: appState?.returnTo || window.location.pathname,
            timestamp: new Date().toISOString()
          });
        }}
      >
        <App />
      </Auth0Provider>
    </Router>
  </StrictMode>,
)
