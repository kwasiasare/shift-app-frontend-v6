// src/utils/logoutUtils.js

const COGNITO_CONFIG = {
    clientId: "3ds755bcao4d6morouahs6p16l",
    domain: "https://us-east-1h0xvcwevw.auth.us-east-1.amazoncognito.com",
    appUri: "https://dev-env.d35xgk4ok41v85.amplifyapp.com"
  };
  
  export const buildLogoutUrl = () => {
    const logoutUrl = new URL(`${COGNITO_CONFIG.domain}/logout`);
    logoutUrl.searchParams.append('client_id', COGNITO_CONFIG.clientId);
    logoutUrl.searchParams.append('logout_uri', `${COGNITO_CONFIG.appUri}/logout`);
    logoutUrl.searchParams.append('response_type', 'code');
    return logoutUrl.toString();
  };
  
  export const clearStorageData = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };
  
  export const handleLogout = async (auth, navigate) => {
    try {
      clearStorageData();
      
      if (auth.isAuthenticated) {
        try {
          await auth.removeUser();
        } catch (error) {
          console.warn('Error removing user:', error);
        }
      }
      
      navigate('/logout');
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = buildLogoutUrl();
    }
  };