import { useApp } from "@/contexts/AppContext";
import type { Faculty } from "@/data/mockData";
import React, { useState } from "react";

interface ReviewFormProps {
  faculty: Faculty;
  onSubmit?: () => void;
  onCancel?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  faculty,
  onSubmit,
  onCancel,
}) => {
  const { currentUser, addReview } = useApp();
  const [formData, setFormData] = useState({
    rating: 5,
    subject: "",
    comment: "",
    semester: "Fall",
    year: new Date().getFullYear(),
    isAnonymous: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) return;

    addReview({
      facultyId: faculty.id,
      studentId: currentUser.id,
      status: "pending",
      ...formData,
    });

    onSubmit?.();
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
      <div className="mb-6">
        <h3 className="mb-2 text-xl font-semibold text-gray-900">
          Write a Review for {faculty.name}
        </h3>
        <p className="text-gray-600">
          {faculty.position} • {faculty.department}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Subject/Course */}
        <div>
          <label
            htmlFor="subject"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Course/Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="e.g., CS 101 - Introduction to Programming"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Rating */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Overall Rating *
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className={`text-2xl transition-colors ${
                  star <= formData.rating ? "text-yellow-400" : "text-gray-300"
                } hover:text-yellow-400`}
              >
                ★
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              ({formData.rating} star{formData.rating !== 1 ? "s" : ""})
            </span>
          </div>
        </div>

        {/* Semester & Year */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="semester"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Semester
            </label>
            <select
              id="semester"
              name="semester"
              value={formData.semester}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Fall">Fall</option>
              <option value="Winter">Winter</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="year"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Year
            </label>
            <select
              id="year"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label
            htmlFor="comment"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Your Review *
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            rows={5}
            placeholder="Share your experience with this faculty member. Be honest and constructive..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Minimum 50 characters. Be respectful and constructive in your
            feedback.
          </p>
        </div>

        {/* Anonymous Option */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isAnonymous"
            name="isAnonymous"
            checked={formData.isAnonymous}
            onChange={handleInputChange}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="isAnonymous" className="ml-2 text-sm text-gray-700">
            Submit this review anonymously
          </label>
        </div>

        {/* Credit Info */}
        <div className="rounded-md border border-green-200 bg-green-50 p-4">
          <div className="flex items-center">
            <span className="mr-2 text-green-600">💰</span>
            <div>
              <p className="text-sm font-medium text-green-800">
                Earn 1 Review Credit
              </p>
              <p className="text-xs text-green-600">
                You'll earn 1 RC for submitting this review, which you can use
                to view other reviews.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              !formData.subject ||
              !formData.comment ||
              formData.comment.length < 50
            }
            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
