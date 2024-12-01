/* Updated App.js with AWS Amplify Integration */
import React, { useState, useEffect, useCallback } from "react";
import ShiftForm from "./ShiftForm";
import ShiftTable from "./ShiftTable";
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
import { API } from "aws-amplify";

// Custom theme
const theme = createTheme({
  palette: {
    primary: { main: "#00796b" },
    secondary: { main: "#004d40" },
    background: { default: "#e0f7fa" },
  },
  typography: { fontFamily: "Roboto, sans-serif" },
});

const App = () => {
  const [shifts, setShifts] = useState([]);
  const [currentShift, setCurrentShift] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFormVisible, setFormVisible] = useState(false);

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

  // Fetch shifts on mount
  const readShiftsFromAPI = useCallback(async () => {
    try {
      const shiftsData = await API.get("shiftApi", "/shifts");
      setShifts(shiftsData);
      showSnackbar("Shifts fetched successfully", "success");
    } catch (error) {
      console.error("Error fetching shifts:", error);
      showSnackbar("Failed to fetch shifts", "error");
    }
  }, []);

  useEffect(() => {
    readShiftsFromAPI();
  }, [readShiftsFromAPI]);

  const handleAddShift = async (newShift) => {
    const tempId = Date.now();
    const optimisticShift = { ...newShift, _id: tempId };

    setShifts((prevShifts) => [...prevShifts, optimisticShift]);

    try {
      const addedShift = await API.post("shiftApi", "/shifts", { body: newShift });
      setShifts((prevShifts) =>
        prevShifts.map((shift) => (shift._id === tempId ? addedShift : shift))
      );

      showSnackbar("Shift added successfully", "success");
      resetForm();
      setFormVisible(false);
    } catch (error) {
      console.error("Error adding shift:", error);
      setShifts((prevShifts) => prevShifts.filter((shift) => shift._id !== tempId));
      showSnackbar("Failed to add shift", "error");
    }
  };

  const handleEditShift = (shiftId) => {
    const shiftToEdit = shifts.find((shift) => shift._id === shiftId);
    setCurrentShift(shiftToEdit);
    setIsEditing(true);
    setFormVisible(true);
  };

  const handleUpdateShift = async (updatedShift) => {
    try {
      const updatedShiftData = await API.put("shiftApi", `/shifts/${updatedShift._id}`, {
        body: updatedShift,
      });
      setShifts((prevShifts) =>
        prevShifts.map((shift) =>
          shift._id === updatedShiftData._id ? updatedShiftData : shift
        )
      );
      setIsEditing(false);
      setCurrentShift(null);
      showSnackbar("Shift updated successfully", "success");
      setFormVisible(false);
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
      await API.del("shiftApi", `/shifts/${deleteId}`);
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

export default App;
