const jwt = require("jsonwebtoken");

function generateToken(payload) {
  return jwt.sign(payload, "secret", { expiresIn: "2h" });
}

module.exports = { generateToken };
