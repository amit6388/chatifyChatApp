const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomname:{
        type:"string",
        required:true
    },
    friendname:{
        type:"string",
        required:true
    },
    users: Array,
  },
  {
    timestamps: true,
  }
);

const RoomModel = mongoose.model("room",roomSchema)
module.exports = RoomModel