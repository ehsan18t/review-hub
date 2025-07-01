import { useApp } from "@/contexts/AppContext";
import type { Review } from "@/data/mockData";
import React, { useState } from "react";
import {
  HiOutlineCheck,
  HiOutlineDocumentText,
  HiOutlineLightBulb,
  HiOutlineX,
} from "react-icons/hi";

import { HiOutlineExclamationTriangle } from "react-icons/hi2";

interface DisputeFormProps {
  review: Review;
  onSubmit: () => void;
  onCancel: () => void;
}

const DisputeForm: React.FC<DisputeFormProps> = ({
  review,
  onSubmit,
  onCancel,
}) => {
  const { currentUser, createDispute } = useApp();
  const [formData, setFormData] = useState({
    reason: "",
    evidence: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.reason.trim()) {
      newErrors.reason = "Please provide a reason for the dispute";
    } else if (formData.reason.trim().length < 50) {
      newErrors.reason = "Reason must be at least 50 characters";
    }

    if (!formData.evidence.trim()) {
      newErrors.evidence = "Please provide evidence to support your dispute";
    } else if (formData.evidence.trim().length < 30) {
      newErrors.evidence =
        "Evidence description must be at least 30 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !currentUser) return;

    createDispute({
      reviewId: review.id,
      facultyId: currentUser.id,
      studentId: review.studentId,
      status: "pending",
      facultyReason: formData.reason.trim(),
      facultyEvidence: formData.evidence.trim(),
    });

    onSubmit();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-orange-200 bg-orange-100">
          <HiOutlineExclamationTriangle className="h-8 w-8 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Dispute Review</h2>
        <p className="mt-2 text-slate-600">
          Submit a formal dispute for this review with supporting evidence
        </p>
      </div>

      {/* Review Preview */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
        <h3 className="mb-3 flex items-center space-x-2 text-lg font-semibold text-slate-900">
          <HiOutlineDocumentText className="h-5 w-5 text-slate-600" />
          <span>Review Being Disputed</span>
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <span className="font-medium">Course:</span>
            <span>{review.subject}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <span className="font-medium">Rating:</span>
            <span>{review.rating}/5 ⭐</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <span className="font-medium">Semester:</span>
            <span>
              {review.semester} {review.year}
            </span>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <p className="text-sm leading-relaxed text-slate-700">
              {review.comment}
            </p>
          </div>
        </div>
      </div>

      {/* Dispute Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Reason */}
        <div>
          <label
            htmlFor="reason"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Reason for Dispute *
          </label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            rows={4}
            placeholder="Explain why you believe this review contains false or misleading information. Be specific about which claims you are disputing and why they are inaccurate."
            className={`w-full resize-none rounded-lg border-2 px-4 py-3 text-sm leading-relaxed transition-all duration-200 focus:ring-4 focus:outline-none ${
              errors.reason
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-slate-300 hover:border-slate-400 focus:border-orange-500 focus:ring-orange-100"
            }`}
          />
          {errors.reason && (
            <p className="mt-2 flex items-center space-x-1 text-sm text-red-600">
              <HiOutlineX className="h-4 w-4" />
              <span>{errors.reason}</span>
            </p>
          )}
          <div className="mt-1 text-xs text-slate-500">
            {formData.reason.length}/50 minimum characters
          </div>
        </div>

        {/* Evidence */}
        <div>
          <label
            htmlFor="evidence"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Supporting Evidence *
          </label>
          <textarea
            id="evidence"
            name="evidence"
            value={formData.evidence}
            onChange={handleInputChange}
            rows={4}
            placeholder="Describe the evidence you have to support your dispute. This could include course materials, attendance records, assignment instructions, or other documentation that contradicts the claims in the review."
            className={`w-full resize-none rounded-lg border-2 px-4 py-3 text-sm leading-relaxed transition-all duration-200 focus:ring-4 focus:outline-none ${
              errors.evidence
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-slate-300 hover:border-slate-400 focus:border-orange-500 focus:ring-orange-100"
            }`}
          />
          {errors.evidence && (
            <p className="mt-2 flex items-center space-x-1 text-sm text-red-600">
              <HiOutlineX className="h-4 w-4" />
              <span>{errors.evidence}</span>
            </p>
          )}
          <div className="mt-1 text-xs text-slate-500">
            {formData.evidence.length}/30 minimum characters
          </div>
        </div>

        {/* Guidelines */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h4 className="mb-3 flex items-center space-x-2 font-semibold text-blue-900">
            <HiOutlineLightBulb className="h-5 w-5" />
            <span>Dispute Guidelines</span>
          </h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start space-x-2">
              <span className="mt-0.5 text-blue-600">•</span>
              <span>
                Only dispute reviews that contain factually incorrect
                information
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="mt-0.5 text-blue-600">•</span>
              <span>Provide specific evidence to support your claims</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="mt-0.5 text-blue-600">•</span>
              <span>
                Personal opinions and subjective experiences cannot be disputed
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="mt-0.5 text-blue-600">•</span>
              <span>All disputes are reviewed by administration</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-4 sm:flex-row">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border-2 border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-all duration-200 hover:scale-105 hover:border-slate-400 hover:bg-slate-50 focus:ring-4 focus:ring-slate-200 focus:outline-none"
          >
            <span className="flex items-center justify-center space-x-2">
              <HiOutlineX className="h-4 w-4" />
              <span>Cancel</span>
            </span>
          </button>
          <button
            type="submit"
            disabled={!formData.reason.trim() || !formData.evidence.trim()}
            className="flex-1 rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-orange-700 hover:shadow-xl focus:ring-4 focus:ring-orange-200 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-400 disabled:hover:scale-100 disabled:hover:shadow-lg"
          >
            <span className="flex items-center justify-center space-x-2">
              <HiOutlineCheck className="h-4 w-4" />
              <span>Submit Dispute</span>
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default DisputeForm;
