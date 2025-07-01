import type { Faculty } from "@/data/mockData";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import ReviewForm from "./ReviewForm";

interface ReviewModalProps {
  faculty: Faculty;
  isOpen: boolean;
  onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  faculty,
  isOpen,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Memoize close handler to prevent unnecessary re-renders
  const handleClose = useCallback(() => {
    if (isAnimating) return;
    onClose();
  }, [onClose, isAnimating]);

  const handleSubmit = () => {
    handleClose();
  };

  const handleCancel = () => {
    handleClose();
  };

  // Handle backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      // Don't close on backdrop click for review form
      return;
    }
  }, []);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;

      setIsVisible(true);
      setIsAnimating(true);
      document.body.style.overflow = "hidden";

      // Focus the modal after animation
      const timer = setTimeout(() => {
        setIsAnimating(false);
        modalRef.current?.focus();
      }, 10);

      return () => clearTimeout(timer);
    } else if (isVisible) {
      setIsAnimating(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsAnimating(false);
        document.body.style.removeProperty("overflow");

        // Restore focus to the previously focused element
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isOpen, isVisible]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, handleClose]);

  // Focus trap for accessibility
  useEffect(() => {
    if (!isOpen || isAnimating) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }, [isOpen, isAnimating]);

  if (!isVisible) return null;

  const backdropClasses = `fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-all duration-300 ${
    isAnimating ? "opacity-0" : "opacity-100"
  }`;

  const modalClasses = `relative w-full max-w-5xl mx-auto my-8 transform transition-all duration-300 focus:outline-none ${
    isAnimating
      ? "opacity-0 scale-95 translate-y-4"
      : "opacity-100 scale-100 translate-y-0"
  }`;

  return createPortal(
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
    >
      {/* Backdrop */}
      <div className={backdropClasses} onClick={handleBackdropClick} />

      {/* Modal Container */}
      <div className="flex min-h-full items-start justify-center p-4">
        <div
          ref={modalRef}
          className={modalClasses}
          onClick={(e) => e.stopPropagation()}
          tabIndex={-1}
        >
          {/* Close Button - Floating */}
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white hover:text-slate-900 hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
              aria-label="Close review form"
            >
              <HiXMark className="h-5 w-5" />
            </button>
          </div>

          {/* Review Form - Unchanged */}
          <div className="relative">
            <ReviewForm
              faculty={faculty}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ReviewModal;
