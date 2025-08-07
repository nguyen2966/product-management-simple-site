const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;

  const chats = await Chat.find({ deleted: false });

  for (const chat of chats) {
    const infoUser = await User.findOne({ _id: chat.user_id }).select("fullName");
    chat.infoUser = infoUser;
  }

  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
    chats: chats,
    userId: userId, // để client dùng gửi tin
    fullName: res.locals.user.fullName,
  });
};
