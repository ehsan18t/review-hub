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
      <nav className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="flex items-center space-x-2">
                <span className="text-2xl">🎓</span>
                <span className="text-xl font-bold text-gray-900">
                  Faculty Review Hub
                </span>
              </a>
            </div>

            {/* Navigation Links */}
            {currentUser && (
              <div className="hidden items-center space-x-8 md:flex">
                {currentUser.role === "student" && (
                  <>
                    <a
                      href="/dashboard"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                    >
                      Dashboard
                    </a>
                    <a
                      href="/faculty"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                    >
                      Browse Faculty
                    </a>
                    <a
                      href="/profile"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                    >
                      My Profile
                    </a>
                  </>
                )}

                {currentUser.role === "faculty" && (
                  <>
                    <a
                      href="/faculty-dashboard"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                    >
                      Dashboard
                    </a>
                    <a
                      href="/my-reviews"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                    >
                      My Reviews
                    </a>
                    <a
                      href="/faculty-profile"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                    >
                      Edit Profile
                    </a>
                  </>
                )}

                {currentUser.role === "admin" && (
                  <>
                    <a
                      href="/admin"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                    >
                      Admin Panel
                    </a>
                    <a
                      href="/manage-reviews"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
                    >
                      Manage Reviews
                    </a>
                    <a
                      href="/manage-users"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
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
                    <div className="flex items-center space-x-1 rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                      <span>💰</span>
                      <span>{currentUser.reviewCredits} RC</span>
                    </div>
                  )}

                  {/* Notifications */}
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative rounded-full p-2 text-gray-400 hover:text-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <span className="text-xl">🔔</span>
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
                  </button>

                  {/* Role Switcher */}
                  <div className="relative">
                    <button
                      onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                      className="flex items-center space-x-2 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200 hover:text-blue-600"
                    >
                      <span>👤</span>
                      <span>{currentUser.name}</span>
                      <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800 capitalize">
                        {currentUser.role}
                      </span>
                      <span>⌄</span>
                    </button>

                    {showRoleSwitcher && (
                      <div className="absolute right-0 z-10 mt-2 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                        <div className="border-b px-4 py-2 text-xs text-gray-500">
                          Switch Role (Demo)
                        </div>
                        {["student", "faculty", "admin"].map((role) => (
                          <button
                            key={role}
                            onClick={() => handleRoleSwitch(role as any)}
                            className={`w-full px-4 py-2 text-left text-sm capitalize hover:bg-gray-100 ${
                              currentUser.role === role
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-700"
                            }`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {!currentUser && (
                <button
                  onClick={handleGetStarted}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="border-t border-gray-200 px-4 py-2 md:hidden">
          <button className="w-full px-4 py-2 text-left text-sm text-gray-700">
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
