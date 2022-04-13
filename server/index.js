const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

app.get("/", (req, res) => {
  res.send("Server Started");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://react-nodejs-n-chat-app.netlify.app/",
    method: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log("User", socket.id, "Joined Room", data);
  });

  socket.on("send_message", (data) => {
    console.log("message data sent from", data.author, " : ", data);
    socket.to(data.room).emit("recieve_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

server.listen(process.env.PORT || 5000, () => {
  console.log("server running");
});
