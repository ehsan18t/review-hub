import { AppProvider, useApp } from "@/contexts/AppContext";
import { getDisputeById, getFacultyById, mockReviews } from "@/data/mockData";
import React, { useEffect, useState } from "react";
import {
  HiOutlineArrowLeft,
  HiOutlineDocumentText,
  HiOutlineInformationCircle,
  HiOutlinePaperClip,
} from "react-icons/hi";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import Navigation from "./Navigation";

interface StudentDisputeResponseProps {
  disputeId?: string;
}

const StudentDisputeResponseContent: React.FC<{ disputeId: string }> = ({
  disputeId,
}) => {
  const { currentUser, updateDispute } = useApp();
  const [studentResponse, setStudentResponse] = useState("");
  const [studentEvidence, setStudentEvidence] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const dispute = getDisputeById(disputeId);
  const review = dispute
    ? mockReviews.find((r) => r.id === dispute.reviewId)
    : null;
  const faculty = review ? getFacultyById(review.facultyId) : null;

  useEffect(() => {
    if (dispute && dispute.studentResponse) {
      setStudentResponse(dispute.studentResponse);
      setStudentEvidence(dispute.studentEvidence || "");
    }
  }, [dispute]);

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

  if (!dispute || !review || !faculty) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <HiOutlineExclamationTriangle className="h-8 w-8" />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-slate-900">
            Dispute Not Found
          </h1>
          <p className="mb-6 text-slate-600">
            The dispute you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <a
            href="/my-disputes"
            className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-blue-700"
          >
            <span>View My Disputes</span>
          </a>
        </div>
      </div>
    );
  }

  if (dispute.studentId !== currentUser.id) {
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
            You can only respond to disputes on your own reviews.
          </p>
          <a
            href="/my-disputes"
            className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-blue-700"
          >
            <span>View My Disputes</span>
          </a>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!studentResponse.trim()) return;

    setIsSubmitting(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      updateDispute(disputeId, {
        studentResponse: studentResponse.trim(),
        studentEvidence: studentEvidence.trim() || undefined,
        updatedAt: new Date(),
      });

      setHasSubmitted(true);
    } catch (error) {
      console.error("Failed to submit response:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const canEdit = dispute.status === "pending" && !hasSubmitted;
  const hasExistingResponse = !!dispute.studentResponse;

  if (hasSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <HiOutlineDocumentText className="h-8 w-8" />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-slate-900">
            Response Submitted!
          </h1>
          <p className="mb-6 text-slate-600">
            Your response has been submitted successfully. The admin will review
            both sides and make a decision.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <a
              href="/my-disputes"
              className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-blue-700"
            >
              <span>View All Disputes</span>
            </a>
            <a
              href={`/dispute/details/${disputeId}`}
              className="inline-flex items-center space-x-2 rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-50"
            >
              <span>View Dispute Details</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center">
            <a
              href="/my-disputes"
              className="mr-4 flex items-center space-x-2 text-slate-600 transition-colors duration-200 hover:text-blue-600"
            >
              <HiOutlineArrowLeft className="h-4 w-4" />
              <span>Back to My Disputes</span>
            </a>
          </div>
          <h1 className="flex items-center space-x-3 text-3xl font-bold text-slate-900">
            <span>🚨</span>
            <span>Respond to Faculty Dispute</span>
          </h1>
          <p className="mt-2 text-slate-600">
            A faculty member has disputed your review. Please provide your
            response and any supporting evidence.
          </p>
        </div>

        {/* Context Section */}
        <div className="mb-8 space-y-6">
          {/* Original Review */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center space-x-2 text-xl font-bold text-slate-900">
              <span>📝</span>
              <span>Your Original Review</span>
            </h2>
            <div className="rounded-lg bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {review.subject}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {faculty.name} • {review.semester} {review.year}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
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
              </div>
              <p className="text-slate-700">{review.comment}</p>
              <p className="mt-3 text-xs text-slate-500">
                Posted on {formatDate(review.createdAt)}
              </p>
            </div>
          </div>

          {/* Faculty Dispute */}
          <div className="rounded-xl border border-orange-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center space-x-2 text-xl font-bold text-slate-900">
              <span>⚠️</span>
              <span>Faculty's Dispute</span>
            </h2>
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
              <div className="mb-3">
                <p className="text-sm font-semibold text-orange-800">
                  Reason for Dispute:
                </p>
                <p className="mt-1 text-orange-700">{dispute.facultyReason}</p>
              </div>
              {dispute.facultyEvidence && (
                <div className="rounded bg-orange-100 p-3">
                  <p className="mb-1 text-sm font-semibold text-orange-800">
                    Evidence Provided:
                  </p>
                  <p className="text-orange-700">{dispute.facultyEvidence}</p>
                </div>
              )}
              <p className="mt-3 text-xs text-orange-600">
                Submitted on {formatDate(dispute.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Response Form */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center space-x-2 text-xl font-bold text-slate-900">
            <span>🛡️</span>
            <span>Your Response</span>
          </h2>

          {hasExistingResponse && !canEdit && (
            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="mb-2 flex items-center space-x-2">
                <HiOutlineInformationCircle className="h-5 w-5 text-blue-600" />
                <p className="font-semibold text-blue-800">
                  Response Already Submitted
                </p>
              </div>
              <p className="text-blue-700">
                You have already responded to this dispute. The admin is
                reviewing both sides.
              </p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Your Response to the Dispute *
              </label>
              <textarea
                value={studentResponse}
                onChange={(e) => setStudentResponse(e.target.value)}
                disabled={!canEdit}
                rows={5}
                placeholder="Explain your side of the story. Address the faculty member's concerns and provide your perspective on the review you wrote."
                className="w-full resize-none rounded-lg border-2 border-slate-300 px-4 py-3 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none disabled:bg-slate-100 disabled:text-slate-600"
                required
              />
              <p className="mt-2 text-xs text-slate-600">
                Be respectful and factual. Explain why your review was fair and
                accurate.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Supporting Evidence (Optional)
              </label>
              <textarea
                value={studentEvidence}
                onChange={(e) => setStudentEvidence(e.target.value)}
                disabled={!canEdit}
                rows={4}
                placeholder="Provide any evidence that supports your review (e.g., screenshots of course materials, email communications, attendance records, assignment feedback, etc.)"
                className="w-full resize-none rounded-lg border-2 border-slate-300 px-4 py-3 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none disabled:bg-slate-100 disabled:text-slate-600"
              />
              <div className="mt-2 flex items-center space-x-2 text-xs text-slate-600">
                <HiOutlinePaperClip className="h-3 w-3" />
                <span>
                  Describe any documents, screenshots, or other evidence you
                  have
                </span>
              </div>
            </div>

            {/* Guidelines */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h3 className="mb-2 flex items-center space-x-2 font-semibold text-blue-800">
                <HiOutlineInformationCircle className="h-5 w-5" />
                <span>Response Guidelines</span>
              </h3>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• Stay factual and avoid emotional responses</li>
                <li>• Address specific points raised by the faculty member</li>
                <li>• Provide concrete examples to support your claims</li>
                <li>• Be respectful even if you disagree with the dispute</li>
                <li>• Include relevant dates, times, or specific incidents</li>
              </ul>
            </div>

            {canEdit && (
              <div className="flex items-center justify-end space-x-4">
                <a
                  href="/my-disputes"
                  className="rounded-lg border-2 border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-50"
                >
                  Cancel
                </a>
                <button
                  onClick={handleSubmit}
                  disabled={!studentResponse.trim() || isSubmitting}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center space-x-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Submitting...</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-2">
                      <HiOutlineDocumentText className="h-4 w-4" />
                      <span>Submit Response</span>
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentDisputeResponse: React.FC<StudentDisputeResponseProps> = ({
  disputeId,
}) => {
  if (!disputeId) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <HiOutlineExclamationTriangle className="h-8 w-8" />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-slate-900">
            Invalid Dispute ID
          </h1>
          <p className="mb-6 text-slate-600">
            No dispute ID was provided. Please access this page through a valid
            dispute link.
          </p>
          <a
            href="/my-disputes"
            className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-blue-700"
          >
            <span>View My Disputes</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <AppProvider>
      <StudentDisputeResponseContent disputeId={disputeId} />
    </AppProvider>
  );
};

export default StudentDisputeResponse;
