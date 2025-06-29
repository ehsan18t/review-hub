import { AppProvider, useApp } from "@/contexts/AppContext";
import { getPendingReviews, mockUsers } from "@/data/mockData";
import React, { useState } from "react";
import Navigation from "./Navigation";
import ReviewCard from "./ReviewCard";

const UserManagementTable: React.FC = () => {
  const [users] = useState(mockUsers);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">User Management</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Name
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Email
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Role
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Department
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Credits
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-xs font-bold text-white">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <span className="text-gray-700">{user.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : user.role === "faculty"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {user.department || "-"}
                </td>
                <td className="px-4 py-3">
                  {user.role === "student" ? (
                    <span className="font-medium text-green-600">
                      {user.reviewCredits} RC
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-3">
                  <button className="mr-3 text-sm font-medium text-blue-600 hover:text-blue-800">
                    Edit
                  </button>
                  <button className="text-sm font-medium text-red-600 hover:text-red-800">
                    Suspend
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PendingReviewsPanel: React.FC = () => {
  const { updateReviewStatus } = useApp();
  const [pendingReviews, setPendingReviews] = useState(getPendingReviews());

  const handleApprove = (reviewId: string) => {
    updateReviewStatus(reviewId, "approved");
    setPendingReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  const handleReject = (reviewId: string) => {
    updateReviewStatus(reviewId, "rejected");
    setPendingReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Pending Reviews</h2>
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
          {pendingReviews.length} pending
        </span>
      </div>

      <div className="space-y-6">
        {pendingReviews.length === 0 ? (
          <div className="py-8 text-center">
            <span className="mb-4 block text-4xl">✅</span>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              All caught up!
            </h3>
            <p className="text-gray-600">No pending reviews to moderate.</p>
          </div>
        ) : (
          pendingReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              showActions={true}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))
        )}
      </div>
    </div>
  );
};

const AdminStats: React.FC = () => {
  const totalUsers = mockUsers.length;
  const totalStudents = mockUsers.filter((u) => u.role === "student").length;
  const totalFaculty = mockUsers.filter((u) => u.role === "faculty").length;
  const pendingCount = getPendingReviews().length;

  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: "👥",
      color: "text-blue-600",
    },
    {
      label: "Students",
      value: totalStudents,
      icon: "🎓",
      color: "text-green-600",
    },
    {
      label: "Faculty",
      value: totalFaculty,
      icon: "👨‍🏫",
      color: "text-purple-600",
    },
    {
      label: "Pending Reviews",
      value: pendingCount,
      icon: "⏳",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="mb-8 grid gap-6 md:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-md"
        >
          <div className="flex items-center">
            <span className="mr-3 text-2xl">{stat.icon}</span>
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const AdminPanelContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"reviews" | "users">("reviews");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-600">
          Manage reviews, users, and monitor platform activity.
        </p>
      </div>

      {/* Stats */}
      <AdminStats />

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("reviews")}
            className={`border-b-2 px-1 py-2 text-sm font-medium ${
              activeTab === "reviews"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            Review Management
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`border-b-2 px-1 py-2 text-sm font-medium ${
              activeTab === "users"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            User Management
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === "reviews" ? (
        <PendingReviewsPanel />
      ) : (
        <UserManagementTable />
      )}
    </div>
  );
};

const AdminPanel: React.FC = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <AdminPanelContent />
      </div>
    </AppProvider>
  );
};

export default AdminPanel;
