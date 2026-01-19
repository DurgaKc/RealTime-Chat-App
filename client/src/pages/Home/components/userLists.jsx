import React from "react";
import { Avatar, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import { createNewChat } from "../../../api/user";
import { showLoader, hideLoader } from "../../../redux/loaderSlice";
import { setAllChats } from "../../../redux/userSlice";

const UserLists = ({ searchKey = "" }) => {
  const dispatch = useDispatch();

  const { allUsers, allChats, user: currentUser } = useSelector(
    (state) => state.userReducer
  );

  // 🔹 Start new chat
  const startNewChat = async (searchUserId) => {
    try {
      dispatch(showLoader());

      const response = await createNewChat([
        currentUser._id,
        searchUserId,
      ]);

      dispatch(hideLoader());

      if (response?.success) {
        toast.success(response.message);

        const newChat = response.data;

        dispatch(setAllChats([...allChats, newChat]));
      }
    } catch (error) {
      dispatch(hideLoader());
      toast.error(
        error?.response?.data?.message || "Failed to start chat"
      );
    }
  };

  const getInitials = (firstname, lastname) =>
    `${firstname?.[0] || ""}${lastname?.[0] || ""}`.toUpperCase();

  // 🔹 Users who already have chats
  const chattedUserIds = allChats?.flatMap((chat) => chat.members) || [];

  const chatStartedUsers = allUsers?.filter((user) =>
    chattedUserIds.includes(user._id)
  );

  // 🔹 Search users
  const searchedUsers =
    searchKey.trim() === ""
      ? []
      : allUsers?.filter((user) => {
          const fname = user?.firstname?.toLowerCase() || "";
          const lname = user?.lastname?.toLowerCase() || "";
          const key = searchKey.toLowerCase();

          return fname.includes(key) || lname.includes(key);
        });

  // 🔹 Final list logic
  const finalUsers =
    searchKey.trim() === "" ? chatStartedUsers : searchedUsers;

  return (
    <div className="space-y-2">
      {finalUsers?.map((user) => {
        const isChatStarted = allChats?.some((chat) =>
          chat.members.includes(user._id)
        );

        return (
          <div
            key={user._id}
            className="flex items-center justify-between rounded-md ml-4 mr-2 px-2 py-1 shadow-sm hover:shadow transition"
            style={{ backgroundColor: "#C2A68C" }}
          >
            {/* Left */}
            <div className="flex items-center gap-2">
              <Avatar
                sx={{
                  bgcolor: "#957C62",
                  width: 30,
                  height: 30,
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {getInitials(user.firstname, user.lastname)}
              </Avatar>

              <div className="leading-tight">
                <Typography
                  fontSize="13px"
                  fontWeight={600}
                  className="text-white"
                >
                  {user.firstname} {user.lastname}
                </Typography>

                <Typography fontSize="11px" className="text-white/80">
                  {user.email}
                </Typography>
              </div>
            </div>

            {/* Right */}
            {!isChatStarted && searchKey.trim() !== "" && (
              <Button
                size="small"
                className="!bg-white !text-[#957C62] !text-xs !capitalize hover:!bg-[#EFE9E3]"
                onClick={() => startNewChat(user._id)}
              >
                Start Chat
              </Button>
            )}
          </div>
        );
      })}

      {searchKey.trim() !== "" && finalUsers?.length === 0 && (
        <p className="text-center text-sm text-gray-600">
          No users found
        </p>
      )}
    </div>
  );
};

export default UserLists;
