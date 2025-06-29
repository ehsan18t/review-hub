import type { Faculty } from "@/data/mockData";
import React from "react";
import ReviewForm from "./ReviewForm";

interface ReviewModalProps {
  faculty: Faculty;
  onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ faculty, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white">
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Write Review</h2>
            <button
              onClick={onClose}
              className="text-2xl text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          <ReviewForm faculty={faculty} onSubmit={onClose} onCancel={onClose} />
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
