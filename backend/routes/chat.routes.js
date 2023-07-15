const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addUserToGroup,
  removeUserFromGroup,
} = require("../controller/chat.controller");
const protect = require("../middleware/auth.middleware");

const chatRouter = require("express").Router();

chatRouter.post("/", protect, accessChat);
chatRouter.get("/", protect, fetchChats);
chatRouter.post("/group/create", protect, createGroupChat);
chatRouter.put("/group/rename", protect, renameGroup);
chatRouter.put("/group/add", protect, addUserToGroup);
chatRouter.put("/group/remove", protect, removeUserFromGroup);

module.exports = chatRouter;
