const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addUserToGroup,
  removeUserFromGroup,
} = require("../controller/chat.controller");
const protect = require("../middleware/auth.middleware");

const router = require("express").Router();

router.post("/", protect, accessChat);
router.get("/", protect, fetchChats);
router.post("/group/create", protect, createGroupChat);
router.put("/group/rename", protect, renameGroup);
router.put("/group/add", protect, addUserToGroup);
router.put("/group/remove", protect, removeUserFromGroup);

module.exports = router;
