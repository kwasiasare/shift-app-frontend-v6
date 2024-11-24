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

// Custom theme
const theme = createTheme({
  palette: {
    primary: { main: "#00796b" },
    secondary: { main: "#004d40" },
    background: { default: "#e0f7fa" },
  },
  typography: { fontFamily: "Roboto, sans-serif" },
});

//const date = new Date('2024-11-18T00:00:00.000Z');
//const formattedDate = date.toISOString().split('T')[0]; // Extracts the date part


const App = () => {
  const [shifts, setShifts] = useState([]);
  const [currentShift, setCurrentShift] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState(null); // Change to store _id
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  
  // Load shifts on component mount
  //useEffect(() => {
  //  readShiftsFromAPI();
  //}, []);

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

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Typography variant="h4" align="center" gutterBottom>
          Shift Management
        </Typography>
        <ShiftForm
          onAddShift={handleAddShift}
          currentShift={currentShift}
          isEditing={isEditing}
          onUpdateShift={handleUpdateShift}
        />
        <ShiftTable
          shifts={shifts}
          onEdit={handleEditShift}
          onDelete={handleDeleteShift}
        />
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
          open={snackbar.open} // Controls visibility
          autoHideDuration={3000} // Closes automatically after 3 seconds
          onClose={closeSnackbar} // Close event handler
        >
          <Alert
            onClose={closeSnackbar} // Close alert manually
            severity={snackbar.severity} // Type of message ('success', 'error', etc.)
            sx={{ width: "100%" }} // Full-width styling
          >
            {snackbar.message} 
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};




export default App;
