interface M2MTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

class Auth0M2MService {
  private readonly domain: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private tokenCache: { token: string; expiresAt: number } | null = null;

  constructor() {
    this.domain = import.meta.env.VITE_AUTH0_DOMAIN;
    this.clientId = import.meta.env.VITE_AUTH0_M2M_CLIENT_ID;
    this.clientSecret = import.meta.env.VITE_AUTH0_M2M_CLIENT_SECRET;

    // Validate configuration
    if (!this.domain || !this.clientId || !this.clientSecret) {
      console.error('Missing required environment variables:', {
        domain: !!this.domain,
        clientId: !!this.clientId,
        clientSecret: !!this.clientSecret
      });
    }
  }

  private async getM2MToken(): Promise<string> {
    if (this.tokenCache && this.tokenCache.expiresAt > Date.now()) {
      return this.tokenCache.token;
    }

    const payload = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      audience: `https://${this.domain}/api/v2/`,
      grant_type: 'client_credentials',
      scope: 'read:users read:roles' // Added read:roles scope
    };

    console.log('Requesting M2M token with payload:', {
      ...payload,
      client_secret: '***' // Hide secret in logs
    });

    try {
      const response = await fetch(`https://${this.domain}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('M2M token request failed:', {
          status: response.status,
          statusText: response.statusText,
          error: data
        });
        throw new Error(`Failed to get M2M token: ${response.statusText} - ${JSON.stringify(data)}`);
      }

      this.tokenCache = {
        token: data.access_token,
        expiresAt: Date.now() + (data.expires_in * 1000) - 60000
      };

      console.log('M2M token obtained successfully');
      return data.access_token;
    } catch (error) {
      console.error('Error during M2M token request:', error);
      throw error;
    }
  }

  async getUserMetadata(userId: string): Promise<any> {
    try {
      const token = await this.getM2MToken();
      
      // Get user details including roles
      const response = await fetch(`https://${this.domain}/api/v2/users/${userId}?include_fields=true`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to get user metadata: ${response.statusText} - ${JSON.stringify(errorData)}`);
      }

      const userData = await response.json();

      // Get user roles
      const rolesResponse = await fetch(`https://${this.domain}/api/v2/users/${userId}/roles`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!rolesResponse.ok) {
        console.error('Failed to fetch user roles');
        return userData;
      }

      const rolesData = await rolesResponse.json();
      
      return {
        ...userData,
        roles: rolesData
      };
    } catch (error) {
      console.error('Error in getUserMetadata:', error);
      throw error;
    }
  }
}

export const auth0M2MService = new Auth0M2MService();