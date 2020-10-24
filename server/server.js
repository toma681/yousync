const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

let roomList = [];
let socketToUsername = new Map();
let socketToRoom = new Map();
let rooms = new Map();

app.get("/", (req, res) => {
  res.send("Youtube Sync API")
});

io.on("connection", socket => {
  console.log("New Connection from " + socket.id);
  socket.on("roomName", name => {
    socket.join(name);
    socketToRoom.set(socket.id, name);
    if (rooms.get(name)) {
      rooms.get(name).socketList.push(socket.id);
    } else {
      rooms.set(name, {name: name, loaded: false, videoID: "", messageList: [], socketList: [socket.id]});
    }

  });

  socket.on("sendUserName", name => {
    socketToUsername.set(socket.id, name);
  });

  socket.on("sendMessage", msg => {
    let {currentMessage, roomName, color, userName} = msg;
    rooms.get(roomName).messageList.push({userName, currentMessage, color});
    io.to(roomName).emit("receiveMessage", rooms.get(roomName).messageList);
  });

  socket.on("getPrevMessages", name => {
    if (rooms.get(name)) {
      io.to(socket.id).emit("receiveMessage", rooms.get(name).messageList);
    }

  });

  socket.on("sendSeek", data => {
    let {name, time} = data;
    socket.to(name).broadcast.emit("receiveSeek", time);
  });

  socket.on("sendPlay", name => {
    socket.to(name).broadcast.emit("receivePlay");
  });

  socket.on("sendPause", name => {
    socket.to(name).broadcast.emit("receivePause");
  });

  socket.on("getRoomList", () => {
    let sendRoomList = [];
    rooms.forEach(curRoom => {
      sendRoomList.push(curRoom);
    });

    io.to(socket.id).emit("receiveRoomList", sendRoomList);
  });

  socket.on("sendVideoSwitch", data => {
    let {roomName, id} = data;
    io.to(roomName).emit("receiveVideoSwitch", id);
    rooms.get(roomName).loaded = true;
    rooms.get(roomName).videoID = id;
  });

  socket.on("checkIfLoaded", name => {
    io.to(socket.id).emit("receiveLoaded", rooms.get(name))
  });

  socket.on("disconnect", () => {
    let myRoom = socketToRoom.get(socket.id);
    let roomObj = rooms.get(myRoom);
    let socketPos;
    if (roomObj) {
      if (roomObj.socketList.length === 1) {
        rooms.delete(myRoom);
      } else {
        roomObj.socketList.forEach((curSocket, id) => {
          if (curSocket === socket.id) {
            socketPos = id;
          }
        });
        roomObj.socketList.splice(socketPos, 1);
        let userName = socketToUsername.get(socket.id);
        let currentMessage = `${userName} has left the room`;
        roomObj.messageList.push({userName: null, currentMessage, color: null})
        io.to(myRoom).emit("receiveMessage", roomObj.messageList);
      }
    }
  });

});


server.listen(process.env.PORT || 8080, () => console.log("Server Running"));
