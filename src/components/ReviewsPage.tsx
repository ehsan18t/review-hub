import { AppProvider, useApp } from "@/contexts/AppContext";
import {
  getDisputeByReviewId,
  mockFaculty,
  mockReviews,
  type Faculty,
  type Review,
} from "@/data/mockData";
import React, { useEffect, useState } from "react";
import {
  HiOutlineAdjustments,
  HiOutlineBookOpen,
  HiOutlineCheckCircle,
  HiOutlineChevronDown,
  HiOutlineClock,
  HiOutlineSparkles,
  HiOutlineUsers,
  HiOutlineXCircle,
} from "react-icons/hi";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import Navigation from "./Navigation";
import ReviewCard from "./ReviewCard";

interface ReviewsPageProps {
  facultyId: string;
}

const ReviewsPageContent: React.FC<{ faculty: Faculty }> = ({ faculty }) => {
  const { currentUser, spendReviewCredit, createDispute } = useApp();
  const [hasAccess, setHasAccess] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "rating">(
    "newest",
  );
  const [filterBy, setFilterBy] = useState<
    "all" | "approved" | "pending" | "rejected"
  >("all");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string>("");
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeEvidence, setDisputeEvidence] = useState("");

  // Initialize reviews from mock data
  useEffect(() => {
    const allFacultyReviews = mockReviews.filter(
      (review) => review.facultyId === faculty.id,
    );
    setReviews(allFacultyReviews);
  }, [faculty.id]);

  // Initialize access status from localStorage
  useEffect(() => {
    if (currentUser?.role === "student") {
      const unlockedFaculty = JSON.parse(
        localStorage.getItem("unlockedFaculty") || "[]",
      );
      const facultyKey = `${currentUser.id}_${faculty.id}`;
      setHasAccess(unlockedFaculty.includes(facultyKey));
    } else {
      // Faculty and admins always have access
      setHasAccess(true);
    }
  }, [currentUser, faculty.id]);

  // Get reviews based on user role and filters
  const getVisibleReviews = () => {
    if (!currentUser) return [];

    let filteredReviews = reviews;

    // Role-based filtering
    if (currentUser.role === "student") {
      // Students can only see approved reviews
      filteredReviews = reviews.filter(
        (review) => review.status === "approved",
      );
    } else {
      // Faculty and admins can see all reviews, but apply status filter
      if (filterBy !== "all") {
        filteredReviews = reviews.filter(
          (review) => review.status === filterBy,
        );
      }
    }

    return filteredReviews;
  };

  const visibleReviews = getVisibleReviews();

  // Handle admin actions
  const handleApprove = (reviewId: string) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === reviewId
          ? { ...review, status: "approved" as const }
          : review,
      ),
    );
  };

  const handleReject = (reviewId: string) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === reviewId
          ? { ...review, status: "rejected" as const }
          : review,
      ),
    );
  };

  // Handle faculty dispute
  const handleDispute = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setShowDisputeModal(true);
  };

  // Fixed createDispute call to match AppContext interface
  const handleSubmitDispute = () => {
    if (disputeReason.trim() && selectedReviewId && currentUser) {
      const review = reviews.find((r) => r.id === selectedReviewId);
      if (review) {
        createDispute({
          reviewId: selectedReviewId,
          facultyId: currentUser.id,
          studentId: review.studentId,
          status: "pending",
          facultyReason: disputeReason,
          facultyEvidence: disputeEvidence,
        });
        setShowDisputeModal(false);
        setDisputeReason("");
        setDisputeEvidence("");
        setSelectedReviewId("");
      }
    }
  };

  // Check if user should see access gate
  const shouldShowAccessGate = () => {
    if (!currentUser) return true;
    return currentUser.role === "student" && !hasAccess;
  };

  const sortedReviews = [...visibleReviews].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const handleUnlockReviews = () => {
    if (currentUser && currentUser.reviewCredits > 0) {
      if (spendReviewCredit()) {
        setHasAccess(true);

        // Store unlock status in localStorage
        const unlockedFaculty = JSON.parse(
          localStorage.getItem("unlockedFaculty") || "[]",
        );
        const facultyKey = `${currentUser.id}_${faculty.id}`;

        if (!unlockedFaculty.includes(facultyKey)) {
          unlockedFaculty.push(facultyKey);
          localStorage.setItem(
            "unlockedFaculty",
            JSON.stringify(unlockedFaculty),
          );
        }
      }
    }
  };

  const getRatingStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  // Show locked rating for students without access
  const getDisplayRating = () => {
    if (shouldShowAccessGate()) {
      return {
        stars: "🔒🔒🔒🔒🔒",
        average: "?",
        count: "?",
      };
    }

    return {
      stars: getRatingStars(Math.round(faculty.avgRating)),
      average: faculty.avgRating.toFixed(1),
      count: faculty.totalReviews.toString(),
    };
  };

  const displayRating = getDisplayRating();

  // Get review stats for admin
  const getReviewStats = () => {
    const pending = reviews.filter((r) => r.status === "pending").length;
    const approved = reviews.filter((r) => r.status === "approved").length;
    const rejected = reviews.filter((r) => r.status === "rejected").length;

    return { pending, approved, rejected, total: reviews.length };
  };

  const stats = getReviewStats();

  // Check if current user can dispute reviews for this faculty
  const canDisputeReviews = () => {
    const result =
      currentUser?.role === "faculty" && currentUser.id === faculty.id;
    console.log("Checking dispute permissions:", {
      currentUserId: currentUser?.id,
      currentUserRole: currentUser?.role,
      facultyId: faculty.id,
      idsMatch: currentUser?.id === faculty.id,
      roleMatch: currentUser?.role === "faculty",
      canDispute: result,
    });
    return result;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <a
            href="/"
            className="transition-colors duration-200 hover:text-blue-600"
          >
            🏠 Home
          </a>
          <span>→</span>
          <a
            href="/faculty"
            className="transition-colors duration-200 hover:text-blue-600"
          >
            👨‍🏫 Browse Faculty
          </a>
          <span>→</span>
          <span className="text-slate-900">{faculty.name}</span>
        </div>
      </nav>

      {/* Faculty Header */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-4 flex items-center space-x-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                <span className="text-2xl font-bold">
                  {faculty.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </span>
              </div>
              <div>
                <h1 className="mb-2 text-3xl font-bold text-slate-900">
                  {faculty.name}
                </h1>
                <p className="mb-2 text-lg text-slate-600">
                  {faculty.position} • {faculty.department}
                </p>
                <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  <HiOutlineBookOpen className="mr-1 h-3 w-3" />
                  {faculty.department}
                </div>
              </div>
            </div>

            {faculty.bio && (
              <p className="mb-4 leading-relaxed text-slate-700">
                {faculty.bio}
              </p>
            )}

            {/* Rating Section */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <span
                  className={`text-2xl ${
                    shouldShowAccessGate() ? "text-slate-400" : "text-amber-500"
                  }`}
                >
                  {displayRating.stars}
                </span>
                <div>
                  <span
                    className={`text-xl font-bold ${
                      shouldShowAccessGate()
                        ? "text-slate-400"
                        : "text-slate-900"
                    }`}
                  >
                    {displayRating.average}
                  </span>
                  <span
                    className={`ml-2 text-sm ${
                      shouldShowAccessGate()
                        ? "text-slate-400"
                        : "text-slate-600"
                    }`}
                  >
                    ({displayRating.count}{" "}
                    {displayRating.count === "1" ? "review" : "reviews"})
                  </span>
                </div>
              </div>

              {shouldShowAccessGate() && (
                <div className="flex items-center space-x-2 rounded-full border border-amber-200 bg-amber-100 px-4 py-2 text-sm">
                  <span>🔒</span>
                  <span className="font-medium text-amber-700">
                    Unlock to see ratings
                  </span>
                </div>
              )}
            </div>

            {/* Admin Stats */}
            {currentUser?.role === "admin" && !shouldShowAccessGate() && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
                  <div className="text-lg font-bold text-slate-900">
                    {stats.total}
                  </div>
                  <div className="flex items-center justify-center text-xs text-slate-600">
                    <HiOutlineUsers className="mr-1 h-3 w-3" />
                    Total
                  </div>
                </div>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-center">
                  <div className="text-lg font-bold text-amber-700">
                    {stats.pending}
                  </div>
                  <div className="flex items-center justify-center text-xs text-amber-600">
                    <HiOutlineClock className="mr-1 h-3 w-3" />
                    Pending
                  </div>
                </div>
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-center">
                  <div className="text-lg font-bold text-emerald-700">
                    {stats.approved}
                  </div>
                  <div className="flex items-center justify-center text-xs text-emerald-600">
                    <HiOutlineCheckCircle className="mr-1 h-3 w-3" />
                    Approved
                  </div>
                </div>
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center">
                  <div className="text-lg font-bold text-red-700">
                    {stats.rejected}
                  </div>
                  <div className="flex items-center justify-center text-xs text-red-600">
                    <HiOutlineXCircle className="mr-1 h-3 w-3" />
                    Rejected
                  </div>
                </div>
              </div>
            )}

            {/* Faculty Info Banner - Show when faculty is viewing their own reviews */}
            {canDisputeReviews() && !shouldShowAccessGate() && (
              <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">📝</span>
                  <p className="text-sm font-medium text-blue-800">
                    You're viewing your own reviews. You can dispute any
                    approved reviews that you believe are inappropriate or
                    incorrect.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex-shrink-0">
            {currentUser?.role === "student" && (
              <a
                href={`/review/${faculty.id}`}
                className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-md focus:ring-4 focus:ring-blue-200 focus:outline-none"
              >
                <span>📝</span>
                <span>Write Review</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {shouldShowAccessGate() ? (
        // Access Gate
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 shadow-sm">
            <span className="text-4xl">🔒</span>
          </div>

          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            Unlock Reviews for {faculty.name}
          </h2>
          <p className="mx-auto mb-6 max-w-2xl leading-relaxed text-slate-600">
            To view detailed reviews and ratings for {faculty.name}, you need to
            spend 1 Review Credit. Write reviews to earn more credits!
          </p>

          <div className="mb-8">
            <div className="mb-4 flex items-center justify-center space-x-2 text-sm text-slate-600">
              <span>Your balance:</span>
              <div className="flex items-center space-x-1 rounded-full bg-emerald-100 px-3 py-1.5 font-semibold text-emerald-800 shadow-sm">
                <span>💰</span>
                <span>{currentUser?.reviewCredits || 0} RC</span>
              </div>
            </div>

            {currentUser && currentUser.reviewCredits > 0 ? (
              <button
                onClick={handleUnlockReviews}
                className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-md focus:ring-4 focus:ring-blue-200 focus:outline-none"
              >
                <span className="flex items-center space-x-2">
                  <span>💰</span>
                  <span>Spend 1 Credit to View Reviews</span>
                </span>
              </button>
            ) : (
              <div>
                <p className="mb-4 font-medium text-red-600">
                  💸 Insufficient credits
                </p>
                <a
                  href="/faculty"
                  className="inline-block rounded-lg bg-slate-600 px-8 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-slate-700 hover:shadow-md focus:ring-4 focus:ring-slate-200 focus:outline-none"
                >
                  <span className="flex items-center space-x-2">
                    <span>📝</span>
                    <span>Browse Faculty to Write Reviews</span>
                  </span>
                </a>
              </div>
            )}
          </div>

          {/* Preview Info */}
          <div className="mx-auto max-w-2xl rounded-lg border border-slate-200 bg-slate-50 p-6">
            <h3 className="mb-3 font-bold text-slate-900">
              🎯 What you'll unlock:
            </h3>
            <div className="grid gap-4 text-sm text-slate-600 md:grid-cols-2">
              <div className="flex items-center space-x-2">
                <span>📝</span>
                <span>Detailed written reviews</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>⭐</span>
                <span>Individual ratings & overall score</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📚</span>
                <span>Course-specific feedback</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>👤</span>
                <span>Anonymous student experiences</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Reviews Content
        <div className="space-y-6">
          {/* Enhanced Controls */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="mb-2 flex items-center space-x-2 text-xl font-bold text-slate-900">
                  <HiOutlineSparkles className="h-5 w-5 text-blue-600" />
                  <span>
                    {currentUser?.role === "student"
                      ? `📚 Student Reviews (${sortedReviews.length})`
                      : `📋 All Reviews (${sortedReviews.length})`}
                  </span>
                </h2>
                <p className="text-slate-600">
                  {currentUser?.role === "student"
                    ? `Showing approved reviews for ${faculty.name}`
                    : currentUser?.role === "admin"
                      ? `Managing all reviews for ${faculty.name}`
                      : canDisputeReviews()
                        ? `Showing all reviews for you. You can dispute approved reviews.`
                        : `Showing all reviews for ${faculty.name}`}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* Sort Control */}
              <div className="flex items-center space-x-2">
                <HiOutlineAdjustments className="h-4 w-4 text-slate-500" />
                <label
                  htmlFor="sort"
                  className="text-sm font-medium text-slate-700"
                >
                  Sort by:
                </label>
                <div className="relative">
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none rounded-lg border border-slate-300 bg-white py-2 pr-8 pl-3 text-sm transition-all duration-200 hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <HiOutlineChevronDown className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                </div>
              </div>

              {/* Admin/Faculty Filter Control */}
              {(currentUser?.role === "admin" || canDisputeReviews()) && (
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="filter"
                    className="text-sm font-medium text-slate-700"
                  >
                    Filter:
                  </label>
                  <div className="relative">
                    <select
                      id="filter"
                      value={filterBy}
                      onChange={(e) => setFilterBy(e.target.value as any)}
                      className="appearance-none rounded-lg border border-slate-300 bg-white py-2 pr-8 pl-3 text-sm transition-all duration-200 hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    >
                      <option value="all">All Reviews</option>
                      <option value="pending">⏳ Pending</option>
                      <option value="approved">✅ Approved</option>
                      <option value="rejected">❌ Rejected</option>
                    </select>
                    <HiOutlineChevronDown className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reviews List */}
          {sortedReviews.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-900">
                {filterBy === "all"
                  ? "No reviews yet"
                  : `No ${filterBy} reviews`}
              </h3>
              <p className="mb-6 text-slate-600">
                {filterBy === "all"
                  ? `Be the first to write a review for ${faculty.name}!`
                  : `No ${filterBy} reviews found for ${faculty.name}.`}
              </p>
              {currentUser?.role === "student" && filterBy === "all" && (
                <a
                  href={`/review/${faculty.id}`}
                  className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-md focus:ring-4 focus:ring-blue-200 focus:outline-none"
                >
                  <span>✍️</span>
                  <span>Write the First Review</span>
                </a>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {sortedReviews.map((review) => {
                const existingDispute = getDisputeByReviewId(review.id);
                const canDispute =
                  canDisputeReviews() &&
                  review.status === "approved" &&
                  !existingDispute;

                console.log("Review dispute check:", {
                  reviewId: review.id,
                  canDisputeReviews: canDisputeReviews(),
                  status: review.status,
                  existingDispute: !!existingDispute,
                  canDispute,
                });

                return (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    faculty={faculty}
                    showActions={currentUser?.role === "admin"}
                    showDisputeActions={canDispute}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onDispute={handleDispute}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-600 text-white">
                <HiOutlineExclamationTriangle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  🚨 Dispute Review
                </h2>
                <p className="text-sm text-slate-600">
                  Please provide a reason and evidence for disputing this review
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Reason for Dispute *
                </label>
                <textarea
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  rows={3}
                  placeholder="Explain why you believe this review should be removed (e.g., false claims, inappropriate content, etc.)"
                  className="w-full resize-none rounded-lg border-2 border-slate-300 px-4 py-3 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Supporting Evidence (Optional)
                </label>
                <textarea
                  value={disputeEvidence}
                  onChange={(e) => setDisputeEvidence(e.target.value)}
                  rows={4}
                  placeholder="Provide any additional evidence or documentation to support your dispute"
                  className="w-full resize-none rounded-lg border-2 border-slate-300 px-4 py-3 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDisputeModal(false);
                  setDisputeReason("");
                  setDisputeEvidence("");
                  setSelectedReviewId("");
                }}
                className="rounded-lg border-2 border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitDispute}
                disabled={!disputeReason.trim()}
                className="rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                🚨 Submit Dispute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="mt-8 text-center">
        <a
          href="/faculty"
          className="inline-flex items-center space-x-2 font-medium text-blue-600 transition-colors duration-200 hover:text-blue-800"
        >
          <span>←</span>
          <span>Back to Browse Faculty</span>
        </a>
      </div>
    </div>
  );
};

const ReviewsPage: React.FC<ReviewsPageProps> = ({ facultyId }) => {
  const faculty = mockFaculty.find((f) => f.id === facultyId);

  if (!faculty) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
            <span className="text-4xl">❌</span>
          </div>
          <h1 className="mb-4 text-3xl font-bold text-slate-900">
            Faculty Not Found
          </h1>
          <p className="mb-8 text-slate-600">
            The faculty member you're looking for doesn't exist.
          </p>
          <a
            href="/faculty"
            className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-md focus:ring-4 focus:ring-blue-200 focus:outline-none"
          >
            <span>📚</span>
            <span>Browse All Faculty</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <ReviewsPageContent faculty={faculty} />
      </div>
    </AppProvider>
  );
};

export default ReviewsPage;
