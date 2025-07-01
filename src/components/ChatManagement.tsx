import { AppProvider, useApp } from "@/contexts/AppContext";
import { groupMessagesByDate } from "@/data/mockData";
import React, { useEffect, useRef, useState } from "react";
import {
  HiOutlineClipboardCopy,
  HiOutlineCog,
  HiOutlineEye,
  HiOutlinePaperAirplane,
  HiOutlineRefresh,
  HiOutlineStop,
  HiOutlineUserGroup,
  HiOutlineX,
} from "react-icons/hi";

interface ChatManagementProps {
  accessUrl: string;
}

const ChatManagementContent: React.FC<ChatManagementProps> = ({
  accessUrl,
}) => {
  const {
    currentUser,
    continuousReviewChats,
    continuousReviewMessages,
    addMessageToChat,
    blockStudentFromChat,
    unblockStudentFromChat,
    endContinuousReviewChat,
    generateNewChatUrl,
  } = useApp();

  const chat = continuousReviewChats.find((c) => c.accessUrl === accessUrl);
  const messages = continuousReviewMessages.filter(
    (m) => m.chatId === chat?.id,
  );

  const [newMessage, setNewMessage] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
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

  // Only show this message to non-faculty users or if faculty is not the owner
  const isFaculty = currentUser?.role === "faculty";
  const isChatOwner = isFaculty && currentUser?.id === chat.facultyId;

  if (!chat.isActive && !isChatOwner) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <span className="mb-4 block text-6xl">⏸️</span>
          <h1 className="mb-2 text-2xl font-bold text-slate-900">
            Chat Has Ended
          </h1>
          <p className="text-slate-600">
            This continuous review session has been closed by the faculty
            member.
          </p>
        </div>
      </div>
    );
  }

  const isBlocked =
    currentUser && chat.blockedStudents.includes(currentUser.id);

  const handleSendMessage = () => {
    if (
      !newMessage.trim() ||
      !currentUser ||
      !chat ||
      isBlocked ||
      !chat.isActive
    )
      return;

    addMessageToChat({
      chatId: chat.id,
      studentId: currentUser.id,
      message: newMessage.trim(),
    });

    setNewMessage("");
  };

  const handleBlockUser = (studentId: string) => {
    if (chat) {
      blockStudentFromChat(chat.id, studentId);
    }
  };

  const handleUnblockUser = (studentId: string) => {
    if (chat) {
      unblockStudentFromChat(chat.id, studentId);
    }
  };

  const handleEndChat = () => {
    if (
      chat &&
      window.confirm(
        "Are you sure you want to end this chat? This action cannot be undone.",
      )
    ) {
      endContinuousReviewChat(chat.id);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/chat/${chat.accessUrl}`,
    );
    alert("Chat URL copied to clipboard!");
  };

  const generateNewUrl = () => {
    if (
      chat &&
      window.confirm("Generate a new URL? The old URL will stop working.")
    ) {
      generateNewChatUrl(chat.id);
    }
  };

  const groupedMessages = groupMessagesByDate(messages);
  const uniqueParticipants = new Set(messages.map((m) => m.studentId));

  // Generate anonymous identifiers for students
  const getAnonymousId = (studentId: string): string => {
    const participantsList = Array.from(uniqueParticipants).sort();
    const index = participantsList.indexOf(studentId);
    return `Student ${String.fromCharCode(65 + index)}`;
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Main Chat Area */}
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
                  <span
                    className={`h-2 w-2 rounded-full ${
                      chat.isActive ? "bg-emerald-500" : "bg-slate-400"
                    }`}
                  ></span>
                  <span>{chat.isActive ? "Active" : "Ended"}</span>
                </span>
                {!chat.isActive && chat.endedAt && (
                  <span className="text-xs text-slate-500">
                    Ended on {chat.endedAt.toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            {isChatOwner && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowParticipants(true)}
                  className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-200"
                >
                  <HiOutlineUserGroup className="mr-1 inline h-4 w-4" />
                  {uniqueParticipants.size} Participants
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                >
                  <HiOutlineCog className="h-4 w-4" />
                </button>
                {chat.isActive ? (
                  <button
                    onClick={handleEndChat}
                    className="rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-200"
                  >
                    <HiOutlineStop className="mr-1 inline h-4 w-4" />
                    End Chat
                  </button>
                ) : (
                  <div className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600">
                    <HiOutlineEye className="mr-1 inline h-4 w-4" />
                    View Only
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Chat Status Banner for Ended Chats */}
        {!chat.isActive && isChatOwner && (
          <div className="border-b border-amber-200 bg-amber-50 px-6 py-3">
            <div className="flex items-center space-x-2">
              <span className="text-amber-600">📊</span>
              <div>
                <p className="font-semibold text-amber-900">
                  Chat History View
                </p>
                <p className="text-sm text-amber-800">
                  This chat has ended. You can review the conversation history
                  but no new messages can be sent.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <span className="mb-4 block text-6xl">💬</span>
                <h3 className="mb-2 text-lg font-semibold text-slate-700">
                  {chat.isActive
                    ? "No messages yet"
                    : "No messages in this chat"}
                </h3>
                <p className="text-slate-500">
                  {chat.isActive
                    ? "Be the first to start the conversation!"
                    : "This chat ended without any messages."}
                </p>
              </div>
            </div>
          ) : (
            Object.entries(groupedMessages).map(([date, dayMessages]) => (
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
                    const isFacultyMessage = isChatOwner && isCurrentUser;

                    return (
                      <div
                        key={message.id}
                        className="flex items-start space-x-3"
                      >
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${
                            isFacultyMessage ? "bg-emerald-600" : "bg-blue-600"
                          }`}
                        >
                          {isFacultyMessage ? "👨‍🏫" : "👤"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-slate-900">
                              {isFacultyMessage
                                ? "You (Faculty)"
                                : isChatOwner
                                  ? getAnonymousId(message.studentId)
                                  : isCurrentUser
                                    ? "You"
                                    : "Anonymous Student"}
                            </span>
                            <span className="text-xs text-slate-500">
                              {message.createdAt.toLocaleTimeString()}
                            </span>
                            {isChatOwner && !isCurrentUser && chat.isActive && (
                              <button
                                onClick={() =>
                                  chat.blockedStudents.includes(
                                    message.studentId,
                                  )
                                    ? handleUnblockUser(message.studentId)
                                    : handleBlockUser(message.studentId)
                                }
                                className={`rounded px-2 py-1 text-xs ${
                                  chat.blockedStudents.includes(
                                    message.studentId,
                                  )
                                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                              >
                                {chat.blockedStudents.includes(
                                  message.studentId,
                                )
                                  ? "Unblock"
                                  : "Block"}
                              </button>
                            )}
                            {!chat.isActive &&
                              isChatOwner &&
                              chat.blockedStudents.includes(
                                message.studentId,
                              ) && (
                                <span className="rounded bg-red-100 px-2 py-1 text-xs text-red-700">
                                  Was Blocked
                                </span>
                              )}
                          </div>
                          <p className="mt-1 text-slate-700">
                            {message.message}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input - Only show if chat is active */}
        {chat.isActive && !isBlocked && (
          <div className="border-t border-slate-200 bg-white p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={
                    isChatOwner
                      ? "Send a message to your students..."
                      : "Share your anonymous feedback..."
                  }
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
          </div>
        )}

        {/* Blocked message for active chats */}
        {chat.isActive && isBlocked && (
          <div className="border-t border-slate-200 bg-red-50 p-4 text-center">
            <p className="text-red-700">
              🚫 You have been blocked from sending messages in this chat.
            </p>
          </div>
        )}

        {/* Ended chat message */}
        {!chat.isActive && !isChatOwner && (
          <div className="border-t border-slate-200 bg-slate-100 p-4 text-center">
            <p className="text-slate-700">
              📊 This chat has ended. No new messages can be sent.
            </p>
          </div>
        )}
      </div>

      {/* Settings Modal - Only show for active chats or chat owners */}
      {showSettings && isChatOwner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                Chat Settings
              </h2>
              <button
                onClick={() => setShowSettings(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {chat.isActive && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Chat URL
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={`${window.location.origin}/chat/${chat.accessUrl}`}
                        readOnly
                        className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-sm"
                      />
                      <button
                        onClick={copyUrl}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                      >
                        <HiOutlineClipboardCopy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        Generate New URL
                      </h3>
                      <p className="text-sm text-slate-600">
                        Create a new access URL. The old URL will stop working.
                      </p>
                    </div>
                    <button
                      onClick={generateNewUrl}
                      className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                    >
                      <HiOutlineRefresh className="mr-1 inline h-4 w-4" />
                      Generate
                    </button>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-red-900">End Chat</h3>
                        <p className="text-sm text-red-600">
                          Permanently close this chat. No one will be able to
                          send messages.
                        </p>
                      </div>
                      <button
                        onClick={handleEndChat}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                      >
                        End Chat
                      </button>
                    </div>
                  </div>
                </>
              )}

              {!chat.isActive && (
                <div className="rounded-lg bg-blue-50 p-4 text-center">
                  <h3 className="mb-2 font-semibold text-blue-900">
                    📊 Chat History
                  </h3>
                  <p className="text-sm text-blue-800">
                    This chat ended on {chat.endedAt?.toLocaleDateString()}. You
                    can review the conversation history but cannot make changes.
                  </p>
                  <div className="mt-3 text-xs text-blue-700">
                    <p>• Total Messages: {messages.length}</p>
                    <p>• Participants: {uniqueParticipants.size}</p>
                    <p>
                      • Duration: {chat.createdAt.toLocaleDateString()} -{" "}
                      {chat.endedAt?.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Participants Modal */}
      {showParticipants && isChatOwner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                Anonymous Participants ({uniqueParticipants.size})
              </h2>
              <button
                onClick={() => setShowParticipants(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4 rounded-lg bg-blue-50 p-3">
              <p className="text-sm text-blue-800">
                🔒 Student identities are protected. You can only see anonymous
                identifiers{" "}
                {chat.isActive
                  ? "and manage participation"
                  : "from when the chat was active"}
                .
              </p>
            </div>

            <div className="space-y-2">
              {Array.from(uniqueParticipants).map((studentId) => {
                const isBlocked = chat.blockedStudents.includes(studentId);

                return (
                  <div
                    key={studentId}
                    className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                        👤
                      </div>
                      <span className="font-medium">
                        {getAnonymousId(studentId)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isBlocked && (
                        <span className="rounded bg-red-100 px-2 py-1 text-xs text-red-700">
                          {chat.isActive ? "Blocked" : "Was Blocked"}
                        </span>
                      )}
                      {chat.isActive && (
                        <button
                          onClick={() =>
                            isBlocked
                              ? handleUnblockUser(studentId)
                              : handleBlockUser(studentId)
                          }
                          className={`rounded px-3 py-1 text-xs font-semibold ${
                            isBlocked
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                        >
                          {isBlocked ? "Unblock" : "Block"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ChatManagement: React.FC<ChatManagementProps> = ({ accessUrl }) => {
  return (
    <AppProvider>
      <ChatManagementContent accessUrl={accessUrl} />
    </AppProvider>
  );
};

export default ChatManagement;
