
import React, { useState, useRef, useEffect } from "react";
import {
  FiSearch,
  FiEdit,
  FiMoreVertical,
  FiPhone,
  FiVideo,
  FiUser,
  FiSmile,
  FiPaperclip,
  FiImage,
  FiSend,
  FiArrowLeft,
  FiCheck,
  FiCheckCircle,
  FiUsers,
  FiShield,
  FiX,
  FiInfo,
} from "react-icons/fi";

const currentUser = {
  name: "Abhisek Daude",
  image: "https://i.pravatar.cc/150?img=12",
};

const initialConversations = [
  {
    id: 1,
    name: "Anjali Sharma",
    role: "BSc CSIT Student",
    image: "https://i.pravatar.cc/150?img=47",
    online: true,
    unread: 1,
    time: "2m ago",
    lastMessage: "Sure! Let's connect 😊",
    interests: ["Programming", "AI", "Technology", "Learning"],
    mutualFriends: 12,
    messages: [
      {
        id: 1,
        sender: "me",
        text: "Hello Anjali! 👋",
        time: "10:24 AM",
        read: true,
      },
      {
        id: 2,
        sender: "other",
        text: "Hi Abhisek! How are you?",
        time: "10:25 AM",
      },
      {
        id: 3,
        sender: "me",
        text: "I'm good. Are you free for a study session today?",
        time: "10:26 AM",
        read: true,
      },
      {
        id: 4,
        sender: "other",
        text: "Sure! Let's connect 😊",
        time: "10:27 AM",
      },
    ],
  },
  {
    id: 2,
    name: "Rohan Thapa",
    role: "Computer Engineering Student",
    image: "https://i.pravatar.cc/150?img=11",
    online: true,
    unread: 1,
    time: "10m ago",
    lastMessage: "Okay, see you there!",
    interests: ["Engineering", "DSA", "Web Development"],
    mutualFriends: 8,
    messages: [
      {
        id: 1,
        sender: "other",
        text: "Hey Abhisek, are you coming to college?",
        time: "09:40 AM",
      },
      {
        id: 2,
        sender: "me",
        text: "Yes, I'll be there soon.",
        time: "09:42 AM",
        read: true,
      },
      {
        id: 3,
        sender: "other",
        text: "Okay, see you there!",
        time: "09:45 AM",
      },
    ],
  },
  {
    id: 3,
    name: "Study Group",
    role: "8 members",
    image: null,
    group: true,
    online: true,
    unread: 2,
    time: "1h ago",
    lastMessage: "New assignment posted...",
    interests: ["DBMS", "Programming", "Study"],
    mutualFriends: 5,
    messages: [
      {
        id: 1,
        sender: "other",
        text: "Has everyone completed the DBMS assignment?",
        time: "08:20 AM",
      },
      {
        id: 2,
        sender: "me",
        text: "Almost completed!",
        time: "08:25 AM",
        read: true,
      },
    ],
  },
  {
    id: 4,
    name: "Sita Bhandari",
    role: "Software Developer",
    image: "https://i.pravatar.cc/150?img=44",
    online: false,
    unread: 0,
    time: "2h ago",
    lastMessage: "Thanks for the help!",
    interests: ["React", "JavaScript", "UI/UX"],
    mutualFriends: 20,
    messages: [
      {
        id: 1,
        sender: "me",
        text: "Let me know if you need any help.",
        time: "Yesterday",
        read: true,
      },
      {
        id: 2,
        sender: "other",
        text: "Thanks for the help!",
        time: "Yesterday",
      },
    ],
  },
  {
    id: 5,
    name: "Kiran Adhikari",
    role: "Data Science Student",
    image: "https://i.pravatar.cc/150?img=13",
    online: true,
    unread: 0,
    time: "3h ago",
    lastMessage: "Perfect! 👍",
    interests: ["Python", "Machine Learning"],
    mutualFriends: 10,
    messages: [
      {
        id: 1,
        sender: "other",
        text: "I shared the Python notes.",
        time: "Yesterday",
      },
      {
        id: 2,
        sender: "me",
        text: "Perfect! 👍",
        time: "Yesterday",
        read: true,
      },
    ],
  },
  {
    id: 6,
    name: "Tech Learners",
    role: "12 members",
    image: null,
    group: true,
    online: true,
    unread: 0,
    time: "1d ago",
    lastMessage: "Welcome to the group!",
    interests: ["Technology", "Learning"],
    mutualFriends: 4,
    messages: [
      {
        id: 1,
        sender: "other",
        text: "Welcome to the group!",
        time: "Yesterday",
      },
    ],
  },
  {
    id: 7,
    name: "Dipesh Chaudhary",
    role: "AI Enthusiast",
    image: "https://i.pravatar.cc/150?img=14",
    online: false,
    unread: 0,
    time: "1d ago",
    lastMessage: "Let's discuss AI sometime.",
    interests: ["AI", "Python", "Deep Learning"],
    mutualFriends: 15,
    messages: [
      {
        id: 1,
        sender: "other",
        text: "Let's discuss AI sometime.",
        time: "Yesterday",
      },
    ],
  },
];

const Avatar = ({ conversation, size = "md" }) => {
  const sizes = {
    sm: "w-9 h-9",
    md: "w-11 h-11",
    lg: "w-14 h-14",
    xl: "w-24 h-24",
  };

  return (
    <div className="relative shrink-0">
      {conversation.image ? (
        <img
          src={conversation.image}
          alt={conversation.name}
          className={`${sizes[size]} rounded-full object-cover border border-slate-200`}
        />
      ) : (
        <div
          className={`${sizes[size]} rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center`}
        >
          <FiUsers size={size === "xl" ? 34 : 22} />
        </div>
      )}

      {conversation.online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
      )}
    </div>
  );
};

const Message = () => {
  const [conversations, setConversations] = useState(
    initialConversations
  );

  const [activeId, setActiveId] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [message, setMessage] = useState("");
  const [showProfile, setShowProfile] = useState(true);

  const messageEndRef = useRef(null);

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeId
  );

  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch = conversation.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      (filter === "Unread" && conversation.unread > 0) ||
      (filter === "Groups" && conversation.group);

    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [activeId, conversations]);

  const selectConversation = (id) => {
    setActiveId(id);

    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === id
          ? { ...conversation, unread: 0 }
          : conversation
      )
    );
  };

  const sendMessage = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "me",
      text: message.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: false,
    };

    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === activeId
          ? {
              ...conversation,
              lastMessage: newMessage.text,
              time: "Just now",
              messages: [...conversation.messages, newMessage],
            }
          : conversation
      )
    );

    setMessage("");
  };

  return (
    <div className="h-[calc(100dvh-80px)] min-h-0 overflow-hidden bg-slate-100 p-2 sm:p-3">

      <div
        className={`grid h-full min-h-0 gap-3 ${
          showProfile
            ? "grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[270px_minmax(0,1fr)_265px]"
            : "grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)]"
        }`}
      >

        {/* LEFT: CONVERSATIONS */}

        <aside className="min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col">

          {/* Conversation Header */}

          <div className="shrink-0 p-4 pb-3">

            <div className="flex items-center justify-between mb-4">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Messages
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Stay connected
                </p>
              </div>

              <button
                type="button"
                className="w-10 h-10 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center transition"
                title="New message"
              >
                <FiEdit size={18} />
              </button>

            </div>

            {/* Search */}

            <div className="relative">

              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 rounded-xl bg-slate-50 border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />

            </div>

            {/* Filters */}

            <div className="flex gap-2 mt-3">

              {["All", "Unread", "Groups"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`flex-1 px-2 py-2 rounded-full text-xs font-medium border transition ${
                    filter === item
                      ? "bg-emerald-700 text-white border-emerald-700"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-emerald-50"
                  }`}
                >
                  {item}
                  {item === "Unread" && (
                    <span className="ml-1">
                      ({conversations.filter((c) => c.unread > 0).length})
                    </span>
                  )}
                </button>
              ))}

            </div>

          </div>

          <div className="border-t border-slate-100" />

          {/* Scrollable Conversation List */}

          <div className="flex-1 min-h-0 overflow-y-auto">

            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-400">
                No conversations found.
              </div>
            ) : (
              filteredConversations.map((conversation) => (

                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => selectConversation(conversation.id)}
                  className={`w-full flex items-center gap-3 p-3 text-left border-b border-slate-100 transition ${
                    activeId === conversation.id
                      ? "bg-emerald-50 border-l-[3px] border-l-emerald-600"
                      : "hover:bg-slate-50 border-l-[3px] border-l-transparent"
                  }`}
                >

                  <Avatar conversation={conversation} size="md" />

                  <div className="flex-1 min-w-0">

                    <div className="flex items-center justify-between gap-1">

                      <h3 className="text-sm font-semibold text-slate-900 truncate">
                        {conversation.name}
                      </h3>

                      <span className="text-[10px] text-slate-400 shrink-0">
                        {conversation.time}
                      </span>

                    </div>

                    <div className="flex items-center justify-between gap-2 mt-1">

                      <p className="text-xs text-slate-500 truncate">
                        {conversation.lastMessage}
                      </p>

                      {conversation.unread > 0 && (
                        <span className="min-w-5 h-5 px-1 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center">
                          {conversation.unread}
                        </span>
                      )}

                    </div>

                  </div>

                </button>

              ))
            )}

          </div>

        </aside>

        {/* CENTER: CHAT AREA */}

        <main className="min-w-0 min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col">

          {activeConversation && (
            <>

              {/* Fixed Chat Header */}

              <header className="h-[72px] shrink-0 flex items-center justify-between px-4 sm:px-5 border-b border-slate-100">

                <div className="flex items-center gap-3 min-w-0">

                  <button
                    type="button"
                    onClick={() => setActiveId(activeId)}
                    className="lg:hidden text-slate-500"
                  >
                    <FiArrowLeft size={20} />
                  </button>

                  <Avatar
                    conversation={activeConversation}
                    size="md"
                  />

                  <div className="min-w-0">

                    <h2 className="font-bold text-slate-900 text-sm sm:text-base truncate">
                      {activeConversation.name}
                    </h2>

                    <p className="text-xs text-emerald-600 mt-1">
                      {activeConversation.online
                        ? "Active now"
                        : activeConversation.group
                        ? activeConversation.role
                        : "Offline"}
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-1 sm:gap-2">

                  <button
                    type="button"
                    title="Voice call"
                    className="w-9 h-9 rounded-full bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 flex items-center justify-center"
                  >
                    <FiPhone size={17} />
                  </button>

                  <button
                    type="button"
                    title="Video call"
                    className="w-9 h-9 rounded-full bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 flex items-center justify-center"
                  >
                    <FiVideo size={18} />
                  </button>

                  <button
                    type="button"
                    title="Profile information"
                    onClick={() => setShowProfile(!showProfile)}
                    className={`hidden xl:flex w-9 h-9 rounded-full items-center justify-center ${
                      showProfile
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-50 text-slate-600"
                    }`}
                  >
                    <FiInfo size={18} />
                  </button>

                  <button
                    type="button"
                    title="More options"
                    className="w-9 h-9 rounded-full bg-slate-50 hover:bg-emerald-50 text-slate-600 flex items-center justify-center"
                  >
                    <FiMoreVertical size={18} />
                  </button>

                </div>

              </header>

              {/* Scrollable Messages Only */}

              <section className="flex-1 min-h-0 overflow-y-auto bg-white px-3 sm:px-5 py-5">

                <div className="flex justify-center mb-6">

                  <span className="text-[11px] font-medium bg-slate-100 text-slate-500 px-4 py-2 rounded-full">
                    Today
                  </span>

                </div>

                <div className="space-y-5">

                  {activeConversation.messages.map((msg) => {

                    const isMine = msg.sender === "me";

                    return (

                      <div
                        key={msg.id}
                        className={`flex items-end gap-2 ${
                          isMine ? "justify-end" : "justify-start"
                        }`}
                      >

                        {!isMine && (
                          <Avatar
                            conversation={activeConversation}
                            size="sm"
                          />
                        )}

                        <div
                          className={`max-w-[80%] sm:max-w-[70%] px-4 py-3 rounded-2xl ${
                            isMine
                              ? "bg-emerald-100 text-slate-900 rounded-br-sm"
                              : "bg-slate-100 text-slate-800 rounded-bl-sm"
                          }`}
                        >

                          <p className="text-sm leading-6 break-words">
                            {msg.text}
                          </p>

                          <div
                            className={`flex items-center gap-1 justify-end mt-1 ${
                              isMine
                                ? "text-emerald-700"
                                : "text-slate-400"
                            }`}
                          >

                            <span className="text-[10px]">
                              {msg.time}
                            </span>

                            {isMine && (
                              msg.read ? (
                                <FiCheckCircle size={12} />
                              ) : (
                                <FiCheck size={12} />
                              )
                            )}

                          </div>

                        </div>

                        {isMine && (
                          <Avatar
                            conversation={currentUser}
                            size="sm"
                          />
                        )}

                      </div>

                    );

                  })}

                  <div ref={messageEndRef} />

                </div>

              </section>

              {/* Fixed Message Input */}

              <footer className="shrink-0 border-t border-slate-100 bg-white p-3 sm:p-4">

                <form
                  onSubmit={sendMessage}
                  className="flex items-center gap-2"
                >

                  <button
                    type="button"
                    title="Emoji"
                    className="hidden sm:flex w-9 h-9 items-center justify-center text-slate-500 hover:text-emerald-700"
                  >
                    <FiSmile size={21} />
                  </button>

                  <div className="flex-1 min-w-0 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 h-12 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-50">

                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1 min-w-0 bg-transparent outline-none text-sm text-slate-800 placeholder:text-slate-400"
                    />

                    <button
                      type="button"
                      title="Attach file"
                      className="text-slate-400 hover:text-emerald-700"
                    >
                      <FiPaperclip size={19} />
                    </button>

                    <button
                      type="button"
                      title="Upload image"
                      className="text-slate-400 hover:text-emerald-700"
                    >
                      <FiImage size={19} />
                    </button>

                  </div>

                  <button
                    type="submit"
                    disabled={!message.trim()}
                    title="Send message"
                    className="w-11 h-11 shrink-0 rounded-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white flex items-center justify-center transition"
                  >
                    <FiSend size={18} />
                  </button>

                </form>

              </footer>

            </>
          )}

        </main>

        {/* RIGHT: PROFILE INFORMATION */}

        {showProfile && (
          <aside className="hidden xl:flex min-h-0 flex-col gap-3 overflow-y-auto">

            {/* Profile Card */}

            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

              <div className="p-5 flex flex-col items-center text-center">

                <div className="mb-3">
                  <Avatar
                    conversation={activeConversation}
                    size="xl"
                  />
                </div>

                <h2 className="font-bold text-slate-900 text-lg">
                  {activeConversation.name}
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  {activeConversation.role}
                </p>

                <button
                  type="button"
                  className="w-full mt-4 h-10 rounded-xl border border-emerald-400 text-emerald-700 font-semibold text-sm hover:bg-emerald-50 transition"
                >
                  View Profile
                </button>

              </div>

              {/* Shared Interests */}

              <div className="border-t border-slate-100 p-4">

                <h3 className="font-bold text-sm text-slate-900 mb-3">
                  Shared Interests
                </h3>

                <div className="flex flex-wrap gap-2">

                  {activeConversation.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-3 py-2 rounded-full bg-slate-100 text-slate-600 text-xs"
                    >
                      {interest}
                    </span>
                  ))}

                </div>

              </div>

              {/* Mutual Friends */}

              <div className="border-t border-slate-100 p-4">

                <div className="flex justify-between items-center mb-3">

                  <h3 className="font-bold text-sm text-slate-900">
                    Mutual Friends
                  </h3>

                  <span className="text-xs text-slate-400">
                    {activeConversation.mutualFriends}
                  </span>

                </div>

                <div className="flex items-center">

                  {[11, 12, 13, 14].map((img) => (
                    <img
                      key={img}
                      src={`https://i.pravatar.cc/100?img=${img}`}
                      alt="Mutual friend"
                      className="w-9 h-9 rounded-full border-2 border-white object-cover -ml-2 first:ml-0"
                    />
                  ))}

                  <span className="w-9 h-9 rounded-full bg-slate-100 border-2 border-white -ml-2 flex items-center justify-center text-[10px] font-semibold text-slate-600">
                    +{Math.max(activeConversation.mutualFriends - 4, 0)}
                  </span>

                </div>

              </div>

            </section>

            {/* Quick Actions */}

            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">

              <h3 className="font-bold text-sm text-slate-900 mb-3">
                Quick Actions
              </h3>

              <button
                type="button"
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-left"
              >
                <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <FiUser size={17} />
                </span>
                <span className="text-sm text-slate-600">
                  View Profile
                </span>
              </button>

              <button
                type="button"
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 text-left"
              >
                <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <FiShield size={17} />
                </span>
                <span className="text-sm text-slate-600">
                  Block User
                </span>
              </button>

              <button
                type="button"
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-red-50 text-left"
              >
                <span className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                  <FiX size={17} />
                </span>
                <span className="text-sm text-red-500">
                  Report Conversation
                </span>
              </button>

            </section>

          </aside>
        )}

      </div>

    </div>
  );
};

export default Message;
