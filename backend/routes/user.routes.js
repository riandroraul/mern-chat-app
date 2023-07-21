const {
  registerUser,
  loginUser,
  getUsers,
} = require("../controller/user.controller");
const protect = require("../middleware/auth.middleware");

const router = require("express").Router();

router.get("/", protect, getUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
