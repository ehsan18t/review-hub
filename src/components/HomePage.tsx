import { AppProvider, useApp } from "@/contexts/AppContext";
import type { Faculty } from "@/data/mockData";
import { mockFaculty, mockUsers } from "@/data/mockData";
import React, { useState } from "react";
import FacultyCard from "./FacultyCard";
import Navigation from "./Navigation";
import ReviewForm from "./ReviewForm";

const HomePageContent: React.FC = () => {
  const { currentUser, setCurrentUser } = useApp();
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

  const handleGetStarted = (role: "student" | "faculty") => {
    const user = mockUsers.find((u) => u.role === role);
    if (user) {
      setCurrentUser(user);
    }
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
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="text-center">
            <div className="mb-16">
              <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-blue-600 shadow-xl transition-all duration-300 hover:scale-110 hover:bg-blue-700">
                <span className="text-6xl">🎓</span>
              </div>
              <h1 className="mb-6 text-6xl font-bold tracking-tight text-slate-900">
                Faculty Review Hub
              </h1>
              <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-slate-600">
                A comprehensive platform for students to review faculty members
                and help improve the university experience. Share your
                experiences, read honest reviews, and make informed decisions
                about your courses.
              </p>
            </div>

            <div className="mb-20 flex flex-col items-center justify-center gap-6 sm:flex-row">
              <button
                onClick={() => handleGetStarted("student")}
                className="group relative overflow-hidden rounded-xl bg-blue-600 px-10 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-xl focus:ring-4 focus:ring-blue-200 focus:outline-none"
              >
                <span className="relative z-10 flex items-center space-x-3">
                  <span>🎓</span>
                  <span>Get Started as Student</span>
                </span>
              </button>
              <button
                onClick={() => handleGetStarted("faculty")}
                className="group relative overflow-hidden rounded-xl bg-emerald-600 px-10 py-4 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-emerald-700 hover:shadow-xl focus:ring-4 focus:ring-emerald-200 focus:outline-none"
              >
                <span className="relative z-10 flex items-center space-x-3">
                  <span>👨‍🏫</span>
                  <span>Get Started as Faculty</span>
                </span>
              </button>
            </div>

            <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
              <div className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-blue-300 hover:shadow-xl">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-3xl shadow-md transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-700">
                  📝
                </div>
                <h3 className="mb-4 text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-blue-600">
                  Write Reviews
                </h3>
                <p className="leading-relaxed text-slate-600">
                  Share your experiences with faculty members and help fellow
                  students make informed decisions about their courses.
                </p>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-purple-300 hover:shadow-xl">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-3xl shadow-md transition-all duration-300 group-hover:scale-110 group-hover:bg-purple-700">
                  👀
                </div>
                <h3 className="mb-4 text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-purple-600">
                  Read Reviews
                </h3>
                <p className="leading-relaxed text-slate-600">
                  Access honest feedback from other students about faculty
                  teaching styles and course experiences.
                </p>
              </div>
              <div className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-xl">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-3xl shadow-md transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-700">
                  💰
                </div>
                <h3 className="mb-4 text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-emerald-600">
                  Earn Credits
                </h3>
                <p className="leading-relaxed text-slate-600">
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
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-8 transition-all duration-300">
          <h1 className="mb-3 text-4xl font-bold text-slate-900">
            Welcome back, {currentUser.name}! 👋
          </h1>
          <p className="text-lg text-slate-600">
            {currentUser.role === "student"
              ? "Find faculty members, read reviews, and share your experiences."
              : currentUser.role === "faculty"
                ? "View your reviews and manage your profile."
                : "Manage reviews and users across the platform."}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="max-w-full">
          <label
            htmlFor="search"
            className="mb-3 block text-sm font-bold text-slate-700"
          >
            Search Faculty
          </label>
          <div className="relative">
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or department..."
              className="w-full rounded-xl border-2 border-slate-300 px-4 py-3 pl-12 shadow-sm transition-all duration-200 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <span className="text-lg text-slate-400">🔍</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {currentUser.role === "student" && (
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md">
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-emerald-600 p-3 shadow-sm">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <p className="text-sm font-bold tracking-wide text-emerald-700 uppercase">
                  Review Credits
                </p>
                <p className="text-3xl font-bold text-emerald-600">
                  {currentUser.reviewCredits}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md">
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-blue-600 p-3 shadow-sm">
                <span className="text-2xl">📝</span>
              </div>
              <div>
                <p className="text-sm font-bold tracking-wide text-blue-700 uppercase">
                  Reviews Written
                </p>
                <p className="text-3xl font-bold text-blue-600">3</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-purple-200 bg-purple-50 p-6 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md">
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-purple-600 p-3 shadow-sm">
                <span className="text-2xl">👀</span>
              </div>
              <div>
                <p className="text-sm font-bold tracking-wide text-purple-700 uppercase">
                  Reviews Read
                </p>
                <p className="text-3xl font-bold text-purple-600">0</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-orange-200 bg-orange-50 p-6 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md">
            <div className="flex items-center">
              <div className="mr-4 rounded-full bg-orange-600 p-3 shadow-sm">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <p className="text-sm font-bold tracking-wide text-orange-700 uppercase">
                  Faculty Reviewed
                </p>
                <p className="text-3xl font-bold text-orange-600">5</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Faculty Grid */}
      <div className="mb-8">
        <h2 className="mb-8 text-3xl font-bold text-slate-900">
          Faculty Members
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
        <div className="py-20 text-center">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg">
            <span className="text-4xl">🔍</span>
          </div>
          <h3 className="mb-4 text-2xl font-bold text-slate-900">
            No faculty found
          </h3>
          <p className="mb-8 text-lg text-slate-600">
            Try adjusting your search terms.
          </p>
          <button
            onClick={() => setSearchTerm("")}
            className="rounded-lg bg-blue-600 px-8 py-3 font-bold text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-lg focus:ring-4 focus:ring-blue-200 focus:outline-none"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
};

export { HomePageContent };

const HomePage: React.FC = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <HomePageContent />
      </div>
    </AppProvider>
  );
};

export default HomePage;
