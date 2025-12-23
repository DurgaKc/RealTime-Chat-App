import React from "react";
import { Avatar } from "@mui/material";
import { FaMessage } from "react-icons/fa6";
import { useSelector } from "react-redux";

const ChatHeader = () => {
  const { user } = useSelector((state) => state.userReducer);

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

  return (
    <header className="flex justify-between items-center px-4 py-4 bg-[#EFE9E3] shadow-md">
      {/* Left */}
      <div className="flex items-center gap-2">
        <FaMessage className="mt-1 text-[#957C62]" />
        <span className="text-xl font-bold text-[#957C62]">QuickChat</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-green-500"></span>

        <span className="text-[#957C62] font-medium">
          {getFullName()}
        </span>

        <Avatar
          sx={{
            width: 34,
            height: 34,
            bgcolor: "#C2A68C",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          {getInitials()}
        </Avatar>
      </div>
    </header>
  );
};

export default ChatHeader;
