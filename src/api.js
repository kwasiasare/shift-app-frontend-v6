// src/api.js
import axios from "axios";

// Replace with your actual Azure Function App URL
// const API_BASE_URL = "https://shift-app-backend-v6.onrender.com";
const API_BASE_URL = "https://osqrbz5rg9.execute-api.us-east-1.amazonaws.com/prod";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createShift = async (shiftData) => {
  try {
    const response = await axiosInstance.post("/api/", shiftData);
    return response.data;
  } catch (error) {
    console.error("Error creating shift:", error);
    throw error;
  }
};

export const readShifts = async () => {
  try {
    const response = await axiosInstance.get("/api/");
    return response.data;
  } catch (error) {
    console.error("Error reading shifts:", error);
    throw error;
  }
};

export const updateShift = async (shiftId, updatedData) => {
  try {
    const response = await axiosInstance.put(`/api/single/${shiftId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating shift:", error);
    throw error;
  }
};

export const deleteShift = async (shiftId) => {
  try {
    const response = await axiosInstance.delete(`/api/single/${shiftId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting shift:", error);
    throw error;
  }
};
