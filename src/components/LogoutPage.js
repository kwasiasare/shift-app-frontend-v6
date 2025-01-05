import React from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import { Button, Container, Typography } from "@mui/material";

const LogoutPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signoutRedirect();
      localStorage.removeItem("your-app-data");
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <Container className="logout-container">
      <Typography variant="h5" gutterBottom>
        Logout
      </Typography>
      <Typography variant="body1" gutterBottom>
        Are you sure you want to log out?
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleLogout}
        className="logout-button"
      >
        Yes, Log Out
      </Button>
    </Container>
  );
};

export default LogoutPage;