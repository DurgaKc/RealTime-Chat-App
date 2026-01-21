import React from "react";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import ChatArea from "./components/chat";
import { useSelector } from "react-redux";

const Home = () => {
  const { selectedChat } = useSelector( state => state.userReducer);
  return (
    <div>
  <Header />

  <div style={{ display: "flex", height: "calc(100vh - 64px)" }}>
    <Sidebar />
   {selectedChat && <ChatArea />}
  </div>
</div>

  );
};

export default Home;
