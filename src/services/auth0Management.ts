import { User } from '@auth0/auth0-react';

interface UserMetadata {
  roles?: string[];
  permissions?: string[];
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export class Auth0ManagementService {
  private readonly domain: string;

  constructor() {
    this.domain = import.meta.env.VITE_AUTH0_DOMAIN;
  }

  async getUserMetadata(accessToken: string, userId: string): Promise<UserMetadata> {
    console.log('Fetching user metadata...');
    
    const userDetailsByIdUrl = `https://${this.domain}/api/v2/users/${userId}`;
    console.log('Fetching user details from:', userDetailsByIdUrl);

    const response = await fetch(userDetailsByIdUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const metadata = await response.json();
    console.log('Full User Metadata Response:', metadata);
    
    const roles = metadata.roles || metadata.app_metadata?.roles || [];
    console.log('Final resolved roles:', roles);

    return {
      ...metadata,
      roles
    };
  }
}

export const auth0ManagementService = new Auth0ManagementService();