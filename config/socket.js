const Chat = require("../models/chat.model");
const User = require("../models/user.model");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("CLIENT_SEND_MESSAGE", async ({ userId, content }) => {
      if (!userId || !content) return;

      const chat = new Chat({ user_id: userId, content });
      await chat.save();

      const user = await User.findById(userId).select("fullName");

      io.emit("SERVER_RETURN_MESSAGE", {
        userId: userId,
        fullName: user.fullName,
        content: content,
      });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};
