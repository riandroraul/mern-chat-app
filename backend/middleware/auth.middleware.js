const User = require("../models/user.model");
const { verifyToken } = require("../utils/manageToken");

async function protect(req, res, next) {
  try {
    const token = req.headers.authorization || req.headers.Authorization;
    if (!token) {
      res.status(401);
      throw new Error("User Not Authorize!");
    }
    const decoded = verifyToken(token);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}

module.exports = protect;
