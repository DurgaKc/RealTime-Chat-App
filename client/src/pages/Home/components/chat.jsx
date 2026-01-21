import { useSelector } from "react-redux";
import { Avatar } from "@mui/material";

const ChatArea = () => {
  const { selectedChat, user, allUsers } = useSelector(
    (state) => state.userReducer
  );

  if (!selectedChat) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a chat to start messaging
      </div>
    );
  }

  /* 🔑 FIND OTHER USER CORRECTLY */
  const otherUserId = selectedChat.members.find(
    (m) => m !== user._id
  );
  const otherUser = allUsers.find(
    (u) => u._id === otherUserId
  );

  return (
    <div className="flex flex-col h-full">
      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#957C62] text-white shadow">
        <Avatar sx={{ bgcolor: "#fff", color: "#957C62" }}>
          {otherUser?.firstname?.[0]}
        </Avatar>

        <div>
          <p className="font-semibold text-lg">
            {otherUser?.firstname} {otherUser?.lastname}
          </p>
          <p className="text-xs opacity-80">Online</p>
        </div>
      </div>

      {/* ================= MESSAGES ================= */}
      <div className="flex-1 p-4 overflow-y-auto bg-[#F5F1ED]">
        {/* Messages will come here */}
        <div className="text-center text-sm text-gray-500">
          No messages yet
        </div>
      </div>

      {/* ================= SEND MESSAGE ================= */}
      <div className="flex items-center gap-3 p-3 bg-white border-t">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-full outline-none focus:border-[#957C62]"
        />

        <button className="bg-[#957C62] text-white px-6 py-2 rounded-full hover:bg-[#846A53]">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
