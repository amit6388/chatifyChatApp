const MessageModel = require("../models/MessageModel");
const MessageController = {
  sendMsg: async (req, res, next) => {
    try {
      const senderId = req.user._id;
      const { msg, roomId, username } = req.body;
      // const file = req.file
      //   ? `${process.env.BASE_URL}/uploads/${req.file.filename}`
      //   : null;

      const file = req.file ? req.file.location:null
      const filename = req.file ? req.file.key : null;
      const message = new MessageModel({
        message: { text: msg || null },
        roomId: roomId,
        sender: senderId,
        username: username,
        file: file,
        filename: filename,
      });
      const data = await message.save();
      if (data) {
        res.status(201).json({
          code: 201,
          data: data,
          error: false,
          message: "Message Sent Successfully",
        });
      }
    } catch (error) {
      next();
    }
  },
  getMsg: async (req, res, next) => {
    try {
      const roomId = req.body.roomId;
      const from = req.user._id.toString();
      const message = await MessageModel.find({ roomId: roomId }).sort({
        createdAt: 1,
      });
      if (message) {
        const projectedMessage = message.map((msg) => {
          return {
            fromSelf: msg.sender.toString() === from,
            id: msg._id,
            message: msg.message.text,
            roomId: msg.roomId,
            username: msg.username,
            file: msg.file,
            filename: msg.filename,
          };
        });

        if (projectedMessage) {
          res.status(200).json({
            code: 200,
            data: projectedMessage,
            error: false,
            message: "message Fetched successfully",
          });
        } else {
          res.status(200).json({
            code: 404,
            data: [],
            error: false,
            message: "message Not Found",
          });
        }
      }
    } catch (error) {
      next();
    }
  },

  deletemsg: async (req, res, next) => {
    try {
      const msgId = req.params.id;
      const data = await MessageModel.deleteOne({ _id: msgId });
      if (data) {
        res.status(200).json({
          code: 200,
          data: data,
          error: false,
          message: "message deleted successfully",
        });
      }
    } catch (error) {
      next();
    }
  },
  updateMsg: async (req, res, next) => {
    try {
      const msgId = req.params.id;
      const updateData = { text: req.body.msg };
      const data = await MessageModel.updateOne(
        { _id: msgId },
        { $set: { message: updateData } }
      );
      if (data) {
        res.status(200).json({
          code: 200,
          data: data,
          error: false,
          message: "message updated successfully",
        });
      }
    } catch (error) {}
  },
};
module.exports = MessageController;
