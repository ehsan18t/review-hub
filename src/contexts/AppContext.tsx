import type { Review, User } from "@/data/mockData";
import { mockReviews, mockUsers } from "@/data/mockData";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AppContextType {
  currentUser: User | null;
  reviews: Review[];
  setCurrentUser: (user: User | null) => void;
  addReview: (review: Omit<Review, "id" | "createdAt">) => void;
  updateReviewStatus: (
    reviewId: string,
    status: "approved" | "rejected",
  ) => void;
  addReviewCredits: (userId: string, amount: number) => void;
  spendReviewCredits: (userId: string, amount: number) => boolean;
  spendReviewCredit: () => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);

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

  return (
    <AppContext.Provider
      value={{
        currentUser,
        reviews,
        setCurrentUser,
        addReview,
        updateReviewStatus,
        addReviewCredits,
        spendReviewCredits,
        spendReviewCredit,
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
