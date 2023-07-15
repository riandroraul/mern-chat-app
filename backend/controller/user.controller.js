const User = require("../models/user.model");
const { hashPassword, comparePassword } = require("../utils/managePassword");
const { generateToken } = require("../utils/manageToken");

async function registerUser(req, res) {
  try {
    const { name, email, password, picture } = req.body;
    const hashingPassword = await hashPassword(password);
    if (!name || !email || !password) {
      res.status(400);
      throw new Error("please Enter all the Fields");
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      res.status(400);
      throw new Error("User Already Exist");
    }

    const newUser = await User.create({
      name,
      email,
      password: hashingPassword,
      picture,
    });

    if (newUser) {
      res.status(201).json({
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        picture: newUser.picture,
        token: generateToken({ id: newUser._id, email: newUser.email }),
      });
    } else {
      res.status(400);
      throw new Error("Register Failed!");
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const checkUser = await User.findOne({ email });
    if (checkUser && (await comparePassword(password, checkUser.password))) {
      res.status(200).json({
        _id: checkUser._id,
        name: checkUser.name,
        email: checkUser.email,
        token: generateToken({ id: checkUser._id, email: checkUser.email }),
      });
    } else {
      res.status(400);
      throw new Error("User with given email doesn't exist");
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
}

async function getUsers(req, res) {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    let users = await User.find(keyword)
      .find({
        _id: { $ne: req.user._id },
      })
      .select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
}

module.exports = { registerUser, loginUser, getUsers };
