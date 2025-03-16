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
  industry: ReactNode;
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

  // Address related fields
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    taxId: string;
  };
}