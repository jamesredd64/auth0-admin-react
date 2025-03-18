interface MarketingBudget {
  amount: number;
  frequency: string;
  adCosts: number;
}

interface Profile {
  dateOfBirth?: Date;
  gender?: string;
  profilePictureUrl?: string;
  marketingBudget?: MarketingBudget;
}

export interface UserMetadata {
  gender: string;
  marketingBudget: any;
  profilePictureUrl: string;
  dateOfBirth: string;
  userId: any;
  industry: string;
  name: string;
  nickname: string;
  email: string;
  picture: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  roles: string[];
  auth0Id: string;
  
  // Marketing related fields
  adBudget: number;
  costPerAcquisition: number;
  dailySpendingLimit: number;
  marketingChannels: string;
  monthlyBudget: number;
  preferredPlatforms: string;
  notificationPreferences: boolean;
  roiTarget: number;

  // Profile related fields
  profile?: Profile;
  bio?: string;
  company?: string;
  position?: string;

  // Address related fields
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}