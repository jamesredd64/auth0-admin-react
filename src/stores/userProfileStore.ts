
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

export const useUserProfileStore = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.userProfile);

  return {
    // Getters
    currentProfile: state.profile ? { ...state.profile, ...state.pendingChanges } : null,
    hasUnsavedChanges: Object.keys(state.pendingChanges).length > 0,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    updateProfile: (updates: Partial<UserMetadata>) => {
      dispatch(updateProfile(updates));
    },

    setInitialProfile: (profile: UserMetadata) => {
      dispatch(setProfile(profile));
    },

    async syncWithMongoDB(auth0Id: string, mongoDbClient: ReturnType<typeof useMongoDbClient>) {
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        const currentState = this.currentProfile;
        if (!currentState) throw new Error('No profile data to sync');

        await mongoDbClient.updateUser(auth0Id, currentState);
        dispatch(setProfile(currentState));
        return true;
      } catch (error) {
        dispatch(setError(error instanceof Error ? error.message : 'Failed to sync with MongoDB'));
        return false;
      } finally {
        dispatch(setLoading(false));
      }
    },

    async saveChanges(auth0Id: string, mongoDbClient: ReturnType<typeof useMongoDbClient>) {
      console.log('auth0Id ' + auth0Id)
      return this.syncWithMongoDB(auth0Id, mongoDbClient);
    },

    resetChanges() {
      dispatch(resetChanges());
    }
  };
};
