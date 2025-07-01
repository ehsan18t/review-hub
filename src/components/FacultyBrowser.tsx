import { AppProvider } from "@/contexts/AppContext";
import type { Faculty } from "@/data/mockData";
import { mockFaculty } from "@/data/mockData";
import React, { useState } from "react";
import FacultyCard from "./FacultyCard";
import Navigation from "./Navigation";
import ReviewModal from "./ReviewModal";

const FacultyBrowserContent: React.FC = () => {
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "rating" | "reviews">("name");

  const departments = Array.from(new Set(mockFaculty.map((f) => f.department)));

  const filteredFaculty = mockFaculty
    .filter((faculty) => {
      const matchesSearch =
        faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faculty.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (faculty.bio &&
          faculty.bio.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesDepartment =
        !filterDepartment || faculty.department === filterDepartment;

      return matchesSearch && matchesDepartment;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.avgRating - a.avgRating;
        case "reviews":
          return b.totalReviews - a.totalReviews;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleWriteReview = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setShowReviewModal(true);
  };

  const handleViewReviews = (faculty: Faculty) => {
    window.location.href = `/reviews/${faculty.id}`;
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Browse Faculty
          </h1>
          <p className="text-gray-600">
            Find faculty members, read reviews, and share your experiences.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
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
                placeholder="Search by name, department, or expertise..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="department"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Department
              </label>
              <select
                id="department"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="sort"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Sort By
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="name">Name (A-Z)</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredFaculty.length} of {mockFaculty.length} faculty
            members
          </p>
        </div>

        {/* Faculty Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFaculty.map((faculty) => (
            <FacultyCard
              key={faculty.id}
              faculty={faculty}
              onWriteReview={() => handleWriteReview(faculty)}
              onViewReviews={() => handleViewReviews(faculty)}
            />
          ))}
        </div>

        {filteredFaculty.length === 0 && (
          <div className="py-12 text-center">
            <span className="mb-4 block text-4xl">🔍</span>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              No faculty found
            </h3>
            <p className="mb-4 text-gray-600">
              Try adjusting your search terms or filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterDepartment("");
              }}
              className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedFaculty && (
        <ReviewModal
          faculty={selectedFaculty}
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
        />
      )}
    </>
  );
};

const FacultyBrowser: React.FC = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <FacultyBrowserContent />
      </div>
    </AppProvider>
  );
};

export default FacultyBrowser;
