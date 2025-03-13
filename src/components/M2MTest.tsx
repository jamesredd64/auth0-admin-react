import { useEffect, useState } from 'react';
import { auth0M2MService } from '../services/auth0M2M';

export const M2MTest = () => {
  const [status, setStatus] = useState<string>('Not started');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testM2M = async () => {
      try {
        setStatus('Testing M2M connection...');
        // Use a known user ID for testing
        const testUserId = 'auth0|test';
        await auth0M2MService.getUserMetadata(testUserId);
        setStatus('M2M connection successful');
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setStatus('M2M connection failed');
      }
    };

    testM2M();
  }, []);

  return (
    <div>
      <h3>M2M Connection Test</h3>
      <p>Status: {status}</p>
      {error && (
        <div style={{ color: 'red' }}>
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
};