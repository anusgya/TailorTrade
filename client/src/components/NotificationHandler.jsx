"use client";

import { Info } from "lucide-react";

const NotificationHandler = ({ notifications, setNotifications }) => {
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/notifications/${notificationId}/read`,
        {
          method: "PUT",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification._id !== notificationId
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="w-full h-screen relative">
      {notifications?.length === 0 ? (
        <div className="w-full h-full text-md font-medium text-center ">
          No notifications
        </div>
      ) : (
        notifications?.map((notification) => (
          <div
            key={notification._id}
            onClick={() => markAsRead(notification._id)}
            className={`p-2 bg-gray-50 rounded-md flex border-2 gap-2 items-center text-neutral-800 mb-2 cursor-pointer  ${
              notification.type === "positive"
                ? "border-green-500"
                : notification.type === "neutral"
                ? "bg-blue-500"
                : "border-red-500"
            }`}
          >
            <div>
              <Info />
            </div>
            <div> {notification.content}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationHandler;
