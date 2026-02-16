import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const changePassword = async ({ oldPassword, newPassword }) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    const res = await axios.put(
      `${backendUrl}/api/auth/changePassword`,
      { oldPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return res.data;
  } catch (error) {
    // Re-throw the error so the component can catch it
    throw error;
  }
};