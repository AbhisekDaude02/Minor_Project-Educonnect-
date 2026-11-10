
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
  FiArrowUpRight,
  FiInbox,
} from "react-icons/fi";

import {
  getAllNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../../services/notificationServices";

// ------------------------------------------
// Notification configuration
// ------------------------------------------

const notificationConfig = {
  friend_request: {
    icon: FiUserPlus,
    label: "Friend request",
    color: "text-blue-600",
    background: "bg-blue-50",
    route: "/community",
  },
  friend_accept: {
    icon: FiUsers,
    label: "Friend accepted",
    color: "text-emerald-600",
    background: "bg-emerald-50",
    route: "/community",
  },
  new_post: {
    icon: FiFileText,
    label: "New post",
    color: "text-indigo-600",
    background: "bg-indigo-50",
    route: "/educonnect",
  },
  new_note: {
    icon: FiBookOpen,
    label: "New notes",
    color: "text-amber-600",
    background: "bg-amber-50",
    route: "/studymaterials",
  },
  new_study_material: {
    icon: FiBookOpen,
    label: "Study material",
    color: "text-violet-600",
    background: "bg-violet-50",
    route: "/studymaterials",
  },
  new_job: {
    icon: FiBriefcase,
    label: "Job opportunity",
    color: "text-teal-600",
    background: "bg-teal-50",
    route: "/jobs",
  },
  job_application: {
    icon: FiBriefcase,
    label: "Job application",
    color: "text-orange-600",
    background: "bg-orange-50",
    route: "/jobs",
  },
  new_like: {
    icon: FiHeart,
    label: "Post like",
    color: "text-rose-600",
    background: "bg-rose-50",
    route: "/educonnect",
  },
  new_comment: {
    icon: FiMessageCircle,
    label: "New comment",
    color: "text-cyan-600",
    background: "bg-cyan-50",
    route: "/educonnect",
  },
};

const getNotificationConfig = (type) =>
  notificationConfig[type] || {
    icon: FiBell,
    label: "Notification",
    color: "text-slate-600",
    background: "bg-slate-100",
    route: "/notifications",
  };

// ------------------------------------------
// Time formatting
// ------------------------------------------

const formatTime = (date) => {
  if (!date) return "";

  const notificationDate = new Date(date);

  if (Number.isNaN(notificationDate.getTime())) {
    return "";
  }

  const now = new Date();
  const difference = Math.max(0, now - notificationDate);

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

// ------------------------------------------
// Loading skeleton
// ------------------------------------------

const NotificationSkeleton = () => (
  <div className="min-h-screen bg-[#f8faf9] px-4 py-10 sm:px-6">
    <div className="mx-auto max-w-5xl animate-pulse">
      <div className="mb-3 h-8 w-52 rounded-lg bg-slate-200" />
      <div className="mb-10 h-4 w-72 rounded bg-slate-100" />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div className="h-5 w-36 rounded bg-slate-200" />
          <div className="h-8 w-32 rounded-lg bg-slate-100" />
        </div>

        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="flex items-center gap-4 border-b border-slate-100 p-6 last:border-0"
          >
            <div className="h-12 w-12 shrink-0 rounded-full bg-slate-200" />

            <div className="flex-1 space-y-3">
              <div className="h-3.5 w-1/3 rounded bg-slate-200" />
              <div className="h-3 w-2/3 rounded bg-slate-100" />
              <div className="h-2.5 w-20 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ------------------------------------------
// Main component
// ------------------------------------------

const Notification = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState("all");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  // ------------------------------------------
  // Fetch notifications
  // ------------------------------------------

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
        countResponse.data.unreadCount ??
        countResponse.data.count ??
        0;

      setNotifications(
        Array.isArray(notificationData) ? notificationData : []
      );

      setUnreadCount(Number(countData) || 0);
    } catch (error) {
      console.error("Notification fetching error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load notifications"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ------------------------------------------
  // Mark single notification read
  // ------------------------------------------

  const handleMarkRead = async (notificationId) => {
    try {
      setProcessingId(notificationId);

      await markNotificationRead(notificationId);

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );

      setUnreadCount((previous) => Math.max(0, previous - 1));
    } catch (error) {
      console.error("Mark notification read error:", error);

      toast.error(
        error.response?.data?.message ||
          "Could not mark notification as read"
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ------------------------------------------
  // Mark all read
  // ------------------------------------------

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;

    try {
      setMarkingAll(true);

      await markAllNotificationsRead();

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      setUnreadCount(0);

      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Mark all read error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to mark all as read"
      );
    } finally {
      setMarkingAll(false);
    }
  };

  // ------------------------------------------
  // Delete notification
  // ------------------------------------------

  const handleDeleteNotification = async (
    event,
    notificationId,
    isRead
  ) => {
    event.stopPropagation();

    try {
      setProcessingId(notificationId);

      await deleteNotification(notificationId);

      setNotifications((previous) =>
        previous.filter(
          (notification) => notification._id !== notificationId
        )
      );

      if (!isRead) {
        setUnreadCount((previous) => Math.max(0, previous - 1));
      }

      toast.success("Notification deleted");
    } catch (error) {
      console.error("Delete notification error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete notification"
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ------------------------------------------
  // Notification click
  // ------------------------------------------

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await handleMarkRead(notification._id);
    }

    const config = getNotificationConfig(notification.type);

    navigate(config.route);
  };

  // ------------------------------------------
  // Filter
  // ------------------------------------------

  const filteredNotifications = useMemo(() => {
    if (activeTab === "unread") {
      return notifications.filter(
        (notification) => !notification.isRead
      );
    }

    return notifications;
  }, [notifications, activeTab]);

  if (loading) {
    return <NotificationSkeleton />;
  }

  return (
    <main className="min-h-screen bg-[#f8faf9]">
      <div className="mx-auto max-w-5xl px-4 pb-20 pt-8 sm:px-6 sm:pt-12 lg:px-8">

        {/* PAGE HEADING */}

        <header className="mb-8 sm:mb-10">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">

            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                  Your workspace
                </span>
              </div>

              <h1 className="text-[28px] font-bold tracking-tight text-slate-900 sm:text-[34px]">
                Notifications
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Keep track of everything happening in your Educonnect community.
              </p>
            </div>

            <button
              type="button"
              onClick={() => fetchNotifications(false)}
              disabled={refreshing}
              className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 text-[13px] font-semibold text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiRefreshCw
                size={14}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </header>

        {/* OVERVIEW */}

        <section className="mb-7 grid grid-cols-2 gap-3 sm:gap-4">
          <div className="rounded-xl border border-slate-200/80 bg-white px-5 py-5 shadow-sm sm:px-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 sm:text-sm">
                All notifications
              </span>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <FiInbox size={17} />
              </div>
            </div>

            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold leading-none tracking-tight text-slate-900">
                {notifications.length}
              </span>
              <span className="pb-0.5 text-xs text-slate-400">
                total
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-white px-5 py-5 shadow-sm sm:px-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 sm:text-sm">
                Unread
              </span>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <FiBell size={17} />
              </div>
            </div>

            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold leading-none tracking-tight text-slate-900">
                {unreadCount}
              </span>
              <span className="pb-0.5 text-xs text-slate-400">
                pending
              </span>
            </div>
          </div>
        </section>

        {/* NOTIFICATION INBOX */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_16px_rgba(15,23,42,0.025)]">

          {/* INBOX HEADER */}

          <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">

            <div>
              <h2 className="text-[16px] font-bold tracking-tight text-slate-900">
                Activity inbox
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Your latest updates and interactions
              </p>
            </div>

            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0 || markingAll}
              className="inline-flex items-center gap-2 self-start rounded-lg px-3 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40 sm:self-auto"
            >
              <FiCheckCircle size={15} />
              {markingAll ? "Marking as read..." : "Mark all as read"}
            </button>
          </div>

          {/* TABS */}

          <div className="flex items-center gap-7 border-b border-slate-100 px-5 sm:px-7">

            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`relative flex h-13 items-center gap-2 py-4 text-[13px] font-semibold transition-colors ${
                activeTab === "all"
                  ? "text-emerald-700"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              All activity

              <span
                className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                  activeTab === "all"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {notifications.length}
              </span>

              {activeTab === "all" && (
                <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-emerald-600" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("unread")}
              className={`relative flex h-13 items-center gap-2 py-4 text-[13px] font-semibold transition-colors ${
                activeTab === "unread"
                  ? "text-emerald-700"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Unread

              {unreadCount > 0 && (
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                    activeTab === "unread"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {unreadCount}
                </span>
              )}

              {activeTab === "unread" && (
                <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-emerald-600" />
              )}
            </button>
          </div>

          {/* NOTIFICATION LIST */}

          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {filteredNotifications.map((notification) => {
                const config = getNotificationConfig(
                  notification.type
                );

                const Icon = config.icon;
                const sender = notification.sender;
                const isUnread = !notification.isRead;
                const isProcessing =
                  processingId === notification._id;

                return (
                  <div
                    key={notification._id}
                    onClick={() =>
                      handleNotificationClick(notification)
                    }
                    className={`group relative flex cursor-pointer gap-3 px-4 py-5 transition-colors duration-150 sm:gap-4 sm:px-7 sm:py-5 ${
                      isUnread
                        ? "bg-emerald-50/30 hover:bg-emerald-50/60"
                        : "bg-white hover:bg-slate-50/80"
                    }`}
                  >
                    {/* UNREAD INDICATOR */}

                    {isUnread && (
                      <span className="absolute bottom-0 left-0 top-0 w-[3px] bg-emerald-500" />
                    )}

                    {/* AVATAR */}

                    <div className="relative h-11 w-11 shrink-0 sm:h-12 sm:w-12">
                      {sender?.profilepic ? (
                        <img
                          src={sender.profilepic}
                          alt={sender.fullName || "User"}
                          className="h-full w-full rounded-full border border-slate-200 object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-base font-bold text-slate-600">
                          {sender?.fullName
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                        </div>
                      )}

                      <span
                        className={`absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-[2.5px] border-white ${config.background} ${config.color}`}
                      >
                        <Icon size={11} strokeWidth={2.3} />
                      </span>
                    </div>

                    {/* CONTENT */}

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <h3
                          className={`text-[13px] tracking-[-0.01em] text-slate-900 ${
                            isUnread
                              ? "font-bold"
                              : "font-semibold"
                          }`}
                        >
                          {sender?.fullName || "Educonnect user"}
                        </h3>

                        <span className="text-[11px] text-slate-400">
                          ·
                        </span>

                        <span className="text-[11px] font-medium text-slate-500">
                          {config.label}
                        </span>
                      </div>

                      <p
                        className={`mt-1.5 max-w-2xl text-[13px] leading-[1.7] ${
                          isUnread
                            ? "text-slate-700"
                            : "text-slate-500"
                        }`}
                      >
                        {notification.message}
                      </p>

                      <div className="mt-2.5 flex flex-wrap items-center gap-3">
                        <time className="text-[11px] font-medium text-slate-400">
                          {formatTime(notification.createdAt)}
                        </time>

                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 opacity-80 transition-opacity group-hover:opacity-100">
                          View activity
                          <FiArrowUpRight size={12} />
                        </span>
                      </div>
                    </div>

                    {/* ROW ACTIONS */}

                    <div
                      className="flex shrink-0 items-start gap-1"
                      onClick={(event) =>
                        event.stopPropagation()
                      }
                    >
                      {isUnread && (
                        <span className="mr-1 mt-3 hidden h-2 w-2 rounded-full bg-emerald-500 sm:block" />
                      )}

                      {!notification.isRead && (
                        <button
                          type="button"
                          title="Mark as read"
                          aria-label="Mark notification as read"
                          disabled={isProcessing}
                          onClick={() =>
                            handleMarkRead(notification._id)
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-emerald-100 hover:text-emerald-700 disabled:opacity-40"
                        >
                          <FiCheck size={16} />
                        </button>
                      )}

                      <button
                        type="button"
                        title="Delete notification"
                        aria-label="Delete notification"
                        disabled={isProcessing}
                        onClick={(event) =>
                          handleDeleteNotification(
                            event,
                            notification._id,
                            notification.isRead
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* EMPTY STATE */

            <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-14 text-center">

              <div className="relative mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-400">
                  {activeTab === "unread" ? (
                    <FiCheckCircle size={32} strokeWidth={1.5} />
                  ) : (
                    <FiBellOff size={32} strokeWidth={1.5} />
                  )}
                </div>

                {activeTab === "unread" && (
                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-emerald-500 text-white">
                    <FiCheck size={12} />
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold tracking-tight text-slate-900">
                {activeTab === "unread"
                  ? "You're all caught up"
                  : "Nothing here yet"}
              </h3>

              <p className="mt-2 max-w-xs text-[13px] leading-6 text-slate-500">
                {activeTab === "unread"
                  ? "You've read all your notifications. New updates will appear here."
                  : "Your notifications will appear here when someone interacts with you or shares something new."}
              </p>

              {activeTab === "unread" && (
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
                >
                  View all activity
                  <FiArrowUpRight size={14} />
                </button>
              )}
            </div>
          )}
        </section>

        {/* FOOTER */}

        <div className="mt-6 flex items-center justify-center gap-2 text-center">
          <FiCheckCircle
            size={13}
            className="text-emerald-600"
          />
          <p className="text-[11px] text-slate-400">
            Stay connected with your academic and professional community.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Notification;
