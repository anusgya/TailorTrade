const express = require("express");
const router = express.Router();
const {
  getUnreadNotifications,
  markNotificationAsRead,
} = require("../controllers/notificationController");
const getUserInfo = require("../middleware/authentication");
const Notification = require("../models/Notification");

router.get("/:_id", async (req, res) => {
  const user_id = req.params._id;

  try {
    const notifications = await getUnreadNotifications(user_id);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { senderId, recipientId, type, content } = req.body;
    console.log("response i jksdfjklsdjflksdjflksjdf", req.body);

    const notification = new Notification({
      recipient: recipientId,
      sender: senderId,
      type,
      content,
    });

    await notification.save();

    // Get the Socket.IO instance
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    // Send the notification to the recipient if they're online
    const recipientSocketId = onlineUsers.get(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("notification", notification);
      console.log(
        `Notification sent to user ${recipientId} on socket ${recipientSocketId}`
      );
    } else {
      console.log(
        `User ${recipientId} is not online. Notification saved but not sent.`
      );
    }

    res
      .status(201)
      .json({ message: "Notification created successfully", notification });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: "Error creating notification" });
  }
});

router.put("/:_id/read", async (req, res) => {
  try {
    await markNotificationAsRead(req.params._id);
    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Error marking notification as read" });
  }
});

module.exports = router;
