export interface UserMetadata {
  // Existing Auth0 metadata fields
  name: string;
  nickname: string;
  roles: string[];
  email: string;
  picture: string;

  // Basic user fields
  firstName: string;
  lastName: string;
  phoneNumber: string;
  auth0Id: string;

  // Meta fields
  adBudget: number;
  costPerAcquisition: number;
  dailySpendingLimit: number;
  marketingChannels: string;
  monthlyBudget: number;
  preferredPlatforms: string;
  notificationPreferences: boolean;
  roiTarget: number;
  industry: string;

  // Profile fields
  dateOfBirth: string; // ISO date string
  gender: string;
  profilePictureUrl: string;
  bio: string;
  company: string;
  position: string;
  
  // Marketing Budget
  marketingBudget: {
    amount: number;
    frequency: 'daily' | 'monthly' | 'quarterly' | 'yearly';
    adCosts: number;
  };

  // Address fields
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    taxId: string;
  };
}