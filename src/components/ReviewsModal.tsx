import { useApp } from "@/contexts/AppContext";
import { mockReviews, type Faculty } from "@/data/mockData";
import React, { useState } from "react";

interface ReviewsModalProps {
  faculty: Faculty;
  onClose: () => void;
}

const ReviewsModal: React.FC<ReviewsModalProps> = ({ faculty, onClose }) => {
  const { currentUser, spendReviewCredit } = useApp();
  const [hasAccess, setHasAccess] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "rating">(
    "newest",
  );

  // Get reviews for this faculty
  const facultyReviews = mockReviews.filter(
    (review) => review.facultyId === faculty.id,
  );

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
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Reviews for {faculty.name}
            </h2>
            <p className="mt-1 text-gray-600">
              {faculty.department} • {facultyReviews.length} reviews
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {!hasAccess ? (
            // Access Gate
            <div className="p-8 text-center">
              <span className="mb-6 block text-6xl">🔒</span>
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                Unlock Reviews
              </h3>
              <p className="mx-auto mb-6 max-w-md text-gray-600">
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
                    className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    Spend 1 Credit to View Reviews
                  </button>
                ) : (
                  <div>
                    <p className="mb-4 text-red-600">Insufficient credits</p>
                    <button
                      onClick={onClose}
                      className="rounded-lg bg-gray-600 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-700"
                    >
                      Write a Review to Earn Credits
                    </button>
                  </div>
                )}
              </div>

              {/* Preview Info */}
              <div className="mx-auto max-w-md rounded-lg bg-gray-50 p-4">
                <h4 className="mb-2 font-semibold text-gray-900">
                  What you'll see:
                </h4>
                <ul className="space-y-1 text-left text-sm text-gray-600">
                  <li>• Detailed written reviews</li>
                  <li>• Rating breakdowns by category</li>
                  <li>• Course-specific feedback</li>
                  <li>• Anonymous student experiences</li>
                </ul>
              </div>
            </div>
          ) : (
            // Reviews Content
            <div className="p-6">
              {/* Faculty Summary */}
              <div className="mb-6 rounded-lg bg-gray-50 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Overall Rating
                    </h3>
                    <div className="mt-1 flex items-center space-x-2">
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

                  <div className="text-right">
                    <div className="mb-1 text-sm text-gray-600">Sort by:</div>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="rounded-md border border-gray-300 px-3 py-1 text-sm"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                {sortedReviews.length === 0 ? (
                  <div className="py-8 text-center">
                    <span className="mb-4 block text-4xl">📝</span>
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">
                      No reviews yet
                    </h3>
                    <p className="text-gray-600">
                      Be the first to write a review for {faculty.name}!
                    </p>
                  </div>
                ) : (
                  sortedReviews.map((review) => (
                    <div
                      key={review.id}
                      className="rounded-lg border border-gray-200 bg-white p-6"
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
                          </div>
                        </div>
                      </div>

                      {/* Review Content */}
                      <div className="space-y-3">
                        <div>
                          <h4 className="mb-1 font-semibold text-gray-900">
                            Review
                          </h4>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>

                        {/* Additional Info */}
                        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-3">
                          <div className="text-center">
                            <div className="text-sm text-gray-600">
                              Semester
                            </div>
                            <div className="font-semibold text-gray-900">
                              {review.semester} {review.year}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-600">Status</div>
                            <div
                              className={`font-semibold capitalize ${
                                review.status === "approved"
                                  ? "text-green-600"
                                  : review.status === "rejected"
                                    ? "text-red-600"
                                    : "text-yellow-600"
                              }`}
                            >
                              {review.status}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {hasAccess
                ? "Thanks for using Review Credits!"
                : "Write reviews to earn credits"}
            </div>
            <button
              onClick={onClose}
              className="rounded-md bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsModal;
