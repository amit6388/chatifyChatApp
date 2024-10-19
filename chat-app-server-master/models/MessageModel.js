const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    message: {
      text: {
        type: "string",
        default:null
      },
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "rooms",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    username:{
      type:"string",
      required:true
    },
    file:{
      type:"string",
      default:null
    },
    filename:{
      type:"string",
      default:null
    }
  },
  {
    timestamps: true,
  }
);
 const MessageModel = mongoose.model("message",messageSchema)

 module.exports =MessageModel