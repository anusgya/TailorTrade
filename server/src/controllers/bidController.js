const Bid = require("../models/Bid");
const Post = require("../models/Post");
const Seamster = require("../models/Seamster");
const User = require("../models/User");

exports.createBid = async (req, res) => {
  try {
    const { post_id, seamster_id, bid_amount } = req.body;
    const post = await Post.findById(post_id);
    const seamster = await Seamster.findOne({ seamster_id });
    // if (!post || !seamster) {
    //   return res.status(404).json({ error: "Post or Seamster not found" });
    // }
    const bid = await new Bid({
      post_id,
      seamster_id,
      bid_amount,
    }).save();
    res.status(201).json(bid);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.acceptBid = async (req, res) => {
  try {
    const bid_id = req.params._id;
    const bid = await Bid.findById(bid_id);
    bid.is_accepted = true;
    await bid.save();
    res.status(200).json(bid);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBidsByPost = async (req, res) => {
  try {
    const post_id = req.params._id;
    const bids = await Bid.find({ post_id })
      .populate({
        path: "seamster_id",
        populate: [
          {
            path: "address",
          },
          {
            path: "profile_picture",
          },
        ],
      })
      .sort({ bid_amount: 1 });
    bids.map((bid) => {
      if (bid.seamster_id.profile_picture)
        bid.seamster_id.profile_picture.path = `http://localhost:8080/uploads/${bid.seamster_id.profile_picture.type}/${bid.seamster_id.profile_picture.filename}`;
    });
    res.status(200).json(bids);
    // console.log(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBidsBySeamster = async (req, res) => {
  try {
    const seamster_id = req.params._id;
    const sort_field = req.query.sort;
    const bids = await Bid.find({ seamster_id })
      .populate({
        path: "post_id",
        populate: {
          path: "user",
          populate: [
            {
              path: "address",
            },
            {
              path: "profile_picture",
            },
          ],
        },
      })
      .populate({
        path: "seamster_id",
      })
      .sort({ [sort_field]: -1 });
    bids.map((bid) => {
      if (bid.post_id?.user?.profile_picture)
        bid.post_id.user.profile_picture.path = `http://localhost:8080/uploads/${bid.post_id.user.profile_picture.type}/${bid.post_id.user.profile_picture.filename}`;
    });
    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBid = async (req, res) => {
  const bid_id = req.params._id;
  try {
    const { bid_amount } = req.body;
    const bid = await Bid.findByIdAndUpdate(
      bid_id,
      { bid_amount },
      { new: true, runValidators: true }
    );
    res.status(200).json(bid);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteBid = async (req, res) => {
  const bid_id = req.params._id;
  try {
    const bid = await Bid.findByIdAndDelete(bid_id);
    res.status(204).send({ deletedBid: bid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
