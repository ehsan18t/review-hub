// Mock data for Faculty Review System

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "faculty" | "admin";
  avatar?: string;
  department?: string;
  position?: string;
  bio?: string;
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
  upvotes?: number;
  downvotes?: number;
  createdAt: Date;
  isAnonymous: boolean;
  disputeId?: string; // Link to dispute if one exists
}

export interface Dispute {
  id: string;
  reviewId: string;
  facultyId: string;
  studentId: string;
  status: "pending" | "approved" | "rejected";
  facultyReason: string;
  facultyEvidence?: string;
  studentResponse?: string;
  studentEvidence?: string;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string; // Admin ID
}

export interface AIInsight {
  id: string;
  facultyId: string;
  type: "strength" | "improvement" | "trend";
  title: string;
  description: string;
  confidence: number;
  basedOnReviews: number;
}

export interface DetailedAIInsight {
  id: string;
  facultyId: string;
  type: "actionable" | "strength" | "improvement" | "trend";
  priority?: "high" | "medium" | "low";
  severity?: "high" | "medium" | "low";
  direction?: "positive" | "negative" | "neutral";
  title: string;
  description: string;
  impact?: string;
  timeToImplement?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  specificActions?: string[];
  evidence?: string;
  recommendation?: string;
  suggestions?: string[];
  potentialSolutions?: string[];
  analysis?: string;
  prediction?: string;
  dataPoints?: Array<{
    period?: string;
    courseType?: string;
    rating?: number;
    reviews?: number;
    studentSatisfaction?: string;
  }>;
  basedOnReviews: number;
  confidence: number;
}

// New interfaces for Continuous Review feature
export interface ContinuousReviewChat {
  id: string;
  facultyId: string;
  title: string;
  description: string;
  courseCode: string;
  semester: string;
  year: number;
  isActive: boolean;
  accessUrl: string; // Cryptic URL for access
  createdAt: Date;
  endedAt?: Date;
  blockedStudents: string[]; // Array of student IDs
  maxParticipants?: number;
}

export interface ContinuousReviewMessage {
  id: string;
  chatId: string;
  studentId: string;
  message: string;
  createdAt: Date;
  isBlocked: boolean; // If message was sent by a blocked user
}

// Mock users (keeping existing data)
export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@university.edu",
    role: "student",
    department: "Computer Science",
    reviewCredits: 3,
  },
  {
    id: "f1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    role: "faculty",
    department: "Computer Science",
    position: "Associate Professor",
    bio: "Specializes in Machine Learning and Data Science with 10+ years of teaching experience.",
    reviewCredits: 0,
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@university.edu",
    role: "admin",
    department: "Administration",
    position: "System Administrator",
    bio: "Responsible for managing the faculty review system and ensuring smooth operations.",
    reviewCredits: 0,
  },
  {
    id: "2",
    name: "Emily Davis",
    email: "emily.davis@university.edu",
    role: "student",
    department: "Mathematics",
    reviewCredits: 5,
  },
  {
    id: "4",
    name: "Alex Thompson",
    email: "alex.thompson@university.edu",
    role: "student",
    department: "Computer Science",
    reviewCredits: 2,
  },
  {
    id: "5",
    name: "Sarah Wilson",
    email: "sarah.wilson@university.edu",
    role: "student",
    department: "Computer Science",
    reviewCredits: 4,
  },
];

// Mock faculty (keeping existing data)
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

// Mock continuous review chats
export const mockContinuousReviewChats: ContinuousReviewChat[] = [
  {
    id: "cr1",
    facultyId: "f1",
    title: "CS 101 - Mid-Semester Feedback",
    description:
      "Share your thoughts on the course progress, assignments, and teaching methods.",
    courseCode: "CS 101",
    semester: "Fall",
    year: 2024,
    isActive: true,
    accessUrl: "7f9a8b2c4e6d1a3b5c7e9f0d2a4b6c8e",
    createdAt: new Date("2024-11-01"),
    blockedStudents: [],
    maxParticipants: 50,
  },
  {
    id: "cr2",
    facultyId: "f1",
    title: "CS 201 - Assignment Feedback Session",
    description:
      "Let me know how you're finding the current assignments and any suggestions for improvement.",
    courseCode: "CS 201",
    semester: "Fall",
    year: 2024,
    isActive: false,
    accessUrl: "9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b",
    createdAt: new Date("2024-10-15"),
    endedAt: new Date("2024-10-22"),
    blockedStudents: ["4"],
    maxParticipants: 30,
  },
  {
    id: "cr3",
    facultyId: "f2",
    title: "CS 301 - Final Project Discussion",
    description:
      "Anonymous feedback on the final project requirements and timeline.",
    courseCode: "CS 301",
    semester: "Fall",
    year: 2024,
    isActive: true,
    accessUrl: "3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e",
    createdAt: new Date("2024-11-10"),
    blockedStudents: [],
    maxParticipants: 25,
  },
];

// Mock continuous review messages
export const mockContinuousReviewMessages: ContinuousReviewMessage[] = [
  {
    id: "crm1",
    chatId: "cr1",
    studentId: "1",
    message:
      "The assignments are quite challenging but very helpful for understanding the concepts.",
    createdAt: new Date("2024-11-05T10:30:00"),
    isBlocked: false,
  },
  {
    id: "crm2",
    chatId: "cr1",
    studentId: "2",
    message:
      "Could we have more examples during lectures? Sometimes the pace feels a bit fast.",
    createdAt: new Date("2024-11-05T11:15:00"),
    isBlocked: false,
  },
  {
    id: "crm3",
    chatId: "cr1",
    studentId: "4",
    message:
      "The online resources are great! Really appreciate the detailed explanations.",
    createdAt: new Date("2024-11-06T09:20:00"),
    isBlocked: false,
  },
];

// Mock reviews (keeping existing data)
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
    rating: 2,
    subject: "CS 201 - Data Structures",
    comment:
      "Professor was often unprepared and assignments were unclear. Very disappointing experience.",
    semester: "Spring",
    year: 2024,
    status: "approved",
    createdAt: new Date("2024-05-10"),
    isAnonymous: false,
    disputeId: "d1",
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

// Mock disputes
export const mockDisputes: Dispute[] = [
  {
    id: "d1",
    reviewId: "r3",
    facultyId: "f1",
    studentId: "1",
    status: "pending",
    facultyReason:
      "This review contains false information about my teaching preparation. I maintain detailed lesson plans and always prepare thoroughly for classes.",
    facultyEvidence:
      "I have attached my lesson plans and course materials that demonstrate my preparation level. The student may have missed classes where key concepts were covered.",
    studentResponse:
      "I attended all classes and can provide attendance records. The professor often seemed to struggle with explanations and had to look up answers during class.",
    studentEvidence:
      "I have screenshots of confusing assignment instructions and emails from classmates expressing similar concerns.",
    createdAt: new Date("2024-11-15"),
    updatedAt: new Date("2024-11-20"),
  },
  {
    id: "d2",
    reviewId: "r2",
    facultyId: "f2",
    studentId: "1",
    status: "approved",
    facultyReason: "This review misrepresents the course difficulty level.",
    facultyEvidence:
      "Course syllabus shows appropriate challenge level for the course number.",
    adminNotes:
      "After reviewing evidence, the faculty dispute is valid. The review will be taken down.",
    createdAt: new Date("2024-10-01"),
    updatedAt: new Date("2024-10-15"),
    resolvedAt: new Date("2024-10-15"),
    resolvedBy: "3",
  },
];

// Mock AI insights (keeping existing data)
export const mockAIInsights: AIInsight[] = [
  {
    id: "ai1",
    facultyId: "f1",
    type: "strength",
    title: "Excellent Office Hours Support",
    description:
      "Students consistently praise availability during office hours and individual help.",
    confidence: 0.92,
    basedOnReviews: 15,
  },
  {
    id: "ai2",
    facultyId: "f1",
    type: "improvement",
    title: "Lecture Pace",
    description:
      "Some students find lecture pace too slow. Consider adjusting for different learning speeds.",
    confidence: 0.78,
    basedOnReviews: 8,
  },
  {
    id: "ai3",
    facultyId: "f2",
    type: "strength",
    title: "Well-Structured Courses",
    description:
      "Course organization and structure consistently rated highly by students.",
    confidence: 0.95,
    basedOnReviews: 20,
  },
  {
    id: "ai4",
    facultyId: "f2",
    type: "trend",
    title: "Increasing Student Satisfaction",
    description:
      "Student ratings have improved by 15% over the past two semesters.",
    confidence: 0.88,
    basedOnReviews: 12,
  },
];

// Enhanced AI Insights with detailed teaching recommendations (keeping existing data - truncated for brevity)
export const mockDetailedAIInsights: DetailedAIInsight[] = [
  // Actionable insights for Dr. Sarah Johnson (f1)
  {
    id: "action_f1_1",
    facultyId: "f1",
    type: "actionable",
    priority: "high",
    title: "Implement Interactive Learning Techniques",
    description:
      "45% of students mention wanting more engagement. Try incorporating think-pair-share activities, live polling during lectures, or brief discussion breaks every 15 minutes.",
    impact: "Could increase engagement scores by 25-30%",
    timeToImplement: "1-2 weeks",
    difficulty: "Easy",
    specificActions: [
      "Start each class with a 2-minute discussion question",
      "Use tools like Kahoot or Poll Everywhere for real-time feedback",
      "Implement 'turn and talk' moments during lectures",
    ],
    basedOnReviews: 12,
    confidence: 0.87,
  },
  {
    id: "action_f1_2",
    facultyId: "f1",
    type: "actionable",
    priority: "medium",
    title: "Enhance Assignment Clarity",
    description:
      "Students report confusion about assignment expectations. Create detailed rubrics and provide examples of high-quality work.",
    impact: "Could reduce student anxiety and improve assignment quality",
    timeToImplement: "2-3 weeks",
    difficulty: "Medium",
    specificActions: [
      "Create step-by-step assignment guides with examples",
      "Host optional assignment Q&A sessions",
      "Provide sample work from previous semesters (with permission)",
    ],
    basedOnReviews: 8,
    confidence: 0.82,
  },
  {
    id: "action_f1_3",
    facultyId: "f1",
    type: "actionable",
    priority: "low",
    title: "Optimize Office Hours Structure",
    description:
      "While students appreciate your availability, consider structured office hours with specific topics or group sessions for common questions.",
    impact: "More efficient help delivery and reduced repeated questions",
    timeToImplement: "1 week",
    difficulty: "Easy",
    specificActions: [
      "Designate first 30 minutes for general questions",
      "Create 'Homework Help Wednesday' sessions",
      "Use shared document for FAQ during office hours",
    ],
    basedOnReviews: 15,
    confidence: 0.78,
  },

  // Strengths for Dr. Sarah Johnson (f1)
  {
    id: "strength_f1_1",
    facultyId: "f1",
    type: "strength",
    title: "Outstanding Individual Support",
    description:
      "Students consistently praise your one-on-one mentoring. 92% of reviews mention feeling supported and encouraged during office hours.",
    evidence:
      "Keywords: 'helpful', 'patient', 'encouraging' appear in 89% of positive reviews",
    impact:
      "This personal touch significantly contributes to student success and retention",
    recommendation:
      "Continue this approach and consider mentoring junior faculty on these techniques",
    basedOnReviews: 18,
    confidence: 0.94,
  },
  {
    id: "strength_f1_2",
    facultyId: "f1",
    type: "strength",
    title: "Real-World Application Excellence",
    description:
      "Your ability to connect theoretical concepts to practical applications is highly valued by students.",
    evidence:
      "85% of students mention 'real-world examples' or 'practical applications' positively",
    impact:
      "Helps students understand relevance and improves knowledge retention",
    recommendation:
      "Document these examples to share with colleagues and create a resource bank",
    basedOnReviews: 16,
    confidence: 0.91,
  },

  // Improvements for Dr. Sarah Johnson (f1)
  {
    id: "improve_f1_1",
    facultyId: "f1",
    type: "improvement",
    severity: "medium",
    title: "Lecture Pacing Consistency",
    description:
      "25% of students report difficulty following along when complex topics are introduced rapidly.",
    suggestions: [
      "Use the 'chunk and check' method - introduce concept, pause, check understanding",
      "Provide lecture outlines at the beginning of class",
      "Include more transition statements between topics",
    ],
    potentialSolutions: [
      "Create 'pause points' in your lecture slides",
      "Ask for thumbs up/down understanding checks",
      "Record brief recap videos for complex topics",
    ],
    basedOnReviews: 7,
    confidence: 0.73,
  },
  {
    id: "improve_f1_2",
    facultyId: "f1",
    type: "improvement",
    severity: "low",
    title: "Assessment Feedback Timeliness",
    description:
      "Some students desire faster feedback on assignments, though quality is consistently praised.",
    suggestions: [
      "Consider audio feedback for faster delivery",
      "Use rubrics with pre-written comments for common issues",
      "Implement peer review sessions for draft submissions",
    ],
    potentialSolutions: [
      "Set up voice recording system for personalized feedback",
      "Create feedback templates for common assignment types",
      "Use gradual release: quick initial feedback, detailed feedback later",
    ],
    basedOnReviews: 5,
    confidence: 0.68,
  },

  // Trends for Dr. Sarah Johnson (f1)
  {
    id: "trend_f1_1",
    facultyId: "f1",
    type: "trend",
    direction: "positive",
    title: "Steady Rating Improvement",
    description:
      "Your average rating has increased from 3.8 to 4.2 over the past three semesters.",
    dataPoints: [
      { period: "Spring 2024", rating: 3.8, reviews: 8 },
      { period: "Fall 2024", rating: 4.0, reviews: 12 },
      { period: "Current", rating: 4.2, reviews: 4 },
    ],
    analysis:
      "The upward trend correlates with increased student engagement strategies implemented last year",
    prediction:
      "Continuing current practices could lead to 4.5+ rating by next semester",
    basedOnReviews: 24,
    confidence: 0.85,
  },
  {
    id: "trend_f1_2",
    facultyId: "f1",
    type: "trend",
    direction: "neutral",
    title: "Student Engagement Patterns",
    description:
      "Higher engagement in project-based courses (4.6 avg) vs. lecture-heavy courses (3.9 avg).",
    dataPoints: [
      { courseType: "Project-Based", rating: 4.6, studentSatisfaction: "94%" },
      { courseType: "Lecture-Heavy", rating: 3.9, studentSatisfaction: "78%" },
      { courseType: "Mixed Format", rating: 4.1, studentSatisfaction: "85%" },
    ],
    analysis:
      "Students respond more positively to hands-on learning experiences",
    prediction:
      "Incorporating more project elements could boost overall satisfaction",
    basedOnReviews: 20,
    confidence: 0.79,
  },

  // Insights for Prof. Michael Chen (f2)
  {
    id: "action_f2_1",
    facultyId: "f2",
    type: "actionable",
    priority: "high",
    title: "Leverage Industry Connections Further",
    description:
      "Students love your industry insights. Consider inviting guest speakers or organizing field trips to tech companies.",
    impact: "Could enhance practical learning and career preparation",
    timeToImplement: "3-4 weeks",
    difficulty: "Medium",
    specificActions: [
      "Reach out to 3-4 industry contacts for guest lectures",
      "Organize virtual company tours",
      "Create industry mentor matching program",
    ],
    basedOnReviews: 20,
    confidence: 0.91,
  },
  {
    id: "strength_f2_1",
    facultyId: "f2",
    type: "strength",
    title: "Industry-Relevant Content",
    description:
      "Students highly value the real-world applications and industry connections. Course projects are consistently rated as practical and valuable.",
    evidence:
      "95% of students mention 'practical', 'real-world', or 'industry-relevant' positively",
    impact: "Significantly improves student job readiness and engagement",
    recommendation:
      "Document these industry connections and share with department for broader implementation",
    basedOnReviews: 20,
    confidence: 0.95,
  },

  // Rating Category Analysis for Dr. Sarah Johnson (f1)
  {
    id: "rating_analysis_f1_1",
    facultyId: "f1",
    type: "actionable",
    priority: "medium",
    title: "Improve Student Engagement Strategies",
    description:
      "Based on detailed rating analysis, your lowest-rated category is 'Student Engagement' (3.2/5 avg). Students appreciate your teaching quality but want more interactive elements.",
    impact:
      "Could boost overall rating from 4.2 to 4.6 by focusing on engagement",
    timeToImplement: "2-3 weeks",
    difficulty: "Medium",
    specificActions: [
      "Incorporate 2-3 interactive polls per lecture using tools like Mentimeter",
      "Add 'think-pair-share' activities during complex topics",
      "Create discussion forums for each module to encourage peer interaction",
      "Use real-world case studies that students can actively analyze",
    ],
    basedOnReviews: 18,
    confidence: 0.89,
  },
  {
    id: "rating_analysis_f1_2",
    facultyId: "f1",
    type: "strength",
    title: "Exceptional Accessibility and Support",
    description:
      "Your 'Accessibility' category scores highest at 4.8/5. Students consistently praise your availability and willingness to help.",
    evidence:
      "92% of reviews mention 'helpful office hours', 'always available', or 'patient with questions'",
    impact:
      "This strength significantly contributes to student success and retention rates",
    recommendation:
      "Continue this excellent practice and consider sharing your office hour strategies with colleagues as a best practice model",
    basedOnReviews: 22,
    confidence: 0.96,
  },
  {
    id: "rating_analysis_f1_3",
    facultyId: "f1",
    type: "improvement",
    severity: "low",
    title: "Coursework and Exam Fairness Perception",
    description:
      "While still above average (3.7/5), some students feel assignments could be clearer and exams more aligned with lectures.",
    suggestions: [
      "Provide detailed rubrics for all major assignments",
      "Host review sessions before major exams",
      "Create practice problems that mirror exam format",
      "Offer optional pre-submission feedback for major projects",
    ],
    potentialSolutions: [
      "Develop assignment templates with clear expectations",
      "Record brief explanation videos for complex assignment requirements",
      "Create a FAQ document for common assignment questions",
      "Implement peer review sessions for draft submissions",
    ],
    basedOnReviews: 15,
    confidence: 0.74,
  },
  {
    id: "rating_analysis_f1_4",
    facultyId: "f1",
    type: "trend",
    direction: "positive",
    title: "Teaching Quality Recognition Trend",
    description:
      "Your 'Teaching Quality' rating has improved from 4.0 to 4.5 over the past year, showing consistent enhancement in core instruction.",
    dataPoints: [
      { period: "Spring 2024", rating: 4.0, reviews: 8 },
      { period: "Summer 2024", rating: 4.2, reviews: 5 },
      { period: "Fall 2024", rating: 4.5, reviews: 9 },
    ],
    analysis:
      "The improvement correlates with your adoption of more structured lecture formats and clearer learning objectives",
    prediction:
      "Maintaining current teaching practices should sustain this positive trend and may reach 4.7+ by next semester",
    basedOnReviews: 22,
    confidence: 0.87,
  },

  // Rating insights for Prof. Michael Chen (f2)
  {
    id: "rating_analysis_f2_1",
    facultyId: "f2",
    type: "strength",
    title: "Outstanding Explanation Skills",
    description:
      "Your 'Explanation Skills' category leads at 4.9/5. Students consistently praise your ability to break down complex software engineering concepts.",
    evidence:
      "98% of reviews mention 'clear explanations', 'easy to understand', or 'great at simplifying complex topics'",
    impact:
      "This exceptional skill helps students master difficult programming concepts and builds their confidence",
    recommendation:
      "Consider creating instructional videos or tutorials that can be shared department-wide as teaching resources",
    basedOnReviews: 28,
    confidence: 0.97,
  },
  {
    id: "rating_analysis_f2_2",
    facultyId: "f2",
    type: "actionable",
    priority: "low",
    title: "Optimize Coursework Balance",
    description:
      "While highly rated overall, some students find the coursework load heavy. Consider redistributing assignment weight across the semester.",
    impact:
      "Could improve student satisfaction and reduce end-of-semester stress",
    timeToImplement: "1-2 weeks",
    difficulty: "Easy",
    specificActions: [
      "Break large projects into smaller, milestone-based submissions",
      "Offer bonus points for early submissions to encourage time management",
      "Create optional practice assignments for students who want extra help",
      "Implement peer code review sessions to distribute learning workload",
    ],
    basedOnReviews: 12,
    confidence: 0.73,
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
export const getDisputesByFacultyId = (facultyId: string) =>
  mockDisputes.filter((d) => d.facultyId === facultyId);
export const getDisputesByStudentId = (studentId: string) =>
  mockDisputes.filter((d) => d.studentId === studentId);
export const getPendingDisputes = () =>
  mockDisputes.filter((d) => d.status === "pending");
export const getDisputeByReviewId = (reviewId: string) =>
  mockDisputes.find((d) => d.reviewId === reviewId);
export const getDisputeById = (id: string) =>
  mockDisputes.find((d) => d.id === id);
export const getUserById = (id: string) => mockUsers.find((u) => u.id === id);

// Helper function to get detailed insights by faculty ID
export const getDetailedAIInsightsByFacultyId = (facultyId: string) =>
  mockDetailedAIInsights.filter((insight) => insight.facultyId === facultyId);

// Helper function to get insights by type and faculty ID
export const getDetailedInsightsByType = (
  facultyId: string,
  type: DetailedAIInsight["type"],
) =>
  mockDetailedAIInsights.filter(
    (insight) => insight.facultyId === facultyId && insight.type === type,
  );

// New helper functions for Continuous Review
export const getContinuousReviewChatsByFacultyId = (facultyId: string) =>
  mockContinuousReviewChats.filter((chat) => chat.facultyId === facultyId);

export const getContinuousReviewChatByUrl = (accessUrl: string) =>
  mockContinuousReviewChats.find((chat) => chat.accessUrl === accessUrl);

export const getContinuousReviewChatById = (chatId: string) =>
  mockContinuousReviewChats.find((chat) => chat.id === chatId);

export const getMessagesByChatId = (chatId: string) =>
  mockContinuousReviewMessages.filter((message) => message.chatId === chatId);

// Utility function to generate cryptic URL
export const generateCrypticUrl = (): string => {
  return Math.random().toString(36).substr(2, 32);
};

// Utility function to group messages by date
export const groupMessagesByDate = (messages: ContinuousReviewMessage[]) => {
  const grouped: { [date: string]: ContinuousReviewMessage[] } = {};

  messages.forEach((message) => {
    const dateKey = message.createdAt.toDateString();
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(message);
  });

  return grouped;
};
