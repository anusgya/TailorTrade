const Notification = require("../models/Notification");

const createNotification = async (recipientId, senderId, type, content) => {
  try {
    const notification = new Notification({
      recipient: recipientId,
      sender: senderId,
      type,
      content,
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

const getUnreadNotifications = async (userId) => {
  try {
    return await Notification.find({ recipient: userId, read: false })
      .sort({ createdAt: -1 })
      .populate("sender", "username");
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    throw error;
  }
};

const markNotificationAsRead = async (notificationId) => {
  try {
    await Notification.findByIdAndUpdate(notificationId, { read: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

module.exports = {
  createNotification,
  getUnreadNotifications,
  markNotificationAsRead,
};
