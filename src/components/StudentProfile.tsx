import { AppProvider, useApp } from "@/contexts/AppContext";
import { mockFaculty, mockReviews } from "@/data/mockData";
import React, { useState } from "react";
import Navigation from "./Navigation";
import ReviewCard from "./ReviewCard";

const StudentProfileContent: React.FC = () => {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<
    "profile" | "reviews" | "activity"
  >("profile");

  if (!currentUser) return null;

  const userReviews = mockReviews.filter((r) => r.studentId === currentUser.id);
  const approvedReviews = userReviews.filter((r) => r.status === "approved");
  const pendingReviews = userReviews.filter((r) => r.status === "pending");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        <div className="flex items-center space-x-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-2xl font-bold text-white">
            {currentUser.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {currentUser.name}
            </h1>
            <p className="text-gray-600">{currentUser.email}</p>
            <p className="font-medium text-blue-600">
              {currentUser.department}
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {currentUser.reviewCredits}
            </div>
            <div className="text-sm text-gray-600">Review Credits</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
          <div className="flex items-center">
            <span className="mr-3 text-2xl">📝</span>
            <div>
              <p className="text-sm text-gray-600">Reviews Written</p>
              <p className="text-2xl font-bold text-blue-600">
                {userReviews.length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
          <div className="flex items-center">
            <span className="mr-3 text-2xl">✅</span>
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">
                {approvedReviews.length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
          <div className="flex items-center">
            <span className="mr-3 text-2xl">⏳</span>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {pendingReviews.length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
          <div className="flex items-center">
            <span className="mr-3 text-2xl">🎯</span>
            <div>
              <p className="text-sm text-gray-600">Faculty Reviewed</p>
              <p className="text-2xl font-bold text-purple-600">
                {new Set(userReviews.map((r) => r.facultyId)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          {[
            { key: "profile", label: "Profile" },
            { key: "reviews", label: "My Reviews" },
            { key: "activity", label: "Activity" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`border-b-2 px-1 py-2 text-sm font-medium ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        {activeTab === "profile" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Profile Information
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={currentUser.name}
                  disabled
                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={currentUser.email}
                  disabled
                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Department
                </label>
                <input
                  type="text"
                  value={currentUser.department || "Not specified"}
                  disabled
                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Role
                </label>
                <input
                  type="text"
                  value={
                    currentUser.role.charAt(0).toUpperCase() +
                    currentUser.role.slice(1)
                  }
                  disabled
                  className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
                />
              </div>
            </div>
            <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
              <h3 className="mb-2 font-medium text-blue-900">
                Account Information
              </h3>
              <p className="text-sm text-blue-800">
                This is a demo account. In a real application, you would be able
                to edit your profile information, change your password, and
                manage your account settings.
              </p>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">My Reviews</h2>
            {userReviews.length === 0 ? (
              <div className="py-8 text-center">
                <span className="mb-4 block text-4xl">📝</span>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  No reviews yet
                </h3>
                <p className="mb-4 text-gray-600">
                  Start by writing your first faculty review!
                </p>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
                >
                  Browse Faculty
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userReviews.map((review) => {
                  const faculty = mockFaculty.find(
                    (f) => f.id === review.facultyId,
                  );
                  return (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      faculty={faculty}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Recent Activity
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 rounded-lg bg-gray-50 p-4">
                <span className="text-2xl">📝</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    Wrote a review for Dr. Sarah Johnson
                  </p>
                  <p className="text-sm text-gray-600">
                    2 days ago • Earned 1 Review Credit
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 rounded-lg bg-gray-50 p-4">
                <span className="text-2xl">👀</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    Viewed reviews for Prof. Michael Chen
                  </p>
                  <p className="text-sm text-gray-600">
                    5 days ago • Spent 1 Review Credit
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 rounded-lg bg-gray-50 p-4">
                <span className="text-2xl">✅</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    Review approved for Dr. Lisa Rodriguez
                  </p>
                  <p className="text-sm text-gray-600">1 week ago</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StudentProfile: React.FC = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <StudentProfileContent />
      </div>
    </AppProvider>
  );
};

export default StudentProfile;
