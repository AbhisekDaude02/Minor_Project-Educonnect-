import API from "../api/axios";

// Get all notifications
export const getAllNotifications = () => {
  return API.get("/notification/all");
};

// Get unread notification count
export const getUnreadCount = () => {
  return API.get("/notification/unread-count");
};

// Mark one notification as read
export const markNotificationRead = (notificationId) => {
  return API.put(`/notification/read/${notificationId}`);
};

// Mark all notifications as read
export const markAllNotificationsRead = () => {
  return API.put("/notification/read-all");
};

// Delete one notification
export const deleteNotification = (notificationId) => {
  return API.delete(`/notification/delete/${notificationId}`);
};
