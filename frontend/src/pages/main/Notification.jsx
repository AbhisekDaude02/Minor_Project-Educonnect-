import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FiBell,
  FiCheck,
  FiCheckCircle,
  FiTrash2,
  FiRefreshCw,
  FiUsers,
  FiFileText,
  FiBriefcase,
  FiHeart,
  FiMessageCircle,
  FiUserPlus,
  FiBookOpen,
  FiBellOff,
  FiArrowRight,
} from "react-icons/fi";

import {
  getAllNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../../services/notificationServices";

const Notification = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState("all");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  // ======================================
  // GET NOTIFICATIONS
  // ======================================

  const fetchNotifications = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const [notificationResponse, countResponse] = await Promise.all([
        getAllNotifications(),
        getUnreadCount(),
      ]);

      const notificationData =
        notificationResponse.data.notifications ||
        notificationResponse.data.notification ||
        [];

      const countData =
        countResponse.data.unreadCount ?? countResponse.data.count ?? 0;

      setNotifications(Array.isArray(notificationData) ? notificationData : []);

      setUnreadCount(Number(countData) || 0);
    } catch (error) {
      console.error("Notification fetching error:", error);

      toast.error(
        error.response?.data?.message || "Failed to load notifications",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ======================================
  // NOTIFICATION TYPE CONFIGURATION
  // ======================================

  const getNotificationConfig = (type) => {
    switch (type) {
      case "friend_request":
        return {
          icon: <FiUserPlus />,
          color: "bg-blue-50 text-blue-600",
          title: "Friend request",
          route: "/community",
        };

      case "friend_accept":
        return {
          icon: <FiUsers />,
          color: "bg-emerald-50 text-emerald-600",
          title: "Friend accepted",
          route: "/community",
        };

      case "new_post":
        return {
          icon: <FiFileText />,
          color: "bg-indigo-50 text-indigo-600",
          title: "New post",
          route: "/educonnect",
        };

      case "new_note":
        return {
          icon: <FiBookOpen />,
          color: "bg-amber-50 text-amber-600",
          title: "New notes",
          route: "/studymaterials",
        };

      case "new_study_material":
        return {
          icon: <FiBookOpen />,
          color: "bg-purple-50 text-purple-600",
          title: "Study material",
          route: "/studymaterials",
        };

      case "new_job":
        return {
          icon: <FiBriefcase />,
          color: "bg-teal-50 text-teal-600",
          title: "Job opportunity",
          route: "/jobs",
        };

      case "job_application":
        return {
          icon: <FiBriefcase />,
          color: "bg-orange-50 text-orange-600",
          title: "Job application",
          route: "/jobs",
        };

      case "new_like":
        return {
          icon: <FiHeart />,
          color: "bg-rose-50 text-rose-600",
          title: "Post like",
          route: "/educonnect",
        };

      case "new_comment":
        return {
          icon: <FiMessageCircle />,
          color: "bg-cyan-50 text-cyan-600",
          title: "New comment",
          route: "/educonnect",
        };

      default:
        return {
          icon: <FiBell />,
          color: "bg-gray-100 text-gray-600",
          title: "Notification",
          route: "/notifications",
        };
    }
  };

  // ======================================
  // TIME FORMAT
  // ======================================

  const formatTime = (date) => {
    if (!date) return "";

    const notificationDate = new Date(date);

    if (Number.isNaN(notificationDate.getTime())) {
      return "";
    }

    const now = new Date();
    const difference = now - notificationDate;

    const minutes = Math.floor(difference / 60000);
    const hours = Math.floor(difference / 3600000);
    const days = Math.floor(difference / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return notificationDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year:
        notificationDate.getFullYear() !== now.getFullYear()
          ? "numeric"
          : undefined,
    });
  };

  // ======================================
  // MARK ONE NOTIFICATION AS READ
  // ======================================

  const handleMarkRead = async (notificationId) => {
    try {
      setProcessingId(notificationId);

      await markNotificationRead(notificationId);

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification,
        ),
      );

      setUnreadCount((previous) => Math.max(0, previous - 1));
    } catch (error) {
      console.error("Mark notification read error:", error);

      toast.error(
        error.response?.data?.message || "Could not mark notification as read",
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ======================================
  // MARK ALL AS READ
  // ======================================

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;

    try {
      setMarkingAll(true);

      await markAllNotificationsRead();

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );

      setUnreadCount(0);

      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Mark all read error:", error);

      toast.error(
        error.response?.data?.message || "Failed to mark all as read",
      );
    } finally {
      setMarkingAll(false);
    }
  };

  // ======================================
  // DELETE NOTIFICATION
  // ======================================

  const handleDeleteNotification = async (event, notificationId, isRead) => {
    event.stopPropagation();

    try {
      setProcessingId(notificationId);

      await deleteNotification(notificationId);

      setNotifications((previous) =>
        previous.filter((notification) => notification._id !== notificationId),
      );

      if (!isRead) {
        setUnreadCount((previous) => Math.max(0, previous - 1));
      }

      toast.success("Notification deleted");
    } catch (error) {
      console.error("Delete notification error:", error);

      toast.error(
        error.response?.data?.message || "Failed to delete notification",
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ======================================
  // CLICK NOTIFICATION
  // ======================================

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await handleMarkRead(notification._id);
    }

    const config = getNotificationConfig(notification.type);

    navigate(config.route);
  };

  // ======================================
  // FILTER NOTIFICATIONS
  // ======================================

  const filteredNotifications = useMemo(() => {
    if (activeTab === "unread") {
      return notifications.filter((notification) => !notification.isRead);
    }

    return notifications;
  }, [notifications, activeTab]);

  // ======================================
  // LOADING SCREEN
  // ======================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 h-8 w-56 animate-pulse rounded-lg bg-gray-200" />

          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="mb-3 flex animate-pulse items-center gap-4 rounded-xl border border-gray-100 bg-white p-5"
            >
              <div className="h-12 w-12 rounded-full bg-gray-200" />

              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/3 rounded bg-gray-200" />
                <div className="h-3 w-2/3 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ======================================
  // MAIN PAGE
  // ======================================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* HEADER */}

        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <FiBell size={23} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Notifications
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Stay updated with your Educonnect activities.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fetchNotifications(false)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* SUMMARY CARDS */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total notifications
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  {notifications.length}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FiBell size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Unread notifications
                </p>

                <h2 className="mt-2 text-3xl font-bold text-emerald-600">
                  {unreadCount}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <FiCheckCircle size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* NOTIFICATION PANEL */}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* PANEL HEADER */}

          <div className="flex flex-col justify-between gap-4 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Your activity
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                All your recent updates in one place.
              </p>
            </div>

            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0 || markingAll}
              className="inline-flex items-center justify-center gap-2 self-start rounded-lg px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40 sm:self-auto"
            >
              <FiCheck />
              {markingAll ? "Processing..." : "Mark all as read"}
            </button>
          </div>

          {/* TABS */}

          <div className="flex items-center gap-6 border-b border-gray-100 px-5">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`relative py-4 text-sm font-semibold transition ${
                activeTab === "all"
                  ? "text-emerald-700"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              All
              {activeTab === "all" && (
                <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-emerald-600" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("unread")}
              className={`relative flex items-center gap-2 py-4 text-sm font-semibold transition ${
                activeTab === "unread"
                  ? "text-emerald-700"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                  {unreadCount}
                </span>
              )}
              {activeTab === "unread" && (
                <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-emerald-600" />
              )}
            </button>
          </div>

          {/* NOTIFICATION LIST */}

          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notification) => {
                const config = getNotificationConfig(notification.type);

                const sender = notification.sender;

                return (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`group flex cursor-pointer items-start gap-3 px-4 py-5 transition hover:bg-gray-50 sm:gap-4 sm:px-5 ${
                      !notification.isRead ? "bg-emerald-50/40" : ""
                    }`}
                  >
                    {/* SENDER AVATAR */}

                    <div className="relative shrink-0">
                      {sender?.profilepic ? (
                        <img
                          src={sender.profilepic}
                          alt={sender.fullName || "User"}
                          className="h-11 w-11 rounded-full border border-gray-200 object-cover sm:h-12 sm:w-12"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-lg font-bold text-gray-600 sm:h-12 sm:w-12">
                          {sender?.fullName?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      )}

                      <span
                        className={`absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-xs ${config.color}`}
                      >
                        {config.icon}
                      </span>
                    </div>

                    {/* NOTIFICATION CONTENT */}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {sender?.fullName || "Educonnect user"}
                        </h3>

                        <span className="text-xs text-gray-400">
                          {config.title}
                        </span>

                        {!notification.isRead && (
                          <span className="h-2 w-2 rounded-full bg-emerald-600" />
                        )}
                      </div>

                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        {notification.message}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        <span className="text-xs text-gray-400">
                          {formatTime(notification.createdAt)}
                        </span>

                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                          View details
                          <FiArrowRight size={12} />
                        </span>
                      </div>
                    </div>

                    {/* ACTIONS */}

                    <div
                      className="flex shrink-0 items-center gap-1"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {!notification.isRead && (
                        <button
                          type="button"
                          title="Mark as read"
                          disabled={processingId === notification._id}
                          onClick={() => handleMarkRead(notification._id)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-50"
                        >
                          <FiCheck size={17} />
                        </button>
                      )}

                      <button
                        type="button"
                        title="Delete notification"
                        disabled={processingId === notification._id}
                        onClick={(event) =>
                          handleDeleteNotification(
                            event,
                            notification._id,
                            notification.isRead,
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* EMPTY STATE */

            <div className="flex min-h-[350px] flex-col items-center justify-center px-5 py-12 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <FiBellOff size={34} />
              </div>

              <h3 className="text-lg font-semibold text-gray-800">
                {activeTab === "unread"
                  ? "No unread notifications"
                  : "No notifications yet"}
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                {activeTab === "unread"
                  ? "You are all caught up. There are no unread notifications right now."
                  : "When someone sends you a friend request, shares a post, uploads notes, or interacts with your content, you will see it here."}
              </p>

              {activeTab === "unread" && (
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className="mt-5 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  View all notifications
                </button>
              )}
            </div>
          )}
        </div>

        {/* FOOTER */}

        <p className="mt-5 text-center text-xs text-gray-400">
          Educonnect keeps you updated with your academic and professional
          community.
        </p>
      </div>
    </div>
  );
};

export default Notification;
