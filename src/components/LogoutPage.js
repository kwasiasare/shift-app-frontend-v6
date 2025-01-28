import React, { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import { Button, Container, Typography, CircularProgress } from "@mui/material";

const LogoutPage = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogoutFlow = async () => {
            // Clear any remaining application state
            localStorage.clear();
            sessionStorage.clear();

            // If we're on the logout page but still authenticated
            if (auth.isAuthenticated) {
                try {
                    const clientId = "3ds755bcao4d6morouahs6p16l";
                    const logoutUri = "https://dev-env.d35xgk4ok41v85.amplifyapp.com/logout";
                    const cognitoDomain = "https://us-east-1h0xvcwevw.auth.us-east-1.amazoncognito.com";
                    
                    // Force a redirect to Cognito logout
                    const logoutUrl = new URL(`${cognitoDomain}/logout`);
                    logoutUrl.searchParams.append('client_id', clientId);
                    logoutUrl.searchParams.append('logout_uri', logoutUri);
                    logoutUrl.searchParams.append('response_type', 'code');
                    
                    window.location.href = logoutUrl.toString();
                } catch (error) {
                    console.error("Logout error:", error);
                    // If all else fails, redirect to home
                    navigate('/');
                }
            } else {
                // If we're already logged out, redirect to home after a short delay
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            }
        };

        handleLogoutFlow();
    }, [auth.isAuthenticated, navigate]);

    return (
        <Container className="logout-container">
            <Typography variant="h5" gutterBottom>
                Logging Out...
            </Typography>
            <CircularProgress />
            <Typography variant="body1" style={{ marginTop: '1rem' }}>
                Please wait while we complete the logout process.
            </Typography>
        </Container>
    );
};

export default LogoutPage;