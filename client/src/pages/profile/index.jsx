import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@mui/material";
import { uploadProfilePic } from "../../api/user";
import { hideLoader, showLoader } from "../../redux/loaderSlice";
import toast from "react-hot-toast";
import { setUser } from "../../redux/userSlice";
import ChatHeader from "../Home/components/header";

const Profile = () => {
  const { user } = useSelector((state) => state.userReducer);
  const [preview, setPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); // Add this to track the actual file
  const fileInputRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.profilePic) {
      setPreview(user.profilePic);
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Store the actual file
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  const getInitials = () => {
    if (!user) return "";
    return (
      (user.firstname?.[0]?.toUpperCase() || '') + 
      (user.lastname?.[0]?.toUpperCase() || '')
    );
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const updateProfilePic = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    try {
      dispatch(showLoader());
      
      // Convert image to base64
      const base64Image = await convertToBase64(selectedFile);
      
      const response = await uploadProfilePic(base64Image);
      
      if (response.success) {
        toast.success(response.message);
        dispatch(setUser(response.data));
        setSelectedFile(null); // Clear selected file after successful upload
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message || "Error uploading image");
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <>
    <ChatHeader/>
    <div className="min-h-screen bg-gradient-to-br from-[#F5F1ED] to-[#E8DFD8] flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-4xl p-8">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          {/* LEFT SIDE - PROFILE IMAGE */}
          <div className="flex flex-col items-center gap-4 w-full md:w-1/2">
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                className="w-48 h-48 rounded-full object-cover shadow-lg border-4 border-[#C2A68C]"
              />
            ) : (
              <Avatar
                sx={{
                  width: 180,
                  height: 180,
                  bgcolor: "#C2A68C",
                  fontSize: "48px",
                  fontWeight: "bold",
                }}
              >
                {getInitials()}
              </Avatar>
            )}

            <button
              onClick={() => fileInputRef.current.click()}
              className="bg-[#957C62] text-white px-6 py-2 rounded-lg hover:bg-[#7d6651] transition duration-300 shadow-md"
            >
              Choose Picture
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
            
            {selectedFile && (
              <button 
                onClick={updateProfilePic}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-300 shadow-md"
              >
                Upload Picture
              </button>
            )}
          </div>

          {/* RIGHT SIDE - USER INFO */}
          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-3xl font-bold text-[#957C62]">
              {user?.firstname} {user?.lastname}
            </h2>

            <div className="bg-[#F5F1ED] p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-medium text-gray-800">{user?.email}</p>
            </div>

            <div className="bg-[#F5F1ED] p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Account Created</p>
              <p className="text-lg font-medium text-gray-800">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Profile;