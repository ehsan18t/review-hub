import { AppProvider, useApp } from "@/contexts/AppContext";
import type { Faculty } from "@/data/mockData";
import { mockFaculty } from "@/data/mockData";
import React, { useState } from "react";
import FacultyCard from "./FacultyCard";
import Navigation from "./Navigation";
import ReviewForm from "./ReviewForm";

const HomePageContent: React.FC = () => {
  const { currentUser } = useApp();
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaculty = mockFaculty.filter(
    (faculty) =>
      faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.department.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleWriteReview = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setShowReviewForm(true);
  };

  const handleViewReviews = (faculty: Faculty) => {
    window.location.href = `/reviews/${faculty.id}`;
  };

  const handleCloseModal = () => {
    setShowReviewForm(false);
    setSelectedFaculty(null);
  };

  if (showReviewForm && selectedFaculty) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <ReviewForm
          faculty={selectedFaculty}
          onSubmit={handleCloseModal}
          onCancel={handleCloseModal}
        />
      </div>
    );
  }

  if (!currentUser) {
    // Landing page for non-logged users
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="text-center">
            <div className="mb-8">
              <span className="mb-4 block text-6xl">🎓</span>
              <h1 className="mb-6 text-5xl font-bold text-gray-900">
                Faculty Review Hub
              </h1>
              <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600">
                A comprehensive platform for students to review faculty members
                and help improve the university experience. Share your
                experiences, read honest reviews, and make informed decisions
                about your courses.
              </p>
            </div>

            <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={() => (window.location.href = "/student")}
                className="rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-blue-700"
              >
                Get Started as Student
              </button>
              <button
                onClick={() => (window.location.href = "/faculty")}
                className="rounded-lg bg-green-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-green-700"
              >
                Get Started as Faculty
              </button>
            </div>

            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow-md">
                <div className="mb-4 text-3xl">📝</div>
                <h3 className="mb-2 text-xl font-semibold">Write Reviews</h3>
                <p className="text-gray-600">
                  Share your experiences with faculty members and help fellow
                  students make informed decisions.
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-md">
                <div className="mb-4 text-3xl">👀</div>
                <h3 className="mb-2 text-xl font-semibold">Read Reviews</h3>
                <p className="text-gray-600">
                  Access honest feedback from other students about faculty
                  teaching styles and course experiences.
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 shadow-md">
                <div className="mb-4 text-3xl">💰</div>
                <h3 className="mb-2 text-xl font-semibold">Earn Credits</h3>
                <p className="text-gray-600">
                  Earn Review Credits by writing reviews and spend them to
                  access detailed feedback from others.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard for logged users
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Welcome back, {currentUser.name}!
        </h1>
        <p className="text-gray-600">
          {currentUser.role === "student"
            ? "Find faculty members, read reviews, and share your experiences."
            : currentUser.role === "faculty"
              ? "View your reviews and manage your profile."
              : "Manage reviews and users across the platform."}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="max-w-md">
          <label
            htmlFor="search"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Search Faculty
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or department..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Quick Stats */}
      {currentUser.role === "student" && (
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
            <div className="flex items-center">
              <span className="mr-3 text-2xl">💰</span>
              <div>
                <p className="text-sm text-gray-600">Review Credits</p>
                <p className="text-2xl font-bold text-green-600">
                  {currentUser.reviewCredits}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
            <div className="flex items-center">
              <span className="mr-3 text-2xl">📝</span>
              <div>
                <p className="text-sm text-gray-600">Reviews Written</p>
                <p className="text-2xl font-bold text-blue-600">3</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
            <div className="flex items-center">
              <span className="mr-3 text-2xl">👀</span>
              <div>
                <p className="text-sm text-gray-600">Reviews Read</p>
                <p className="text-2xl font-bold text-purple-600">12</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
            <div className="flex items-center">
              <span className="mr-3 text-2xl">🎯</span>
              <div>
                <p className="text-sm text-gray-600">Faculty Reviewed</p>
                <p className="text-2xl font-bold text-orange-600">5</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Faculty Grid */}
      <div className="mb-8">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Faculty Members
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFaculty.map((faculty) => (
            <FacultyCard
              key={faculty.id}
              faculty={faculty}
              onWriteReview={() => handleWriteReview(faculty)}
              onViewReviews={() => handleViewReviews(faculty)}
            />
          ))}
        </div>
      </div>

      {filteredFaculty.length === 0 && (
        <div className="py-12 text-center">
          <span className="mb-4 block text-4xl">🔍</span>
          <h3 className="mb-2 text-xl font-semibold text-gray-900">
            No faculty found
          </h3>
          <p className="text-gray-600">Try adjusting your search terms.</p>
        </div>
      )}
    </div>
  );
};

export { HomePageContent };

const HomePage: React.FC = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <HomePageContent />
      </div>
    </AppProvider>
  );
};

export default HomePage;
