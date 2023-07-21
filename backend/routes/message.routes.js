const router = require("express").Router();
const {
  sendMessage,
  getMessages,
} = require("../controller/message.controller");
const protect = require("../middleware/auth.middleware");

router.post("/", protect, sendMessage);
router.get("/:chatId", protect, getMessages);

module.exports = router;
