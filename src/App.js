//deploy test
import React, { useState, useEffect, useCallback } from "react";
import ShiftForm from "./components/ShiftForm";
import ShiftTable from "./components/ShiftTable";
import {
  Container,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Snackbar,
  Alert
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./App.css";
import { readShifts, createShift, updateShift, deleteShift } from "./api";
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';

Amplify.configure(config);

// Custom theme
const theme = createTheme({
  palette: {
    primary: { main: "#00796b" },
    secondary: { main: "#004d40" },
    background: { default: "#e0f7fa" },
  },
  typography: { fontFamily: "Roboto, sans-serif" },
});

const App = ({signOut, user}) => {
  const [shifts, setShifts] = useState([]);
  const [currentShift, setCurrentShift] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState(null); // Change to store _id
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFormVisible, setFormVisible] = useState(false); // New state for form visibility

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  
  // Snackbar handlers
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };
  
  // Fetch shift on mount
  const readShiftsFromAPI = useCallback(async () => {
    try {
      const shiftsData = await readShifts();
      setShifts(shiftsData);
      showSnackbar("Shifts fetched successfully", "success");
    } catch (error) {
      console.error("Error fetching shifts:", error);
      showSnackbar("Failed to fetch shifts", "error");
    }
  }, []); // Empty dependency array because no dependencies are used within the function

  useEffect(() => {
    readShiftsFromAPI();
  }, [readShiftsFromAPI]); // Add as a dependency

  const handleAddShift = async (newShift) => {
    // Optimistically add the shift to the state
    const tempId = Date.now(); // Temporary ID for the new shift
    const optimisticShift = { ...newShift, _id: tempId };

    setShifts((prevShifts) => [...prevShifts, optimisticShift]);
    
    try {
      const addedShift = await createShift(newShift);
      // Replace the temporary shift with the actual one from the API
      setShifts((prevShifts) =>
        prevShifts.map((shift) =>
          shift._id === tempId ? addedShift : shift
        )
      );

      showSnackbar("Shift added successfully", "success");
      resetForm(); // Reset the form after addition
      setFormVisible(false); // Hide form after successful addition
    } catch (error) {
      console.error("Error adding shift:", error);

      // Rollback the optimistic update
      setShifts((prevShifts) =>
        prevShifts.filter((shift) => shift._id !== tempId)
      );

      showSnackbar("Failed to add shift", "error");
    }
  };

  const handleEditShift = (shiftId) => {
    const shiftToEdit = shifts.find(shift => shift._id === shiftId);
    setCurrentShift(shiftToEdit);
    setIsEditing(true);
    setFormVisible(true); // Show form when editing
  };

  const handleUpdateShift = async (updatedShift) => {
    try {
      const updatedShiftData = await updateShift(
        updatedShift._id,
        updatedShift
      );
      setShifts((prevShifts) =>
        prevShifts.map((shift) =>
          shift._id === updatedShiftData._id ? updatedShiftData : shift
        )
      );
      setIsEditing(false);
      setCurrentShift(null);
      showSnackbar("Shift updated successfully", "success");
      setFormVisible(false); // Hide form after update
      resetForm();
    } catch (error) {
      console.error("Error updating shift:", error);
      showSnackbar("Failed to update shift", "error");
    }
  };

  const handleDeleteShift = (shiftId) => {
    setDeleteId(shiftId);
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteShift(deleteId);
      setShifts((prevShifts) => prevShifts.filter((shift) => shift._id !== deleteId));
      setIsDialogOpen(false);
      setDeleteId(null);
      showSnackbar("Shift deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting shift:", error);
      showSnackbar("Failed to delete shift", "error");
    }
  };

  const cancelDelete = () => {
    setIsDialogOpen(false);
    setDeleteId(null);
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentShift(null);
  };

  const toggleFormVisibility = () => {
    setFormVisible((prev) => !prev);
    if (isEditing) {
      setIsEditing(false);
      setCurrentShift(null);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Typography variant="h4" align="center" gutterBottom>
          Shift Management
        </Typography>
        <Typography variant="h6" align="center">
          Welcome, {user.username}!
        </Typography>
        <Button onClick={signOut} variant="outlined" style={{ marginBottom: "16px" }}>
          Sign Out
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={toggleFormVisibility}
          style={{ marginBottom: "16px" }}
        >
          {isFormVisible ? "Hide Form" : "Add Shift"}
        </Button>
        {isFormVisible && (
          <ShiftForm
            onAddShift={handleAddShift}
            currentShift={currentShift}
            isEditing={isEditing}
            onUpdateShift={handleUpdateShift}
          />
        )}
        {shifts.length === 0 ? (
          <Typography align="center" variant="h6">
            No shifts available. Add a new shift to get started!
          </Typography>
        ) : (
          <ShiftTable
            shifts={shifts}
            onEdit={handleEditShift}
            onDelete={handleDeleteShift}
          />
        )}
        <Dialog open={isDialogOpen} onClose={cancelDelete}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this shift?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelDelete} color="primary">
              Cancel
            </Button>
            <Button onClick={confirmDelete} color="secondary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={closeSnackbar}
        >
          <Alert
            onClose={closeSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default withAuthenticator(App);