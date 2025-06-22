const Message = require("../models/messageModel");
const User = require("../models/userModel");

exports.createMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      message,
    }).save();
    return res.status(200).json({ sender, receiver, newMessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessagesBySeamster = async (req, res) => {
  try {
    const { seamster_id } = req.params._id;
    const messages = await Message.find({ receiver_id: seamsterId });
    return res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessagesByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params._id;
    const messages = await Message.find({ receiver_id: customerId });
    return res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessagesBySeamsterAndCustomer = async (req, res) => {
  try {
    const { seamster_id, customer_id } = req.params;
    const messages = await Message.find({
      receiver_id: seamster_id,
      sender_id: customer_id,
    });
    return res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
