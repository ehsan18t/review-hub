import type { Faculty } from "@/data/mockData";
import React from "react";

interface FacultyCardProps {
  faculty: Faculty;
  onViewReviews?: () => void;
  onWriteReview?: () => void;
  showActions?: boolean;
}

const FacultyCard: React.FC<FacultyCardProps> = ({
  faculty,
  onViewReviews,
  onWriteReview,
  showActions = true,
}) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">
          ★
        </span>,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">
          ☆
        </span>,
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">
          ★
        </span>,
      );
    }

    return stars;
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
      {/* Header */}
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-xl font-bold text-white">
          {faculty.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-gray-900">
            {faculty.name}
          </h3>
          <p className="text-sm text-gray-600">{faculty.position}</p>
          <p className="text-sm font-medium text-blue-600">
            {faculty.department}
          </p>
        </div>
      </div>

      {/* Bio */}
      {faculty.bio && (
        <p className="mt-4 line-clamp-3 text-sm text-gray-700">{faculty.bio}</p>
      )}

      {/* Rating */}
      <div className="mt-4 flex items-center space-x-2">
        <div className="flex items-center">
          {renderStars(faculty.avgRating)}
        </div>
        <span className="text-sm text-gray-600">
          {faculty.avgRating.toFixed(1)} ({faculty.totalReviews} reviews)
        </span>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="mt-6 flex space-x-3">
          <button
            onClick={onViewReviews}
            className="flex-1 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
          >
            View Reviews
          </button>
          <button
            onClick={onWriteReview}
            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Write Review
          </button>
        </div>
      )}
    </div>
  );
};

export default FacultyCard;
