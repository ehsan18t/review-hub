import { useApp } from "@/contexts/AppContext";
import { mockUsers } from "@/data/mockData";
import React, { useState } from "react";
import {
  HiOutlineAcademicCap,
  HiOutlineChevronDown,
  HiOutlineDocumentText,
  HiOutlineMenu,
  HiOutlineSearch,
  HiOutlineUser,
  HiOutlineUserGroup,
  HiOutlineViewGrid,
  HiOutlineX,
} from "react-icons/hi";
import { IoNotifications } from "react-icons/io5";
import { TbCoinBitcoin } from "react-icons/tb";
import NotificationSidebar from "./NotificationSidebar";

const Navigation: React.FC = () => {
  const { currentUser, setCurrentUser } = useApp();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleRoleSwitch = (role: "student" | "faculty" | "admin") => {
    const user = mockUsers.find((u) => u.role === role);
    if (user) {
      setCurrentUser(user);
      setShowRoleSwitcher(false);
      setShowMobileMenu(false);
    }
  };

  const handleGetStarted = () => {
    const user = mockUsers.find((u) => u.role === "student");
    if (user) {
      setCurrentUser(user);
    }
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  const getNavigationLinks = () => {
    if (!currentUser) return [];

    const baseLinks = {
      student: [
        { href: "/dashboard", label: "Dashboard", icon: HiOutlineViewGrid },
        { href: "/faculty", label: "Browse Faculty", icon: HiOutlineSearch },
        { href: "/profile", label: "Profile", icon: HiOutlineUser },
      ],
      faculty: [
        {
          href: "/faculty-dashboard",
          label: "Dashboard",
          icon: HiOutlineViewGrid,
        },
        {
          href: "/my-reviews",
          label: "My Reviews",
          icon: HiOutlineDocumentText,
        },
        { href: "/profile", label: "Profile", icon: HiOutlineUser },
      ],
      admin: [
        { href: "/admin", label: "Admin Panel", icon: HiOutlineViewGrid },
        {
          href: "/manage-reviews",
          label: "Manage Reviews",
          icon: HiOutlineDocumentText,
        },
        {
          href: "/manage-users",
          label: "Manage Users",
          icon: HiOutlineUserGroup,
        },
        { href: "/profile", label: "Profile", icon: HiOutlineUser },
      ],
    };

    return baseLinks[currentUser.role] || [];
  };

  return (
    <>
      <nav className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <a
                href="/"
                className="group flex items-center space-x-2 sm:space-x-3"
              >
                <div className="rounded-lg bg-blue-600 p-2 shadow-sm transition-all duration-200 group-hover:bg-blue-700 sm:p-2.5">
                  <HiOutlineAcademicCap className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                </div>
                <span className="text-xl font-bold text-slate-900 transition-colors duration-200 group-hover:text-blue-600">
                  Review Hub
                </span>
              </a>
            </div>

            {/* Desktop Navigation Links */}
            {currentUser && (
              <div className="hidden items-center space-x-1 md:flex">
                {getNavigationLinks().map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:scale-105 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            )}

            {/* Right side actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {currentUser && (
                <>
                  {/* Review Credits (for students) */}
                  {currentUser.role === "student" && (
                    <div className="flex items-center justify-center gap-1 rounded-full bg-emerald-600 px-2 py-1 text-xs font-semibold text-white shadow-sm transition-all duration-200">
                      <TbCoinBitcoin size={20} />
                      <span className="hidden sm:inline">
                        {currentUser.reviewCredits} RC
                      </span>
                      <span className="sm:hidden">
                        {currentUser.reviewCredits}
                      </span>
                    </div>
                  )}

                  {/* Notifications */}
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative rounded-full p-2 text-slate-500 transition-all duration-200 hover:scale-110 hover:bg-slate-100 hover:text-slate-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none sm:p-2.5"
                  >
                    <IoNotifications className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 animate-pulse rounded-full bg-red-500 shadow-sm sm:h-3 sm:w-3"></span>
                  </button>

                  {/* Desktop Role Switcher */}
                  <div className="relative hidden sm:block">
                    <button
                      onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                      className="flex cursor-pointer items-center space-x-3 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-100 hover:shadow-sm"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white transition-colors duration-200 hover:bg-blue-700">
                        {currentUser.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div className="hidden text-left lg:block">
                        <p className="max-w-[120px] truncate font-semibold text-slate-900">
                          {currentUser.name}
                        </p>
                        <p className="text-xs text-slate-600 capitalize">
                          {currentUser.role}
                        </p>
                      </div>
                      <HiOutlineChevronDown className="h-4 w-4 text-slate-400 transition-transform duration-200" />
                    </button>

                    {showRoleSwitcher && (
                      <div className="animate-in slide-in-from-top-2 absolute right-0 z-10 mt-2 w-56 rounded-lg border border-slate-200 bg-white py-2 shadow-xl transition-all duration-200">
                        <div className="border-b border-slate-100 px-4 py-2">
                          <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                            Switch Role (Demo)
                          </p>
                        </div>
                        <div className="py-1">
                          {["student", "faculty", "admin"].map((role) => (
                            <button
                              key={role}
                              onClick={() => handleRoleSwitch(role as any)}
                              className={`w-full px-4 py-2.5 text-left text-sm font-medium capitalize transition-all duration-200 hover:scale-105 hover:bg-slate-50 ${
                                currentUser.role === role
                                  ? "border-r-2 border-blue-600 bg-blue-50 text-blue-600"
                                  : "text-slate-700"
                              }`}
                            >
                              <span className="flex items-center space-x-3">
                                <span
                                  className={`h-2 w-2 rounded-full transition-colors duration-200 ${
                                    currentUser.role === role
                                      ? "bg-blue-600"
                                      : "bg-slate-300"
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

                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="rounded-lg p-2 text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none sm:hidden"
                  >
                    {showMobileMenu ? (
                      <HiOutlineX className="h-6 w-6" />
                    ) : (
                      <HiOutlineMenu className="h-6 w-6" />
                    )}
                  </button>
                </>
              )}

              {!currentUser && (
                <button
                  onClick={handleGetStarted}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none sm:px-6 sm:py-2.5"
                >
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Start</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && currentUser && (
          <div className="animate-in slide-in-from-top border-t border-slate-200 bg-white duration-200 sm:hidden">
            <div className="px-4 py-3">
              {/* User Info */}
              <div className="mb-4 flex items-center space-x-3 rounded-lg bg-slate-50 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {currentUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">
                    {currentUser.name}
                  </p>
                  <p className="text-sm text-slate-600 capitalize">
                    {currentUser.role}
                  </p>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="mb-4 space-y-1">
                {getNavigationLinks().map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <link.icon className="h-5 w-5" />
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>

              {/* Role Switcher */}
              <div className="border-t border-slate-200 pt-4">
                <p className="mb-3 px-3 text-xs font-medium tracking-wide text-slate-500 uppercase">
                  Switch Role (Demo)
                </p>
                <div className="space-y-1">
                  {["student", "faculty", "admin"].map((role) => (
                    <button
                      key={role}
                      onClick={() => handleRoleSwitch(role as any)}
                      className={`flex w-full items-center space-x-3 rounded-lg px-3 py-3 text-sm font-medium capitalize transition-all duration-200 hover:bg-slate-50 ${
                        currentUser.role === role
                          ? "border-l-2 border-blue-600 bg-blue-50 text-blue-600"
                          : "text-slate-700"
                      }`}
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full transition-colors duration-200 ${
                          currentUser.role === role
                            ? "bg-blue-600"
                            : "bg-slate-300"
                        }`}
                      />
                      <span>{role}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* NotificationSidebar */}
      <NotificationSidebar
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* Mobile Menu Backdrop */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 z-20 bg-black/20 sm:hidden"
          onClick={closeMobileMenu}
        />
      )}
    </>
  );
};

export default Navigation;
