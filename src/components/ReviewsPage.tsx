import { AppProvider, useApp } from "@/contexts/AppContext";
import { mockFaculty, mockReviews, type Faculty } from "@/data/mockData";
import React, { useEffect, useState } from "react";
import Navigation from "./Navigation";

interface ReviewsPageProps {
  facultyId: string;
}

const ReviewsPageContent: React.FC<{ faculty: Faculty }> = ({ faculty }) => {
  const { currentUser, spendReviewCredit } = useApp();
  const [hasAccess, setHasAccess] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "rating">(
    "newest",
  );

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

  // Get reviews for this faculty
  const allFacultyReviews = mockReviews.filter(
    (review) => review.facultyId === faculty.id,
  );

  // Filter reviews based on user role
  const getVisibleReviews = () => {
    if (!currentUser) return [];

    // Students can only see approved reviews
    if (currentUser.role === "student") {
      return allFacultyReviews.filter((review) => review.status === "approved");
    }

    // Faculty and admins can see all reviews
    return allFacultyReviews;
  };

  const facultyReviews = getVisibleReviews();

  // Check if user should see access gate
  const shouldShowAccessGate = () => {
    if (!currentUser) return true;
    return currentUser.role === "student" && !hasAccess;
  };

  const sortedReviews = [...facultyReviews].sort((a, b) => {
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <a
            href="/"
            className="transition-colors duration-200 hover:text-blue-600"
          >
            Home
          </a>
          <span>→</span>
          <a
            href="/faculty"
            className="transition-colors duration-200 hover:text-blue-600"
          >
            Browse Faculty
          </a>
          <span>→</span>
          <span className="text-slate-900">{faculty.name}</span>
        </div>
      </nav>

      {/* Faculty Header */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="mb-2 text-3xl font-bold text-slate-900">
              {faculty.name}
            </h1>
            <p className="mb-4 text-lg text-slate-600">
              {faculty.position} • {faculty.department}
            </p>
            {faculty.bio && (
              <p className="mb-4 leading-relaxed text-slate-700">
                {faculty.bio}
              </p>
            )}

            {/* Rating Section */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span
                  className={`text-2xl ${
                    shouldShowAccessGate() ? "text-slate-400" : "text-amber-500"
                  }`}
                >
                  {displayRating.stars}
                </span>
                <span
                  className={`text-xl font-bold ${
                    shouldShowAccessGate() ? "text-slate-400" : "text-slate-900"
                  }`}
                >
                  {displayRating.average}
                </span>
                <span
                  className={`${
                    shouldShowAccessGate() ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  ({displayRating.count}{" "}
                  {displayRating.count === "1" ? "review" : "reviews"})
                </span>
              </div>

              {shouldShowAccessGate() && (
                <div className="flex items-center space-x-2 rounded-full bg-amber-100 px-3 py-1 text-sm">
                  <span>🔒</span>
                  <span className="font-medium text-amber-700">
                    Unlock to see ratings
                  </span>
                </div>
              )}
            </div>
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
          {/* Controls */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="mb-2 text-xl font-bold text-slate-900">
                  {currentUser?.role === "student"
                    ? `📚 Student Reviews (${facultyReviews.length})`
                    : `📋 All Reviews (${facultyReviews.length})`}
                </h2>
                <p className="text-slate-600">
                  {currentUser?.role === "student"
                    ? `Showing approved reviews for ${faculty.name}`
                    : `Showing all reviews for ${faculty.name}`}
                  {currentUser?.role === "admin" &&
                    facultyReviews.length > 0 && (
                      <span className="ml-2 text-sm font-medium text-blue-600">
                        • You can manage reviews below
                      </span>
                    )}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="sort"
                    className="text-sm font-medium text-slate-700"
                  >
                    Sort by:
                  </label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm transition-all duration-200 hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          {sortedReviews.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-900">
                No reviews yet
              </h3>
              <p className="mb-6 text-slate-600">
                Be the first to write a review for {faculty.name}!
              </p>
              <a
                href={`/review/${faculty.id}`}
                className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-md focus:ring-4 focus:ring-blue-200 focus:outline-none"
              >
                <span>✍️</span>
                <span>Write the First Review</span>
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedReviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md"
                >
                  {/* Review Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <div className="mb-2 flex items-center space-x-2">
                        <span className="text-lg text-amber-500">
                          {getRatingStars(review.rating)}
                        </span>
                        <span className="font-bold text-slate-900">
                          {review.rating}/5
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        {review.subject && (
                          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                            📚 {review.subject}
                          </span>
                        )}
                        <span>{formatDate(review.createdAt)}</span>
                        {review.isAnonymous && (
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                            👤 Anonymous
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Only show status to faculty and admins */}
                      {currentUser?.role !== "student" && (
                        <div
                          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                            review.status === "approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : review.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {review.status === "approved" && "✅"}
                          {review.status === "rejected" && "❌"}
                          {review.status === "pending" && "⏳"}
                          {review.status}
                        </div>
                      )}

                      {currentUser?.role === "admin" && (
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                "Are you sure you want to remove this review?",
                              )
                            ) {
                              alert(
                                `Review ${review.id} would be removed (demo)`,
                              );
                            }
                          }}
                          className="rounded-lg border border-red-300 px-3 py-1 text-xs font-medium text-red-600 transition-all duration-200 hover:bg-red-50 hover:text-red-800 focus:ring-2 focus:ring-red-200 focus:outline-none"
                        >
                          🗑️ Remove
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="space-y-3">
                    <div>
                      <p className="leading-relaxed text-slate-700">
                        {review.comment}
                      </p>
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-600">📅 Semester:</span>
                        <span className="font-medium text-slate-900">
                          {review.semester} {review.year}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-600">🆔 Review ID:</span>
                        <span className="font-mono text-xs text-slate-500">
                          #{review.id}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
