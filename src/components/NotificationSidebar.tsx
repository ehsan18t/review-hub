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
        return "text-emerald-700 bg-emerald-100";
      case "review_rejected":
        return "text-red-700 bg-red-100";
      case "credit_earned":
        return "text-green-700 bg-green-100";
      case "credit_spent":
        return "text-blue-700 bg-blue-100";
      case "system":
        return "text-purple-700 bg-purple-100";
      default:
        return "text-slate-700 bg-slate-100";
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
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="animate-in slide-in-from-right fixed top-0 right-0 z-50 flex h-full w-96 transform flex-col bg-white shadow-2xl transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-blue-50 px-6 py-6">
          <div className="flex items-center space-x-4">
            <div className="rounded-lg bg-blue-600 p-3 shadow-sm transition-colors duration-200 hover:bg-blue-700">
              <span className="text-xl">🔔</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <span className="inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  {unreadCount} new
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2.5 text-slate-400 transition-all duration-200 hover:scale-110 hover:bg-slate-100 hover:text-slate-600"
          >
            <span className="text-xl font-bold">×</span>
          </button>
        </div>

        {/* Actions */}
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
          <button
            onClick={markAllAsRead}
            className="text-sm font-bold text-blue-600 transition-all duration-200 hover:scale-105 hover:text-blue-800 disabled:cursor-not-allowed disabled:text-slate-400"
            disabled={unreadCount === 0}
          >
            Mark all as read
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-8 rounded-full bg-slate-100 p-8 shadow-sm">
                <span className="text-5xl">🔔</span>
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">
                No notifications
              </h3>
              <p className="max-w-xs text-sm leading-relaxed text-slate-600">
                You'll see notifications here when you have updates about
                reviews, credits, and system messages.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`cursor-pointer p-6 transition-all duration-200 hover:scale-[1.02] hover:bg-slate-50 ${
                    !notification.read
                      ? "border-l-4 border-blue-600 bg-blue-50/50"
                      : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`rounded-lg p-2.5 shadow-sm transition-all duration-200 hover:scale-110 ${getNotificationColor(notification.type)}`}
                    >
                      <span className="text-lg">
                        {getNotificationIcon(notification.type)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between">
                        <p
                          className={`text-sm font-bold ${
                            !notification.read
                              ? "text-slate-900"
                              : "text-slate-700"
                          }`}
                        >
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="mt-1 ml-2 h-2.5 w-2.5 flex-shrink-0 animate-pulse rounded-full bg-blue-600"></div>
                        )}
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {notification.message}
                      </p>
                      <div className="mt-3 flex items-center space-x-2">
                        <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-6">
          <button
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-md focus:ring-4 focus:ring-blue-200 focus:outline-none"
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
