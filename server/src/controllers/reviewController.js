const Review = require("../models/Review");

exports.createReview = async (req, res) => {
  const { customer_id, seamster_id, rating, comment } = req.body;
  try {
    const newReview = await new Review({
      customer_id,
      seamster_id,
      rating,
      comment,
    }).save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllReviewsBySeamster = async (req, res) => {
  const seamster_id = req.params._id;
  try {
    const reviews = await Review.find({ seamster_id })
      .populate({
        path: "customer_id",
        populate: {
          path: "profile_picture",
        },
      })
      .sort({ created_at: -1 })
      .exec();

    reviews.map((review) => {
      if (review.customer_id.profile_picture)
        review.customer_id.profile_picture.path = `http://localhost:8080/uploads/${review.customer_id.profile_picture.type}/${review.customer_id.profile_picture.filename}`;
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReviewsByCustomer = async (req, res) => {
  const { customer_id } = req.body;
  try {
    const reviews = await Review.find({ customer_id });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  const { review_id } = req.params._id;
  try {
    const review = await Review.findByIdAndDelete(review_id);
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
