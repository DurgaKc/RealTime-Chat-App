import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@mui/material";
import {
  createNewMessage,
  getAllMessages,
  clearUnreadMessageCount,
} from "../../../api/user";
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import { setAllChats } from "../../../redux/userSlice";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { FaImage } from "react-icons/fa6";

const ChatArea = ({ socket }) => {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);

  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { selectedChat, user, allChats } = useSelector(
    (state) => state.userReducer
  );

  const otherUser = selectedChat?.members?.find((m) => m._id !== user._id);

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

    const lastMsg = selectedChat?.lastMessage;
    if (lastMsg?.sender === user._id) return;

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

  /* ================= LOAD CHAT & SOCKET EVENTS ================= */
  useEffect(() => {
    if (!selectedChat?._id) return;

    setAllMessages([]);
    getMessages();
    clearUnreadMessages();

    /* ===== RECEIVE MESSAGE ===== */
    socket.off("receive-message");
    socket.on("receive-message", (data) => {
      if (data.chatId === selectedChat._id) {
        setAllMessages((prev) => [...prev, data]);
      }
    });

    /* ===== TYPING INDICATOR ===== */
    socket.off("started-typing");
    socket.on("started-typing", (data) => {
      if (data.chatId === selectedChat._id && data.sender !== user._id) {
        setIsTyping(true);

        setTimeout(() => {
          setIsTyping(false);
        }, 1500);
      }
    });

    return () => {
      socket.off("receive-message");
      socket.off("started-typing");
    };
  }, [selectedChat?._id]);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages, isTyping]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async (image) => {
    // allow sending if either text OR image exists
    if (!message.trim() && !image) return;
    if (!selectedChat?._id) return;

    const payload = {
      chatId: selectedChat._id,
      sender: user._id,
      text: message.trim(),
      image: image || null,
    };

    // Emit to socket
    socket.emit("send-message", {
      ...payload,
      members: selectedChat.members.map((m) => m._id),
      read: false,
      createdAt: new Date().toISOString(),
    });

    const tempId = Date.now();

    const tempMsg = {
      ...payload,
      _id: tempId,
      createdAt: new Date().toISOString(),
      read: false,
    };

    setAllMessages((prev) => [...prev, tempMsg]);
    setMessage("");

    try {
      const response = await createNewMessage(payload);

      if (response?.success) {
        setAllMessages((prev) =>
          prev.map((m) => (m._id === tempId ? response.data : m))
        );
      }
    } catch (error) {
      toast.error(error?.message || "Failed to send message");
    }
  };

  /* ================= SEND IMAGE ================= */
  const sendImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      sendMessage(reader.result);
    };
  };

  /* ================= HANDLE IMAGE ERROR ================= */
  const handleImageError = () => {
    setImageError(true);
  };

  /* ================= GET USER INITIALS ================= */
  const getUserInitials = () => {
    if (!otherUser) return "U";
    const first = otherUser.firstname?.[0] || "";
    const last = otherUser.lastname?.[0] || "";
    return (first + last).toUpperCase() || "U";
  };

  /* ================= GET USER FULL NAME ================= */
  const getUserFullName = () => {
    if (!otherUser) return "Unknown User";
    return `${otherUser.firstname || "Unknown"} ${
      otherUser.lastname || "User"
    }`.trim();
  };

  if (!selectedChat) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a chat to start messaging
      </div>
    );
  }

  /* ================= FORMAT TIME ================= */
  const formatTime = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = messageDate.toDateString() === today.toDateString();
    const isYesterday = messageDate.toDateString() === yesterday.toDateString();

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
      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#957C62] text-white shadow">
        {otherUser?.profilePic && !imageError ? (
          <img
            src={otherUser.profilePic}
            alt={getUserFullName()}
            className="w-10 h-10 rounded-full object-cover border-2 border-white"
            onError={handleImageError}
          />
        ) : (
          <Avatar sx={{ bgcolor: "#fff", color: "#957C62" }}>
            {getUserInitials()}
          </Avatar>
        )}

        <div>
          <p className="font-semibold text-lg">{getUserFullName()}</p>
          <p className="text-xs opacity-80">Online</p>
        </div>
      </div>

      {/* MESSAGES */}
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
              {msg.text && <div>{msg.text}</div>}
              {msg.image && (
                <div className="mt-1">
                  <img
                    src={msg.image}
                    alt="image"
                    className="h-32 w-32 object-cover rounded"
                  />
                </div>
              )}
            </div>

            <div className="text-[11px] text-gray-500 mt-1 px-1 flex items-center gap-1">
              {formatTime(msg.createdAt)}
              {msg.sender === user._id && msg.read && (
                <span className="text-[12px]">seen</span>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-sm text-gray-500 italic mb-2">
            {otherUser?.profilePic && !imageError ? (
              <img
                src={otherUser.profilePic}
                alt={getUserFullName()}
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <Avatar
                sx={{
                  width: 20,
                  height: 20,
                  fontSize: "10px",
                  bgcolor: "#C2A68C",
                }}
              >
                {getUserInitials()}
              </Avatar>
            )}
            <span>typing...</span>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* INPUT */}
      <div className="flex items-center gap-3 p-3 mb-4 bg-white border-t">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-full outline-none focus:border-[#957C62]"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);

            socket.emit("user-typing", {
              chatId: selectedChat._id,
              members: selectedChat.members.map((m) => m._id),
              sender: user._id,
            });
          }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <label htmlFor="file">
          <FaImage
            className="text-[#957C62] cursor-pointer"
            size={24}
          />
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            accept="image/jpg, image/png, image/jpeg, image/gif"
            onChange={sendImage}
          />
        </label>

        <button
          className="bg-[#957C62] text-white px-6 py-2 rounded-full hover:bg-[#846A53] transition flex items-center gap-2"
          onClick={() => sendMessage()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
