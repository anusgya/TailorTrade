const Order = require("../models/Order");
const Post = require("../models/Post");
const { create } = require("../models/User");

exports.createOrder = async (req, res) => {
  const { post_id, customer_id, seamster_id, price } = req.body;
  try {
    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const newOrder = await new Order({
      post_id,
      customer_id,
      seamster_id,
      price,
    }).save();
    return res.status(201).json(newOrder);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  const order_id = req.params._id;
  try {
    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order_id = req.params._id;
    const { order_status } = req.body;

    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update the order status
    order.order_status = order_status;
    await order.save();

    return res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error updating order:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

exports.searchOrder = async (req, res) => {
  const search_query = req.query.searchElement;
  try {
    const results = await Order.find({
      $text: { $search: search_query },
    }).exec();

    res.json(results);
  } catch (error) {
    console.error("Error searching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteOrder = async (req, res) => {
  const order_id = req.params._id;
  console.log(order_id);
  try {
    const order = await Order.findByIdAndDelete(order_id);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrdersByCustomer = async (req, res) => {
  const customer_id = req.params._id;
  const sortField = req.query.sort;
  try {
    const orders = await Order.find({ customer_id })
      .populate({
        path: "seamster_id",
        populate: [
          {
            path: "address",
          },
          { path: "profile_picture" },
        ],
      })
      .populate({
        path: "post_id",
      })
      .sort({ [sortField]: -1 });
    orders.map((order) => {
      if (order.seamster_id.profile_picture)
        order.seamster_id.profile_picture.path = `http://localhost:8080/uploads/${order.seamster_id.profile_picture.type}/${order.seamster_id.profile_picture.filename}`;
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrdersBySeamster = async (req, res) => {
  const seamster_id = req.params._id;
  const sort_field = req.query.sort;

  // console.log("thankgoddd", sort_field);
  try {
    const orders = await Order.find({ seamster_id })
      .populate({
        path: "post_id",
        populate: {
          path: "image",
        },
      })
      .populate({
        path: "customer_id",
        populate: [
          {
            path: "address",
          },
          { path: "profile_picture" },
        ],
      })
      .sort({ [sort_field]: -1 });
    orders.map((order) => {
      if (order.customer_id.profile_picture)
        order.customer_id.profile_picture.path = `http://localhost:8080/uploads/${order.customer_id.profile_picture.type}/${order.customer_id.profile_picture.filename}`;
      if (order.post_id.image)
        order.post_id.image.path = `http://localhost:8080/uploads/${order.post_id.image.type}/${order.post_id.image.filename}`;
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRecentOrderByCustomer = async (req, res) => {
  const customer_id = req.params._id;
  try {
    const orders = await Order.find({ customer_id })

      .populate({
        path: "post_id",
        populate: {
          path: "image",
        },
      })
      .sort({ created_at: -1 });
    const order = orders[0];
    if (order.post_id?.image) {
      order.post_id.image.path = `http://localhost:8080/uploads/${order.post_id.image.type}/${order.post_id.image.filename}`;
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
