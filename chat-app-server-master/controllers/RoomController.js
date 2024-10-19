const RoomModel = require("../models/RoomModel");
const RoomController = {
  createRoom: async (req, res, next) => {
    try {
      const data = new RoomModel({
        roomname: req.user.username,
        users: [req.body.from, req.body.to],
        friendname:req.body.friendname
      });
      const room = await data.save();
      if (room) {
        res.status(201).json({
          code: 201,
          message: "room created successfully",
          data: room,
          error: false,
        });
      }
    } catch (error) {
      next();
    }
  },
  createGroup: async (req, res, next) => {
    try {
      const data = new RoomModel({
        roomname:req.body.groupName,
        users:req.body.users,
        friendname:req.body.groupName
      });
      const room = await data.save();
      if (room) {
        res.status(201).json({
          code: 201,
          message: "room created successfully",
          data: room,
          error: false,
        });
      }
    } catch (error) {
      next();
    }
  },
  getRooms: async (req, res, next) => {
    try {
      const userId = req.user._id.toString();
      const rooms = await RoomModel.find({
        users: {
          $in: [userId],
        },
      });
      const projectedRooms =  rooms.map((item)=>{
        return{
          _id:item._id,
          roomname:item.roomname == req.user.username ? item.friendname:item.roomname,
          users:item.users,
          createdAt:item.createdAt,
          updatedAt:item.updatedAt
        }
      })
      // console.log(projectedRooms)
      if (rooms) {
        res.status(200).json({
          code: 200,
          message: "rooms fetched successfully",
          data: projectedRooms,
          error: false,
        });
      }
    } catch (error) {
      next();
    }
  },

};
module.exports = RoomController;
