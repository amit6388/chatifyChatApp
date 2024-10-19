require("dotenv").config();
const http = require("http");
const app = require("./app");
const mongoose = require("mongoose");
const Port = process.env.PORT || 8000;
const db = process.env.DATABASE;
const server = http.createServer(app);
const { Server } = require("socket.io");
const SocketEvents = require("./Constants/SocketEvents");

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://chat-frontend-opal.vercel.app/"],
    methods: ["GET", "POST", "PUT"],
  },
  transports: ["websocket", "polling"],
  upgrade: false,
  pingInterval: 1000,
  pingTimeout: 150000,
});

io.on("connection", async (socket) => {
  const {
    ADDROOM,
    DELETE_MESSAGE,
    DISCONNECT,
    MESSAGE,
    SEND_MESSAGE,
    EDIT_MESSAGE,
  } = SocketEvents;
  const username = socket.handshake.auth.username;

  console.log(username, " is connected on socket");

  socket.on(ADDROOM, (room) => {
    socket.join(room);
  });

  socket.on(SEND_MESSAGE, (data) => {
    socket.to(data.roomId).emit(MESSAGE, data);
  });

  socket.on(DELETE_MESSAGE, (data) => {
    socket.to(data.roomId).emit(DELETE_MESSAGE, data);
  });
  socket.on(EDIT_MESSAGE, (data) => {
    socket.to(data.roomId).emit(EDIT_MESSAGE, data);
  });

  socket.on(DISCONNECT, () => {
    console.log(username, " is disconnected on socket");
  });
});

server.listen(Port, () => {
  console.log("server Started at port : ", Port);

  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Database Connected");
    })
    .catch((err) => {
      console.log("error connecting to DB ", err);
    });
});
