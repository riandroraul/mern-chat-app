const {
  registerUser,
  loginUser,
  getUsers,
} = require("../controller/user.controller");
const protect = require("../middleware/auth.middleware");

const userRouter = require("express").Router();

userRouter.get("/", protect, getUsers);
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

module.exports = userRouter;
