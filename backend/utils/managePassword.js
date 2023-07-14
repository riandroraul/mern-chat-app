const bcrypt = require("bcrypt");

async function hashPassword(plainText) {
  const passwordHashed = await bcrypt.hash(plainText, 10);
  return passwordHashed;
}

async function comparePassword(plainText, passwordHashed) {
  return await bcrypt.compare(plainText, passwordHashed);
}

module.exports = { hashPassword, comparePassword };
