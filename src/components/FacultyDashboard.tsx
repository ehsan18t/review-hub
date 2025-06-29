import { AppProvider } from "@/contexts/AppContext";
import type { AIInsight, Faculty } from "@/data/mockData";
import {
  getAIInsightsByFacultyId,
  getApprovedReviewsByFacultyId,
  mockFaculty,
} from "@/data/mockData";
import React, { useState } from "react";
import Navigation from "./Navigation";
import ReviewCard from "./ReviewCard";

const FacultyProfileEditor: React.FC<{ faculty: Faculty }> = ({ faculty }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: faculty.name,
    position: faculty.position,
    department: faculty.department,
    bio: faculty.bio || "",
  });

  const handleSave = () => {
    // In a real app, this would save to backend
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Position
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      position: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      department: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Tell students about your expertise and teaching philosophy..."
                />
              </div>
              <button
                onClick={handleSave}
                className="rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {faculty.name}
                </h3>
                <p className="text-gray-600">{faculty.position}</p>
                <p className="font-medium text-blue-600">
                  {faculty.department}
                </p>
              </div>
              <div>
                <h4 className="mb-2 font-medium text-gray-900">About</h4>
                <p className="text-gray-700">
                  {faculty.bio || "No bio available."}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Stats */}
          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="mb-3 font-medium text-gray-900">Statistics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {faculty.avgRating.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {faculty.totalReviews}
                </div>
                <div className="text-sm text-gray-600">Total Reviews</div>
              </div>
            </div>
          </div>

          {/* Avatar */}
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-2xl font-bold text-white">
              {faculty.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-800">
              Upload Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AIInsightsPanel: React.FC<{ insights: AIInsight[] }> = ({ insights }) => {
  const getInsightIcon = (type: AIInsight["type"]) => {
    switch (type) {
      case "strength":
        return "💪";
      case "improvement":
        return "📈";
      case "trend":
        return "📊";
      default:
        return "🤖";
    }
  };

  const getInsightColor = (type: AIInsight["type"]) => {
    switch (type) {
      case "strength":
        return "bg-green-50 border-green-200 text-green-800";
      case "improvement":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "trend":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center">
        <span className="mr-3 text-2xl">🤖</span>
        <h2 className="text-2xl font-bold text-gray-900">AI Insights</h2>
      </div>

      <div className="space-y-4">
        {insights.length === 0 ? (
          <p className="py-8 text-center text-gray-600">
            No AI insights available yet. More data needed for analysis.
          </p>
        ) : (
          insights.map((insight) => (
            <div
              key={insight.id}
              className={`rounded-lg border p-4 ${getInsightColor(insight.type)}`}
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{getInsightIcon(insight.type)}</span>
                <div className="flex-1">
                  <h4 className="mb-1 font-semibold">{insight.title}</h4>
                  <p className="text-sm opacity-90">{insight.description}</p>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="text-xs opacity-75">Confidence:</span>
                    <div className="bg-opacity-50 h-2 w-16 rounded-full bg-white">
                      <div
                        className="h-2 rounded-full bg-current"
                        style={{ width: `${insight.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-xs opacity-75">
                      {Math.round(insight.confidence * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const FacultyDashboardContent: React.FC = () => {
  // For demo, assume current user is faculty member with ID 'f1'
  const faculty = mockFaculty.find((f) => f.id === "f1") || mockFaculty[0];
  const reviews = getApprovedReviewsByFacultyId(faculty.id);
  const insights = getAIInsightsByFacultyId(faculty.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Faculty Dashboard
        </h1>
        <p className="text-gray-600">
          Manage your profile, view reviews, and get AI-powered insights.
        </p>
      </div>

      {/* Profile Editor */}
      <div className="mb-8">
        <FacultyProfileEditor faculty={faculty} />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Reviews */}
        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Recent Reviews
          </h2>
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-md">
                <span className="mb-4 block text-4xl">📝</span>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  No reviews yet
                </h3>
                <p className="text-gray-600">
                  Your approved reviews will appear here.
                </p>
              </div>
            ) : (
              reviews
                .slice(0, 3)
                .map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    faculty={faculty}
                  />
                ))
            )}
            {reviews.length > 3 && (
              <button className="w-full py-2 font-medium text-blue-600 hover:text-blue-800">
                View All Reviews ({reviews.length})
              </button>
            )}
          </div>
        </div>

        {/* AI Insights */}
        <div>
          <AIInsightsPanel insights={insights} />
        </div>
      </div>
    </div>
  );
};

const FacultyDashboard: React.FC = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <FacultyDashboardContent />
      </div>
    </AppProvider>
  );
};

export default FacultyDashboard;
