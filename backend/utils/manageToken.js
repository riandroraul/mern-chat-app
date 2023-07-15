const jwt = require("jsonwebtoken");

function generateToken(payload) {
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "2h" });
}

function verifyToken(token) {
  const newToken = token.split(" ")[1];
  return jwt.verify(newToken, process.env.SECRET_KEY);
}

module.exports = { generateToken, verifyToken };
