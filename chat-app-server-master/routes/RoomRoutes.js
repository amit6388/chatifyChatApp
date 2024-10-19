const express = require("express");
const RoomController = require("../controllers/RoomController");
const RequireAuth = require('../middleware/RequireAuth')
const router = express.Router();

router.post("/create-room",RequireAuth.userAuth, RoomController.createRoom);
router.post("/create-group",RequireAuth.userAuth, RoomController.createGroup);
router.get("/get-rooms",RequireAuth.userAuth, RoomController.getRooms);

module.exports = router;