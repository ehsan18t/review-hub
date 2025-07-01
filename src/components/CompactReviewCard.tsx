import type { Faculty, Review } from "@/data/mockData";
import { getUserById } from "@/data/mockData";
import React from "react";
import {
  HiOutlineAcademicCap,
  HiOutlineCalendar,
  HiOutlineStar,
  HiOutlineUser,
  HiStar,
} from "react-icons/hi";

interface CompactReviewCardProps {
  review: Review;
  faculty: Faculty;
}

const CompactReviewCard: React.FC<CompactReviewCardProps> = ({
  review,
  faculty,
}) => {
  const student = getUserById(review.studentId);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-emerald-600";
    if (rating >= 3.5) return "text-blue-600";
    if (rating >= 2.5) return "text-amber-600";
    return "text-red-600";
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
            {review.isAnonymous ? (
              <HiOutlineUser className="h-4 w-4 text-blue-600" />
            ) : (
              <span className="text-xs font-bold text-blue-600">
                {student?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("") || "?"}
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {review.isAnonymous
                ? "Anonymous Student"
                : student?.name || "Test Student"}
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <HiOutlineCalendar className="h-3 w-3" />
              <span>{formatDate(review.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span key={i}>
                {i < Math.floor(review.rating) ? (
                  <HiStar
                    className={`h-4 w-4 ${getRatingColor(review.rating)}`}
                  />
                ) : i === Math.floor(review.rating) &&
                  review.rating % 1 !== 0 ? (
                  <div className="relative">
                    <HiOutlineStar className="h-4 w-4 text-slate-300" />
                    <div className="absolute inset-0 w-1/2 overflow-hidden">
                      <HiStar
                        className={`h-4 w-4 ${getRatingColor(review.rating)}`}
                      />
                    </div>
                  </div>
                ) : (
                  <HiOutlineStar className="h-4 w-4 text-slate-300" />
                )}
              </span>
            ))}
          </div>
          <span
            className={`text-sm font-bold ${getRatingColor(review.rating)}`}
          >
            {review.rating}
          </span>
        </div>
      </div>

      {/* Course Info */}
      <div className="mb-3 flex items-center space-x-2 text-sm text-slate-600">
        <HiOutlineAcademicCap className="h-4 w-4" />
        <span>{review.subject}</span>
        <span>•</span>
        <span>
          {review.semester} {review.year}
        </span>
      </div>

      {/* Comment Preview */}
      <div className="mb-2">
        <p className="text-sm leading-relaxed text-slate-700">
          {truncateText(review.comment, 120)}
        </p>
      </div>

      {/* Read More Link */}
      {review.comment.length > 120 && (
        <div className="text-right">
          <a
            href={`/reviews/${faculty.id}`}
            className="text-xs font-medium text-blue-600 transition-colors duration-200 hover:text-blue-800"
          >
            Read full review →
          </a>
        </div>
      )}
    </div>
  );
};

export default CompactReviewCard;
