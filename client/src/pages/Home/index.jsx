import { useEffect } from "react";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import ChatArea from "./components/chat";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");


const Home = () => {
  const { selectedChat, user } = useSelector((state) => state.userReducer);
  

  useEffect(() => {
    if (user) {
      socket.emit("join-room", user._id);
      // socket.emit("send-message", {text:'Hi Durga', recipient:'696dd82dea6cf1861742aeb0'});
      // socket.on('receive-message', data => {
      //   console.log(data);
      // })
    }
  }, [user]);

  return (
    <div className="h-screen flex flex-col">
  <Header />

  <div className="flex flex-1 h-screen">
  {/* SIDEBAR */}
  <div
    className={`
      fixed inset-0 z-20 bg-white md:static md:block 
      ${selectedChat ? "translate-x-[100%] md:translate-x-0" : "translate-x-0"}
      w-full md:w-[550px] transition-transform duration-300 ease-in-out
      overflow-y-auto
    `}
  >
    <Sidebar />
  </div>

  {/* CHAT AREA */}
  <div
    className={`
      flex-1 ml-0 md:mx-[50px] h-full 
      ${selectedChat ? "block" : "hidden md:block"}
    `}
  >
    {selectedChat && <ChatArea socket={socket} />}
  </div>
</div>

</div>

  );
};

export default Home;
