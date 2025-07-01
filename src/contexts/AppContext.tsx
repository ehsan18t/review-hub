import type {
  ContinuousReviewChat,
  ContinuousReviewMessage,
  Dispute,
  Review,
  User,
} from "@/data/mockData";
import {
  generateCrypticUrl,
  mockContinuousReviewChats,
  mockContinuousReviewMessages,
  mockDisputes,
  mockReviews,
  mockUsers,
} from "@/data/mockData";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AppContextType {
  currentUser: User | null;
  reviews: Review[];
  disputes: Dispute[];
  continuousReviewChats: ContinuousReviewChat[];
  continuousReviewMessages: ContinuousReviewMessage[];
  setCurrentUser: (user: User | null) => void;
  updateUser: (user: User) => void;
  addReview: (review: Omit<Review, "id" | "createdAt">) => void;
  updateReviewStatus: (
    reviewId: string,
    status: "approved" | "rejected",
  ) => void;
  addReviewCredits: (userId: string, amount: number) => void;
  spendReviewCredits: (userId: string, amount: number) => boolean;
  spendReviewCredit: () => boolean;
  createDispute: (
    dispute: Omit<Dispute, "id" | "createdAt" | "updatedAt">,
  ) => void;
  updateDispute: (disputeId: string, updates: Partial<Dispute>) => void;
  resolveDispute: (
    disputeId: string,
    approved: boolean,
    adminNotes: string,
  ) => void;
  createContinuousReviewChat: (
    chat: Omit<
      ContinuousReviewChat,
      "id" | "createdAt" | "accessUrl" | "isActive" | "blockedStudents"
    >,
  ) => ContinuousReviewChat;
  updateContinuousReviewChat: (
    chatId: string,
    updates: Partial<ContinuousReviewChat>,
  ) => void;
  endContinuousReviewChat: (chatId: string) => void;
  blockStudentFromChat: (chatId: string, studentId: string) => void;
  unblockStudentFromChat: (chatId: string, studentId: string) => void;
  generateNewChatUrl: (chatId: string) => string;
  addMessageToChat: (
    message: Omit<ContinuousReviewMessage, "id" | "createdAt" | "isBlocked">,
  ) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [disputes, setDisputes] = useState<Dispute[]>(mockDisputes);
  const [continuousReviewChats, setContinuousReviewChats] = useState<
    ContinuousReviewChat[]
  >(mockContinuousReviewChats);
  const [continuousReviewMessages, setContinuousReviewMessages] = useState<
    ContinuousReviewMessage[]
  >(mockContinuousReviewMessages);

  // Initialize user from localStorage
  useEffect(() => {
    const savedUserType = localStorage.getItem("userType") as
      | "student"
      | "faculty"
      | "admin"
      | null;
    if (savedUserType) {
      const user = mockUsers.find((u) => u.role === savedUserType);
      if (user) {
        setCurrentUserState(user);
      }
    } else {
      // Default to student if no saved preference
      setCurrentUserState(mockUsers[0]);
    }
  }, []);

  const setCurrentUser = (user: User | null) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem("userType", user.role);
    } else {
      localStorage.removeItem("userType");
    }
  };

  const updateUser = (updatedUser: User) => {
    setCurrentUserState(updatedUser);
    // In a real app, this would also update the backend
    // For demo purposes, we just update the local state
  };

  const addReview = (review: Omit<Review, "id" | "createdAt">) => {
    const newReview: Review = {
      ...review,
      id: `r${Date.now()}`,
      createdAt: new Date(),
    };
    setReviews((prev) => [...prev, newReview]);

    // Add review credit to the student
    if (currentUser && currentUser.role === "student") {
      addReviewCredits(currentUser.id, 1);
    }
  };

  const updateReviewStatus = (
    reviewId: string,
    status: "approved" | "rejected",
  ) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId ? { ...review, status } : review,
      ),
    );
  };

  const addReviewCredits = (userId: string, amount: number) => {
    if (currentUser && currentUser.id === userId) {
      const updatedUser = {
        ...currentUser,
        reviewCredits: currentUser.reviewCredits + amount,
      };
      setCurrentUserState(updatedUser);
    }
  };

  const spendReviewCredits = (userId: string, amount: number): boolean => {
    if (
      currentUser &&
      currentUser.id === userId &&
      currentUser.reviewCredits >= amount
    ) {
      const updatedUser = {
        ...currentUser,
        reviewCredits: currentUser.reviewCredits - amount,
      };
      setCurrentUserState(updatedUser);
      return true;
    }
    return false;
  };

  const spendReviewCredit = (): boolean => {
    if (currentUser && currentUser.reviewCredits >= 1) {
      const updatedUser = {
        ...currentUser,
        reviewCredits: currentUser.reviewCredits - 1,
      };
      setCurrentUserState(updatedUser);
      return true;
    }
    return false;
  };

  const createDispute = (
    dispute: Omit<Dispute, "id" | "createdAt" | "updatedAt">,
  ) => {
    const newDispute: Dispute = {
      ...dispute,
      id: `d${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setDisputes((prev) => [...prev, newDispute]);

    // Link the dispute to the review
    setReviews((prev) =>
      prev.map((review) =>
        review.id === dispute.reviewId
          ? { ...review, disputeId: newDispute.id }
          : review,
      ),
    );
  };

  const updateDispute = (disputeId: string, updates: Partial<Dispute>) => {
    setDisputes((prev) =>
      prev.map((dispute) =>
        dispute.id === disputeId
          ? { ...dispute, ...updates, updatedAt: new Date() }
          : dispute,
      ),
    );
  };

  const resolveDispute = (
    disputeId: string,
    approved: boolean,
    adminNotes: string,
  ) => {
    const dispute = disputes.find((d) => d.id === disputeId);
    if (!dispute) return;

    // Update dispute status
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId
          ? {
              ...d,
              status: approved ? "approved" : "rejected",
              adminNotes,
              resolvedAt: new Date(),
              resolvedBy: currentUser?.id,
              updatedAt: new Date(),
            }
          : d,
      ),
    );

    // If dispute is approved, remove the review
    if (approved) {
      setReviews((prev) =>
        prev.map((review) =>
          review.id === dispute.reviewId
            ? { ...review, status: "rejected" }
            : review,
        ),
      );
    }
  };

  // Continuous Review Functions
  const createContinuousReviewChat = (
    chat: Omit<
      ContinuousReviewChat,
      "id" | "createdAt" | "accessUrl" | "isActive" | "blockedStudents"
    >,
  ): ContinuousReviewChat => {
    const newChat: ContinuousReviewChat = {
      ...chat,
      id: `cr${Date.now()}`,
      createdAt: new Date(),
      accessUrl: generateCrypticUrl(),
      isActive: true,
      blockedStudents: [],
    };
    setContinuousReviewChats((prev) => [...prev, newChat]);
    return newChat;
  };

  const updateContinuousReviewChat = (
    chatId: string,
    updates: Partial<ContinuousReviewChat>,
  ) => {
    setContinuousReviewChats((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, ...updates } : chat)),
    );
  };

  const endContinuousReviewChat = (chatId: string) => {
    setContinuousReviewChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? { ...chat, isActive: false, endedAt: new Date() }
          : chat,
      ),
    );
  };

  const blockStudentFromChat = (chatId: string, studentId: string) => {
    setContinuousReviewChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              blockedStudents: [...chat.blockedStudents, studentId],
            }
          : chat,
      ),
    );
  };

  const unblockStudentFromChat = (chatId: string, studentId: string) => {
    setContinuousReviewChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              blockedStudents: chat.blockedStudents.filter(
                (id) => id !== studentId,
              ),
            }
          : chat,
      ),
    );
  };

  const generateNewChatUrl = (chatId: string): string => {
    const newUrl = generateCrypticUrl();
    setContinuousReviewChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, accessUrl: newUrl } : chat,
      ),
    );
    return newUrl;
  };

  const addMessageToChat = (
    message: Omit<ContinuousReviewMessage, "id" | "createdAt" | "isBlocked">,
  ) => {
    const chat = continuousReviewChats.find((c) => c.id === message.chatId);
    const isBlocked =
      chat?.blockedStudents.includes(message.studentId) || false;

    const newMessage: ContinuousReviewMessage = {
      ...message,
      id: `crm${Date.now()}`,
      createdAt: new Date(),
      isBlocked,
    };

    setContinuousReviewMessages((prev) => [...prev, newMessage]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        reviews,
        disputes,
        continuousReviewChats,
        continuousReviewMessages,
        setCurrentUser,
        updateUser,
        addReview,
        updateReviewStatus,
        addReviewCredits,
        spendReviewCredits,
        spendReviewCredit,
        createDispute,
        updateDispute,
        resolveDispute,
        createContinuousReviewChat,
        updateContinuousReviewChat,
        endContinuousReviewChat,
        blockStudentFromChat,
        unblockStudentFromChat,
        generateNewChatUrl,
        addMessageToChat,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
