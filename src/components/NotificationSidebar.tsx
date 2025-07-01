import React, { useEffect, useState } from "react";
import { HiOutlineBell, HiOutlineCheck, HiOutlineX } from "react-icons/hi";

interface Notification {
  id: string;
  type:
    | "review_approved"
    | "review_rejected"
    | "credit_earned"
    | "credit_spent"
    | "system";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority?: "high" | "medium" | "low";
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "review_approved",
    title: "Review Approved",
    message:
      "Your review for Dr. Sarah Johnson has been approved and is now live.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    priority: "high",
  },
  {
    id: "2",
    type: "credit_earned",
    title: "Credit Earned",
    message: "You earned 1 Review Credit for writing a helpful review.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    priority: "medium",
  },
  {
    id: "3",
    type: "credit_spent",
    title: "Credit Spent",
    message:
      "You spent 1 Review Credit to view reviews for Prof. Michael Chen.",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    priority: "low",
  },
  {
    id: "4",
    type: "review_rejected",
    title: "Review Needs Revision",
    message:
      "Your review for Prof. David Wilson was rejected. Please review our guidelines and resubmit.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    read: false,
    priority: "high",
  },
  {
    id: "5",
    type: "system",
    title: "Welcome to Faculty Review Hub!",
    message:
      "Start by browsing faculty and writing your first review to earn credits.",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    read: true,
    priority: "low",
  },
];

interface NotificationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationSidebar: React.FC<NotificationSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  // Close sidebar when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent body scroll
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "review_approved":
        return "✅";
      case "review_rejected":
        return "❌";
      case "credit_earned":
        return "💰";
      case "credit_spent":
        return "💸";
      case "system":
        return "🔔";
      default:
        return "📢";
    }
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "review_approved":
        return "text-emerald-700 bg-emerald-100 border-emerald-200";
      case "review_rejected":
        return "text-red-700 bg-red-100 border-red-200";
      case "credit_earned":
        return "text-green-700 bg-green-100 border-green-200";
      case "credit_spent":
        return "text-blue-700 bg-blue-100 border-blue-200";
      case "system":
        return "text-purple-700 bg-purple-100 border-purple-200";
      default:
        return "text-slate-700 bg-slate-100 border-slate-200";
    }
  };

  const getPriorityIndicator = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-slate-400";
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((notif) => notif.id !== notificationId),
    );
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - timestamp.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d ago`;
    }
  };

  const filteredNotifications = notifications.filter(
    (notif) => filter === "all" || !notif.read,
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div className="animate-in slide-in-from-right fixed top-0 right-0 z-50 flex h-full w-full max-w-md transform flex-col bg-white shadow-2xl transition-all duration-300 sm:w-96">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-blue-50 px-4 py-4 sm:px-6 sm:py-6">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 p-2 shadow-sm transition-colors duration-200 hover:bg-blue-700">
              <HiOutlineBell className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <span className="inline-flex items-center rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm">
                  {unreadCount} new
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-all duration-200 hover:scale-110 hover:bg-slate-100 hover:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            aria-label="Close notifications"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="border-b border-slate-100 bg-white px-4 py-3 sm:px-6">
          <div className="flex space-x-1">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                filter === "all"
                  ? "bg-blue-100 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
                filter === "unread"
                  ? "bg-blue-100 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>

        {/* Actions */}
        {unreadCount > 0 && (
          <div className="border-b border-slate-100 bg-slate-50 px-4 py-3 sm:px-6">
            <button
              onClick={markAllAsRead}
              className="flex items-center space-x-2 text-sm font-bold text-blue-600 transition-all duration-200 hover:scale-105 hover:text-blue-800"
            >
              <HiOutlineCheck className="h-4 w-4" />
              <span>Mark all as read</span>
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center sm:p-12">
              <div className="mb-6 rounded-full bg-slate-100 p-6 shadow-sm sm:mb-8 sm:p-8">
                <span className="text-4xl sm:text-5xl">🔔</span>
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900 sm:mb-3 sm:text-xl">
                {filter === "unread"
                  ? "No unread notifications"
                  : "No notifications"}
              </h3>
              <p className="max-w-xs text-sm leading-relaxed text-slate-600">
                {filter === "unread"
                  ? "You're all caught up! Check back later for new updates."
                  : "You'll see notifications here when you have updates about reviews, credits, and system messages."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`group relative cursor-pointer p-4 transition-all duration-200 hover:bg-slate-50 sm:p-6 ${
                    !notification.read
                      ? "border-l-4 border-blue-600 bg-blue-50/30"
                      : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div
                      className={`flex-shrink-0 rounded-lg border p-2 shadow-sm transition-all duration-200 hover:scale-110 sm:p-2.5 ${getNotificationColor(notification.type)}`}
                    >
                      <span className="text-base sm:text-lg">
                        {getNotificationIcon(notification.type)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <p
                            className={`text-sm font-bold ${
                              !notification.read
                                ? "text-slate-900"
                                : "text-slate-700"
                            }`}
                          >
                            {notification.title}
                          </p>
                          {notification.priority && (
                            <span
                              className={`h-2 w-2 rounded-full ${getPriorityIndicator(notification.priority)}`}
                              title={`${notification.priority} priority`}
                            />
                          )}
                        </div>
                        {!notification.read && (
                          <div className="mt-1 ml-2 h-2 w-2 flex-shrink-0 animate-pulse rounded-full bg-blue-600"></div>
                        )}
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600 sm:mt-2">
                        {notification.message}
                      </p>
                      <div className="mt-2 flex items-center justify-between sm:mt-3">
                        <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                          {formatTime(notification.timestamp)}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="rounded p-1 text-slate-400 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600"
                          aria-label="Delete notification"
                        >
                          <HiOutlineX className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-4 sm:px-6 sm:py-6">
          <button
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-md focus:ring-4 focus:ring-blue-200 focus:outline-none"
            onClick={() => {
              onClose();
              // In a real app, this would navigate to a full notifications page
              alert("Opening full notifications page...");
            }}
          >
            View All Notifications
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationSidebar;
