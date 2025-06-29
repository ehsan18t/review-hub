// Mock data for Faculty Review System

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "faculty" | "admin";
  avatar?: string;
  department?: string;
  reviewCredits: number;
}

export interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  avatar?: string;
  bio?: string;
  avgRating: number;
  totalReviews: number;
}

export interface Review {
  id: string;
  facultyId: string;
  studentId: string;
  rating: number;
  subject: string;
  comment: string;
  semester: string;
  year: number;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  isAnonymous: boolean;
}

export interface AIInsight {
  id: string;
  facultyId: string;
  type: "strength" | "improvement" | "trend";
  title: string;
  description: string;
  confidence: number;
}

// Mock users
export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@university.edu",
    role: "student",
    department: "Computer Science",
    reviewCredits: 5,
  },
  {
    id: "2",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    role: "faculty",
    department: "Computer Science",
    reviewCredits: 0,
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@university.edu",
    role: "admin",
    reviewCredits: 0,
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@university.edu",
    role: "student",
    department: "Mathematics",
    reviewCredits: 3,
  },
];

// Mock faculty
export const mockFaculty: Faculty[] = [
  {
    id: "f1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    department: "Computer Science",
    position: "Associate Professor",
    bio: "Specializes in Machine Learning and Data Science with 10+ years of teaching experience.",
    avgRating: 4.2,
    totalReviews: 24,
  },
  {
    id: "f2",
    name: "Prof. Michael Chen",
    email: "michael.chen@university.edu",
    department: "Computer Science",
    position: "Professor",
    bio: "Expert in Software Engineering and Algorithms. Department Head since 2020.",
    avgRating: 4.7,
    totalReviews: 31,
  },
  {
    id: "f3",
    name: "Dr. Lisa Rodriguez",
    email: "lisa.rodriguez@university.edu",
    department: "Mathematics",
    position: "Assistant Professor",
    bio: "Research focus on Applied Mathematics and Statistics.",
    avgRating: 3.9,
    totalReviews: 18,
  },
  {
    id: "f4",
    name: "Dr. James Wilson",
    email: "james.wilson@university.edu",
    department: "Physics",
    position: "Professor",
    bio: "Theoretical Physics researcher with expertise in Quantum Mechanics.",
    avgRating: 4.5,
    totalReviews: 27,
  },
  {
    id: "f5",
    name: "Dr. Maria Garcia",
    email: "maria.garcia@university.edu",
    department: "Chemistry",
    position: "Associate Professor",
    bio: "Organic Chemistry specialist with focus on sustainable synthesis.",
    avgRating: 4.1,
    totalReviews: 22,
  },
];

// Mock reviews
export const mockReviews: Review[] = [
  {
    id: "r1",
    facultyId: "f1",
    studentId: "1",
    rating: 5,
    subject: "CS 101 - Introduction to Programming",
    comment:
      "Excellent teacher! Very clear explanations and helpful during office hours.",
    semester: "Fall",
    year: 2024,
    status: "approved",
    createdAt: new Date("2024-12-01"),
    isAnonymous: false,
  },
  {
    id: "r2",
    facultyId: "f2",
    studentId: "4",
    rating: 4,
    subject: "CS 301 - Software Engineering",
    comment:
      "Great course structure, but assignments could be more challenging.",
    semester: "Fall",
    year: 2024,
    status: "pending",
    createdAt: new Date("2024-12-15"),
    isAnonymous: true,
  },
  {
    id: "r3",
    facultyId: "f1",
    studentId: "4",
    rating: 3,
    subject: "CS 201 - Data Structures",
    comment: "Good content but lectures can be a bit slow-paced.",
    semester: "Spring",
    year: 2024,
    status: "approved",
    createdAt: new Date("2024-05-10"),
    isAnonymous: true,
  },
  {
    id: "r4",
    facultyId: "f3",
    studentId: "1",
    rating: 4,
    subject: "MATH 205 - Calculus II",
    comment: "Very helpful with problem-solving techniques.",
    semester: "Fall",
    year: 2024,
    status: "pending",
    createdAt: new Date("2024-12-20"),
    isAnonymous: false,
  },
];

// Mock AI insights
export const mockAIInsights: AIInsight[] = [
  {
    id: "ai1",
    facultyId: "f1",
    type: "strength",
    title: "Excellent Office Hours Support",
    description:
      "Students consistently praise availability during office hours and individual help.",
    confidence: 0.92,
  },
  {
    id: "ai2",
    facultyId: "f1",
    type: "improvement",
    title: "Lecture Pace",
    description:
      "Some students find lecture pace too slow. Consider adjusting for different learning speeds.",
    confidence: 0.78,
  },
  {
    id: "ai3",
    facultyId: "f2",
    type: "strength",
    title: "Well-Structured Courses",
    description:
      "Course organization and structure consistently rated highly by students.",
    confidence: 0.95,
  },
  {
    id: "ai4",
    facultyId: "f2",
    type: "trend",
    title: "Increasing Student Satisfaction",
    description:
      "Student ratings have improved by 15% over the past two semesters.",
    confidence: 0.88,
  },
];

// Helper functions
export const getFacultyById = (id: string) =>
  mockFaculty.find((f) => f.id === id);
export const getReviewsByFacultyId = (facultyId: string) =>
  mockReviews.filter((r) => r.facultyId === facultyId);
export const getApprovedReviewsByFacultyId = (facultyId: string) =>
  mockReviews.filter(
    (r) => r.facultyId === facultyId && r.status === "approved",
  );
export const getPendingReviews = () =>
  mockReviews.filter((r) => r.status === "pending");
export const getAIInsightsByFacultyId = (facultyId: string) =>
  mockAIInsights.filter((ai) => ai.facultyId === facultyId);
