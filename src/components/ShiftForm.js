import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import moment from "moment";

const defaultShiftState = {
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
};


const ShiftForm = ({ onAddShift, currentShift, isEditing, onUpdateShift }) => {
  const [shift, setShift] = useState(defaultShiftState);

  // Populate form with current shift data if editing
  useEffect(() => {
    if (isEditing && currentShift) {
      setShift({
        ...defaultShiftState,
        ...currentShift,
        date: currentShift.date ? moment(currentShift.date).format("YYYY-MM-DD") : "", // Format date
      });
    } else {
      setShift(defaultShiftState);
    }
  }, [isEditing, currentShift]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'date') {
      setShift({ ...shift, [name]: moment(value).format("YYYY-MM-DD") });
    } else {
      setShift({ ...shift, [name]: value });
    }
  };

  //const handleDateChange = (e) => {
    //setShift({ ...shift, date: e.target.value });
  //};

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
    setShift(defaultShiftState);
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={shift.location}
            onChange={handleChange}
            required
            aria-label="Location"
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
          <TextField
            fullWidth
            label="Date"
            name="date"
            type="date"
            value={shift.date}
            onChange={handleChange}
            required
           // aria-label="Date"
          />
        <TextField
            fullWidth
            label="Start Time"
            name="start_time"
            type="time"
            value={shift.start_time}
            onChange={handleChange}
            required
            aria-label="Start Time"
          />
          <TextField
            fullWidth
            label="End Time"
            name="end_time"
            type="time"
            value={shift.end_time}
            onChange={handleChange}
            required
            aria-label="End Time"
          />
          </Box>
          <Box sx={{ marginTop: 2 }}>
            <TextField
              fullWidth
              select
              label="Map Staff"
              name="map_staff"
              value={shift.map_staff}
              onChange={handleChange}
              aria-label="Map Staff"
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </TextField>
          </Box>
          <Box sx={{ marginTop: 2 }}>
            <TextField
              fullWidth
              select
              label="Gender"
              name="gender"
              value={shift.gender}
              onChange={handleChange}
              aria-label="Gender"
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
              <MenuItem value="N/A">Not Applicable</MenuItem>
            </TextField>
          </Box>
          <Box sx={{ marginTop: 2 }}>
            <TextField
              fullWidth
              label="Original Message"
              name="message"
              value={shift.message}
              onChange={handleChange}
              aria-label="Message"
            />
          </Box>
          <Box sx={{ marginTop: 2 }}>
            <TextField
              fullWidth
              label="Coordinator"
              name="coordinator"
              value={shift.coordinator}
              onChange={handleChange}
              aria-label="Coordinator"
            />
          </Box>
          <Box sx={{ marginTop: 2 }}>
            <TextField
              fullWidth
              label="Assigned To"
              name="assigned"
              value={shift.assigned}
              onChange={handleChange}
              aria-label="Assigned To"
            />
          </Box>
          <Box sx={{ marginTop: 2 }}>
            <TextField
              fullWidth
              select
              label="Status"
              name="status"
              value={shift.status}
              onChange={handleChange}
              required
              aria-label="Status"
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
          </Box>
          <Box sx={{ marginTop: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color={isEditing ? "secondary" : "primary"}
              fullWidth
            >
              {isEditing ? "Update Shift" : "Add Shift"}
              </Button>
            </Box>
         </form>
      </Container>
   );
};

export default ShiftForm;
