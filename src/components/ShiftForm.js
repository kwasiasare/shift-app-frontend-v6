import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  Container,
  Paper,
} from "@mui/material";

const ShiftForm = ({ onAddShift, currentShift, isEditing, onUpdateShift }) => {
  const [shift, setShift] = useState({
    location: "",
    date: "",
    start_time: "",
    end_time: "",
    map_staff: "No",
    gender: "N/a",
    message: "",
    coordinator: "",
    assigned: "",
    status: "",
  });

  // Populate form with current shift data if editing
  useEffect(() => {
    if (isEditing && currentShift) {
      setShift({
        location: currentShift.location || "",
        date: formatDate(currentShift.date), // Format date for input, 
        start_time: currentShift.start_time || "",
        end_time: currentShift.end_time || "",
        map_staff: currentShift.map_staff || "No",
        gender: currentShift.gender || "N/a",
        message: currentShift.message || "",
        coordinator: currentShift.coordinator || "",
        assigned: currentShift.assigned || "",
        status: currentShift.status || "",
      });
    } else {
      resetForm();
    }
  }, [isEditing, currentShift]);

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setShift({ ...shift, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      onUpdateShift(shift);
    } else {
      onAddShift(shift);
    }
    resetForm();
  };

  const resetForm = () => {
    setShift({
      location: "",
      date: "",
      start_time: "",
      end_time: "",
      map_staff: "No",
      gender: "N/a",
      message: "",
      coordinator: "",
      assigned: "",
      status: "",
    });
  };

  return (
    <Container
      component={Paper}
      elevation={3}
      style={{ padding: "16px", marginBottom: "20px" }}
    >
      <Typography variant="h6" gutterBottom>
        {isEditing ? "Edit Shift" : "Add Shift"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={shift.location}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date"
              name="date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={shift.date}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Start Time"
              name="start_time"
              type="time"
              InputLabelProps={{ shrink: true }}
              value={shift.start_time}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="End Time"
              name="end_time"
              type="time"
              InputLabelProps={{ shrink: true }}
              value={shift.end_time}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Map Staff"
              name="map_staff"
              value={shift.map_staff}
              onChange={handleChange}
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Gender"
              name="gender"
              value={shift.gender}
              onChange={handleChange}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
              <MenuItem value="N/a">N/a</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Original Message"
              name="message"
              value={shift.message}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Coordinator"
              name="coordinator"
              value={shift.coordinator}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Assigned To"
              name="assigned"
              value={shift.assigned}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Status"
              name="status"
              value={shift.status}
              onChange={handleChange}
            >
              <MenuItem value="Assigned To Coordinator">
                Assigned To Coordinator
              </MenuItem>
              <MenuItem value="Added to Connecteam">
                Added to Connecteam
              </MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Shift Completed">Shift Completed</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {isEditing ? "Update Shift" : "Add Shift"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default ShiftForm;
