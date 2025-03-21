import { useMemo } from 'react';
import { MongoDbService } from '../services/mongoDbService';

export const useMongoDb = (accessToken: string) => {
  const mongoDbService = useMemo(() => new MongoDbService(accessToken), [accessToken]);
  return mongoDbService;
};