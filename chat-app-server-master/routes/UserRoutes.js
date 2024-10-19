const express = require("express");
const UserController = require("../controllers/UserController");
const RequireAuth = require('../middleware/RequireAuth')
const router = express.Router();

router.post("/add-user", UserController.createUser);
router.post("/login-user", UserController.loginUser);
router.get("/get-user",RequireAuth.userAuth, UserController.getUsers);
router.get("/get-all-user",RequireAuth.userAuth, UserController.getAllUsers);

module.exports = router;
