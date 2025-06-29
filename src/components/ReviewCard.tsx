import type { Faculty, Review } from "@/data/mockData";
import { getFacultyById } from "@/data/mockData";
import React from "react";

interface ReviewCardProps {
  review: Review;
  faculty?: Faculty;
  showActions?: boolean;
  onApprove?: (reviewId: string) => void;
  onReject?: (reviewId: string) => void;
  onViewFull?: () => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  faculty,
  showActions = false,
  onApprove,
  onReject,
  onViewFull,
}) => {
  const facultyInfo = faculty || getFacultyById(review.facultyId);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-300"}
      >
        ★
      </span>
    ));
  };

  const getStatusBadge = (status: Review["status"]) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", text: "Pending" },
      approved: { color: "bg-green-100 text-green-800", text: "Approved" },
      rejected: { color: "bg-red-100 text-red-800", text: "Rejected" },
    };

    const config = statusConfig[status];
    return (
      <span
        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {facultyInfo && (
            <h4 className="text-lg font-semibold text-gray-900">
              {facultyInfo.name}
            </h4>
          )}
          <p className="mb-2 text-sm text-gray-600">{review.subject}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>
              {review.semester} {review.year}
            </span>
            <span>•</span>
            <span>{review.isAnonymous ? "Anonymous" : "Public"}</span>
            <span>•</span>
            <span>{review.createdAt.toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          {getStatusBadge(review.status)}
          <div className="flex items-center">{renderStars(review.rating)}</div>
        </div>
      </div>

      {/* Comment */}
      <div className="mt-4">
        <p className="leading-relaxed text-gray-700">{review.comment}</p>
      </div>

      {/* Actions */}
      {showActions && review.status === "pending" && (
        <div className="mt-6 flex space-x-3">
          <button
            onClick={() => onReject?.(review.id)}
            className="rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
          >
            Reject
          </button>
          <button
            onClick={() => onApprove?.(review.id)}
            className="rounded-md bg-green-100 px-4 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-200"
          >
            Approve
          </button>
        </div>
      )}

      {/* View Full Button */}
      {onViewFull && (
        <div className="mt-4">
          <button
            onClick={onViewFull}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            View Full Review →
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
