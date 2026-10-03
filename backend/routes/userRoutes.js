
const express = require("express");

const {
    userRegister,
    verifyEmail,
    loginUser,
    userLogout,
    getAllUser
} = require("../controllers/usersAuth");

const authMiddleware = require("../middlewares/authmiddleware");
const upload = require("../middlewares/upload");
const profilepicture = require("../controllers/profilecontroller");

const router = express.Router();

router.post("/userregister", userRegister);

router.get("/verifyemail/:token", verifyEmail);

router.post("/userlogin", loginUser);

router.post("/userlogout", userLogout);

router.put(
    "/profilepicture",
    authMiddleware,
    upload.single("profilepic"),
    profilepicture
);
router.get("/getallusers",getAllUser)

module.exports = router;
