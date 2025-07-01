import { AppProvider, useApp } from "@/contexts/AppContext";
import { mockFaculty, mockReviews } from "@/data/mockData";
import React, { useState } from "react";
import {
  HiOutlineAcademicCap,
  HiOutlineChartBar,
  HiOutlineCheck,
  HiOutlineDocumentText,
  HiOutlineMail,
  HiOutlineOfficeBuilding,
  HiOutlinePencil,
  HiOutlineShieldCheck,
  HiOutlineUser,
  HiOutlineX,
} from "react-icons/hi";
import Navigation from "./Navigation";
import ReviewCard from "./ReviewCard";

const ProfileContent: React.FC = () => {
  const { currentUser, updateUser } = useApp();
  const [activeTab, setActiveTab] = useState<
    "profile" | "reviews" | "activity"
  >("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    department: "",
    position: "",
    bio: "",
  });

  if (!currentUser) return null;

  // Initialize edit form when editing starts
  const startEditing = () => {
    setEditForm({
      name: currentUser.name,
      email: currentUser.email,
      department: currentUser.department || "",
      position: currentUser.position || "",
      bio: currentUser.bio || "",
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditForm({
      name: "",
      email: "",
      department: "",
      position: "",
      bio: "",
    });
  };

  const saveProfile = () => {
    updateUser({
      ...currentUser,
      name: editForm.name,
      email: editForm.email,
      department: editForm.department,
      position: editForm.position,
      bio: editForm.bio,
    });
    setIsEditing(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Get user-specific data
  const getUserData = () => {
    if (currentUser.role === "student") {
      const userReviews = mockReviews.filter(
        (r) => r.studentId === currentUser.id,
      );
      const approvedReviews = userReviews.filter(
        (r) => r.status === "approved",
      );
      const pendingReviews = userReviews.filter((r) => r.status === "pending");

      return {
        reviews: userReviews,
        approvedReviews,
        pendingReviews,
        stats: [
          {
            icon: "📝",
            label: "Reviews Written",
            value: userReviews.length,
            color: "text-blue-600",
          },
          {
            icon: "✅",
            label: "Approved",
            value: approvedReviews.length,
            color: "text-emerald-600",
          },
          {
            icon: "⏳",
            label: "Pending",
            value: pendingReviews.length,
            color: "text-amber-600",
          },
          {
            icon: "🎯",
            label: "Faculty Reviewed",
            value: new Set(userReviews.map((r) => r.facultyId)).size,
            color: "text-purple-600",
          },
        ],
      };
    } else if (currentUser.role === "faculty") {
      const facultyData = mockFaculty.find((f) => f.id === currentUser.id);
      const facultyReviews = mockReviews.filter(
        (r) => r.facultyId === currentUser.id,
      );
      const approvedReviews = facultyReviews.filter(
        (r) => r.status === "approved",
      );

      return {
        reviews: facultyReviews,
        approvedReviews,
        pendingReviews: facultyReviews.filter((r) => r.status === "pending"),
        stats: [
          {
            icon: "📊",
            label: "Total Reviews",
            value: facultyReviews.length,
            color: "text-blue-600",
          },
          {
            icon: "⭐",
            label: "Average Rating",
            value: facultyData?.avgRating.toFixed(1) || "0.0",
            color: "text-amber-600",
          },
          {
            icon: "✅",
            label: "Approved",
            value: approvedReviews.length,
            color: "text-emerald-600",
          },
          {
            icon: "👥",
            label: "Students Taught",
            value: new Set(facultyReviews.map((r) => r.studentId)).size,
            color: "text-purple-600",
          },
        ],
      };
    } else {
      // Admin stats
      const allReviews = mockReviews;
      const pendingReviews = allReviews.filter((r) => r.status === "pending");

      return {
        reviews: allReviews,
        approvedReviews: allReviews.filter((r) => r.status === "approved"),
        pendingReviews,
        stats: [
          {
            icon: "👥",
            label: "Total Users",
            value: "50+",
            color: "text-blue-600",
          },
          {
            icon: "🎓",
            label: "Faculty Members",
            value: mockFaculty.length,
            color: "text-emerald-600",
          },
          {
            icon: "📝",
            label: "Total Reviews",
            value: allReviews.length,
            color: "text-purple-600",
          },
          {
            icon: "⏳",
            label: "Pending Reviews",
            value: pendingReviews.length,
            color: "text-amber-600",
          },
        ],
      };
    }
  };

  const userData = getUserData();
  const canEdit =
    currentUser.role === "faculty" || currentUser.role === "admin";

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "student":
        return "🎓";
      case "faculty":
        return "👨‍🏫";
      case "admin":
        return "👑";
      default:
        return "👤";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "student":
        return "text-blue-600";
      case "faculty":
        return "text-emerald-600";
      case "admin":
        return "text-purple-600";
      default:
        return "text-slate-600";
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-3xl font-bold text-white shadow-lg">
              {currentUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="flex-1">
              <div className="mb-2 flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-slate-900">
                  {currentUser.name}
                </h1>
                <div
                  className={`inline-flex items-center space-x-1.5 rounded-full border bg-slate-100 px-3 py-1.5 text-sm font-semibold ${getRoleColor(currentUser.role)}`}
                >
                  <span>{getRoleIcon(currentUser.role)}</span>
                  <span className="capitalize">{currentUser.role}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="flex items-center space-x-2 text-slate-600">
                  <HiOutlineMail className="h-4 w-4" />
                  <span>{currentUser.email}</span>
                </p>
                {currentUser.department && (
                  <p className="flex items-center space-x-2 text-slate-600">
                    <HiOutlineOfficeBuilding className="h-4 w-4" />
                    <span>{currentUser.department}</span>
                  </p>
                )}
                {currentUser.position && (
                  <p className="flex items-center space-x-2 text-slate-600">
                    <HiOutlineAcademicCap className="h-4 w-4" />
                    <span>{currentUser.position}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {currentUser.role === "student" && (
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">
                  💰 {currentUser.reviewCredits}
                </div>
                <div className="text-sm text-slate-600">Review Credits</div>
              </div>
            )}

            {canEdit && (
              <button
                onClick={startEditing}
                className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
              >
                <HiOutlinePencil className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {currentUser.bio && (
          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="leading-relaxed text-slate-700">{currentUser.bio}</p>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 md:grid-cols-4">
        {userData.stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{stat.icon}</span>
              <div>
                <p className="text-sm font-medium text-slate-600">
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8 border-b border-slate-200">
          {[
            { key: "profile", label: "👤 Profile", icon: HiOutlineUser },
            {
              key: "reviews",
              label:
                currentUser.role === "student" ? "📝 My Reviews" : "📊 Reviews",
              icon: HiOutlineDocumentText,
            },
            { key: "activity", label: "📈 Activity", icon: HiOutlineChartBar },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`border-b-2 px-1 py-3 text-sm font-semibold transition-colors duration-200 ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {activeTab === "profile" && (
          <div className="space-y-8 p-8">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center space-x-2 text-2xl font-bold text-slate-900">
                <HiOutlineUser className="h-6 w-6 text-blue-600" />
                <span>Profile Information</span>
              </h2>
              {!canEdit && (
                <div className="flex items-center space-x-1 text-sm text-slate-500">
                  <HiOutlineShieldCheck className="h-4 w-4" />
                  <span>Students cannot edit profile</span>
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-2 border-slate-300 px-4 py-3 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-2 border-slate-300 px-4 py-3 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={editForm.department}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border-2 border-slate-300 px-4 py-3 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
                    />
                  </div>
                  {currentUser.role === "faculty" && (
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Position/Title
                      </label>
                      <input
                        type="text"
                        name="position"
                        value={editForm.position}
                        onChange={handleInputChange}
                        placeholder="e.g., Associate Professor, Assistant Professor"
                        className="w-full rounded-lg border-2 border-slate-300 px-4 py-3 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Bio/Description
                  </label>
                  <textarea
                    name="bio"
                    value={editForm.bio}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder={
                      currentUser.role === "faculty"
                        ? "Tell students about your teaching philosophy, research interests, and academic background..."
                        : "Brief description about yourself..."
                    }
                    className="w-full resize-none rounded-lg border-2 border-slate-300 px-4 py-3 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={saveProfile}
                    className="inline-flex items-center space-x-2 rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-emerald-700 hover:shadow-md focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                  >
                    <HiOutlineCheck className="h-4 w-4" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="inline-flex items-center space-x-2 rounded-lg border-2 border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 focus:ring-2 focus:ring-slate-200 focus:outline-none"
                  >
                    <HiOutlineX className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                    <h3 className="mb-2 flex items-center space-x-2 text-sm font-semibold text-slate-700">
                      <HiOutlineUser className="h-4 w-4" />
                      <span>Full Name</span>
                    </h3>
                    <p className="text-lg font-semibold text-slate-900">
                      {currentUser.name}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                    <h3 className="mb-2 flex items-center space-x-2 text-sm font-semibold text-slate-700">
                      <HiOutlineMail className="h-4 w-4" />
                      <span>Email</span>
                    </h3>
                    <p className="text-lg font-semibold text-slate-900">
                      {currentUser.email}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                    <h3 className="mb-2 flex items-center space-x-2 text-sm font-semibold text-slate-700">
                      <HiOutlineOfficeBuilding className="h-4 w-4" />
                      <span>Department</span>
                    </h3>
                    <p className="text-lg font-semibold text-slate-900">
                      {currentUser.department || "Not specified"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                    <h3 className="mb-2 flex items-center space-x-2 text-sm font-semibold text-slate-700">
                      <span>{getRoleIcon(currentUser.role)}</span>
                      <span>Role</span>
                    </h3>
                    <p
                      className={`text-lg font-semibold capitalize ${getRoleColor(currentUser.role)}`}
                    >
                      {currentUser.role}
                    </p>
                  </div>
                  {currentUser.position && (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 md:col-span-2">
                      <h3 className="mb-2 flex items-center space-x-2 text-sm font-semibold text-slate-700">
                        <HiOutlineAcademicCap className="h-4 w-4" />
                        <span>Position</span>
                      </h3>
                      <p className="text-lg font-semibold text-slate-900">
                        {currentUser.position}
                      </p>
                    </div>
                  )}
                </div>

                {currentUser.bio && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                    <h3 className="mb-3 text-sm font-semibold text-slate-700">
                      Bio/Description
                    </h3>
                    <p className="leading-relaxed text-slate-900">
                      {currentUser.bio}
                    </p>
                  </div>
                )}

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
                  <h3 className="mb-2 font-semibold text-blue-900">
                    {currentUser.role === "student"
                      ? "📚 Student Account"
                      : "🎓 Academic Account"}
                  </h3>
                  <p className="text-sm text-blue-800">
                    {currentUser.role === "student"
                      ? "This is a demo student account. Your profile information is managed by the institution."
                      : "This is a demo academic account. You can edit your profile information to keep it up to date."}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-6 p-8">
            <h2 className="flex items-center space-x-2 text-2xl font-bold text-slate-900">
              <HiOutlineDocumentText className="h-6 w-6 text-blue-600" />
              <span>
                {currentUser.role === "student"
                  ? `My Reviews (${userData.reviews.length})`
                  : currentUser.role === "faculty"
                    ? `Reviews About Me (${userData.reviews.length})`
                    : `All Reviews (${userData.reviews.length})`}
              </span>
            </h2>

            {userData.reviews.length === 0 ? (
              <div className="py-12 text-center">
                <span className="mb-4 block text-6xl">📝</span>
                <h3 className="mb-2 text-xl font-bold text-slate-900">
                  {currentUser.role === "student"
                    ? "No reviews written yet"
                    : currentUser.role === "faculty"
                      ? "No reviews received yet"
                      : "No reviews in the system"}
                </h3>
                <p className="mx-auto mb-6 max-w-md text-slate-600">
                  {currentUser.role === "student"
                    ? "Start by writing your first faculty review to earn credits!"
                    : currentUser.role === "faculty"
                      ? "Students haven't written reviews for your courses yet."
                      : "Reviews will appear here once students start writing them."}
                </p>
                {currentUser.role === "student" && (
                  <a
                    href="/faculty"
                    className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  >
                    <span>🔍</span>
                    <span>Browse Faculty</span>
                  </a>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {userData.reviews.map((review) => {
                  const faculty = mockFaculty.find(
                    (f) => f.id === review.facultyId,
                  );
                  return (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      faculty={faculty}
                      showActions={currentUser.role === "admin"}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-6 p-8">
            <h2 className="flex items-center space-x-2 text-2xl font-bold text-slate-900">
              <HiOutlineChartBar className="h-6 w-6 text-blue-600" />
              <span>Recent Activity</span>
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 rounded-lg border border-slate-200 bg-slate-50 p-6">
                <span className="text-3xl">📝</span>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">
                    {currentUser.role === "student"
                      ? "Wrote a review for Dr. Sarah Johnson"
                      : currentUser.role === "faculty"
                        ? "Received a new review from a student"
                        : "Approved a review for Prof. Michael Chen"}
                  </p>
                  <p className="text-sm text-slate-600">
                    2 days ago
                    {currentUser.role === "student" &&
                      " • Earned 1 Review Credit"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 rounded-lg border border-slate-200 bg-slate-50 p-6">
                <span className="text-3xl">
                  {currentUser.role === "student"
                    ? "👀"
                    : currentUser.role === "faculty"
                      ? "⭐"
                      : "🔍"}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">
                    {currentUser.role === "student"
                      ? "Viewed reviews for Prof. Michael Chen"
                      : currentUser.role === "faculty"
                        ? "Rating updated based on new reviews"
                        : "Reviewed pending submissions"}
                  </p>
                  <p className="text-sm text-slate-600">
                    5 days ago
                    {currentUser.role === "student" &&
                      " • Spent 1 Review Credit"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 rounded-lg border border-slate-200 bg-slate-50 p-6">
                <span className="text-3xl">✅</span>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">
                    {currentUser.role === "student"
                      ? "Review approved for Dr. Lisa Rodriguez"
                      : currentUser.role === "faculty"
                        ? "Profile information updated"
                        : "System maintenance completed"}
                  </p>
                  <p className="text-sm text-slate-600">1 week ago</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Profile: React.FC = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <ProfileContent />
      </div>
    </AppProvider>
  );
};

export default Profile;
