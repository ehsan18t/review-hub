import { AppProvider, useApp } from "@/contexts/AppContext";
import { getDisputeById, getFacultyById, mockReviews } from "@/data/mockData";
import React, { useState } from "react";
import {
  HiOutlineAcademicCap,
  HiOutlineArrowLeft,
  HiOutlineChat,
  HiOutlineCheck,
  HiOutlineClipboardList,
  HiOutlineClock,
  HiOutlineDocument,
  HiOutlineEye,
  HiOutlineUser,
  HiOutlineX,
} from "react-icons/hi";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import Navigation from "./Navigation";
import ReviewCard from "./ReviewCard";

interface DisputeDetailProps {
  disputeId: string;
}

const DisputeDetailContent: React.FC<DisputeDetailProps> = ({ disputeId }) => {
  const { currentUser, resolveDispute } = useApp();
  const [adminNotes, setAdminNotes] = useState("");
  const [showFullEvidence, setShowFullEvidence] = useState(false);
  const [showFullResponse, setShowFullResponse] = useState(false);

  const dispute = getDisputeById(disputeId);
  const faculty = dispute ? getFacultyById(dispute.facultyId) : null;
  const review = dispute
    ? mockReviews.find((r) => r.id === dispute.reviewId)
    : null;

  if (!dispute || !faculty || !review) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="mx-auto max-w-2xl p-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <HiOutlineExclamationTriangle className="h-8 w-8" />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-slate-900">
            Dispute Not Found
          </h1>
          <p className="mb-6 text-slate-600">
            The dispute you're looking for doesn't exist or has been removed.
          </p>
          <a
            href="/admin/disputes"
            className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-blue-700"
          >
            <HiOutlineArrowLeft className="h-4 w-4" />
            <span>Back to Disputes</span>
          </a>
        </div>
      </div>
    );
  }

  const handleResolve = (approved: boolean) => {
    if (adminNotes.trim()) {
      resolveDispute(dispute.id, approved, adminNotes);
      // In a real app, this would redirect to the disputes list
      window.location.href = "/admin/disputes";
    }
  };

  const getStatusBadge = () => {
    const statusConfig = {
      pending: {
        color: "bg-amber-50 text-amber-700 border-amber-200",
        text: "⏳ Pending Review",
        icon: HiOutlineClock,
      },
      approved: {
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        text: "✅ Approved (Review Removed)",
        icon: HiOutlineCheck,
      },
      rejected: {
        color: "bg-red-50 text-red-700 border-red-200",
        text: "❌ Rejected (Review Kept)",
        icon: HiOutlineX,
      },
    };

    const config = statusConfig[dispute.status];
    const IconComponent = config.icon;

    return (
      <div
        className={`inline-flex items-center space-x-2 rounded-full border px-4 py-2 text-sm font-semibold ${config.color}`}
      >
        <IconComponent className="h-4 w-4" />
        <span>{config.text}</span>
      </div>
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="mx-auto max-w-6xl p-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <a
              href="/admin/disputes"
              className="flex items-center space-x-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:text-slate-900"
            >
              <HiOutlineArrowLeft className="h-4 w-4" />
              <span>Back to Disputes</span>
            </a>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Dispute #{dispute.id.slice(-6).toUpperCase()}
              </h1>
              <p className="text-slate-600">
                Filed {formatDate(dispute.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">{getStatusBadge()}</div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Disputed Review */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center space-x-2">
                <HiOutlineDocument className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  Disputed Review
                </h2>
              </div>
              <ReviewCard
                review={review}
                faculty={faculty}
                showActions={false}
              />
            </div>

            {/* Faculty Evidence */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <HiOutlineAcademicCap className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-lg font-bold text-slate-900">
                    Faculty Evidence
                  </h2>
                </div>
                <span className="text-sm text-slate-500">
                  {formatDate(dispute.createdAt)}
                </span>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg bg-slate-50 p-4">
                  <h3 className="mb-2 font-semibold text-slate-900">
                    Dispute Reason
                  </h3>
                  <p className="text-slate-700">{dispute.facultyReason}</p>
                </div>

                {dispute.facultyEvidence && (
                  <div className="rounded-lg bg-slate-50 p-4">
                    <h3 className="mb-2 font-semibold text-slate-900">
                      Evidence Provided
                    </h3>
                    <div className="text-slate-700">
                      {showFullEvidence ||
                      dispute.facultyEvidence.length <= 300 ? (
                        <p>{dispute.facultyEvidence}</p>
                      ) : (
                        <div>
                          <p>{dispute.facultyEvidence.slice(0, 300)}...</p>
                          <button
                            onClick={() => setShowFullEvidence(true)}
                            className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                          >
                            Show more
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Student Response */}
            {dispute.studentResponse && (
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <HiOutlineUser className="h-5 w-5 text-blue-600" />
                    <h2 className="text-lg font-bold text-slate-900">
                      Student Response
                    </h2>
                  </div>
                  <span className="text-sm text-slate-500">
                    {formatDate(dispute.updatedAt)}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg bg-blue-50 p-4">
                    <h3 className="mb-2 font-semibold text-slate-900">
                      Student Defense
                    </h3>
                    <div className="text-slate-700">
                      {showFullResponse ||
                      dispute.studentResponse.length <= 300 ? (
                        <p>{dispute.studentResponse}</p>
                      ) : (
                        <div>
                          <p>{dispute.studentResponse.slice(0, 300)}...</p>
                          <button
                            onClick={() => setShowFullResponse(true)}
                            className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                          >
                            Show more
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {dispute.studentEvidence && (
                    <div className="rounded-lg bg-blue-50 p-4">
                      <h3 className="mb-2 font-semibold text-slate-900">
                        Student Evidence
                      </h3>
                      <p className="text-slate-700">
                        {dispute.studentEvidence}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Admin Decision */}
            {dispute.status === "pending" && currentUser?.role === "admin" && (
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center space-x-2">
                  <HiOutlineClipboardList className="h-5 w-5 text-purple-600" />
                  <h2 className="text-lg font-bold text-slate-900">
                    Admin Decision
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Administrative Notes *
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={4}
                      placeholder="Provide reasoning for your decision. This will be visible to both the faculty member and student."
                      className="w-full resize-none rounded-lg border-2 border-slate-300 px-4 py-3 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleResolve(true)}
                      disabled={!adminNotes.trim()}
                      className="inline-flex items-center space-x-2 rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <HiOutlineCheck className="h-4 w-4" />
                      <span>Approve Dispute (Remove Review)</span>
                    </button>
                    <button
                      onClick={() => handleResolve(false)}
                      disabled={!adminNotes.trim()}
                      className="inline-flex items-center space-x-2 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <HiOutlineX className="h-4 w-4" />
                      <span>Reject Dispute (Keep Review)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Decision (Resolved) */}
            {dispute.status !== "pending" && dispute.adminNotes && (
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center space-x-2">
                  <HiOutlineClipboardList className="h-5 w-5 text-purple-600" />
                  <h2 className="text-lg font-bold text-slate-900">
                    Admin Decision
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg bg-purple-50 p-4">
                    <h3 className="mb-2 font-semibold text-slate-900">
                      Administrative Notes
                    </h3>
                    <p className="text-slate-700">{dispute.adminNotes}</p>
                  </div>

                  <div className="text-sm text-slate-500">
                    Decision made on {formatDate(dispute.updatedAt)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Dispute Info */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-slate-900">
                Dispute Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Dispute ID
                  </label>
                  <p className="font-mono text-sm text-slate-900">
                    #{dispute.id.slice(-6).toUpperCase()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Faculty Member
                  </label>
                  <p className="font-semibold text-slate-900">{faculty.name}</p>
                  <p className="text-sm text-slate-600">{faculty.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Review Subject
                  </label>
                  <p className="text-sm text-slate-900">{review.subject}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Review Rating
                  </label>
                  <div className="flex items-center space-x-1">
                    <span className="text-lg">
                      {"⭐".repeat(review.rating)}
                    </span>
                    <span className="text-sm text-slate-600">
                      ({review.rating}/5)
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Filed On
                  </label>
                  <p className="text-sm text-slate-900">
                    {formatDate(dispute.createdAt)}
                  </p>
                </div>
                {dispute.status !== "pending" && (
                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Resolved On
                    </label>
                    <p className="text-sm text-slate-900">
                      {formatDate(dispute.updatedAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-slate-900">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <a
                  href={`/reviews/${dispute.facultyId}`}
                  className="flex w-full items-center space-x-2 rounded-lg bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 transition-all duration-200 hover:bg-blue-100"
                >
                  <HiOutlineEye className="h-4 w-4" />
                  <span>View All Faculty Reviews</span>
                </a>
                <a
                  href="/admin/disputes"
                  className="flex w-full items-center space-x-2 rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-100"
                >
                  <HiOutlineChat className="h-4 w-4" />
                  <span>View All Disputes</span>
                </a>
              </div>
            </div>

            {/* Help */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-slate-900">
                💡 Decision Guidelines
              </h3>
              <div className="space-y-3 text-sm text-slate-600">
                <div>
                  <strong className="text-slate-900">Approve Dispute:</strong>
                  <p>
                    If the review is demonstrably false, inappropriate, or
                    violates guidelines.
                  </p>
                </div>
                <div>
                  <strong className="text-slate-900">Reject Dispute:</strong>
                  <p>
                    If the review represents a legitimate student experience,
                    even if negative.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DisputeDetail: React.FC<DisputeDetailProps> = ({ disputeId }) => {
  return (
    <AppProvider>
      <DisputeDetailContent disputeId={disputeId} />
    </AppProvider>
  );
};

export default DisputeDetail;
