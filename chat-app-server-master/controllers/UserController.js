const RoomModel = require("../models/RoomModel");
const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;
const UserController = {
  createUser: async (req, res, next) => {
    try {
      const user = new UserModel(req.body);
      const data = await user.save();

      if (data) {
        const token = jwt.sign({ id: data._id, role: data.role }, secretKey, {
          expiresIn: "6h",
        });
        data._doc.access = token;
        res.status(201).json({
          code: 201,
          message: "User created successfully",
          data: data,
          error: false,
        });
      }
    } catch (error) {
      next();
    }
  },
  loginUser: async (req, res, next) => {
    try {
      const user = await UserModel.findOne(req.body);
      if (user) {
        const token = jwt.sign({ id: user._id, role: user.role }, secretKey, {
          expiresIn: "6h",
        });
        user._doc.access = token;
        res.status(200).json({
          code: 200,
          message: "User Login Successfully",
          data: user,
          error: false,
        });
      } else {
        res.status(200).json({
          code: 404,
          message: "Invalid Credential !",
          data: user,
          error: false,
        });
      }
    } catch (error) {
      next();
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const loggedInUserId = req.user._id.toString();
      const userIDs = [];
      const rooms = await RoomModel.find({
        users: {
          $in: [loggedInUserId],
        },
      });
      // console.log(rooms)
      if (rooms) {
        // Iterate through the rooms and extract user IDs
        rooms.forEach((room) => {
          if (room.users && Array.isArray(room.users)) {
            room.users.forEach((user) => {
              if(room.users.length === 2){
                console.log("prem")
                userIDs.push(user);
              }
            });
          }
        });

        const ids = [...new Set(userIDs)];
        let users = "";
        if (ids.length > 0) {
          users = await UserModel.find({ _id: { $nin: ids } });
        } else {
          users = await UserModel.find({ _id: { $ne: loggedInUserId } });
        }
        if (users) {
          res.status(201).json({
            code: 201,
            message: "User Fetched Successfully",
            data: users,
            error: false,
          });
        } else {
          res.status(200).json({
            code: 404,
            message: "User Not Found !",
            data: [],
            error: false,
          });
        }
      }
    } catch (error) {
      next();
    }
  },

  getAllUsers: async (req, res, next) => {
    try {
      const userId = req.user._id;
      const users = await UserModel.find({ _id: { $ne: userId } });
      if (users) {
        res.status(201).json({
          code: 201,
          message: "User Fetched Successfully",
          data: users,
          error: false,
        });
      } else {
        res.status(200).json({
          code: 404,
          message: "User Not Found !",
          data: [],
          error: false,
        });
      }
    } catch (error) {
      next();
    }
  },
};

module.exports = UserController;
