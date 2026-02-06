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
    <div>
      <Header />

      <div style={{ display: "flex", height: "calc(100vh - 64px)" }}>
        <Sidebar />
        {selectedChat && <ChatArea socket={socket}></ChatArea>}
      </div>
    </div>
  );
};

export default Home;
