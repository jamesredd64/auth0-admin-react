export interface ApiConfig {
  BASE_URL: string;
  ENDPOINTS: {
    USERS: string;
    USER_BY_EMAIL: (email: string) => string;
    HEALTH: string;
  };
}

export const API_CONFIG: ApiConfig;