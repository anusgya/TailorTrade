const express = require("express");
const router = express.Router();
const upload = require("../middleware/imageUpload");
const imageController = require("../controllers/imageController");

router.get("/", imageController.getAllImages);
router.post("/", upload.single("image"), imageController.uploadImage);
router.get("/:_id", imageController.getImageById);
router.get("/user/:_id", imageController.getImagesByUserId);

module.exports = router;
