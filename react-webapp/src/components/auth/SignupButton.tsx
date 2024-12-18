import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export function SignupButton() {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      onClick={() => loginWithRedirect({ appState: { initialScreen: 'signUp' } })}
      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
    >
      Sign Up
    </button>
  );
}
