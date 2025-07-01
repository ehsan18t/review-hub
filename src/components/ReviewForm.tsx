import { useApp } from "@/contexts/AppContext";
import type { Faculty } from "@/data/mockData";
import React, { useState } from "react";
import {
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineChat,
  HiOutlineCheck,
  HiOutlineChevronDown,
  HiOutlineClipboardList,
  HiOutlineLightBulb,
  HiOutlineSearch,
  HiOutlineSparkles,
  HiOutlineStar,
  HiOutlineX,
  HiStar,
} from "react-icons/hi";

interface ReviewFormProps {
  faculty: Faculty;
  onSubmit?: () => void;
  onCancel?: () => void;
}

// Mock course data based on department
const getCoursesByDepartment = (department: string) => {
  const courses = {
    "Computer Science": [
      "CS 101 - Introduction to Programming",
      "CS 102 - Data Structures",
      "CS 201 - Algorithms",
      "CS 202 - Database Systems",
      "CS 301 - Software Engineering",
      "CS 302 - Computer Networks",
      "CS 401 - Machine Learning",
      "CS 402 - Artificial Intelligence",
    ],
    Mathematics: [
      "MATH 101 - Calculus I",
      "MATH 102 - Calculus II",
      "MATH 201 - Linear Algebra",
      "MATH 202 - Differential Equations",
      "MATH 301 - Real Analysis",
      "MATH 302 - Abstract Algebra",
      "MATH 401 - Topology",
      "MATH 402 - Number Theory",
    ],
    Physics: [
      "PHYS 101 - General Physics I",
      "PHYS 102 - General Physics II",
      "PHYS 201 - Modern Physics",
      "PHYS 202 - Thermodynamics",
      "PHYS 301 - Quantum Mechanics",
      "PHYS 302 - Electromagnetism",
      "PHYS 401 - Statistical Mechanics",
      "PHYS 402 - Solid State Physics",
    ],
    Chemistry: [
      "CHEM 101 - General Chemistry I",
      "CHEM 102 - General Chemistry II",
      "CHEM 201 - Organic Chemistry I",
      "CHEM 202 - Organic Chemistry II",
      "CHEM 301 - Physical Chemistry",
      "CHEM 302 - Analytical Chemistry",
      "CHEM 401 - Biochemistry",
      "CHEM 402 - Inorganic Chemistry",
    ],
  };

  return (
    courses[department as keyof typeof courses] || [
      "Course 101 - Introduction",
      "Course 201 - Intermediate",
      "Course 301 - Advanced",
      "Course 401 - Senior Level",
    ]
  );
};

interface RatingCategory {
  key: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

const ratingCategories: RatingCategory[] = [
  {
    key: "teaching",
    label: "Teaching Quality",
    icon: HiOutlineAcademicCap,
    description: "Clarity, organization, and effectiveness of teaching",
  },
  {
    key: "explanability",
    label: "Explanation Skills",
    icon: HiOutlineChat,
    description: "Ability to explain complex concepts clearly",
  },
  {
    key: "accessibility",
    label: "Accessibility",
    icon: HiOutlineSparkles,
    description: "Availability for questions and office hours",
  },
  {
    key: "coursework",
    label: "Coursework & Exams",
    icon: HiOutlineClipboardList,
    description: "Fairness and relevance of assignments and tests",
  },
  {
    key: "engagement",
    label: "Student Engagement",
    icon: HiOutlineBookOpen,
    description: "Ability to keep students interested and motivated",
  },
];

const ReviewForm: React.FC<ReviewFormProps> = ({
  faculty,
  onSubmit,
  onCancel,
}) => {
  const { currentUser, addReview } = useApp();
  const [formData, setFormData] = useState({
    categoryRatings: {
      teaching: 0,
      explanability: 0,
      accessibility: 0,
      coursework: 0,
      engagement: 0,
    },
    subject: "",
    comment: "",
    semester: "Fall",
    year: new Date().getFullYear(),
  });

  const [courseSearch, setCourseSearch] = useState("");
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const courses = getCoursesByDepartment(faculty.department);
  const filteredCourses = courses.filter((course) =>
    course.toLowerCase().includes(courseSearch.toLowerCase()),
  );

  // Calculate overall rating from category ratings
  const calculateOverallRating = () => {
    const categoryValues = Object.values(formData.categoryRatings).filter(
      (r) => r > 0,
    );
    if (categoryValues.length === 0) return 0;
    return (
      Math.round(
        (categoryValues.reduce((sum, rating) => sum + rating, 0) /
          categoryValues.length) *
          2,
      ) / 2
    );
  };

  const overallRating = calculateOverallRating();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.subject) {
      newErrors.subject = "Please select a course";
    }

    // Check if at least 3 categories are rated
    const ratedCategories = Object.values(formData.categoryRatings).filter(
      (rating) => rating > 0,
    );
    if (ratedCategories.length < 3) {
      newErrors.categoryRatings = "Please rate at least 3 categories";
    }

    if (!formData.comment.trim()) {
      newErrors.comment = "Please write a review";
    } else if (formData.comment.length < 50) {
      newErrors.comment = "Review must be at least 50 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) return;

    if (!validateForm()) return;

    addReview({
      facultyId: faculty.id,
      studentId: currentUser.id,
      status: "pending",
      rating: overallRating,
      subject: formData.subject,
      comment: formData.comment,
      semester: formData.semester,
      year: formData.year,
      isAnonymous: false,
    });

    onSubmit?.();
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRatingChange = (categoryKey: string, rating: number) => {
    setFormData((prev) => ({
      ...prev,
      categoryRatings: {
        ...prev.categoryRatings,
        [categoryKey]: rating,
      },
    }));

    if (errors.categoryRatings) {
      setErrors((prev) => ({ ...prev, categoryRatings: "" }));
    }
  };

  const handleCourseSelect = (course: string) => {
    setFormData((prev) => ({ ...prev, subject: course }));
    setCourseSearch(course);
    setShowCourseDropdown(false);
    if (errors.subject) {
      setErrors((prev) => ({ ...prev, subject: "" }));
    }
  };

  const getRatingText = (rating: number) => {
    const texts = {
      0.5: "Very Poor",
      1: "Poor",
      1.5: "Below Average",
      2: "Fair",
      2.5: "Average",
      3: "Good",
      3.5: "Very Good",
      4: "Great",
      4.5: "Excellent",
      5: "Outstanding",
    };
    return texts[rating as keyof typeof texts] || "";
  };

  const StarRating = ({
    rating,
    onRatingChange,
  }: {
    rating: number;
    onRatingChange: (rating: number) => void;
  }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const currentRating = hoverRating || rating;
          const isFullStar = starIndex <= currentRating;
          const isHalfStar = starIndex - 0.5 === currentRating;

          return (
            <div key={starIndex} className="relative">
              {/* Half star button (left side) */}
              <button
                type="button"
                className="absolute top-0 left-0 z-10 h-full w-1/2 focus:outline-none"
                onMouseEnter={() => setHoverRating(starIndex - 0.5)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => onRatingChange(starIndex - 0.5)}
              >
                <span className="sr-only">Rate {starIndex - 0.5} stars</span>
              </button>

              {/* Full star button (right side) */}
              <button
                type="button"
                className="absolute top-0 right-0 z-10 h-full w-1/2 focus:outline-none"
                onMouseEnter={() => setHoverRating(starIndex)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => onRatingChange(starIndex)}
              >
                <span className="sr-only">Rate {starIndex} stars</span>
              </button>

              {/* Star visual */}
              <div className="relative h-8 w-8 transition-transform duration-200 hover:scale-110">
                {/* Background (empty star) */}
                <HiOutlineStar className="absolute inset-0 h-8 w-8 text-slate-300" />

                {/* Half star fill */}
                {isHalfStar && (
                  <div className="absolute inset-0 w-1/2 overflow-hidden">
                    <HiStar className="h-8 w-8 text-amber-400" />
                  </div>
                )}

                {/* Full star fill */}
                {isFullStar && !isHalfStar && (
                  <HiStar className="absolute inset-0 h-8 w-8 text-amber-400" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
        {/* Header */}
        <div className="bg-blue-600 px-8 py-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <HiOutlineAcademicCap className="h-8 w-8" />
            </div>
            <div>
              <h2 className="mb-1 flex items-center space-x-2 text-2xl font-bold">
                <span>Write a Review</span>
              </h2>
              <p className="flex items-center space-x-2 text-blue-100">
                <HiOutlineBookOpen className="h-4 w-4" />
                <span>
                  {faculty.name} • {faculty.position} • {faculty.department}
                </span>
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 p-8">
          {/* Course Selection */}
          <div className="space-y-2">
            <label
              htmlFor="courseSearch"
              className="flex items-center space-x-2 text-sm font-bold text-slate-700"
            >
              <HiOutlineBookOpen className="h-4 w-4" />
              <span>Course/Subject *</span>
            </label>
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  id="courseSearch"
                  value={courseSearch}
                  onChange={(e) => {
                    setCourseSearch(e.target.value);
                    setShowCourseDropdown(true);
                  }}
                  onFocus={() => setShowCourseDropdown(true)}
                  placeholder="Search for a course..."
                  className={`w-full rounded-xl border-2 py-3 pr-12 pl-12 text-sm transition-all duration-200 focus:ring-4 focus:outline-none ${
                    errors.subject
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                />
                <HiOutlineSearch className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowCourseDropdown(!showCourseDropdown)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 transform"
                >
                  <HiOutlineChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                      showCourseDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {showCourseDropdown && (
                <div className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-300 bg-white shadow-lg">
                  {filteredCourses.length > 0 ? (
                    <>
                      <div className="border-b border-slate-200 bg-slate-50 px-4 py-2">
                        <p className="flex items-center space-x-1 text-xs font-medium text-slate-600">
                          <HiOutlineLightBulb className="h-3 w-3" />
                          <span>Available courses in {faculty.department}</span>
                        </p>
                      </div>
                      {filteredCourses.map((course) => (
                        <button
                          key={course}
                          type="button"
                          onClick={() => handleCourseSelect(course)}
                          className="flex w-full items-center space-x-3 border-b border-slate-100 px-4 py-3 text-left transition-colors duration-200 last:border-b-0 hover:bg-blue-50"
                        >
                          <HiOutlineBookOpen className="h-4 w-4 flex-shrink-0 text-blue-600" />
                          <span className="text-sm text-slate-700">
                            {course}
                          </span>
                        </button>
                      ))}
                    </>
                  ) : (
                    <div className="px-4 py-8 text-center text-slate-500">
                      <HiOutlineSearch className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                      <p className="text-sm">
                        No courses found matching "{courseSearch}"
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            {errors.subject && (
              <p className="flex items-center space-x-1 text-sm text-red-600">
                <HiOutlineX className="h-4 w-4" />
                <span>{errors.subject}</span>
              </p>
            )}
          </div>

          {/* Category Ratings */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm font-bold text-slate-700">
                <HiOutlineSparkles className="h-4 w-4" />
                <span>Detailed Ratings *</span>
                <span className="text-xs font-normal text-slate-500">
                  (Rate at least 3 categories)
                </span>
              </div>

              {/* Overall Rating Display */}
              {overallRating > 0 && (
                <div className="flex items-center space-x-2 rounded-full bg-blue-600 px-4 py-2 text-white">
                  <HiStar className="h-4 w-4" />
                  <span className="text-sm font-bold">
                    Overall: {overallRating}
                  </span>
                  <span className="text-xs text-blue-200">
                    ({getRatingText(overallRating)})
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {ratingCategories.map((category) => {
                const IconComponent = category.icon;
                const rating =
                  formData.categoryRatings[
                    category.key as keyof typeof formData.categoryRatings
                  ];

                return (
                  <div
                    key={category.key}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-6"
                  >
                    <div className="mb-4 flex items-start space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="mb-1 font-bold text-slate-900">
                          {category.label}
                        </h4>
                        <p className="text-xs text-slate-600">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <StarRating
                        rating={rating}
                        onRatingChange={(newRating) =>
                          handleRatingChange(category.key, newRating)
                        }
                      />
                      {rating > 0 && (
                        <span className="ml-4 text-sm font-bold text-blue-600">
                          {rating} - {getRatingText(rating)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {errors.categoryRatings && (
              <p className="flex items-center space-x-1 text-sm text-red-600">
                <HiOutlineX className="h-4 w-4" />
                <span>{errors.categoryRatings}</span>
              </p>
            )}
          </div>

          {/* Semester & Year */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="semester"
                className="flex items-center space-x-2 text-sm font-bold text-slate-700"
              >
                <HiOutlineSparkles className="h-4 w-4" />
                <span>Semester</span>
              </label>
              <div className="relative">
                <select
                  id="semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className="w-full appearance-none rounded-xl border-2 border-slate-300 bg-white py-3 pr-12 pl-12 text-sm transition-all duration-200 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
                >
                  <option value="Spring">🌸 Spring</option>
                  <option value="Summer">☀️ Summer</option>
                  <option value="Fall">🍂 Fall</option>
                  <option value="Winter">❄️ Winter</option>
                </select>
                <HiOutlineSparkles className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                <HiOutlineChevronDown className="absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="year"
                className="flex items-center space-x-2 text-sm font-bold text-slate-700"
              >
                <HiOutlineClipboardList className="h-4 w-4" />
                <span>Year</span>
              </label>
              <div className="relative">
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full appearance-none rounded-xl border-2 border-slate-300 bg-white py-3 pr-12 pl-12 text-sm transition-all duration-200 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
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
                <HiOutlineClipboardList className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                <HiOutlineChevronDown className="absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
              </div>
            </div>
          </div>

          {/* Review Comment */}
          <div className="space-y-2">
            <label
              htmlFor="comment"
              className="flex items-center space-x-2 text-sm font-bold text-slate-700"
            >
              <HiOutlineChat className="h-4 w-4" />
              <span>Your Review *</span>
            </label>
            <div className="relative">
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                rows={6}
                placeholder="Share your experience with this faculty member. Be honest, constructive, and specific about what made your experience positive or negative. Mention teaching style, course organization, availability, etc."
                className={`w-full resize-none rounded-xl border-2 px-4 py-3 text-sm leading-relaxed transition-all duration-200 focus:ring-4 focus:outline-none ${
                  errors.comment
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-blue-100"
                }`}
              />
              <div className="absolute right-3 bottom-3 text-xs text-slate-500">
                {formData.comment.length}/50 minimum
              </div>
            </div>
            {errors.comment && (
              <p className="flex items-center space-x-1 text-sm text-red-600">
                <HiOutlineX className="h-4 w-4" />
                <span>{errors.comment}</span>
              </p>
            )}
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <h4 className="mb-2 flex items-center space-x-2 font-bold text-blue-900">
                <HiOutlineLightBulb className="h-4 w-4" />
                <span>Tips for a helpful review:</span>
              </h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li className="flex items-start space-x-2">
                  <HiOutlineCheck className="mt-0.5 h-3 w-3 text-blue-600" />
                  <span>
                    Be specific about teaching methods and course structure
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <HiOutlineCheck className="mt-0.5 h-3 w-3 text-blue-600" />
                  <span>
                    Mention workload, grading fairness, and accessibility
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <HiOutlineCheck className="mt-0.5 h-3 w-3 text-blue-600" />
                  <span>
                    Include both positive aspects and areas for improvement
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <HiOutlineCheck className="mt-0.5 h-3 w-3 text-blue-600" />
                  <span>Keep it professional and constructive</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Credit Info */}
          <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-6">
            <div className="flex items-start space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
                <HiOutlineSparkles className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h4 className="mb-2 flex items-center space-x-2 font-bold text-emerald-900">
                  <span>💰 Earn 1 Review Credit</span>
                </h4>
                <p className="text-sm leading-relaxed text-emerald-800">
                  You'll earn <strong>1 Review Credit</strong> for submitting
                  this review! Use credits to unlock and view detailed reviews
                  from other students.
                </p>
                <div className="mt-3 flex items-center space-x-2 text-xs text-emerald-700">
                  <span className="rounded-full bg-emerald-200 px-2 py-1">
                    Current Balance: {currentUser?.reviewCredits || 0} RC
                  </span>
                  <span>→</span>
                  <span className="rounded-full bg-emerald-600 px-2 py-1 text-white">
                    After Submission: {(currentUser?.reviewCredits || 0) + 1} RC
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl border-2 border-slate-300 bg-white px-6 py-3 font-bold text-slate-700 transition-all duration-200 hover:scale-105 hover:border-slate-400 hover:bg-slate-50 focus:ring-4 focus:ring-slate-200 focus:outline-none"
            >
              <span className="flex items-center justify-center space-x-2">
                <HiOutlineX className="h-4 w-4" />
                <span>Cancel</span>
              </span>
            </button>
            <button
              type="submit"
              disabled={
                !formData.subject ||
                !formData.comment ||
                formData.comment.length < 50 ||
                overallRating === 0
              }
              className="flex-1 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-xl focus:ring-4 focus:ring-blue-200 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-400 disabled:hover:scale-100 disabled:hover:shadow-lg"
            >
              <span className="flex items-center justify-center space-x-2">
                <HiOutlineCheck className="h-4 w-4" />
                <span>Submit Review</span>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
