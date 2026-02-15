const express = require("express");
const cors = require("cors");
const app = express();
const authRouter = require("./controllers/authController");
const userRouter = require("./controllers/userController");
const chatRouter = require("./controllers/chatController");
const messageRouter = require("./controllers/messageController");

// use auth controller routers
app.use(cors());
app.use(express.json(
 { limit: "50mb"}
));
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5000",
    methods: ["GET", "POST"],
  },
});
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

// test socket connection from client
io.on("connection", (socket) => {

  socket.on("join-room", (userid) => {
    socket.join(userid);
    console.log("User joined:", userid);
  });

  socket.on("send-message", (message) => {
    message.members.forEach((member) => {
      if (member !== message.sender) {
        io.to(member).emit("receive-message", message);
      }
    });
  });

  socket.on("user-typing", (data) => {
    data.members.forEach((member) => {
      if (member !== data.sender) {
        io.to(member).emit("started-typing", data);
      }
    });
  });

});


module.exports = server;
