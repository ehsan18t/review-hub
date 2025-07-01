import { AppProvider, useApp } from "@/contexts/AppContext";
import {
  getDisputesByStudentId,
  getFacultyById,
  mockReviews,
} from "@/data/mockData";
import React, { useState } from "react";
import {
  HiOutlineAcademicCap,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlineEye,
  HiOutlineFilter,
  HiOutlineXCircle,
} from "react-icons/hi";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import Navigation from "./Navigation";

const StudentDisputesContent: React.FC = () => {
  const { currentUser } = useApp();
  const [filterBy, setFilterBy] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  if (!currentUser || currentUser.role !== "student") {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <HiOutlineExclamationTriangle className="h-8 w-8" />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-slate-900">
            Access Denied
          </h1>
          <p className="mb-6 text-slate-600">
            You don't have permission to access this page.
          </p>
          <a
            href="/"
            className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-blue-700"
          >
            <span>Go Home</span>
          </a>
        </div>
      </div>
    );
  }

  const allDisputes = getDisputesByStudentId(currentUser.id);

  const getFilteredDisputes = () => {
    if (filterBy === "all") return allDisputes;
    return allDisputes.filter((dispute) => dispute.status === filterBy);
  };

  const filteredDisputes = getFilteredDisputes();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <div className="inline-flex items-center space-x-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            <HiOutlineClock className="h-3 w-3" />
            <span>Pending Review</span>
          </div>
        );
      case "approved":
        return (
          <div className="inline-flex items-center space-x-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            <HiOutlineCheckCircle className="h-3 w-3" />
            <span>Faculty Dispute Approved</span>
          </div>
        );
      case "rejected":
        return (
          <div className="inline-flex items-center space-x-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
            <HiOutlineXCircle className="h-3 w-3" />
            <span>Faculty Dispute Rejected</span>
          </div>
        );
      default:
        return null;
    }
  };

  const getReviewData = (reviewId: string) => {
    const review = mockReviews.find((r) => r.id === reviewId);
    if (!review) return null;
    const faculty = getFacultyById(review.facultyId);
    return { review, faculty };
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getStatusStats = () => {
    const pending = allDisputes.filter((d) => d.status === "pending").length;
    const approved = allDisputes.filter((d) => d.status === "approved").length;
    const rejected = allDisputes.filter((d) => d.status === "rejected").length;
    return { pending, approved, rejected, total: allDisputes.length };
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="flex items-center space-x-3 text-3xl font-bold text-slate-900">
            <span>🚨</span>
            <span>My Review Disputes</span>
          </h1>
          <p className="mt-2 text-slate-600">
            View and respond to faculty disputes on your reviews
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">📊</span>
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Disputes
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">⏳</span>
              <div>
                <p className="text-sm font-medium text-amber-700">Pending</p>
                <p className="text-2xl font-bold text-amber-900">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">✅</span>
              <div>
                <p className="text-sm font-medium text-red-700">Faculty Won</p>
                <p className="text-2xl font-bold text-red-900">
                  {stats.approved}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🛡️</span>
              <div>
                <p className="text-sm font-medium text-emerald-700">
                  Review Protected
                </p>
                <p className="text-2xl font-bold text-emerald-900">
                  {stats.rejected}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <HiOutlineFilter className="h-5 w-5 text-slate-500" />
            <label
              htmlFor="filter"
              className="text-sm font-medium text-slate-700"
            >
              Filter disputes:
            </label>
            <select
              id="filter"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="appearance-none rounded-lg border border-slate-300 bg-white py-2 pr-8 pl-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            >
              <option value="all">All Disputes</option>
              <option value="pending">⏳ Pending Review</option>
              <option value="approved">✅ Faculty Won</option>
              <option value="rejected">🛡️ Review Protected</option>
            </select>
          </div>
        </div>

        {/* Disputes List */}
        {filteredDisputes.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <HiOutlineAcademicCap className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900">
              {filterBy === "all"
                ? "No disputes yet"
                : `No ${filterBy} disputes`}
            </h3>
            <p className="text-slate-600">
              {filterBy === "all"
                ? "Your reviews haven't been disputed by faculty members."
                : `No disputes with ${filterBy} status found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredDisputes.map((dispute) => {
              const reviewData = getReviewData(dispute.reviewId);
              if (!reviewData) return null;

              const { review, faculty } = reviewData;
              const needsResponse =
                dispute.status === "pending" && !dispute.studentResponse;

              return (
                <div
                  key={dispute.id}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center space-x-3">
                        <h3 className="font-bold text-slate-900">
                          Dispute on {review.subject}
                        </h3>
                        {getStatusBadge(dispute.status)}
                        {needsResponse && (
                          <div className="inline-flex items-center space-x-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                            <HiOutlineExclamationTriangle className="h-3 w-3" />
                            <span>Response Needed</span>
                          </div>
                        )}
                      </div>
                      <p className="mb-2 text-sm text-slate-600">
                        Faculty: {faculty?.name} • Submitted:{" "}
                        {formatDate(dispute.createdAt)}
                      </p>
                      <div className="mb-4 rounded-lg bg-slate-50 p-4">
                        <p className="mb-2 text-sm font-semibold text-slate-700">
                          Your Original Review:
                        </p>
                        <div className="mb-2 flex items-center space-x-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-lg ${
                                  i < review.rating
                                    ? "text-amber-400"
                                    : "text-slate-300"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-slate-600">
                            ({review.rating}/5)
                          </span>
                        </div>
                        <p className="text-sm text-slate-700">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 rounded-lg border border-orange-200 bg-orange-50 p-4">
                    <p className="mb-2 text-sm font-semibold text-orange-800">
                      Faculty's Dispute Reason:
                    </p>
                    <p className="text-sm text-orange-700">
                      {dispute.facultyReason}
                    </p>
                    {dispute.facultyEvidence && (
                      <div className="mt-3 rounded bg-orange-100 p-3">
                        <p className="mb-1 text-xs font-semibold text-orange-800">
                          Evidence Provided:
                        </p>
                        <p className="text-xs text-orange-700">
                          {dispute.facultyEvidence}
                        </p>
                      </div>
                    )}
                  </div>

                  {dispute.studentResponse && (
                    <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                      <p className="mb-2 text-sm font-semibold text-blue-800">
                        Your Response:
                      </p>
                      <p className="text-sm text-blue-700">
                        {dispute.studentResponse}
                      </p>
                      {dispute.studentEvidence && (
                        <div className="mt-3 rounded bg-blue-100 p-3">
                          <p className="mb-1 text-xs font-semibold text-blue-800">
                            Your Evidence:
                          </p>
                          <p className="text-xs text-blue-700">
                            {dispute.studentEvidence}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {dispute.adminNotes && dispute.status !== "pending" && (
                    <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className="mb-2 text-sm font-semibold text-slate-700">
                        Admin Decision:
                      </p>
                      <p className="text-sm text-slate-600">
                        {dispute.adminNotes}
                      </p>
                      {dispute.resolvedAt && (
                        <p className="mt-2 text-xs text-slate-500">
                          Resolved on {formatDate(dispute.resolvedAt)}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      Last updated: {formatDate(dispute.updatedAt)}
                    </div>
                    <div className="flex items-center space-x-3">
                      <a
                        href={`/dispute/details/${dispute.id}`}
                        className="inline-flex items-center space-x-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50"
                      >
                        <HiOutlineEye className="h-4 w-4" />
                        <span>View Details</span>
                      </a>
                      {needsResponse && (
                        <a
                          href={`/dispute/response/${dispute.id}`}
                          className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-700"
                        >
                          <HiOutlineDocumentText className="h-4 w-4" />
                          <span>Respond to Dispute</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const StudentDisputes: React.FC = () => {
  return (
    <AppProvider>
      <StudentDisputesContent />
    </AppProvider>
  );
};

export default StudentDisputes;
