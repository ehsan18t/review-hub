import { AppProvider } from "@/contexts/AppContext";
import { mockFaculty, type Faculty } from "@/data/mockData";
import React from "react";
import Navigation from "./Navigation";
import ReviewForm from "./ReviewForm";

interface ReviewPageProps {
  facultyId: string;
}

const ReviewPageContent: React.FC<{ faculty: Faculty }> = ({ faculty }) => {
  const handleSubmit = () => {
    // Navigate back to faculty page or reviews
    window.location.href = `/reviews/${faculty.id}`;
  };

  const handleCancel = () => {
    // Navigate back to faculty browse
    window.location.href = "/faculty";
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <a href="/" className="hover:text-blue-600">
            Home
          </a>
          <span>→</span>
          <a href="/faculty" className="hover:text-blue-600">
            Browse Faculty
          </a>
          <span>→</span>
          <a href={`/reviews/${faculty.id}`} className="hover:text-blue-600">
            {faculty.name}
          </a>
          <span>→</span>
          <span className="text-gray-900">Write Review</span>
        </div>
      </nav>

      <ReviewForm
        faculty={faculty}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

const ReviewPage: React.FC<ReviewPageProps> = ({ facultyId }) => {
  const faculty = mockFaculty.find((f) => f.id === facultyId);

  if (!faculty) {
    return (
      <AppProvider>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="mx-auto max-w-4xl px-4 py-16 text-center">
            <span className="mb-6 block text-6xl">❌</span>
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
              Faculty Not Found
            </h1>
            <p className="mb-8 text-gray-600">
              The faculty member you're trying to review doesn't exist.
            </p>
            <a
              href="/faculty"
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Browse All Faculty
            </a>
          </div>
        </div>
      </AppProvider>
    );
  }

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <ReviewPageContent faculty={faculty} />
      </div>
    </AppProvider>
  );
};

export default ReviewPage;
