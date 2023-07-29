const router = require("express").Router();
const {
  sendMessage,
  getMessages,
} = require("../controller/message.controller");
const protect = require("../middleware/auth.middleware");

router.post("/send", protect, sendMessage);
router.get("/get/:chatId", protect, getMessages);

module.exports = router;
