export const sendNotification = async (
  senderId,
  recipientId,
  type,
  content
) => {
  try {
    const response = await fetch(
      "http://localhost:8080/api/notifications/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ senderId, recipientId, type, content }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to send notification");
    }

    const data = await response.json();
    return data.notification;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};
