import React, { useState, useEffect } from "react";
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
  useEffect(() => {
    readShiftsFromAPI();
  }, []);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };
  
  const readShiftsFromAPI = async () => {
    try {
      const shiftsData = await readShifts();
      setShifts(shiftsData);
    } catch (error) {
      console.error("Error fetching shifts:", error);
      showSnackbar("Failed to fetch shifts", "error");
    }
  };

  const handleAddShift = async (newShift) => {
    try {
      const addedShift = await createShift(newShift);
      setShifts((prevShifts) => [...prevShifts, addedShift]);
      showSnackbar("Shift added successfully", "success");
      resetForm();
    } catch (error) {
      console.error("Error adding shift:", error);
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
      setShifts(
        shifts.map((shift) =>
          shift._Id === updatedShiftData._Id ? updatedShiftData : shift
        )
      );
      setIsEditing(false);
      setCurrentShift(null);
      showSnackbar("Shift updated successfully", "success");
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
      setShifts(shifts.filter((shift) => shift._id !== deleteId));
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

 

  //   // Generate unique ID for each shift
  //   const generateCustomId = () => {
  //     const currentDate = new Date();
  //     const year = currentDate.getFullYear();
  //     const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  //     const day = String(currentDate.getDate()).padStart(2, "0");
  //     const formattedSequence = String(sequence).padStart(3, "0");
  //     setSequence(sequence + 1);
  //     return `${year}${month}${day}-${formattedSequence}`;
  //   };

  //   // Fetch shifts from Cosmos DB
  //   const fetchShifts = async () => {
  //     // const query = `
  //     //     query {
  //     //         Shift {
  //     //             items {
  //     //                 shiftId
  //     //                 location
  //     //                 date
  //     //                 startTime
  //     //                 endTime
  //     //                 mapStaff
  //     //                 gender
  //     //                 originalMessage
  //     //                 dateReceived
  //     //                 timeReceived
  //     //                 coordinator
  //     //                 assignedTo
  //     //                 status
  //     //             }
  //     //         }
  //     //     }
  //     // `;

  //     try {
  //       const response = await fetch(API_URL, {
  //         method: "GET",
  //         headers: { "Content-Type": "application/json" },
  //       });

  //       if (!response.ok) {
  //         const errorText = await response.text();
  //         console.error("Failed to fetch shifts:", errorText);
  //         return;
  //       }

  //       console.log("--------------------------");
  //       console.log(response);

  //       const result = await response.json();
  //       setShifts(result.data.Shift.items);
  //     } catch (error) {
  //       console.error("Failed to fetch shifts:", error);
  //     }
  //   };

  //   // Add a new shift to Cosmos DB
  //   const addShift = async (newShift) => {
  //     const mutation = `
  //             mutation {
  //                 createShift(data: {
  //                     shiftId: "${generateCustomId()}",
  //                     location: "${newShift.location}",
  //                     date: "${newShift.date}",
  //                     startTime: "${newShift.startTime}",
  //                     endTime: "${newShift.endTime}",
  //                     mapStaff: ${newShift.mapStaff},
  //                     gender: "${newShift.gender}",
  //                     originalMessage: "${newShift.originalMessage}",
  //                     dateReceived: "${new Date().toLocaleDateString()}",
  //                     timeReceived: "${new Date().toLocaleTimeString()}",
  //                     coordinator: "${newShift.coordinator}",
  //                     assignedTo: "${newShift.assignedTo}",
  //                     status: "${
  //                       newShift.status
  //                     }" eived: "${new Date().toLocaleTimeString()}"
  //                 }) {
  //                     shiftId
  //                 }
  //             }
  //         `;

  //     fetchShifts();
  //   };

  //   // Update an existing shift in Cosmos DB
  //   const updateShift = async (updatedShift) => {
  //     const mutation = `
  //             mutation {
  //                 updateShift(id: "${updatedShift.shiftId}", data: {
  //                     location: "${updatedShift.location}",
  //                     date: "${updatedShift.date}",
  //                     startTime: "${updatedShift.startTime}",
  //                     endTime: "${updatedShift.endTime}",
  //                     mapStaff: ${updatedShift.mapStaff},
  //                     gender: "${updatedShift.gender}",
  //                     originalMessage: "${updatedShift.originalMessage}",
  //                     coordinator: "${updatedShift.coordinator}",
  //                     assignedTo: "${updatedShift.assignedTo}",
  //                     status: "${updatedShift.status}"
  //                 }) {
  //                     shiftId
  //                 }
  //             }
  //         `;
  //     await fetch(API_URL, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ query: mutation }),
  //     });
  //     fetchShifts();
  //     resetForm();
  //   };

  //   // Delete a shift from Cosmos DB
  //   const deleteShift = async (shiftId) => {
  //     const mutation = `
  //             mutation {
  //                 deleteShift(id: "${shiftId}") {
  //                     shiftId
  //                 }
  //             }
  //         `;
  //     await fetch(API_URL, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ query: mutation }),
  //     });
  //     fetchShifts();
  //   };

  // Form handlers
  //   const handleAddShift = (newShift) => addShift(newShift);
  //   const handleEditShift = (index) => {
  //     setCurrentShift(shifts[index]);
  //     setIsEditing(true);
  //   };

  //   const handleUpdateShift = (updatedShift) => updateShift(updatedShift);
  //   const handleDeleteShift = (index) => {
  //     setDeleteIndex(index);
  //     setIsDialogOpen(true);
  //   };

  //   const confirmDelete = () => {
  //     deleteShift(shifts[deleteIndex].shiftId);
  //     setIsDialogOpen(false);
  //     setDeleteIndex(null);
  //   };

  //   const cancelDelete = () => {
  //     setIsDialogOpen(false);
  //     setDeleteIndex(null);
  //   };


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
            {snackbar.message} // Message content
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default App;
