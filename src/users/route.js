const express = require("express");
const router = express.Router();
const { userRegister } = require("./controller");

router.post("/", userRegister);

module.exports = router;
