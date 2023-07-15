const Chat = require("../models/chat.model");
const User = require("../models/user.model");

async function accessChat(req, res) {
  const { userId } = req.body;
  if (!userId) {
    console.log("userId param not sent with request");
    return res.sendStatus(400);
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
  }
  try {
    const createdChat = await Chat.create(chatData);
    const fullchat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );
    res.status(200).json(fullchat);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

async function fetchChats(req, res) {
  try {
    let result = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    result = await User.populate(result, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

async function createGroupChat(req, res) {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }

  let users = req.body.users;
  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }
  users.push(req.user);
  console.log(req.user);
  let groupAdmin = req.user;
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: groupAdmin,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullGroupChat);
    // res.send(users);
  } catch (error) {}
}

async function renameGroup(req, res) {
  try {
    const { chatId, chatName } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(404).json(error.message);
  }
}

async function addUserToGroup(req, res) {
  try {
    const { chatId, userId } = req.body;
    const addedUser = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(addedUser);
  } catch (error) {
    res.status(404).json(error.message);
  }
}

async function removeUserFromGroup(req, res) {
  try {
    const { chatId, userId } = req.body;
    const removedUser = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(removedUser);
  } catch (error) {
    res.status(404).json(error.message);
  }
}
module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addUserToGroup,
  removeUserFromGroup,
};
