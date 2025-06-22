const express = require("express");
const router = express.Router();
// const upload = require("../middlewares/upload");
const Post = require("../models/Post");
const upload = require("../middleware/imageUpload");
const {
  createPost,
  getPostById,
  getPosts,
  updatePost,
  deletePost,
  getPostsByUser,
  updateTotalOffers,
  searchAllPosts,
  filterPosts,
} = require("../controllers/postController");

router.post("/", upload.single("image"), createPost);
router.get("/search", searchAllPosts);
router.post("/filter", filterPosts);
router.get("/:_id", getPostById);
router.get("/user/:_id", getPostsByUser);
router.get("/", getPosts);
router.put("/:_id", updatePost);
router.put("/offers/:_id", updateTotalOffers);
router.delete("/:_id", deletePost);

module.exports = router;
