import React, { useState, useRef } from "react";
import { Avatar, Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { createNewChat } from "../../../api/user";
import { showLoader, hideLoader } from "../../../redux/loaderSlice";
import { setAllChats, setSelectedChat } from "../../../redux/userSlice";

const UserLists = ({ searchKey = "" }) => {
  const dispatch = useDispatch();
  const [startingUserId, setStartingUserId] = useState(null);
  const [imageErrors, setImageErrors] = useState({}); // NEW: Track image load errors per user

  // Track users for whom chat creation is in progress
  const creatingChatsRef = useRef(new Set());

  const {
    allUsers,
    allChats,
    user: currentUser,
    selectedChat,
  } = useSelector((state) => state.userReducer);

  /* ================= FORMAT TIME ================= */
  const formatChatTime = (date) => {
    if (!date) return "";

    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = messageDate.toDateString() === today.toDateString();
    const isYesterday =
      messageDate.toDateString() === yesterday.toDateString();

    if (isToday) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (isYesterday) {
      return "Yesterday";
    }

    return messageDate.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
    });
  };

  /* ================= UNREAD MESSAGE COUNT ================= */
  const getUnreadMessageCount = (userId) => {
    const chat = allChats.find((c) =>
      c.members.some((m) => m._id === userId)
    );

    if (
      chat &&
      chat.unreadMessageCount > 0 &&
      chat.lastMessage?.sender !== currentUser._id
    ) {
      return chat.unreadMessageCount;
    }

    return 0;
  };

  /* ================= START CHAT ONLY IF NOT EXISTS ================= */
  const startNewChat = async (user) => {
    if (startingUserId === user._id) return;
    if (creatingChatsRef.current.has(user._id)) return;

    const existingChat = allChats.find((c) =>
      c.members.some((m) => m._id === user._id)
    );

    if (existingChat) {
      dispatch(setSelectedChat(existingChat));
      return;
    }

    try {
      creatingChatsRef.current.add(user._id);
      setStartingUserId(user._id);
      dispatch(showLoader());

      const response = await createNewChat([currentUser._id, user._id]);

      if (response?.success) {
        const chat = response.data;

        const exists = allChats.some((c) => c._id === chat._id);
        if (!exists) {
          dispatch(setAllChats([chat, ...allChats]));
        }

        dispatch(setSelectedChat(chat));
      }
    } catch (error) {
      toast.error("Failed to start chat");
    } finally {
      creatingChatsRef.current.delete(user._id);
      setStartingUserId(null);
      dispatch(hideLoader());
    }
  };

  /* ================= OPEN EXISTING CHAT ================= */
  const openChat = (chat) => {
    dispatch(setSelectedChat(chat));
  };

  // NEW: Handle image load error
  const handleImageError = (userId) => {
    setImageErrors(prev => ({ ...prev, [userId]: true }));
  };

  // MODIFIED: Get initials with fallback
  const getInitials = (user) => {
    if (!user) return "";
    const first = user.firstname?.[0] || "";
    const last = user.lastname?.[0] || "";
    return (first + last).toUpperCase() || "U";
  };

  // NEW: Get user display name
  const getUserDisplayName = (user) => {
    return `${user.firstname || ""} ${user.lastname || ""}`.trim() || "Unknown User";
  };

  const chatUsers = [...allChats]
    .sort(
      (a, b) =>
        new Date(b?.lastMessage?.createdAt || 0) -
        new Date(a?.lastMessage?.createdAt || 0)
    )
    .map((chat) =>
      chat.members.find((m) => m._id !== currentUser._id)
    );

  const finalUsers =
    searchKey.trim() === ""
      ? chatUsers
      : allUsers.filter((u) =>
          `${u.firstname} ${u.lastname}`
            .toLowerCase()
            .includes(searchKey.toLowerCase())
        );

  return (
    <div className="space-y-1">
      {finalUsers.map((user) => {
        const chat = allChats.find((c) =>
          c.members.some((m) => m._id === user._id)
        );

        const isActive = selectedChat?._id === chat?._id;
        const isStarting =
          startingUserId === user._id ||
          creatingChatsRef.current.has(user._id);
        
        // NEW: Check if we should show profile pic or avatar
        const showProfilePic = user?.profilePic && !imageErrors[user._id];

        return (
          <div
            key={user._id}
            onClick={() => chat && openChat(chat)}
            className={`flex items-center justify-between px-3 py-2 mx-2 rounded-lg cursor-pointer transition
              ${
                isActive
                  ? "bg-[#957C62] text-white"
                  : "bg-[#EFE9E3] hover:bg-[#E1D6CC]"
              }`}
          >
            {/* LEFT - UPDATED WITH PROFILE PIC */}
            <div className="flex items-center gap-3 overflow-hidden">
              {/* CHANGED: Dynamic profile picture or avatar */}
              {showProfilePic ? (
                <img
                  src={user.profilePic}
                  alt={getUserDisplayName(user)}
                  className="w-9 h-9 rounded-full object-cover border-2"
                  style={{ 
                    borderColor: isActive ? "#fff" : "#C2A68C" 
                  }}
                  onError={() => handleImageError(user._id)}
                />
              ) : (
                <Avatar
                  sx={{
                    bgcolor: isActive ? "#fff" : "#957C62",
                    color: isActive ? "#957C62" : "#fff",
                    width: 36,
                    height: 36,
                    fontSize: "13px",
                  }}
                >
                  {getInitials(user)}
                </Avatar>
              )}

              <div className="flex flex-col overflow-hidden">
                <Typography fontSize="14px" fontWeight={600} noWrap>
                  {getUserDisplayName(user)}
                </Typography>

                {chat?.lastMessage && (
                  <Typography
                    fontSize="11px"
                    className="opacity-80 truncate max-w-[180px]"
                  >
                    {chat.lastMessage.sender === currentUser._id
                      ? `You: ${chat.lastMessage.text}`
                      : chat.lastMessage.text}
                  </Typography>
                )}
              </div>
            </div>

            {/* RIGHT - UNCHANGED */}
            <div className="flex flex-col items-end gap-1 min-w-[60px]">
              {chat?.lastMessage && (
                <Typography
                  fontSize="11px"
                  className={`${
                    isActive ? "text-white/80" : "text-gray-500"
                  }`}
                >
                  {formatChatTime(chat.lastMessage.createdAt)}
                </Typography>
              )}

              {getUnreadMessageCount(user._id) > 0 && (
                <div className="bg-green-600 text-white text-[11px] font-semibold min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full">
                  {getUnreadMessageCount(user._id)}
                </div>
              )}

              {!chat && searchKey && (
                <Button
                  size="small"
                  disabled={isStarting}
                  onClick={(e) => {
                    e.stopPropagation();
                    startNewChat(user);
                  }}
                  className="!bg-white !text-[#957C62] !text-xs disabled:!opacity-50 disabled:!cursor-not-allowed"
                >
                  {isStarting ? "Starting..." : "Start"}
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserLists;