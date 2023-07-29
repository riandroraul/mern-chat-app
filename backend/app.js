const cors = require("cors");
const bodyParser = require("body-parser");
const app = require("express")();
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRouter = require("./routes/user.routes");
const chatRouter = require("./routes/chat.routes");
const messageRouter = require("./routes/message.routes");
const { Server } = require("socket.io");
const { createServer } = require("http");

dotenv.config();

connectDB();
const port = process.env.PORT;
app.use(cors({ credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
const httpServer = createServer(app);

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    // console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room : " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageReceived);
    });
  });
});
