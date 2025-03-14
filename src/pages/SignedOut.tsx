import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';

const SignedOut = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-boxdark-2">
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="text-center px-4">
          <h1 className="mb-4 text-4xl font-bold text-black dark:text-black">
            Welcome James Michael & Clara
          </h1>
          <p className="mb-8 text-lg text-black-600 dark:text-black-400">
            Please sign in to access your dashboard and manage your account.
          </p>
          <button
            onClick={() => loginWithRedirect()}
            className="inline-flex items-center justify-center rounded-lg py-3 px-10 text-center font-medium 
            bg-brand-500 text-white border-2 border-transparent
            hover:bg-white hover:text-brand-500 hover:border-brand-500 
            transition-all duration-200"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignedOut;