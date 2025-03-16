
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from 'react-router-dom';
import AuthProvider from './auth/AuthProvider';
import "./index.css";
import "swiper/swiper-bundle.css";
import "simplebar-react/dist/simplebar.min.css";
import "flatpickr/dist/flatpickr.css";
import  App from "./App";
import { AppWrapper } from "./components/common/PageMeta";
import { ThemeProvider } from "./context/ThemeContext";
import React from "react";
// import { connectDB } from './services/mongodb';
import { Auth0Provider } from '@auth0/auth0-react';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <ThemeProvider>     
          <AppWrapper>
            <Auth0Provider
              domain="dev-uizu7j8qzflxzjpy.us.auth0.com"
              clientId="XFt8FzJrPByvX5WFaBj9wMS2yFXTjji6"
              authorizationParams={{
                redirect_uri: window.location.origin,
                audience: "https://dev-uizu7j8qzflxzjpy.us.auth0.com/api/v2/",
                scope: "openid profile email"
              }}
            >
              <App />
            </Auth0Provider>
          </AppWrapper>
        </ThemeProvider>
      </AuthProvider>
    </Router>      
  </StrictMode>
);
