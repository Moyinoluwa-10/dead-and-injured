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

const players = [];

io.on("connection", (socket) => {
  console.log("a user connected " + socket.id);
  socket.on("disconnect", () => {
    console.log("user disconnected " + socket.id);
  });
});

// Socket.io
io.on("connection", async (socket) => {
  console.log("Client connected: ", socket.id);

  const sockets = await io.fetchSockets();
  // tell new user about previously existing users
  if (sockets.length > 1) {
    socket.emit(
      "user:dump",
      sockets.map((s) => {
        return { id: s.id, username: s.username };
      })
    );
  }

  // tell everyone else about new user
  socket.on("user:enter", (data) => {
    players.push(data);
    socket.broadcast.emit("user:enter", data);
  });

  socket.on("disconnect", (reason) => {
    console.log("Client disconnected: ", socket.id, `(${reason})`);
    socket.broadcast.emit("user:leave", socket.id);
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
