import { supabase } from '../config/supabase';

export interface User {
  auth0_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  profile: {
    date_of_birth: string;
    gender: string;
    profile_picture_url: string;
    marketing_budget: {
      amount: number;
      frequency: 'daily' | 'monthly' | 'quarterly' | 'yearly';
      ad_costs: number;
    };
  };
  address: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
  };
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const userService = {
  async createUser(userData: Omit<User, 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateUser(auth0Id: string, userData: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('auth0_id', auth0Id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserByAuth0Id(auth0Id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth0_id', auth0Id)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
    return data;
  },

  async deleteUser(auth0Id: string) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('auth0_id', auth0Id);

    if (error) throw error;
    return true;
  }
};