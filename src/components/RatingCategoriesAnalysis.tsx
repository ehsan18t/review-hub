import type { Faculty } from "@/data/mockData";
import React from "react";
import {
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineChat,
  HiOutlineClipboardList,
  HiOutlineSparkles,
  HiStar,
} from "react-icons/hi";

interface RatingCategoriesAnalysisProps {
  faculty: Faculty;
}

// Mock rating category data - in a real app, this would be calculated from actual review data
const getRatingCategoryData = (facultyId: string) => {
  const categoryData = {
    f1: {
      teaching: { avg: 4.5, count: 22, trend: "+0.3" },
      explanability: { avg: 4.2, count: 20, trend: "+0.1" },
      accessibility: { avg: 4.8, count: 24, trend: "+0.2" },
      coursework: { avg: 3.7, count: 18, trend: "-0.1" },
      engagement: { avg: 3.2, count: 15, trend: "+0.4" },
    },
    f2: {
      teaching: { avg: 4.7, count: 28, trend: "+0.2" },
      explanability: { avg: 4.9, count: 30, trend: "+0.1" },
      accessibility: { avg: 4.6, count: 25, trend: "0.0" },
      coursework: { avg: 4.2, count: 22, trend: "-0.2" },
      engagement: { avg: 4.8, count: 26, trend: "+0.3" },
    },
  };

  return (
    categoryData[facultyId as keyof typeof categoryData] || categoryData.f1
  );
};

const ratingCategories = [
  {
    key: "teaching",
    label: "Teaching Quality",
    icon: HiOutlineAcademicCap,
    description: "Clarity, organization, and effectiveness",
    color: "blue",
  },
  {
    key: "explanability",
    label: "Explanation Skills",
    icon: HiOutlineChat,
    description: "Ability to explain complex concepts",
    color: "emerald",
  },
  {
    key: "accessibility",
    label: "Accessibility",
    icon: HiOutlineSparkles,
    description: "Availability and responsiveness",
    color: "purple",
  },
  {
    key: "coursework",
    label: "Coursework & Exams",
    icon: HiOutlineClipboardList,
    description: "Fairness and relevance of assessments",
    color: "amber",
  },
  {
    key: "engagement",
    label: "Student Engagement",
    icon: HiOutlineBookOpen,
    description: "Ability to maintain interest",
    color: "rose",
  },
];

const RatingCategoriesAnalysis: React.FC<RatingCategoriesAnalysisProps> = ({
  faculty,
}) => {
  const categoryData = getRatingCategoryData(faculty.id);

  const getColorClasses = (color: string, type: "bg" | "text" | "border") => {
    const colorMap = {
      blue: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        border: "border-blue-200",
      },
      emerald: {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        border: "border-emerald-200",
      },
      purple: {
        bg: "bg-purple-100",
        text: "text-purple-700",
        border: "border-purple-200",
      },
      amber: {
        bg: "bg-amber-100",
        text: "text-amber-700",
        border: "border-amber-200",
      },
      rose: {
        bg: "bg-rose-100",
        text: "text-rose-700",
        border: "border-rose-200",
      },
    };

    return (
      colorMap[color as keyof typeof colorMap]?.[type] || colorMap.blue[type]
    );
  };

  const getTrendIcon = (trend: string) => {
    if (trend.startsWith("+")) return "📈";
    if (trend.startsWith("-")) return "📉";
    return "➡️";
  };

  const getTrendColor = (trend: string) => {
    if (trend.startsWith("+")) return "text-emerald-600";
    if (trend.startsWith("-")) return "text-red-600";
    return "text-slate-600";
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <h2 className="flex items-center space-x-2 text-xl font-bold text-slate-900">
          <span>📊</span>
          <span>Rating Categories Analysis</span>
        </h2>
        <p className="text-slate-600">
          Detailed breakdown of student feedback by category
        </p>
      </div>

      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ratingCategories.map((category) => {
            const IconComponent = category.icon;
            const data =
              categoryData[category.key as keyof typeof categoryData];

            return (
              <div
                key={category.key}
                className={`rounded-lg border p-4 ${getColorClasses(category.color, "border")} ${getColorClasses(category.color, "bg")}`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent
                      className={`h-5 w-5 ${getColorClasses(category.color, "text")}`}
                    />
                    <h3
                      className={`font-semibold ${getColorClasses(category.color, "text")}`}
                    >
                      {category.label}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className={getTrendIcon(data.trend)}></span>
                    <span
                      className={`text-sm font-medium ${getTrendColor(data.trend)}`}
                    >
                      {data.trend}
                    </span>
                  </div>
                </div>

                <div className="mb-2 flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <HiStar
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(data.avg)
                            ? getColorClasses(category.color, "text")
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span
                    className={`text-lg font-bold ${getColorClasses(category.color, "text")}`}
                  >
                    {data.avg}
                  </span>
                </div>

                <p className="mb-2 text-xs text-slate-600">
                  {category.description}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Based on {data.count} reviews</span>
                  {data.avg >= 4.5 && (
                    <span className="font-medium text-emerald-600">
                      ⭐ Top Strength
                    </span>
                  )}
                  {data.avg < 3.5 && (
                    <span className="font-medium text-amber-600">
                      ⚠️ Needs Attention
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 rounded-lg bg-slate-50 p-4">
          <h4 className="mb-2 font-semibold text-slate-900">
            📋 Quick Summary
          </h4>
          <div className="grid gap-2 text-sm md:grid-cols-2">
            <div className="flex items-center space-x-2">
              <span className="text-emerald-600">🏆</span>
              <span className="text-gray-600">
                <strong>Top Category:</strong>{" "}
                {ratingCategories.find(
                  (cat) =>
                    categoryData[cat.key as keyof typeof categoryData].avg ===
                    Math.max(...Object.values(categoryData).map((d) => d.avg)),
                )?.label || "N/A"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-amber-600">📈</span>
              <span className="text-gray-600">
                <strong>Most Improved:</strong>{" "}
                {ratingCategories.find((cat) => {
                  const trend =
                    categoryData[cat.key as keyof typeof categoryData].trend;
                  return (
                    trend.startsWith("+") &&
                    parseFloat(trend) ===
                      Math.max(
                        ...Object.values(categoryData).map((d) =>
                          d.trend.startsWith("+") ? parseFloat(d.trend) : 0,
                        ),
                      )
                  );
                })?.label || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingCategoriesAnalysis;
