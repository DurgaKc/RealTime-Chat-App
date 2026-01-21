import React from "react";
import { Avatar, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { createNewChat } from "../../../api/user";
import { showLoader, hideLoader } from "../../../redux/loaderSlice";
import { setAllChats, setSelectedChat } from "../../../redux/userSlice";

const UserLists = ({ searchKey = "" }) => {
  const dispatch = useDispatch();

  const {
    allUsers,
    allChats,
    user: currentUser,
    selectedChat,
  } = useSelector((state) => state.userReducer);

  /* ================= START NEW CHAT ================= */
  const startNewChat = async (userId) => {
    try {
      dispatch(showLoader());
      const response = await createNewChat([currentUser._id, userId]);
      dispatch(hideLoader());

      if (response?.success) {
        toast.success(response.message);
        dispatch(setAllChats([...allChats, response.data]));
        dispatch(setSelectedChat(response.data));
      }
    } catch (error) {
      dispatch(hideLoader());
      toast.error("Failed to start chat");
    }
  };

  /* ================= OPEN CHAT ================= */
  const openChat = (userId) => {
    const chat = allChats.find(
      (chat) =>
        chat.members.includes(currentUser._id) &&
        chat.members.includes(userId)
    );

    if (chat) {
      dispatch(setSelectedChat(chat));
    }
  };

  /* ================= HELPERS ================= */
  const getInitials = (f, l) =>
    `${f?.[0] || ""}${l?.[0] || ""}`.toUpperCase();

  const chattedUserIds =
    allChats?.flatMap((chat) =>
      chat.members.filter((id) => id !== currentUser._id)
    ) || [];

  const chatStartedUsers = allUsers?.filter((u) =>
    chattedUserIds.includes(u._id)
  );

  const finalUsers =
    searchKey.trim() === ""
      ? chatStartedUsers
      : allUsers.filter((u) =>
          `${u.firstname} ${u.lastname}`
            .toLowerCase()
            .includes(searchKey.toLowerCase())
        );

  return (
    <div className="space-y-1">
      {finalUsers.map((user) => {
        const chat = allChats.find(
          (c) =>
            c.members.includes(currentUser._id) &&
            c.members.includes(user._id)
        );

        const isActive = selectedChat?._id === chat?._id;

        return (
          <div
            key={user._id}
            onClick={() => openChat(user._id)}
            className={`flex items-center justify-between px-3 py-2 mx-2 rounded-lg cursor-pointer transition
              ${
                isActive
                  ? "bg-[#957C62] text-white"
                  : "bg-[#EFE9E3] hover:bg-[#E1D6CC]"
              }`}
          >
            {/* LEFT */}
            <div className="flex items-center gap-3">
              <Avatar
                sx={{
                  bgcolor: isActive ? "#fff" : "#957C62",
                  color: isActive ? "#957C62" : "#fff",
                  width: 36,
                  height: 36,
                  fontSize: "13px",
                }}
              >
                {getInitials(user.firstname, user.lastname)}
              </Avatar>

              <div>
                <Typography fontSize="14px" fontWeight={600}>
                  {user.firstname} {user.lastname}
                </Typography>
                <Typography fontSize="11px" className="opacity-80">
                  {user.email}
                </Typography>
              </div>
            </div>

            {/* RIGHT */}
            {!chat && searchKey && (
              <Button
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  startNewChat(user._id);
                }}
                className="!bg-white !text-[#957C62] !text-xs"
              >
                Start
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UserLists;
