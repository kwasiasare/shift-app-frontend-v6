import React from 'react';
import { useAuth } from 'react-oidc-context';

function LoginPage() {
  const auth = useAuth();

  const handleLogin = () => {
    auth.signinRedirect();
  };

  return (
    <button onClick={handleLogin}>Login with Cognito</button>
  );
}

export default LoginPage;