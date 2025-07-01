import { AppProvider, useApp } from "@/contexts/AppContext";
import {
  getMessagesByChatId,
  type ContinuousReviewChat,
} from "@/data/mockData";
import React, { useState } from "react";
import {
  HiOutlineClipboardCopy,
  HiOutlineCog,
  HiOutlineEye,
  HiOutlinePlus,
  HiOutlineStop,
  HiOutlineX,
} from "react-icons/hi";
import { HiOutlineChatBubbleBottomCenterText } from "react-icons/hi2";
import Navigation from "./Navigation";

const ContinuousReviewsContent: React.FC = () => {
  const {
    currentUser,
    createContinuousReviewChat,
    continuousReviewChats,
    endContinuousReviewChat,
  } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState<ContinuousReviewChat | null>(
    null,
  );
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [newChatForm, setNewChatForm] = useState({
    title: "",
    description: "",
    courseCode: "",
    semester: "Fall",
    year: new Date().getFullYear(),
    maxParticipants: 50,
  });

  if (!currentUser || currentUser.role !== "faculty") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
          <p className="text-slate-600">
            Only faculty members can access this page.
          </p>
        </div>
      </div>
    );
  }

  const facultyChats = continuousReviewChats.filter(
    (chat) => chat.facultyId === currentUser?.id,
  );

  const handleCreateChat = () => {
    const createdChat = createContinuousReviewChat({
      ...newChatForm,
      facultyId: currentUser.id,
    });
    setShowCreateModal(false);
    setNewChatForm({
      title: "",
      description: "",
      courseCode: "",
      semester: "Fall",
      year: new Date().getFullYear(),
      maxParticipants: 50,
    });
  };

  const handleEndChat = (chatId: string) => {
    if (
      window.confirm(
        "Are you sure you want to end this chat? This action cannot be undone.",
      )
    ) {
      endContinuousReviewChat(chatId);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/chat/${text}`);
    // Show toast notification (would implement in real app)
    alert("Chat URL copied to clipboard!");
  };

  const getChatStats = (chat: ContinuousReviewChat) => {
    const messages = getMessagesByChatId(chat.id);
    const uniqueStudents = new Set(messages.map((m) => m.studentId)).size;
    return {
      messages: messages.length,
      participants: uniqueStudents,
      blocked: chat.blockedStudents.length,
    };
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center space-x-3 text-3xl font-bold text-slate-900">
              <HiOutlineChatBubbleBottomCenterText className="h-8 w-8 text-blue-600" />
              <span>Continuous Reviews</span>
            </h1>
            <p className="mt-2 text-slate-600">
              Create anonymous feedback channels for your courses. Get real-time
              insights from students.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
          >
            <HiOutlinePlus className="h-5 w-5" />
            <span>Create Review Chat</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">💬</span>
            <div>
              <p className="text-sm font-medium text-slate-600">Total Chats</p>
              <p className="text-2xl font-bold text-blue-600">
                {facultyChats.length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🟢</span>
            <div>
              <p className="text-sm font-medium text-slate-600">Active Chats</p>
              <p className="text-2xl font-bold text-emerald-600">
                {facultyChats.filter((c) => c.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">💭</span>
            <div>
              <p className="text-sm font-medium text-slate-600">
                Total Messages
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {facultyChats.reduce(
                  (acc, chat) => acc + getChatStats(chat).messages,
                  0,
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">👥</span>
            <div>
              <p className="text-sm font-medium text-slate-600">Participants</p>
              <p className="text-2xl font-bold text-amber-600">
                {facultyChats.reduce(
                  (acc, chat) => acc + getChatStats(chat).participants,
                  0,
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="space-y-6">
        {facultyChats.length === 0 ? (
          <div className="py-12 text-center">
            <span className="mb-4 block text-6xl">💬</span>
            <h3 className="mb-2 text-xl font-bold text-slate-900">
              No review chats yet
            </h3>
            <p className="mx-auto mb-6 max-w-md text-slate-600">
              Create your first continuous review chat to start collecting
              anonymous feedback from students.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
            >
              <HiOutlinePlus className="h-5 w-5" />
              <span>Create Your First Chat</span>
            </button>
          </div>
        ) : (
          facultyChats.map((chat) => {
            const stats = getChatStats(chat);
            return (
              <div
                key={chat.id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="mb-3 flex items-center space-x-3">
                      <h3 className="text-xl font-bold text-slate-900">
                        {chat.title}
                      </h3>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          chat.isActive
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {chat.isActive ? "🟢 Active" : "⏸️ Ended"}
                      </span>
                    </div>
                    <p className="mb-3 text-slate-600">{chat.description}</p>
                    <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center space-x-1">
                        <span>📚</span>
                        <span>{chat.courseCode}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span>📅</span>
                        <span>
                          {chat.semester} {chat.year}
                        </span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span>💬</span>
                        <span>{stats.messages} messages</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span>👥</span>
                        <span>{stats.participants} participants</span>
                      </span>
                      {stats.blocked > 0 && (
                        <span className="flex items-center space-x-1">
                          <span>🚫</span>
                          <span>{stats.blocked} blocked</span>
                        </span>
                      )}
                      {chat.endedAt && (
                        <span className="flex items-center space-x-1">
                          <span>⏰</span>
                          <span>Ended {chat.endedAt.toLocaleDateString()}</span>
                        </span>
                      )}
                    </div>

                    {/* Chat URL - Only show for active chats */}
                    {chat.isActive && (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-xs font-medium tracking-wide text-slate-600 uppercase">
                              Chat URL
                            </p>
                            <p className="font-mono text-sm break-all text-slate-900">
                              {window.location.origin}/chat/{chat.accessUrl}
                            </p>
                          </div>
                          <button
                            onClick={() => copyToClipboard(chat.accessUrl)}
                            className="ml-3 rounded-lg bg-blue-600 p-2 text-white transition-all duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                            title="Copy URL"
                          >
                            <HiOutlineClipboardCopy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Ended chat notice */}
                    {!chat.isActive && (
                      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-amber-600">⚠️</span>
                          <p className="text-sm text-amber-800">
                            This chat has ended. Students can no longer access
                            it, but you can still view the conversation history.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="ml-6 flex flex-col space-y-2">
                    <a
                      href={`/chat/${chat.accessUrl}/manage`}
                      className="inline-flex items-center space-x-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-200 focus:ring-2 focus:ring-slate-200 focus:outline-none"
                    >
                      <HiOutlineEye className="h-4 w-4" />
                      <span>
                        {chat.isActive ? "Manage Chat" : "View History"}
                      </span>
                    </a>
                    <button
                      onClick={() => {
                        setSelectedChat(chat);
                        setShowSettingsModal(true);
                      }}
                      className="inline-flex items-center space-x-2 rounded-lg bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 transition-all duration-200 hover:bg-blue-200 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    >
                      <HiOutlineCog className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                    {chat.isActive ? (
                      <button
                        onClick={() => handleEndChat(chat.id)}
                        className="inline-flex items-center space-x-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 transition-all duration-200 hover:bg-red-200 focus:ring-2 focus:ring-red-200 focus:outline-none"
                      >
                        <HiOutlineStop className="h-4 w-4" />
                        <span>End Chat</span>
                      </button>
                    ) : (
                      <div className="inline-flex items-center justify-center space-x-2 rounded-lg bg-slate-50 px-4 py-2 text-sm font-medium text-slate-500">
                        <span>📊 View Only</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Chat Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                Create Review Chat
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Chat Title *
                </label>
                <input
                  type="text"
                  value={newChatForm.title}
                  onChange={(e) =>
                    setNewChatForm({ ...newChatForm, title: e.target.value })
                  }
                  placeholder="e.g., CS 101 - Mid-Semester Feedback"
                  className="w-full rounded-lg border-2 border-slate-300 px-4 py-3 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>
                <textarea
                  value={newChatForm.description}
                  onChange={(e) =>
                    setNewChatForm({
                      ...newChatForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Tell students what kind of feedback you're looking for..."
                  rows={3}
                  className="w-full resize-none rounded-lg border-2 border-slate-300 px-4 py-3 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    value={newChatForm.courseCode}
                    onChange={(e) =>
                      setNewChatForm({
                        ...newChatForm,
                        courseCode: e.target.value,
                      })
                    }
                    placeholder="e.g., CS 101"
                    className="w-full rounded-lg border-2 border-slate-300 px-4 py-3 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Semester *
                  </label>
                  <select
                    value={newChatForm.semester}
                    onChange={(e) =>
                      setNewChatForm({
                        ...newChatForm,
                        semester: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border-2 border-slate-300 px-4 py-3 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
                  >
                    <option value="Fall">Fall</option>
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                    <option value="Winter">Winter</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Year *
                  </label>
                  <input
                    type="number"
                    value={newChatForm.year}
                    onChange={(e) =>
                      setNewChatForm({
                        ...newChatForm,
                        year: parseInt(e.target.value),
                      })
                    }
                    min="2020"
                    max="2030"
                    className="w-full rounded-lg border-2 border-slate-300 px-4 py-3 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Max Participants (Optional)
                </label>
                <input
                  type="number"
                  value={newChatForm.maxParticipants}
                  onChange={(e) =>
                    setNewChatForm({
                      ...newChatForm,
                      maxParticipants: parseInt(e.target.value),
                    })
                  }
                  min="1"
                  max="500"
                  className="w-full rounded-lg border-2 border-slate-300 px-4 py-3 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Leave empty for unlimited participants
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={handleCreateChat}
                  disabled={!newChatForm.title || !newChatForm.courseCode}
                  className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-200 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Create Chat
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg border-2 border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 focus:ring-2 focus:ring-slate-200 focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal would go here - similar structure */}
    </div>
  );
};

const ContinuousReviews: React.FC = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-50">
        <Navigation />
        <ContinuousReviewsContent />
      </div>
    </AppProvider>
  );
};

export default ContinuousReviews;
