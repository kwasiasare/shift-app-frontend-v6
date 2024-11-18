import React, { useState, useEffect } from "react";
import { Button, TextField, Grid } from "@mui/material";

const ShiftForm = ({ onAddShift, currentShift, isEditing, onUpdateShift, formatDate }) => {
  const [shift, setShift] = useState({
    location: "",
    date: "",
    start_time: "",
    end_time: "",
    map_staff: "No",
    gender: "N/a",
    coordinator: "",
    assigned: "",
    status: "",
  });

  useEffect(() => {
    if (isEditing && currentShift) {
      setShift({
        ...currentShift,
        date: formatDate(currentShift.date), // Format the date for the input field
      });
    } else {
      resetForm();
    }
  }, [currentShift, isEditing, formatDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle date inputs for proper state storage
    const formattedValue =
      name === "date" ? new Date(value).toISOString() : value;

    setShift({ ...shift, [name]: formattedValue });
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
      coordinator: "",
      assigned: "",
      status: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            name="location"
            label="Location"
            value={shift.location}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            type="date"
            name="date"
            label="Date"
            value={shift.date}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            {isEditing ? "Update Shift" : "Add Shift"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ShiftForm;
