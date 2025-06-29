import { AppProvider, useApp } from "@/contexts/AppContext";
import { mockFaculty, mockReviews, type Faculty } from "@/data/mockData";
import React, { useState } from "react";
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
      spendReviewCredit();
      setHasAccess(true);
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <a href="/" className="hover:text-blue-600">
            Home
          </a>
          <span>→</span>
          <a href="/faculty" className="hover:text-blue-600">
            Browse Faculty
          </a>
          <span>→</span>
          <span className="text-gray-900">{faculty.name}</span>
        </div>
      </nav>

      {/* Faculty Header */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              {faculty.name}
            </h1>
            <p className="mb-4 text-lg text-gray-600">
              {faculty.position} • {faculty.department}
            </p>
            {faculty.bio && <p className="mb-4 text-gray-700">{faculty.bio}</p>}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl text-yellow-500">
                  {getRatingStars(Math.round(faculty.avgRating))}
                </span>
                <span className="text-xl font-bold text-gray-900">
                  {faculty.avgRating.toFixed(1)}
                </span>
                <span className="text-gray-600">
                  ({faculty.totalReviews} reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            {currentUser?.role === "student" && (
              <a
                href={`/review/${faculty.id}`}
                className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
              >
                Write Review
              </a>
            )}
          </div>
        </div>
      </div>

      {shouldShowAccessGate() ? (
        // Access Gate
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-md">
          <span className="mb-6 block text-6xl">🔒</span>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">
            Unlock Reviews for {faculty.name}
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-gray-600">
            To view detailed reviews for {faculty.name}, you need to spend 1
            Review Credit. Write reviews to earn more credits!
          </p>

          <div className="mb-6">
            <div className="mb-4 flex items-center justify-center space-x-2 text-sm text-gray-600">
              <span>Your balance:</span>
              <div className="flex items-center space-x-1 rounded-full bg-green-100 px-3 py-1 text-green-800">
                <span>💰</span>
                <span>{currentUser?.reviewCredits || 0} RC</span>
              </div>
            </div>

            {currentUser && currentUser.reviewCredits > 0 ? (
              <button
                onClick={handleUnlockReviews}
                className="rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition-colors hover:bg-blue-700"
              >
                Spend 1 Credit to View Reviews
              </button>
            ) : (
              <div>
                <p className="mb-4 text-red-600">Insufficient credits</p>
                <a
                  href="/faculty"
                  className="inline-block rounded-lg bg-gray-600 px-8 py-3 font-medium text-white transition-colors hover:bg-gray-700"
                >
                  Browse Faculty to Write Reviews
                </a>
              </div>
            )}
          </div>

          {/* Preview Info */}
          <div className="mx-auto max-w-2xl rounded-lg bg-gray-50 p-6">
            <h3 className="mb-3 font-semibold text-gray-900">
              What you'll see:
            </h3>
            <div className="grid gap-4 text-sm text-gray-600 md:grid-cols-2">
              <div className="flex items-center space-x-2">
                <span>📝</span>
                <span>Detailed written reviews</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>⭐</span>
                <span>Individual ratings</span>
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
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="mb-2 text-xl font-semibold text-gray-900">
                  {currentUser?.role === "student"
                    ? `Student Reviews (${facultyReviews.length})`
                    : `All Reviews (${facultyReviews.length})`}
                </h2>
                <p className="text-gray-600">
                  {currentUser?.role === "student"
                    ? `Showing approved reviews for ${faculty.name}`
                    : `Showing all reviews for ${faculty.name}`}
                  {currentUser?.role === "admin" &&
                    facultyReviews.length > 0 && (
                      <span className="ml-2 text-sm text-blue-600">
                        • You can manage reviews below
                      </span>
                    )}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="sort"
                    className="text-sm font-medium text-gray-700"
                  >
                    Sort by:
                  </label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-md">
              <span className="mb-4 block text-4xl">📝</span>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                No reviews yet
              </h3>
              <p className="mb-6 text-gray-600">
                Be the first to write a review for {faculty.name}!
              </p>
              <a
                href={`/review/${faculty.id}`}
                className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
              >
                Write the First Review
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedReviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-md"
                >
                  {/* Review Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <div className="mb-2 flex items-center space-x-2">
                        <span className="text-lg text-yellow-500">
                          {getRatingStars(review.rating)}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {review.rating}/5
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {review.subject && (
                          <span className="mr-2 rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                            {review.subject}
                          </span>
                        )}
                        <span>{formatDate(review.createdAt)}</span>
                        {review.isAnonymous && (
                          <span className="ml-2 rounded bg-gray-100 px-2 py-1 text-xs text-gray-600">
                            Anonymous
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
                              ? "bg-green-100 text-green-800"
                              : review.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
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
                          className="rounded border border-red-300 px-2 py-1 text-xs text-red-600 hover:bg-red-50 hover:text-red-800"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="space-y-3">
                    <div>
                      <p className="leading-relaxed text-gray-700">
                        {review.comment}
                      </p>
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-3 text-sm">
                      <div>
                        <span className="text-gray-600">Semester:</span>
                        <span className="ml-1 font-medium text-gray-900">
                          {review.semester} {review.year}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Review ID:</span>
                        <span className="ml-1 font-mono text-xs text-gray-500">
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
          className="font-medium text-blue-600 hover:text-blue-800"
        >
          ← Back to Browse Faculty
        </a>
      </div>
    </div>
  );
};

const ReviewsPage: React.FC<ReviewsPageProps> = ({ facultyId }) => {
  const faculty = mockFaculty.find((f) => f.id === facultyId);

  if (!faculty) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <span className="mb-6 block text-6xl">❌</span>
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Faculty Not Found
          </h1>
          <p className="mb-8 text-gray-600">
            The faculty member you're looking for doesn't exist.
          </p>
          <a
            href="/faculty"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Browse All Faculty
          </a>
        </div>
      </div>
    );
  }

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <ReviewsPageContent faculty={faculty} />
      </div>
    </AppProvider>
  );
};

export default ReviewsPage;
