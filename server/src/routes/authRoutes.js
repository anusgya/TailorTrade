const express = require("express");
const router = express.Router();
const { login, register, getMe } = require("../controllers/authController");
const upload = require("../middleware/imageUpload");

router.get("/me", getMe);
router.post("/login", login);
router.post("/register", upload.single("profile_picture"), register);
router.post("/");

module.exports = router;
