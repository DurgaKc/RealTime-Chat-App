import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Create an Axios instance
export const axiosInstance = axios.create({
  baseURL: backendUrl,
});

// Request interceptor to automatically add Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Function to get logged-in user data using the instance
export const getLoggedUser = async () => {
  try {
    const response = await axiosInstance.get("/api/user/get-logged-user");
    return response.data; // { success, message, data }
  } catch (error) {
    console.error("Error fetching logged user:", error);
    throw error; // propagate error to caller
  }
};
