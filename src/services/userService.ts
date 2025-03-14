import { UserModel } from './mongodb';

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  profile?: {
    dateOfBirth?: Date;
    gender?: string;
    profilePictureUrl?: string;
    marketingBudget?: {
      amount: number;
      frequency: 'daily' | 'monthly' | 'quarterly' | 'yearly';
      adCosts: number;
    };
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

export const userService = {
  async createUser(userData: UserProfile) {
    try {
      const user = new UserModel(userData);
      return await user.save();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async getUserByEmail(email: string) {
    try {
      return await UserModel.findOne({ email });
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  async updateUser(email: string, userData: Partial<UserProfile>) {
    try {
      return await UserModel.findOneAndUpdate(
        { email },
        { $set: userData },
        { new: true }
      );
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async deleteUser(email: string) {
    try {
      return await UserModel.findOneAndDelete({ email });
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
};