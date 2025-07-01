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
    <div className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg">
      <div className="relative">
        {/* Header */}
        <div className="mb-5 flex items-start space-x-4">
          {/* Avatar */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white shadow-md transition-all duration-300 group-hover:scale-105 group-hover:bg-blue-700 group-hover:shadow-lg">
            {faculty.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <h3 className="mb-1 text-lg font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
              {faculty.name}
            </h3>
            <p className="mb-2 text-sm font-medium text-gray-600">
              {faculty.position}
            </p>
            <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 transition-colors duration-200 hover:bg-blue-200">
              {faculty.department}
            </div>
          </div>
        </div>

        {/* Bio */}
        {faculty.bio && (
          <div className="mb-5">
            <p className="line-clamp-3 text-sm leading-relaxed text-gray-700">
              {faculty.bio}
            </p>
          </div>
        )}

        {/* Rating */}
        <div className="mb-6 rounded-xl bg-gray-50 p-4 transition-colors duration-200 group-hover:bg-blue-50">
          <div className="mb-2 flex items-center space-x-2">
            <div className="flex items-center">
              {renderStars(faculty.avgRating)}
            </div>
            <span className="text-sm font-bold text-gray-900">
              {faculty.avgRating.toFixed(1)}
            </span>
          </div>
          <p className="text-xs font-medium text-gray-600">
            Based on {faculty.totalReviews} reviews
          </p>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex space-x-3">
            <button
              onClick={onViewReviews}
              className="flex-1 rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 hover:scale-105 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              View Reviews
            </button>
            <button
              onClick={onWriteReview}
              className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              Write Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyCard;
