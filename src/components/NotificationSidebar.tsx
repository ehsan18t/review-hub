import React, { useState } from "react";

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
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "review_approved",
    title: "Review Approved",
    message: "Your review for Dr. Sarah Johnson has been approved.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
  },
  {
    id: "2",
    type: "credit_earned",
    title: "Credit Earned",
    message: "You earned 1 Review Credit for writing a review.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
  },
  {
    id: "3",
    type: "credit_spent",
    title: "Credit Spent",
    message:
      "You spent 1 Review Credit to view reviews for Prof. Michael Chen.",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
  },
  {
    id: "4",
    type: "system",
    title: "Welcome!",
    message:
      "Welcome to Faculty Review Hub! Start by browsing faculty and writing your first review.",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    read: true,
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
        return "text-green-600";
      case "review_rejected":
        return "text-red-600";
      case "credit_earned":
        return "text-green-600";
      case "credit_spent":
        return "text-blue-600";
      case "system":
        return "text-gray-600";
      default:
        return "text-gray-600";
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

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 z-50 flex h-full w-80 flex-col bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="rounded-full bg-red-500 px-2 py-1 text-xs text-white">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        {/* Actions */}
        <div className="border-b border-gray-200 p-4">
          <button
            onClick={markAllAsRead}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
            disabled={unreadCount === 0}
          >
            Mark all as read
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <span className="mb-4 block text-4xl">🔔</span>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                No notifications
              </h3>
              <p className="text-gray-600">
                You'll see notifications here when you have them.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`cursor-pointer p-4 hover:bg-gray-50 ${
                    !notification.read
                      ? "border-l-4 border-blue-500 bg-blue-50"
                      : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <span
                      className={`text-xl ${getNotificationColor(notification.type)}`}
                    >
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-medium ${
                          !notification.read ? "text-gray-900" : "text-gray-700"
                        }`}
                      >
                        {notification.title}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        {notification.message}
                      </p>
                      <p className="mt-2 text-xs text-gray-500">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="mt-2 h-2 w-2 rounded-full bg-blue-500"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <button
            className="w-full rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
            onClick={() => alert("View all notifications")}
          >
            View All Notifications
          </button>
        </div>
      </div>
    </>
  );
};

export default NotificationSidebar;
