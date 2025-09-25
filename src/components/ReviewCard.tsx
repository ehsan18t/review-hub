import { useApp } from "@/contexts/AppContext";
import type { Faculty, Review } from "@/data/mockData";
import { getDisputeByReviewId, getFacultyById } from "@/data/mockData";
import React from "react";
import {
  HiOutlineAcademicCap,
  HiOutlineCalendar,
  HiOutlineCheck,
  HiOutlineClock,
  HiOutlineEye,
  HiOutlineStar,
  HiOutlineUserCircle,
  HiOutlineX,
  HiStar,
} from "react-icons/hi";
import {
  HiHandThumbDown,
  HiHandThumbUp,
  HiOutlineExclamationTriangle,
  HiOutlineHandThumbDown,
  HiOutlineHandThumbUp,
} from "react-icons/hi2";

interface ReviewCardProps {
  review: Review;
  faculty?: Faculty;
  showActions?: boolean;
  showDisputeActions?: boolean;
  onApprove?: (reviewId: string) => void;
  onReject?: (reviewId: string) => void;
  onViewFull?: () => void;
  onDispute?: (reviewId: string) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  faculty,
  showActions = false,
  showDisputeActions = false,
  onApprove,
  onReject,
  onViewFull,
  onDispute,
}) => {
  const { currentUser } = useApp();
  const facultyInfo = faculty || getFacultyById(review.facultyId);
  const dispute = getDisputeByReviewId(review.id);

  // Mock vote state - in a real app, this would come from the backend
  const [userVote, setUserVote] = React.useState<"up" | "down" | null>(null);
  const [upvotes, setUpvotes] = React.useState(review?.upvotes || 0);
  const [downvotes, setDownvotes] = React.useState(review?.downvotes || 0);

  const handleVote = (voteType: "up" | "down") => {
    if (!currentUser) return;

    if (userVote === voteType) {
      // Remove vote
      setUserVote(null);
      if (voteType === "up") {
        setUpvotes((prev) => prev - 1);
      } else {
        setDownvotes((prev) => prev - 1);
      }
    } else {
      // Add or change vote
      if (userVote === "up") {
        setUpvotes((prev) => prev - 1);
      } else if (userVote === "down") {
        setDownvotes((prev) => prev - 1);
      }

      setUserVote(voteType);
      if (voteType === "up") {
        setUpvotes((prev) => prev + 1);
      } else {
        setDownvotes((prev) => prev + 1);
      }
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i}>
            {i < rating ? (
              <HiStar className="h-4 w-4 text-amber-400" />
            ) : (
              <HiOutlineStar className="h-4 w-4 text-slate-300" />
            )}
          </span>
        ))}
      </div>
    );
  };

  const getStatusBadge = (status: Review["status"]) => {
    const statusConfig = {
      pending: {
        color: "bg-amber-50 text-amber-700 border-amber-200",
        text: "⏳ Pending Review",
        icon: HiOutlineClock,
      },
      approved: {
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        text: "✅ Approved",
        icon: HiOutlineCheck,
      },
      rejected: {
        color: "bg-red-50 text-red-700 border-red-200",
        text: "❌ Rejected",
        icon: HiOutlineX,
      },
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <div
        className={`inline-flex items-center space-x-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${config.color}`}
      >
        <IconComponent className="h-3 w-3" />
        <span>{config.text}</span>
      </div>
    );
  };

  const getDisputeBadge = () => {
    if (!dispute) return null;

    const disputeConfig = {
      pending: {
        color: "bg-orange-50 text-orange-700 border-orange-200",
        text: "🔍 Under Dispute",
      },
      approved: {
        color: "bg-red-50 text-red-700 border-red-200",
        text: "⚠️ Dispute Upheld",
      },
      rejected: {
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        text: "✅ Dispute Rejected",
      },
    };

    const config = disputeConfig[dispute.status];

    return (
      <div
        className={`inline-flex items-center space-x-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${config.color}`}
      >
        <HiOutlineExclamationTriangle className="h-3 w-3" />
        <span>{config.text}</span>
      </div>
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div className="min-w-0 flex-1">
          {/* Faculty Info */}
          {facultyInfo && (
            <div className="mb-3 flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                <HiOutlineAcademicCap className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-lg font-bold text-slate-900 transition-colors duration-200 group-hover:text-blue-600">
                  {facultyInfo.name}
                </h4>
                <p className="text-sm text-slate-600">
                  {facultyInfo.department}
                </p>
              </div>
            </div>
          )}

          {/* Course & Rating */}
          <div className="mb-3 space-y-2">
            {review.subject && (
              <div className="inline-flex items-center space-x-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
                <HiOutlineAcademicCap className="h-3 w-3" />
                <span>{review.subject}</span>
              </div>
            )}

            <div className="flex items-center space-x-3">
              {renderStars(review.rating)}
              <span className="text-sm font-bold text-slate-900">
                {review.rating}/5
              </span>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <div className="flex items-center space-x-1">
              <HiOutlineCalendar className="h-3 w-3" />
              <span>
                {review.semester} {review.year}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <HiOutlineUserCircle className="h-3 w-3" />
              <span>{review.isAnonymous ? "Anonymous" : "Public"}</span>
            </div>
            <div className="flex items-center space-x-1">
              <HiOutlineClock className="h-3 w-3" />
              <span>{formatDate(review.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex-shrink-0 space-y-2">
          {getStatusBadge(review.status)}
          {getDisputeBadge()}
        </div>
      </div>

      {/* Review Content */}
      <div className="mb-5">
        <div
          className={`rounded-lg border p-4 ${
            dispute && dispute.status === "approved"
              ? "border-red-200 bg-red-50"
              : "border-slate-100 bg-slate-50"
          }`}
        >
          <p className="text-sm leading-relaxed text-slate-700">
            {review.comment.length > 200 && !onViewFull
              ? `${review.comment.slice(0, 200)}...`
              : review.comment}
          </p>
          {dispute && dispute.status === "approved" && (
            <div className="mt-3 rounded-md border border-red-200 bg-red-100 p-3">
              <p className="text-xs font-medium text-red-700">
                ⚠️ This review has been disputed and marked for removal by
                administration.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* View Full Button */}
          {onViewFull && (
            <button
              onClick={onViewFull}
              className="inline-flex items-center space-x-1.5 rounded-lg px-2 py-1 text-sm font-medium text-blue-600 transition-colors duration-200 hover:text-blue-800 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            >
              <HiOutlineEye className="h-4 w-4" />
              <span>View Full</span>
            </button>
          )}

          {/* Dispute Actions for Faculty */}
          {showDisputeActions &&
            currentUser?.role === "faculty" &&
            currentUser.id === review.facultyId &&
            review.status === "approved" &&
            !dispute && (
              <button
                onClick={() => onDispute?.(review.id)}
                className="inline-flex items-center space-x-1.5 rounded-lg border-2 border-orange-300 bg-white px-3 py-2 text-sm font-semibold text-orange-700 transition-all duration-200 hover:scale-105 hover:border-orange-400 hover:bg-orange-50 hover:shadow-sm focus:ring-2 focus:ring-orange-200 focus:outline-none"
              >
                <HiOutlineExclamationTriangle className="h-4 w-4" />
                <span>Dispute</span>
              </button>
            )}

          {/* Dispute Status for Students */}
          {dispute &&
            currentUser?.role === "student" &&
            currentUser.id === review.studentId && (
              <a
                href={`/dispute/${dispute.id}`}
                className="inline-flex items-center space-x-1.5 rounded-lg border-2 border-blue-300 bg-white px-3 py-2 text-sm font-semibold text-blue-700 transition-all duration-200 hover:scale-105 hover:border-blue-400 hover:bg-blue-50 hover:shadow-sm focus:ring-2 focus:ring-blue-200 focus:outline-none"
              >
                <HiOutlineEye className="h-4 w-4" />
                <span>View Dispute</span>
              </a>
            )}

          {/* Vote Buttons */}
          {currentUser && review.status === "approved" && (
            <div className="flex items-center space-x-1 border-l border-slate-200 pl-3">
              <button
                onClick={() => handleVote("up")}
                className={`inline-flex cursor-pointer items-center space-x-1 rounded-lg px-2 py-1 text-sm font-medium transition-all duration-200 focus:ring-2 focus:outline-none ${
                  userVote === "up"
                    ? "bg-emerald-100 text-emerald-700 focus:ring-emerald-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-emerald-600 focus:ring-slate-200"
                }`}
                disabled={!currentUser}
              >
                {userVote === "up" ? (
                  <HiHandThumbUp className="h-4 w-4" />
                ) : (
                  <HiOutlineHandThumbUp className="h-4 w-4" />
                )}
                <span>{upvotes}</span>
              </button>

              <button
                onClick={() => handleVote("down")}
                className={`inline-flex cursor-pointer items-center space-x-1 rounded-lg px-2 py-1 text-sm font-medium transition-all duration-200 focus:ring-2 focus:outline-none ${
                  userVote === "down"
                    ? "bg-red-100 text-red-700 focus:ring-red-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-red-600 focus:ring-slate-200"
                }`}
                disabled={!currentUser}
              >
                {userVote === "down" ? (
                  <HiHandThumbDown className="h-4 w-4" />
                ) : (
                  <HiOutlineHandThumbDown className="h-4 w-4" />
                )}
                <span>{downvotes}</span>
              </button>
            </div>
          )}
        </div>

        {/* Admin Actions */}
        {showActions && review.status === "pending" && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onReject?.(review.id)}
              className="inline-flex items-center space-x-1.5 rounded-lg border-2 border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition-all duration-200 hover:scale-105 hover:border-red-400 hover:bg-red-50 hover:shadow-sm focus:ring-2 focus:ring-red-200 focus:outline-none"
            >
              <HiOutlineX className="h-4 w-4" />
              <span>Reject</span>
            </button>
            <button
              onClick={() => onApprove?.(review.id)}
              className="inline-flex items-center space-x-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-emerald-700 hover:shadow-md focus:ring-2 focus:ring-emerald-200 focus:outline-none"
            >
              <HiOutlineCheck className="h-4 w-4" />
              <span>Approve</span>
            </button>
          </div>
        )}

        {/* Already Processed Status */}
        {showActions && review.status !== "pending" && (
          <div>
            <span className="text-xs text-slate-500">
              {review.status === "approved"
                ? "✅ Already approved"
                : "❌ Already rejected"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
