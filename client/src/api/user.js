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
export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get("/api/user/get-all-users");
    return response.data; 
    
  } catch (error) {
    console.error("Error fetching all user:", error);
    throw error; 
  }
  
};

export const getAllChats = async () => {
    try{
        const response = await axiosInstance.get("/api/chat/get-all-chats");
        return response.data;
    }catch(error){
         console.error("Error fetching all chats:", error);
    throw error; 
    }
}
export const createNewChat = async ( members ) => {
    try{
        const response = await axiosInstance.post("/api/chat/create-new-chat", { members });
        return response.data;
    }catch(error){
         console.error("Error in creating new chats:", error);
    throw error; 
    }
}

export const clearUnreadMessageCount = async ( chatId ) => {
    try{
        const response = await axiosInstance.post("/api/chat/clear-unread-message",  { chatId: chatId} );
        return response.data;
    }catch(error){
         console.error("Error in creating new chats:", error);
    throw error; 
    }
}

// Messages

export const getAllMessages = async ( chatId ) => {
    try{
        const response = await axiosInstance.get(`api/message/get-all-messages/${chatId}`);
        return response.data;
    }catch(error){
         console.error("Error in creating new chats:", error);
    throw error; 
    }
}

export const createNewMessage = async ( message ) => {
    try{
        const response = await axiosInstance.post("/api/message/new-message",  message );
        return response.data;
    }catch(error){
         console.error("Error in creating new chats:", error);
    throw error; 
    }
}

