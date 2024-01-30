const express = require("express");
const router = express.Router();
const { userRegister, userLogin, updateUserProfile } = require("./controller");

router.post("/", userRegister);
router.get("/login", userLogin);
router.get("/:userId/updateUserProfile", updateUserProfile);
module.exports = router;
