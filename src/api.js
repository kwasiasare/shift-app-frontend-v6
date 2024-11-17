// src/api.js
import axios from "axios";

// Replace with your actual Azure Function App URL
const API_BASE_URL = "https://shiftapp-backend-v6-fkeqbsg9ekfucmfu.eastus2-01.azurewebsites.net/";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createShift = async (shiftData) => {
  try {
    const response = await axiosInstance.post("/", shiftData);
    return response.data;
  } catch (error) {
    console.error("Error creating shift:", error);
    throw error;
  }
};

export const readShifts = async () => {
  try {
    const response = await axiosInstance.get("/");
    return response.data;
  } catch (error) {
    console.error("Error reading shifts:", error);
    throw error;
  }
};

export const updateShift = async (shiftId, updatedData) => {
  try {
    const response = await axiosInstance.put(`/single/${shiftId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating shift:", error);
    throw error;
  }
};

export const deleteShift = async (shiftId) => {
  try {
    const response = await axiosInstance.delete(`/single/${shiftId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting shift:", error);
    throw error;
  }
};
