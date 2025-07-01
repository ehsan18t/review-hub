import { AppProvider, useApp } from "@/contexts/AppContext";
import { groupMessagesByDate } from "@/data/mockData";
import React, { useEffect, useRef, useState } from "react";
import {
  HiOutlineInformationCircle,
  HiOutlinePaperAirplane,
} from "react-icons/hi";

interface StudentChatViewProps {
  accessUrl: string;
}

const StudentChatViewContent: React.FC<StudentChatViewProps> = ({
  accessUrl,
}) => {
  const {
    currentUser,
    continuousReviewChats,
    continuousReviewMessages,
    addMessageToChat,
  } = useApp();

  const chat = continuousReviewChats.find((c) => c.accessUrl === accessUrl);
  const messages = continuousReviewMessages.filter(
    (m) => m.chatId === chat?.id,
  );

  const [newMessage, setNewMessage] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!chat) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <span className="mb-4 block text-6xl">🔍</span>
          <h1 className="mb-2 text-2xl font-bold text-slate-900">
            Chat Not Found
          </h1>
          <p className="text-slate-600">
            The chat URL you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  // Students cannot access ended chats
  if (!chat.isActive && currentUser?.role === "student") {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="max-w-md text-center">
          <span className="mb-4 block text-6xl">🔒</span>
          <h1 className="mb-2 text-2xl font-bold text-slate-900">
            Chat No Longer Available
          </h1>
          <p className="mb-4 text-slate-600">
            This continuous review session has been closed by the faculty member
            and is no longer accessible to students.
          </p>
          <div className="rounded-lg bg-blue-50 p-4 text-left">
            <h3 className="font-semibold text-blue-900">{chat.title}</h3>
            <p className="text-sm text-blue-700">
              📚 {chat.courseCode} • 📅 {chat.semester} {chat.year}
            </p>
            {chat.description && (
              <p className="mt-2 text-sm text-blue-800">{chat.description}</p>
            )}
            {chat.endedAt && (
              <p className="mt-2 text-xs text-blue-600">
                Ended on {chat.endedAt.toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Faculty can still view ended chats (but will be redirected to management view)
  if (!chat.isActive && currentUser?.role === "faculty") {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="max-w-md text-center">
          <span className="mb-4 block text-6xl">📊</span>
          <h1 className="mb-2 text-2xl font-bold text-slate-900">
            Chat Has Ended
          </h1>
          <p className="mb-4 text-slate-600">
            This chat session has ended. Use the management interface to view
            the conversation history.
          </p>
          <a
            href={`/chat/${chat.accessUrl}/manage`}
            className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700"
          >
            <span>📈</span>
            <span>View Management Interface</span>
          </a>
        </div>
      </div>
    );
  }

  const isBlocked =
    currentUser && chat.blockedStudents.includes(currentUser.id);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentUser || !chat) return;

    addMessageToChat({
      chatId: chat.id,
      studentId: currentUser.id,
      message: newMessage.trim(),
    });

    setNewMessage("");
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex h-screen bg-slate-50">
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">{chat.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-slate-600">
                <span>📚 {chat.courseCode}</span>
                <span>
                  📅 {chat.semester} {chat.year}
                </span>
                <span className="flex items-center space-x-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  <span>Anonymous Chat</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowInfo(true)}
              className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-200"
            >
              <HiOutlineInformationCircle className="mr-1 inline h-4 w-4" />
              Info
            </button>
          </div>
        </div>

        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="border-b border-slate-200 bg-blue-50 px-6 py-4">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">👋</span>
              <div>
                <h3 className="font-semibold text-blue-900">
                  Welcome to the Anonymous Feedback Session!
                </h3>
                <p className="mt-1 text-sm text-blue-800">
                  Share your honest thoughts about the course. Your identity is
                  protected - only your messages will be visible to the
                  instructor.
                </p>
                {chat.description && (
                  <p className="mt-2 text-sm text-blue-700 italic">
                    "{chat.description}"
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {Object.entries(groupedMessages).map(([date, dayMessages]) => (
            <div key={date} className="mb-6">
              <div className="sticky top-0 z-10 mb-4 text-center">
                <span className="rounded-full bg-slate-200 px-3 py-1 text-sm font-medium text-slate-600">
                  {new Date(date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="space-y-4">
                {dayMessages.map((message) => {
                  const isCurrentUser = currentUser?.id === message.studentId;

                  return (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 ${
                        isCurrentUser ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                        👤
                      </div>
                      <div
                        className={`flex-1 ${isCurrentUser ? "text-right" : ""}`}
                      >
                        <div
                          className={`flex items-center space-x-2 ${
                            isCurrentUser
                              ? "flex-row-reverse space-x-reverse"
                              : ""
                          }`}
                        >
                          <span className="font-semibold text-slate-900">
                            {isCurrentUser ? "You" : "Anonymous Student"}
                          </span>
                          <span className="text-xs text-slate-500">
                            {message.createdAt.toLocaleTimeString()}
                          </span>
                        </div>
                        <div
                          className={`mt-1 ${isCurrentUser ? "text-right" : ""}`}
                        >
                          <div
                            className={`inline-block max-w-xs rounded-lg px-4 py-2 ${
                              isCurrentUser
                                ? "bg-blue-600 text-white"
                                : "border border-slate-200 bg-white text-slate-700"
                            }`}
                          >
                            {message.message}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        {!isBlocked ? (
          <div className="border-t border-slate-200 bg-white p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Share your feedback anonymously..."
                  className="w-full resize-none rounded-lg border-2 border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
                  rows={2}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="rounded-lg bg-blue-600 p-3 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-200 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <HiOutlinePaperAirplane className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              💡 Your messages are anonymous. Press Enter to send, Shift+Enter
              for new line.
            </p>
          </div>
        ) : (
          <div className="border-t border-slate-200 bg-red-50 p-4 text-center">
            <p className="text-red-700">
              🚫 You have been blocked from sending messages in this chat.
            </p>
          </div>
        )}
      </div>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 text-center">
              <h2 className="text-xl font-bold text-slate-900">
                Chat Information
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900">{chat.title}</h3>
                <p className="text-sm text-slate-600">
                  📚 {chat.courseCode} • 📅 {chat.semester} {chat.year}
                </p>
              </div>

              {chat.description && (
                <div>
                  <h4 className="font-medium text-slate-700">
                    About this session:
                  </h4>
                  <p className="text-sm text-slate-600">{chat.description}</p>
                </div>
              )}

              <div className="rounded-lg bg-blue-50 p-4">
                <h4 className="mb-2 font-medium text-blue-900">
                  🔒 Privacy & Anonymity
                </h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• Your identity is completely anonymous</li>
                  <li>• Only your messages are visible to the instructor</li>
                  <li>• Be respectful and constructive in your feedback</li>
                  <li>• The instructor can moderate messages if needed</li>
                </ul>
              </div>

              <div className="rounded-lg bg-amber-50 p-4">
                <h4 className="mb-2 font-medium text-amber-900">
                  💡 Tips for Effective Feedback
                </h4>
                <ul className="space-y-1 text-sm text-amber-800">
                  <li>• Be specific about what works or doesn't work</li>
                  <li>• Suggest improvements rather than just criticism</li>
                  <li>• Focus on course content and teaching methods</li>
                  <li>• Keep discussions professional and course-related</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowInfo(false)}
              className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Got it, let's chat!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const StudentChatView: React.FC<StudentChatViewProps> = ({ accessUrl }) => {
  return (
    <AppProvider>
      <StudentChatViewContent accessUrl={accessUrl} />
    </AppProvider>
  );
};

export default StudentChatView;
