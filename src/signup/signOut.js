import React from 'react';
import { signOut } from 'aws-amplify/auth';

const SignOutButton = () => {
  const handleSignOut = async () => {
    try {
      await signOut();
      alert('Signed out successfully');
    } catch (error) {
      alert(`Sign out failed: ${error.message}`);
    }
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
};

export default SignOutButton;
