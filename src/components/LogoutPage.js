import React, { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, CircularProgress } from '@mui/material';

const COGNITO_CONFIG = {
  clientId: '3ds755bcao4d6morouahs6p16l',
  domain: 'https://us-east-1h0xvcwevw.auth.us-east-1.amazoncognito.com',
  appUri: 'https://dev-env.d35xgk4ok41v85.amplifyapp.com'
};

const LogoutPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Clear all local storage and session data
        localStorage.clear();
        sessionStorage.clear();

        // If still authenticated, initiate OIDC logout
        if (auth.isAuthenticated) {
          try {
            await auth.removeUser(); // Clear OIDC user data
            await auth.signoutSilent(); // Attempt silent logout first
          } catch (oidcError) {
            console.warn('Silent logout failed, attempting redirect:', oidcError);
          }
        }

        // Always redirect to Cognito logout to ensure complete session cleanup
        const logoutUrl = new URL(`${COGNITO_CONFIG.domain}/logout`);
        logoutUrl.searchParams.set('client_id', COGNITO_CONFIG.clientId);
        logoutUrl.searchParams.set('logout_uri', `${COGNITO_CONFIG.appUri}/logout`);
        logoutUrl.searchParams.set('response_type', 'code');
        
        // Add a small delay to ensure local cleanup completes
        setTimeout(() => {
          window.location.href = logoutUrl.toString();
        }, 100);

      } catch (error) {
        console.error('Logout error:', error);
        // If everything fails, redirect to home
        navigate('/');
      }
    };

    performLogout();
  }, [auth, navigate]);

  return (
    <Container className="logout-container">
      <Typography variant="h5" gutterBottom>
        Signing Out...
      </Typography>
      <CircularProgress />
      <Typography variant="body1" sx={{ mt: 2 }}>
        Please wait while we complete the sign-out process.
      </Typography>
    </Container>
  );
};

export default LogoutPage;