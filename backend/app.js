const chats = require("./data/data");
const crypto = require("crypto");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = require("express")();
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRouter = require("./routes/user.routes");
const chatRouter = require("./routes/chat.routes");

dotenv.config();

connectDB();
const port = process.env.PORT;
app.use(cors({ credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);

// app.get("/api/chat", function (req, res, next) {
//   if (req.query.hasOwnProperty("id")) {
//     const singleChat = chats.find((chat) => chat._id === req.query.id);
//     res.send(singleChat);
//   } else {
//     res.send(chats);
//   }
//   console.log(crypto.randomBytes(32).toString("hex"));
// });

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});
