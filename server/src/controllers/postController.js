const Post = require("../models/Post");
const Bid = require("../models/Bid");
const User = require("../models/User");
const Image = require("../models/Image");

// Assuming 'upload.single("image")' is being used to handle file uploads
exports.createPost = async (req, res) => {
  const {
    user,
    title,
    description,
    category_name,
    fabric,
    pattern,
    color,
    size,
    bidding_due_date,
    required_by,
  } = req.body;

  console.log("this is being requested", req.file);

  // First, create the Image document
  const newImage = new Image({
    filename: req.file.filename,
    path: req.file.path,
    contentType: req.file.mimetype,
    type: req.body.image_type,
    user: user,
  });

  try {
    await newImage.save();

    // Then, create the Post document with the Image reference
    const post = new Post({
      user,
      title,
      description,
      category_name,
      image: newImage._id,
      fabric,
      pattern,
      color,
      size,
      bidding_due_date,
      required_by,
      status: "open",
      total_offers: 0,
    });

    await post.save();
    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    console.error("Error creating the post or image:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getPostById = async (req, res) => {
  const { _id } = req.params;
  const post = await Post.findById(_id);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  res.status(200).json(post);
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate({
        path: "user",
        populate: [
          {
            path: "address",
          },
          {
            path: "profile_picture",
          },
        ],
      })
      .populate({
        path: "image",
      })
      .sort({ created_at: -1 });

    posts.map((post) => {
      if (post.image)
        post.image.path = `http://localhost:8080/uploads/${post.image.type}/${post.image.filename}`;
      if (post.user.profile_picture)
        post.user.profile_picture.path = `http://localhost:8080/uploads/${post.user.profile_picture.type}/${post.user.profile_picture.filename}`;
    });
    const filteredPosts = posts.filter((post) => post.status === "open");

    // console.log(posts[0].image);

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Failed to retrieve posts", error: error });
  }
};

exports.getPostsByUser = async (req, res) => {
  const { _id } = req.params;
  const user = _id;
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  try {
    const posts = await Post.find({ user })
      .populate({
        path: "user",
        populate: {
          path: "address",
        },
      })
      .populate({
        path: "image",
      })
      .sort({ created_at: -1 });

    posts.map((post) => {
      if (post.image)
        post.image.path = `http://localhost:8080/uploads/${post.image.type}/${post.image.filename}`;
    });
    res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.searchAllPosts = async (req, res) => {
  const search_query = req.query.searchElement;
  try {
    const results = await Post.find({
      $text: { $search: search_query },
    })
      .populate({
        path: "user",
        populate: [
          {
            path: "address",
          },
          {
            path: "profile_picture",
          },
        ],
      })
      .populate({
        path: "image",
      });

    results.map((post) => {
      if (post.image)
        post.image.path = `http://localhost:8080/uploads/${post.image.type}/${post.image.filename}`;
      if (post.user.profile_picture)
        post.user.profile_picture.path = `http://localhost:8080/uploads/${post.user.profile_picture.type}/${post.user.profile_picture.filename}`;
    });
    res.json(results);
  } catch (error) {
    console.error("Error searching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// exports.searchCustomerPosts = async (req, res) => {
//   const search_query = req.query.searchElement;
//   try {
//     const results = await Order.find({
//       $text: { $search: search_query },
//     }).exec();

//     res.json(results);
//   } catch (error) {
//     console.error("Error searching orders:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

exports.updatePost = async (req, res) => {
  const { _id } = req.params;
  const post_id = _id;

  if (!post_id) {
    return res.status(404).json({ error: "Post not found" });
  }
  try {
    const {
      title,
      description,
      category_name,
      image_url,
      fabric,
      color,
      size,
      bidding_due_date,
      required_by,
      total_offers,
      bid_status,
    } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      post_id,
      {
        title,
        description,
        category_name,
        image_url,
        fabric,
        color,
        size,
        bidding_due_date,
        required_by,
        total_offers,
        bid_status,
      },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({ message: "Post updated successfully", updatedPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  const { _id } = req.params;
  try {
    const post = await Post.findByIdAndDelete(_id);
    res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateTotalOffers = async (req, res) => {
  const { _id } = req.params;
  const post_id = _id;
  try {
    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    post.total_offers += 1;
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.filterPosts = async (req, res) => {
  function createCaseInsensitiveRegex(array) {
    return array.map((value) => new RegExp(`^${value}$`, "i"));
  }
  const filters = req.body;

  // console.log("--------------------------------------", filters);
  try {
    const query = {};

    if (filters.category_name && filters.category_name.length > 0) {
      query.category_name = {
        $in: createCaseInsensitiveRegex(filters.category_name),
      };
    }

    if (filters.fabric && filters.fabric.length > 0) {
      query.fabric = { $in: createCaseInsensitiveRegex(filters.fabric) };
    }

    if (filters.title && filters.title.length > 0) {
      query.title = { $in: createCaseInsensitiveRegex(filters.title) };
    }

    const posts = await Post.find(query)
      .populate({
        path: "user",
        populate: [
          {
            path: "address",
          },
          {
            path: "profile_picture",
          },
        ],
      })
      .populate({
        path: "image",
      })
      .sort({ created_at: -1 });

    posts.map((post) => {
      if (post.image)
        post.image.path = `http://localhost:8080/uploads/${post.image.type}/${post.image.filename}`;
      if (post.user.profile_picture)
        post.user.profile_picture.path = `http://localhost:8080/uploads/${post.user.profile_picture.type}/${post.user.profile_picture.filename}`;
    });
    // console.log("=======================", posts);
    res.json(posts);
  } catch (error) {
    console.error("Error filtering posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
