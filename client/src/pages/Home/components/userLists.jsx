import React from "react";
import { Avatar, Button, Typography } from "@mui/material";
import { useSelector } from "react-redux";

const UserLists = ({ searchKey = "" }) => {
  const { allUsers, allChats } = useSelector((state) => state.userReducer);

  const getInitials = (firstname, lastname) =>
    `${firstname?.[0] || ""}${lastname?.[0] || ""}`.toUpperCase();

  // 🔹 If nothing typed, show nothing
  const filteredUsers =
    searchKey.trim() === ""
      ? []
      : allUsers?.filter((user) => {
          const fname = user?.firstname?.toLowerCase() || "";
          const lname = user?.lastname?.toLowerCase() || "";
          const key = searchKey.toLowerCase();

          return fname.includes(key) || lname.includes(key);
        });

  return (
    <div className="space-y-2">
      {filteredUsers?.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between rounded-md px-3 py-2 shadow-sm hover:shadow transition"
          style={{ backgroundColor: "#C2A68C" }}
        >
          {/* Left */}
          <div className="flex items-center gap-3">
            <Avatar
              sx={{
                bgcolor: "#957C62",
                width: 36,
                height: 36,
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {getInitials(user.firstname, user.lastname)}
            </Avatar>

            <div className="leading-tight">
              <Typography
                fontSize="14px"
                fontWeight={600}
                className="text-white"
              >
                {user.firstname} {user.lastname}
              </Typography>

              <Typography fontSize="12px" className="text-white/80">
                {user.email}
              </Typography>
            </div>
          </div>
          {!allChats.find((chat) => chat.members.includes(user._id)) && (
            <Button
              size="small"
              className="!bg-white !text-[#957C62] !text-xs !capitalize hover:!bg-[#EFE9E3]"
            >
              Chat
            </Button>
          )}
        </div>
      ))}

      {/* Optional empty message */}
      {searchKey.trim() !== "" && filteredUsers?.length === 0 && (
        <p className="text-center text-sm text-gray-600">No users found</p>
      )}
    </div>
  );
};

export default UserLists;
