import React, { useState } from "react";
import { Avatar } from "@mui/material";
import { FaMessage } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { IoMdSettings } from "react-icons/io";
import SettingsDropdown from "./setting/setting";

const ChatHeader = () => {
  const { user } = useSelector((state) => state.userReducer);
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  function getFullName() {
    if (!user) return "";

    const fname =
      user.firstname?.toLowerCase().charAt(0).toUpperCase() +
      user.firstname?.slice(1).toLowerCase();

    const lname =
      user.lastname?.toLowerCase().charAt(0).toUpperCase() +
      user.lastname?.slice(1).toLowerCase();

    return `${fname} ${lname}`;
  }

  function getInitials() {
    if (!user) return "";

    const f = user.firstname?.[0]?.toUpperCase() || "";
    const l = user.lastname?.[0]?.toUpperCase() || "";

    return f + l;
  }
  const logout = () =>{
    localStorage.removeItem('token')
    navigate('/login');
  }

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Determine if we should show image or avatar
  const showImage = user?.profilePic && !imageError;

  return (
    <header className="flex justify-between items-center px-4 py-4 bg-[#EFE9E3] shadow-md">
      {/* Left */}
       <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <FaMessage className="mt-1 text-[#957C62]" />
        <span className="text-xl font-bold text-[#957C62]">QuickChat</span>
      </Link>

      {/* Right */}
      {/* Right */}
<div className="flex items-center gap-3">
  
  {/* Profile Picture with Green Online Dot */}
  <div
    onClick={handleProfileClick}
    className="relative cursor-pointer hover:opacity-80 transition-opacity"
  >
    {showImage ? (
      <img
        src={user.profilePic}
        alt={`${getFullName()}'s profile`}
        className="w-10 h-10 rounded-full object-cover border-2 border-[#C2A68C]"
        onError={handleImageError}
      />
    ) : (
      <Avatar
        sx={{
          width: 40,
          height: 40,
          bgcolor: "#C2A68C",
          fontSize: "15px",
          fontWeight: "bold",
        }}
      >
        {getInitials()}
      </Avatar>
    )}

    {/* Green Online Dot (Overlapping) */}
    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#EFE9E3] rounded-full"></span>
  </div>

  {/* Logged-in User Name */}
  <span className="text-[#957C62] font-medium">
    {getFullName()}
  </span>
  {/* <button
  onClick={logout}
  > */}
    <SettingsDropdown/>
  {/* <IoMdSettings size={24} color="#957C62" /> */}
  {/* </button> */}

</div>

    </header>
  );
};

export default ChatHeader;