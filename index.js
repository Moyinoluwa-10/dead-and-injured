const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);
const PORT = process.env.PORT || 3000;
const io = require("socket.io")(server, { cors: { origin: "*" } });
const path = require("path");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const users = [];
function removeObjectWithId(arr, id) {
  const objWithIdIndex = arr.findIndex((obj) => obj.id === id);
  if (objWithIdIndex > -1) {
    arr.splice(objWithIdIndex, 1);
  }
  return arr;
}

io.on("connection", (socket) => {
  console.log("a user connected " + socket.id);
  socket.on("disconnect", () => {
    console.log("user disconnected " + socket.id);
  });
});

// Socket.io
io.on("connection", async (socket) => {
  console.log("Client connected: ", socket.id);

  socket.on("disconnect", (reason) => {
    console.log("Client disconnected: ", socket.id, `(${reason})`);
    removeObjectWithId(users, socket.id);
    socket.broadcast.emit("user:leave", socket.id);
  });

  const sockets = await io.fetchSockets();
  // tell new user about previously existing users
  if (sockets.length > 1) {
    socket.emit(
      "user:dump",
      users.map((user) => {
        return { id: user.id, username: user.username };
      })
    );
  }

  // tell everyone else about new user
  socket.on("user:enter", (data) => {
    users.push(data);
    socket.broadcast.emit("user:enter", data);
  });

  socket.on("submitAnswer:post", (id, msg) => {
    socket.to(id).emit("submitAnswer:get", msg);
  });

  socket.on("receiveReport:post", (id, msg) => {
    socket.to(id).emit("receiveReport:get", msg);
  });

  socket.on("sendRequest:post", (id, msg) => {
    socket.to(id).emit("sendRequest:get", msg);
  });

  socket.on("sendRequestResponse:post", (id, msg, userId) => {
    socket.to(id).emit("sendRequestResponse:get", msg, userId);
  });

  // socket.on("sendRequest:post", (id, msg) => {
  //   socket.to(id).emit("sendRequest:get", msg);
  // });
});

server.listen(PORT, () => {
  console.log("server listening on " + PORT);
});
