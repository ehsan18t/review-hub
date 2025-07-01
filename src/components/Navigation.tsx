import { useApp } from "@/contexts/AppContext";
import { mockUsers } from "@/data/mockData";
import React, { useState } from "react";
import NotificationSidebar from "./NotificationSidebar";

const Navigation: React.FC = () => {
  const { currentUser, setCurrentUser } = useApp();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleRoleSwitch = (role: "student" | "faculty" | "admin") => {
    const user = mockUsers.find((u) => u.role === role);
    if (user) {
      setCurrentUser(user);
      setShowRoleSwitcher(false);
    }
  };

  const handleGetStarted = () => {
    const user = mockUsers.find((u) => u.role === "student");
    if (user) {
      setCurrentUser(user);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-md transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="group flex items-center space-x-3">
                <div className="rounded-xl bg-blue-600 p-2.5 shadow-md transition-colors duration-200 group-hover:bg-blue-700">
                  <span className="text-xl">🎓</span>
                </div>
                <span className="text-xl font-bold text-gray-900 transition-colors duration-200 group-hover:text-blue-600">
                  Faculty Review Hub
                </span>
              </a>
            </div>

            {/* Navigation Links */}
            {currentUser && (
              <div className="hidden items-center space-x-1 md:flex">
                {currentUser.role === "student" && (
                  <>
                    <a
                      href="/dashboard"
                      className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:scale-105 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Dashboard
                    </a>
                    <a
                      href="/faculty"
                      className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:scale-105 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Browse Faculty
                    </a>
                    <a
                      href="/profile"
                      className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:scale-105 hover:bg-blue-50 hover:text-blue-600"
                    >
                      My Profile
                    </a>
                  </>
                )}

                {currentUser.role === "faculty" && (
                  <>
                    <a
                      href="/faculty-dashboard"
                      className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:scale-105 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Dashboard
                    </a>
                    <a
                      href="/my-reviews"
                      className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:scale-105 hover:bg-blue-50 hover:text-blue-600"
                    >
                      My Reviews
                    </a>
                    <a
                      href="/faculty-profile"
                      className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:scale-105 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Edit Profile
                    </a>
                  </>
                )}

                {currentUser.role === "admin" && (
                  <>
                    <a
                      href="/admin"
                      className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:scale-105 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Admin Panel
                    </a>
                    <a
                      href="/manage-reviews"
                      className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:scale-105 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Manage Reviews
                    </a>
                    <a
                      href="/manage-users"
                      className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:scale-105 hover:bg-blue-50 hover:text-blue-600"
                    >
                      Manage Users
                    </a>
                  </>
                )}
              </div>
            )}

            {/* User Profile & Actions */}
            <div className="flex items-center space-x-4">
              {currentUser && (
                <>
                  {/* Review Credits (for students) */}
                  {currentUser.role === "student" && (
                    <div className="flex items-center space-x-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-emerald-700 hover:shadow-lg">
                      <span>💰</span>
                      <span>{currentUser.reviewCredits} RC</span>
                    </div>
                  )}

                  {/* Notifications */}
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative rounded-full p-3 text-gray-500 transition-all duration-200 hover:scale-110 hover:bg-gray-100 hover:text-gray-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                  >
                    <span className="text-xl">🔔</span>
                    <span className="absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-red-500"></span>
                  </button>

                  {/* Role Switcher */}
                  <div className="relative">
                    <button
                      onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                      className="flex items-center space-x-3 rounded-xl bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-gray-100 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white transition-colors duration-200 hover:bg-blue-700">
                        {currentUser.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div className="hidden text-left sm:block">
                        <p className="font-semibold text-gray-900">
                          {currentUser.name}
                        </p>
                        <p className="text-xs text-gray-600 capitalize">
                          {currentUser.role}
                        </p>
                      </div>
                      <span className="text-gray-400 transition-transform duration-200">
                        ⌄
                      </span>
                    </button>

                    {showRoleSwitcher && (
                      <div className="animate-in slide-in-from-top-2 absolute right-0 z-10 mt-2 w-56 rounded-xl border border-gray-200 bg-white py-2 shadow-xl duration-200">
                        <div className="border-b border-gray-100 px-4 py-2">
                          <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                            Switch Role (Demo)
                          </p>
                        </div>
                        <div className="py-1">
                          {["student", "faculty", "admin"].map((role) => (
                            <button
                              key={role}
                              onClick={() => handleRoleSwitch(role as any)}
                              className={`w-full px-4 py-3 text-left text-sm font-medium capitalize transition-all duration-200 hover:scale-105 hover:bg-gray-50 ${
                                currentUser.role === role
                                  ? "border-r-2 border-blue-600 bg-blue-50 text-blue-600"
                                  : "text-gray-700"
                              }`}
                            >
                              <span className="flex items-center space-x-3">
                                <span
                                  className={`h-2 w-2 rounded-full transition-colors duration-200 ${
                                    currentUser.role === role
                                      ? "bg-blue-600"
                                      : "bg-gray-300"
                                  }`}
                                />
                                <span>{role}</span>
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {!currentUser && (
                <button
                  onClick={handleGetStarted}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="border-t border-gray-100 px-4 py-2 md:hidden">
          <button className="w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gray-50">
            <span className="mr-2">☰</span>
            Menu
          </button>
        </div>
      </nav>

      {/* NotificationSidebar */}
      <NotificationSidebar
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
};

export default Navigation;
