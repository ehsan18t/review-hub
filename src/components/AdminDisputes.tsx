import { AppProvider, useApp } from "@/contexts/AppContext";
import { getFacultyById, mockReviews, type Dispute } from "@/data/mockData";
import React, { useState } from "react";
import {
  HiOutlineCheck,
  HiOutlineChevronDown,
  HiOutlineClock,
  HiOutlineEye,
  HiOutlineFilter,
  HiOutlineSearch,
  HiOutlineX,
} from "react-icons/hi";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import Navigation from "./Navigation";

const AdminDisputesContent: React.FC = () => {
  const { currentUser, disputes } = useApp();
  const [filterBy, setFilterBy] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <HiOutlineExclamationTriangle className="h-8 w-8" />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-slate-900">
            Access Denied
          </h1>
          <p className="mb-6 text-slate-600">
            You don't have permission to access this page.
          </p>
          <a
            href="/"
            className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-blue-700"
          >
            <span>Go Home</span>
          </a>
        </div>
      </div>
    );
  }

  const getFilteredDisputes = () => {
    let filtered = disputes;

    // Filter by status
    if (filterBy !== "all") {
      filtered = filtered.filter((dispute) => dispute.status === filterBy);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((dispute) => {
        const faculty = getFacultyById(dispute.facultyId);
        const review = mockReviews.find((r) => r.id === dispute.reviewId);
        return (
          faculty?.name.toLowerCase().includes(term) ||
          dispute.facultyReason.toLowerCase().includes(term) ||
          review?.subject.toLowerCase().includes(term) ||
          dispute.id.toLowerCase().includes(term)
        );
      });
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  };

  const filteredDisputes = getFilteredDisputes();

  const getStatusBadge = (status: Dispute["status"]) => {
    const statusConfig = {
      pending: {
        color: "bg-amber-50 text-amber-700 border-amber-200",
        text: "⏳ Pending",
        icon: HiOutlineClock,
      },
      approved: {
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        text: "✅ Approved",
        icon: HiOutlineCheck,
      },
      rejected: {
        color: "bg-red-50 text-red-700 border-red-200",
        text: "❌ Rejected",
        icon: HiOutlineX,
      },
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <div
        className={`inline-flex items-center space-x-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${config.color}`}
      >
        <IconComponent className="h-3 w-3" />
        <span>{config.text}</span>
      </div>
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDisputeStats = () => {
    const pending = disputes.filter((d) => d.status === "pending").length;
    const approved = disputes.filter((d) => d.status === "approved").length;
    const rejected = disputes.filter((d) => d.status === "rejected").length;
    return { pending, approved, rejected, total: disputes.length };
  };

  const stats = getDisputeStats();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="flex items-center space-x-3 text-3xl font-bold text-slate-900">
                <span>⚖️</span>
                <span>Dispute Management</span>
              </h1>
              <p className="mt-2 text-slate-600">
                Review and resolve faculty disputes about student reviews
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">📊</span>
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Disputes
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">⏳</span>
              <div>
                <p className="text-sm font-medium text-amber-700">Pending</p>
                <p className="text-2xl font-bold text-amber-900">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">✅</span>
              <div>
                <p className="text-sm font-medium text-emerald-700">Approved</p>
                <p className="text-2xl font-bold text-emerald-900">
                  {stats.approved}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">❌</span>
              <div>
                <p className="text-sm font-medium text-red-700">Rejected</p>
                <p className="text-2xl font-bold text-red-900">
                  {stats.rejected}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex min-w-0 flex-1 items-center space-x-2">
              <HiOutlineSearch className="h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search disputes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-2">
              <HiOutlineFilter className="h-4 w-4 text-slate-500" />
              <div className="relative">
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as any)}
                  className="appearance-none rounded-lg border border-slate-300 bg-white py-2 pr-8 pl-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                >
                  <option value="all">All Disputes</option>
                  <option value="pending">⏳ Pending</option>
                  <option value="approved">✅ Approved</option>
                  <option value="rejected">❌ Rejected</option>
                </select>
                <HiOutlineChevronDown className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Disputes List */}
        {filteredDisputes.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <span className="text-3xl">⚖️</span>
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900">
              {filterBy === "all"
                ? "No disputes found"
                : `No ${filterBy} disputes`}
            </h3>
            <p className="text-slate-600">
              {searchTerm
                ? `No disputes match your search "${searchTerm}"`
                : filterBy === "all"
                  ? "All disputes will appear here when they are filed"
                  : `No ${filterBy} disputes at this time`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDisputes.map((dispute) => {
              const faculty = getFacultyById(dispute.facultyId);
              const review = mockReviews.find((r) => r.id === dispute.reviewId);
              return (
                <div
                  key={dispute.id}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-3 flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                          <HiOutlineExclamationTriangle className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-bold text-slate-900">
                            Dispute #{dispute.id.slice(-6).toUpperCase()}
                          </h3>
                          <p className="text-sm text-slate-600">
                            Faculty: {faculty?.name} • Filed{" "}
                            {formatDate(dispute.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4 space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-slate-600">
                            Subject:
                          </span>
                          <span className="text-sm text-slate-900">
                            {review?.subject || "Unknown Subject"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-slate-600">
                            Rating:
                          </span>
                          <div className="flex items-center space-x-1">
                            <span>{"⭐".repeat(review?.rating || 0)}</span>
                            <span className="text-sm text-slate-600">
                              ({review?.rating || 0}/5)
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <span className="text-sm font-medium text-slate-600">
                            Reason:
                          </span>
                          <span className="text-sm text-slate-900">
                            {dispute.facultyReason.length > 100
                              ? `${dispute.facultyReason.slice(0, 100)}...`
                              : dispute.facultyReason}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {getStatusBadge(dispute.status)}
                        {dispute.studentResponse && (
                          <div className="inline-flex items-center space-x-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                            <span>💬</span>
                            <span>Student Responded</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="ml-4 flex-shrink-0">
                      <a
                        href={`/admin/disputes/${dispute.id}`}
                        className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-700"
                      >
                        <HiOutlineEye className="h-4 w-4" />
                        <span>Review</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const AdminDisputes: React.FC = () => {
  return (
    <AppProvider>
      <AdminDisputesContent />
    </AppProvider>
  );
};

export default AdminDisputes;
