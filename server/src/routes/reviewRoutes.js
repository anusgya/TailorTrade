const express = require("express");
const {
  createReview,
  getReviewsBySeamster,
  deleteReview,
  getAllReviewsBySeamster,
  getAllReviews,
} = require("../controllers/reviewController");

const router = express.Router();

router.post("/", createReview);
router.get("/", getAllReviews);
router.get("/seamster/:_id", getAllReviewsBySeamster);
router.delete("/:_id", deleteReview);

module.exports = router;
