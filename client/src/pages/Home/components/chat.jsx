import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@mui/material";
import { createNewMessage, getAllMessages } from "../../../api/user";
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";

const ChatArea = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const scrollRef = useRef(null);

  const { selectedChat, user, allUsers } = useSelector(
    (state) => state.userReducer
  );

  /* ================= SAFELY FETCH MESSAGES ================= */
  const getMessages = async () => {
    if (!selectedChat?._id) return;

    try {
      dispatch(showLoader());
      const response = await getAllMessages(selectedChat._id);
      dispatch(hideLoader());

      if (response?.success) {
        setAllMessages(response.data || []);
      }
    } catch (error) {
      dispatch(hideLoader());
      toast.error(error?.message || "Failed to load messages");
    }
  };

  /* ================= LOAD CHAT HISTORY ================= */
  useEffect(() => {
    setAllMessages([]); // clear old chat data
    getMessages();
  }, [selectedChat?._id]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async () => {
    if (!message.trim() || !selectedChat?._id) return;

    try {
      const payload = {
        chatId: selectedChat._id,
        sender: user._id,
        text: message.trim(),
      };

      const tempId = Date.now(); // for smooth UI update

      const tempMsg = {
        ...payload,
        _id: tempId,
      };

      // Optimistic UI update
      setAllMessages((prev) => [...prev, tempMsg]);
      setMessage("");

      dispatch(showLoader());
      const response = await createNewMessage(payload);
      dispatch(hideLoader());

      if (response?.success) {
        setAllMessages((prev) =>
          prev.map((m) => (m._id === tempId ? response.data : m))
        );
      }
    } catch (error) {
      dispatch(hideLoader());
      toast.error(error?.message || "Failed to send message");
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a chat to start messaging
      </div>
    );
  }

  /* ================= FIND OTHER USER ================= */
  const otherUserId = selectedChat.members.find((m) => m !== user._id);
  const otherUser = allUsers.find((u) => u._id === otherUserId);

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
        {allMessages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${
              msg.sender === user._id ? "justify-end" : "justify-start"
            } mb-2`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm ${
                msg.sender === user._id
                  ? "bg-[#957C62] text-white"
                  : "bg-white text-gray-800 border"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        <div ref={scrollRef} />
      </div>

      {/* ================= SEND MESSAGE ================= */}
      <div className="flex items-center gap-3 p-3 bg-white border-t">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-full outline-none focus:border-[#957C62]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          className="bg-[#957C62] text-white px-6 py-2 rounded-full hover:bg-[#846A53]"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
