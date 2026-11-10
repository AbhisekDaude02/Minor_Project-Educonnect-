
const express = require("express");

const {
    userRegister,
    verifyEmail,
    loginUser,
    userLogout,
    getAllUser,
    forgetPassword,
    resetPassword,
    getLoggedInUser,
    updateProfile
} = require("../controllers/usersAuth");

const authMiddleware = require("../middlewares/authmiddleware");
const upload = require("../middlewares/upload");
const profilepicture = require("../controllers/profilecontroller");

const router = express.Router();

// Authentication routes
router.post("/userregister", userRegister);
router.get("/verifyemail/:token", verifyEmail);
router.post("/userlogin", loginUser);
router.post("/userlogout", userLogout);

// Profile routes
router.get("/getloginuser", authMiddleware, getLoggedInUser);
router.put(
    "/updateprofile",
    authMiddleware,
    upload.single("profilepic"),
    updateProfile
);

// Profile picture route (existing)
router.put(
    "/profilepicture",
    authMiddleware,
    upload.single("profilepic"),
    profilepicture
);

// User routes
router.get("/getallusers", getAllUser);

// Password routes
router.post("/forgetpass", forgetPassword);
router.post("/resetpass/:token", resetPassword);

module.exports = router;
