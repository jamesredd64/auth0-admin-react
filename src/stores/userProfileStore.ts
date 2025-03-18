
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { UserMetadata } from '../types/user';
import { 
  setProfile, 
  updateProfile, 
  setLoading, 
  setError, 
  resetChanges, 
  saveChanges 
} from '../store/slices/userProfileSlice';
import { useMongoDbClient } from '../services/mongoDbClient';

export const useUserProfileStore = create<UserProfileStore>((set) => ({
  hasUnsavedChanges: false,
  setHasUnsavedChanges: (value: boolean) => set({ hasUnsavedChanges: value }),
  // ... other store properties and methods
}));

