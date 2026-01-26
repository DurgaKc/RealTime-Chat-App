import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@mui/material";
import { createNewMessage, getAllMessages, clearUnreadMessageCount } from "../../../api/user";
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import { setAllChats } from "../../../redux/userSlice";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";

const ChatArea = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const scrollRef = useRef(null);

  const { selectedChat, user, allChats } = useSelector(
    (state) => state.userReducer
  );

  /* ================= FETCH MESSAGES ================= */
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

  /* ================= CLEAR UNREAD ================= */
  const clearUnreadMessages = async () => {
    if (!selectedChat?._id) return;

    try {
      const response = await clearUnreadMessageCount(selectedChat._id);

      if (response?.success) {
        const updatedChats = allChats.map((chat) =>
          chat._id === selectedChat._id ? response.data : chat
        );
        dispatch(setAllChats(updatedChats));
      }
    } catch (error) {
      toast.error(error?.message || "Failed to clear unread messages");
    }
  };

  /* ================= LOAD CHAT ================= */
  useEffect(() => {
    setAllMessages([]);
    getMessages();
    clearUnreadMessages();
  }, [selectedChat?._id]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async () => {
    if (!message.trim() || !selectedChat?._id) return;

    const payload = {
      chatId: selectedChat._id,
      sender: user._id,
      text: message.trim(),
    };

    const tempId = Date.now();

    const tempMsg = {
      ...payload,
      _id: tempId,
      createdAt: new Date().toISOString(),
    };

    setAllMessages((prev) => [...prev, tempMsg]);
    setMessage("");

    try {
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

  const otherUser = selectedChat.members?.find(
    (m) => m._id !== user._id
  );

  /* ================= FORMAT DATE ================= */
  const formatTime = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = messageDate.toDateString() === today.toDateString();
    const isYesterday =
      messageDate.toDateString() === yesterday.toDateString();

    const time = messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isToday) return time;
    if (isYesterday) return `Yesterday, ${time}`;

    return messageDate.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full w-full mx-10 ml-5 mt-4 rounded-xl overflow-hidden">
      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#957C62] text-white shadow">
        <Avatar sx={{ bgcolor: "#fff", color: "#957C62" }}>
          {otherUser?.firstname?.[0] || "U"}
          {otherUser?.lastname?.[0] || "U"}
        </Avatar>

        <div>
          <p className="font-semibold text-lg">
            {otherUser?.firstname || "Unknown"} {otherUser?.lastname || "User"}
          </p>
          <p className="text-xs opacity-80">Online</p>
        </div>
      </div>

      {/* ================= MESSAGES ================= */}
      <div className="flex-1 p-4 overflow-y-auto bg-[#F5F1ED]">
        {allMessages.map((msg) => (
          <div
            key={msg._id}
            className={`flex flex-col ${
              msg.sender === user._id ? "items-end" : "items-start"
            } mb-3`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm shadow-sm ${
                msg.sender === user._id
                  ? "bg-[#957C62] text-white"
                  : "bg-white text-gray-800 border"
              }`}
            >
              {msg.text}
            </div>

            <div className="text-[11px] text-gray-500 mt-1 px-1">
              {formatTime(msg.createdAt)}
            </div>
          </div>
        ))}

        <div ref={scrollRef} />
      </div>

      {/* ================= INPUT ================= */}
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
          className="bg-[#957C62] text-white px-6 py-2 rounded-full hover:bg-[#846A53] transition"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
