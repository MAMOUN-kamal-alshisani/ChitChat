const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const http = require("http");
const server = http.createServer(app);
const socketIO = require("socket.io");
const io = socketIO(server);
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

const {
  autoMessages,
  chatJoin,
  currentUsers,
  RoomUsers,
  userRemove,
} = require("./public/utilties/useFunctions");

// runs on when a client connects
io.on("connection", (socket) => {
  socket.on("join_ROOM", ({ userName, room }) => {
    let NewUser = chatJoin(socket.id, userName, room);

    socket.join(NewUser.room);

    //send a message to the client that has connected
    socket.emit("chat", autoMessages("Admin", "welcome to ChitChat"));

    io.to(NewUser.room).emit("RoomUsers", {
      room: NewUser.room,
      user: RoomUsers(NewUser.room),
    });

    // broadcast when a user has connected !
    socket.broadcast
      .to(NewUser.room)
      .emit(
        "chat",
        autoMessages("Admin", `${NewUser.userName} has connected!`)
      );

    // getting the form message from the client side to server side
    socket.on("chatmessage", (chatmessage) => {
      const currentUserSearch = currentUsers(socket.id);

      //send the form message back to everyone to other users
      io.to(currentUserSearch.room).emit(
        "chat",
        autoMessages(`${currentUserSearch.userName}`, chatmessage)
      );
    });

    socket.on("disconnect", () => {
      const user = userRemove(socket.id);
      // console.log(user);

      io.to(NewUser.room).emit(
        "chat",
        autoMessages("Admin", `${NewUser.userName} has left the chat!`)
      );

      io.to(NewUser.room).emit("RoomUsers", {
        room: NewUser.room,
        user: RoomUsers(NewUser.room),
      });
    });
  });
});

server.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
