import { AppProvider, useApp } from "@/contexts/AppContext";
import type { Faculty } from "@/data/mockData";
import {
  getApprovedReviewsByFacultyId,
  getDetailedInsightsByType,
  getReviewsByFacultyId,
  mockFaculty,
} from "@/data/mockData";
import React, { useState } from "react";
import {
  HiOutlineAcademicCap,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineLightBulb,
  HiOutlineStar,
  HiOutlineTrendingUp,
  HiOutlineUsers,
} from "react-icons/hi";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import CompactReviewCard from "./CompactReviewCard";
import Navigation from "./Navigation";
import RatingCategoriesAnalysis from "./RatingCategoriesAnalysis";

const FacultyProfileCard: React.FC<{ faculty: Faculty }> = ({ faculty }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start space-x-6">
        {/* Avatar */}
        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-2xl font-bold text-white shadow-md">
          {faculty.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h2 className="mb-2 text-2xl font-bold text-slate-900">
            {faculty.name}
          </h2>
          <p className="mb-2 text-slate-600">
            {faculty.position} • {faculty.department}
          </p>
          {faculty.bio && (
            <p className="text-sm leading-relaxed text-slate-700">
              {faculty.bio}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="flex flex-shrink-0 space-x-6">
          <div className="text-center">
            <div className="mb-1 flex items-center justify-center">
              <HiOutlineStar className="mr-1 h-5 w-5 text-amber-500" />
              <span className="text-2xl font-bold text-slate-900">
                {faculty.avgRating.toFixed(1)}
              </span>
            </div>
            <div className="text-sm text-slate-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="mb-1 flex items-center justify-center">
              <HiOutlineUsers className="mr-1 h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold text-slate-900">
                {faculty.totalReviews}
              </span>
            </div>
            <div className="text-sm text-slate-600">Total Reviews</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EnhancedAIInsightsPanel: React.FC<{ faculty: Faculty }> = ({
  faculty,
}) => {
  const [activeTab, setActiveTab] = useState<
    "actionable" | "strengths" | "improvements" | "trends"
  >("actionable");

  const actionableInsights = getDetailedInsightsByType(
    faculty.id,
    "actionable",
  );
  const strengthInsights = getDetailedInsightsByType(faculty.id, "strength");
  const improvementInsights = getDetailedInsightsByType(
    faculty.id,
    "improvement",
  );
  const trendInsights = getDetailedInsightsByType(faculty.id, "trend");

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "actionable":
        return <HiOutlineLightBulb className="h-5 w-5" />;
      case "strengths":
        return <HiOutlineCheckCircle className="h-5 w-5" />;
      case "improvements":
        return <HiOutlineExclamationTriangle className="h-5 w-5" />;
      case "trends":
        return <HiOutlineTrendingUp className="h-5 w-5" />;
      default:
        return <HiOutlineLightBulb className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600";
      case "Medium":
        return "text-yellow-600";
      case "Hard":
        return "text-red-600";
      default:
        return "text-slate-600";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              AI Teaching Insights
            </h2>
            <p className="text-slate-600">
              Personalized recommendations to enhance your teaching
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8 px-6">
          {[
            {
              key: "actionable",
              label: "Action Items",
              count: actionableInsights.length,
            },
            {
              key: "strengths",
              label: "Strengths",
              count: strengthInsights.length,
            },
            {
              key: "improvements",
              label: "Areas to Improve",
              count: improvementInsights.length,
            },
            { key: "trends", label: "Trends", count: trendInsights.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 border-b-2 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {getTabIcon(tab.key)}
              <span>{tab.label}</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "actionable" && (
          <div className="space-y-6">
            {actionableInsights.length === 0 ? (
              <div className="py-8 text-center text-slate-500">
                No actionable insights available at this time.
              </div>
            ) : (
              actionableInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {insight.title}
                        </h3>
                        {insight.priority && (
                          <span
                            className={`rounded-full border px-2 py-1 text-xs font-medium ${getPriorityColor(insight.priority)}`}
                          >
                            {insight.priority.toUpperCase()} PRIORITY
                          </span>
                        )}
                      </div>
                      <p className="mb-3 text-slate-700">
                        {insight.description}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4 grid gap-4 md:grid-cols-3">
                    {insight.impact && (
                      <div className="rounded bg-blue-50 p-3">
                        <p className="text-sm font-medium text-blue-800">
                          Expected Impact
                        </p>
                        <p className="text-sm text-blue-700">
                          {insight.impact}
                        </p>
                      </div>
                    )}
                    {insight.timeToImplement && (
                      <div className="rounded bg-green-50 p-3">
                        <p className="text-sm font-medium text-green-800">
                          Time to Implement
                        </p>
                        <p className="text-sm text-green-700">
                          {insight.timeToImplement}
                        </p>
                      </div>
                    )}
                    {insight.difficulty && (
                      <div className="rounded bg-purple-50 p-3">
                        <p className="text-sm font-medium text-purple-800">
                          Difficulty
                        </p>
                        <p
                          className={`text-sm font-semibold ${getDifficultyColor(insight.difficulty)}`}
                        >
                          {insight.difficulty}
                        </p>
                      </div>
                    )}
                  </div>

                  {insight.specificActions &&
                    insight.specificActions.length > 0 && (
                      <div>
                        <p className="mb-2 text-sm font-semibold text-slate-800">
                          Specific Actions:
                        </p>
                        <ul className="space-y-1">
                          {insight.specificActions.map((action, index) => (
                            <li
                              key={index}
                              className="flex items-start space-x-2 text-sm text-slate-700"
                            >
                              <span className="text-blue-500">•</span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>Based on {insight.basedOnReviews} reviews</span>
                    <span>
                      Confidence: {Math.round(insight.confidence * 100)}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "strengths" && (
          <div className="space-y-6">
            {strengthInsights.length === 0 ? (
              <div className="py-8 text-center text-slate-500">
                No strength insights available at this time.
              </div>
            ) : (
              strengthInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="rounded-lg border border-emerald-200 bg-emerald-50 p-5"
                >
                  <div className="mb-3 flex items-center space-x-2">
                    <HiOutlineCheckCircle className="h-6 w-6 text-emerald-600" />
                    <h3 className="text-lg font-semibold text-emerald-900">
                      {insight.title}
                    </h3>
                  </div>
                  <p className="mb-4 text-emerald-800">{insight.description}</p>

                  {insight.evidence && (
                    <div className="mb-4 rounded bg-emerald-100 p-3">
                      <p className="mb-1 text-sm font-medium text-emerald-900">
                        Evidence:
                      </p>
                      <p className="text-sm text-emerald-800">
                        {insight.evidence}
                      </p>
                    </div>
                  )}

                  {insight.impact && (
                    <div className="mb-4 rounded bg-white p-3">
                      <p className="mb-1 text-sm font-medium text-slate-900">
                        Impact:
                      </p>
                      <p className="text-sm text-slate-700">{insight.impact}</p>
                    </div>
                  )}

                  {insight.recommendation && (
                    <div className="rounded bg-blue-50 p-3">
                      <p className="mb-1 text-sm font-medium text-blue-900">
                        Recommendation:
                      </p>
                      <p className="text-sm text-blue-800">
                        {insight.recommendation}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between text-xs text-emerald-600">
                    <span>Based on {insight.basedOnReviews} reviews</span>
                    <span>
                      Confidence: {Math.round(insight.confidence * 100)}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "improvements" && (
          <div className="space-y-6">
            {improvementInsights.length === 0 ? (
              <div className="py-8 text-center text-slate-500">
                No improvement insights available at this time.
              </div>
            ) : (
              improvementInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="rounded-lg border border-yellow-200 bg-yellow-50 p-5"
                >
                  <div className="mb-3 flex items-center space-x-2">
                    <HiOutlineExclamationTriangle className="h-6 w-6 text-yellow-600" />
                    <h3 className="text-lg font-semibold text-yellow-900">
                      {insight.title}
                    </h3>
                    {insight.severity && (
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getSeverityColor(insight.severity)}`}
                      >
                        {insight.severity.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className="mb-4 text-yellow-800">{insight.description}</p>

                  {insight.suggestions && insight.suggestions.length > 0 && (
                    <div className="mb-4">
                      <p className="mb-2 text-sm font-semibold text-yellow-900">
                        Quick Suggestions:
                      </p>
                      <ul className="space-y-1">
                        {insight.suggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2 text-sm text-yellow-800"
                          >
                            <span className="text-yellow-600">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {insight.potentialSolutions &&
                    insight.potentialSolutions.length > 0 && (
                      <div className="rounded bg-white p-3">
                        <p className="mb-2 text-sm font-semibold text-slate-900">
                          Potential Solutions:
                        </p>
                        <ul className="space-y-1">
                          {insight.potentialSolutions.map((solution, index) => (
                            <li
                              key={index}
                              className="flex items-start space-x-2 text-sm text-slate-700"
                            >
                              <span className="text-blue-500">✓</span>
                              <span>{solution}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  <div className="mt-4 flex items-center justify-between text-xs text-yellow-600">
                    <span>Based on {insight.basedOnReviews} reviews</span>
                    <span>
                      Confidence: {Math.round(insight.confidence * 100)}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "trends" && (
          <div className="space-y-6">
            {trendInsights.length === 0 ? (
              <div className="py-8 text-center text-slate-500">
                No trend insights available at this time.
              </div>
            ) : (
              trendInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="rounded-lg border border-blue-200 bg-blue-50 p-5"
                >
                  <div className="mb-3 flex items-center space-x-2">
                    <HiOutlineTrendingUp
                      className={`h-6 w-6 ${
                        insight.direction === "positive"
                          ? "text-green-600"
                          : insight.direction === "negative"
                            ? "text-red-600"
                            : "text-blue-600"
                      }`}
                    />
                    <h3 className="text-lg font-semibold text-blue-900">
                      {insight.title}
                    </h3>
                  </div>
                  <p className="mb-4 text-blue-800">{insight.description}</p>

                  {insight.dataPoints && insight.dataPoints.length > 0 && (
                    <div className="mb-4 rounded bg-white p-4">
                      <p className="mb-3 text-sm font-semibold text-slate-900">
                        Data Points:
                      </p>
                      <div className="space-y-2">
                        {insight.dataPoints.map((point, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-slate-700">
                              {point.period || point.courseType}:
                            </span>
                            <span className="font-medium text-slate-900">
                              {point.rating
                                ? `${point.rating} ⭐`
                                : point.studentSatisfaction}
                              {point.reviews && ` (${point.reviews} reviews)`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {insight.analysis && (
                    <div className="mb-3 rounded bg-blue-100 p-3">
                      <p className="mb-1 text-sm font-medium text-blue-900">
                        Analysis:
                      </p>
                      <p className="text-sm text-blue-800">
                        {insight.analysis}
                      </p>
                    </div>
                  )}

                  {insight.prediction && (
                    <div className="rounded bg-green-50 p-3">
                      <p className="mb-1 text-sm font-medium text-green-900">
                        Prediction:
                      </p>
                      <p className="text-sm text-green-800">
                        {insight.prediction}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 text-right text-xs text-blue-600">
                    <span>
                      Confidence: {Math.round(insight.confidence * 100)}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const FacultyDashboardContent: React.FC = () => {
  const { currentUser } = useApp();

  // Find the faculty data based on current user
  const faculty =
    currentUser?.role === "faculty"
      ? mockFaculty.find((f) => f.id === currentUser.id) || mockFaculty[0]
      : mockFaculty[0];

  const allReviews = getReviewsByFacultyId(faculty.id);
  const approvedReviews = getApprovedReviewsByFacultyId(faculty.id);

  const getReviewStats = () => {
    const pending = allReviews.filter((r) => r.status === "pending").length;
    const approved = allReviews.filter((r) => r.status === "approved").length;
    const rejected = allReviews.filter((r) => r.status === "rejected").length;
    return { pending, approved, rejected, total: allReviews.length };
  };

  const stats = getReviewStats();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 flex items-center space-x-3 text-3xl font-bold text-slate-900">
            <span>👨‍🏫</span>
            <span>Faculty Dashboard</span>
          </h1>
          <p className="text-slate-600">
            Monitor your teaching performance and get AI-powered insights to
            enhance student learning.
          </p>
        </div>

        {/* Profile Card */}
        <div className="mb-8">
          <FacultyProfileCard faculty={faculty} />
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <HiOutlineUsers className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Reviews
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                <HiOutlineCheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Approved</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.approved}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                <HiOutlineClock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Pending</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-500">
                <HiOutlineStar className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Avg Rating</p>
                <p className="text-2xl font-bold text-slate-900">
                  {faculty.avgRating.toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* AI Insights - Takes 2 columns */}
          <div className="space-y-8 lg:col-span-2">
            <EnhancedAIInsightsPanel faculty={faculty} />
            <RatingCategoriesAnalysis faculty={faculty} />
          </div>

          {/* Recent Reviews - Takes 1 column */}
          <div>
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-6">
                <h2 className="flex items-center space-x-2 text-xl font-bold text-slate-900">
                  <HiOutlineAcademicCap className="h-6 w-6 text-blue-600" />
                  <span>Recent Reviews</span>
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {approvedReviews.length === 0 ? (
                    <div className="py-8 text-center">
                      <span className="mb-4 block text-4xl">📝</span>
                      <h3 className="mb-2 text-lg font-semibold text-slate-900">
                        No reviews yet
                      </h3>
                      <p className="text-slate-600">
                        Your approved reviews will appear here.
                      </p>
                      <a
                        href={`/reviews/${faculty.id}`}
                        className="mt-4 inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-700"
                      >
                        <span>View All Reviews</span>
                      </a>
                    </div>
                  ) : (
                    <>
                      {approvedReviews.slice(0, 3).map((review) => (
                        <CompactReviewCard
                          key={review.id}
                          review={review}
                          faculty={faculty}
                        />
                      ))}
                      {approvedReviews.length > 3 && (
                        <div className="pt-4 text-center">
                          <a
                            href={`/reviews/${faculty.id}`}
                            className="inline-flex items-center space-x-2 font-medium text-blue-600 transition-colors duration-200 hover:text-blue-800"
                          >
                            <span>
                              View All {approvedReviews.length} Reviews
                            </span>
                            <span>→</span>
                          </a>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FacultyDashboard: React.FC = () => {
  return (
    <AppProvider>
      <FacultyDashboardContent />
    </AppProvider>
  );
};

export default FacultyDashboard;
