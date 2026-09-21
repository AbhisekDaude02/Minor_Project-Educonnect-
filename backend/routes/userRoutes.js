const express = require("express");
const userRegister = require("../controllers/usersAuth");

const router = express.Router();

router.post("/userregister",userRegister);

module.exports = router;