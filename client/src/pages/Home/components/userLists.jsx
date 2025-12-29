import React from "react";
import { Avatar, Button, Typography } from "@mui/material";

const UserLists = ({ user }) => {
  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition border mb-2">
      
      {/* Left: Avatar */}
      <div className="flex items-center gap-4">
        <Avatar
          sx={{
            bgcolor: "#1976d2",
            width: 45,
            height: 45,
            fontSize: "16px",
            fontWeight: 600,
          }}
        >
          {getInitials(user.firstName, user.lastName)}
        </Avatar>

        {/* Middle: Name & Email */}
        <div>
          <Typography variant="subtitle1" fontWeight={600}>
            {user.firstName} {user.lastName}
          </Typography>
          <Typography
            variant="body2"
            className="text-gray-500 text-sm"
          >
            {user.email}
          </Typography>
        </div>
      </div>

      {/* Right: Start Chat Button */}
      <Button
        variant="contained"
        size="small"
        className="!bg-blue-600 hover:!bg-blue-700 !capitalize"
      >
        Start Chat
      </Button>
    </div>
  );
};

export default UserLists;
