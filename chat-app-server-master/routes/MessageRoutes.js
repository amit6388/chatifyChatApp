const express = require("express");
const MessageController = require("../controllers/MessageController");
const RequireAuth = require('../middleware/RequireAuth')
const router = express.Router();
const upload = require('../services/MulterUpload')

router.post("/send-msg",RequireAuth.userAuth,upload.single('file'), MessageController.sendMsg);
router.post("/get-msg",RequireAuth.userAuth, MessageController.getMsg);
router.delete("/delete-msg/:id",RequireAuth.userAuth, MessageController.deletemsg);
router.put("/update-msg/:id",RequireAuth.userAuth, MessageController.updateMsg);

module.exports = router;
