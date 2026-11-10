import React, { useContext, useEffect, useMemo, useRef, useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FiSearch,
  FiSend,
  FiPhone,
  FiVideo,
  FiMic,
  FiSquare,
  FiPaperclip,
  FiImage,
  FiCheck,
  FiCheckCircle,
  FiPhoneOff,
  FiVolumeX,
  FiVideoOff,
  FiUser,
  FiArrowLeft,
  FiMessageCircle,
} from "react-icons/fi";

import { AuthContext } from "../../context/authContext";
import { socket } from "../../services/socket";

import {
  getConversations,
  getMessages,
  sendTextMessage,
  sendAttachment,
  markRead,
} from "../../services/messageServices";

import useWebRTCCall from "../../hooks/useWebRTCCall";

const SERVER_URL = "http://localhost:3000";

const fileUrl = (url) => {
  if (!url) return "";
  return /^https?:\/\//i.test(url)
    ? url
    : `${SERVER_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

const Avatar = ({ user, size = "md" }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [user?.profilepic]);

  const dimensions = size === "lg" ? "h-16 w-16" : "h-11 w-11";

  const initials = (user?.fullName || "U")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return user?.profilepic && !failed ? (
    <img
      src={fileUrl(user.profilepic)}
      alt={user.fullName}
      onError={() => setFailed(true)}
      className={`${dimensions} shrink-0 rounded-full border border-slate-200 object-cover`}
    />
  ) : (
    <div
      className={`${dimensions} flex shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700`}
    >
      {initials || "U"}
    </div>
  );
};

const Message = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const { users: me } = useContext(AuthContext);

  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [recording, setRecording] = useState(false);
  const [mobileChat, setMobileChat] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const bottomRef = useRef(null);
  const selectedRef = useRef(null);
  const recorderRef = useRef(null);
  const audioStreamRef = useRef(null);
  const typingTimerRef = useRef(null);
  const loadVersionRef = useRef(0);
  const recordingTimerRef = useRef(null);
  const recordingTargetRef = useRef(null);
  const recordingStartRef = useRef(0);

  const calls = useWebRTCCall();

  const selected = conversations.find(
    (item) => String(item.user?._id) === String(selectedId),
  );

  const otherUser = selected?.user;

  useEffect(() => {
    selectedRef.current = selectedId;
  }, [selectedId]);

  const loadConversations = async () => {
    try {
      const response = await getConversations();
      const list = response.data.conversations || [];

      setConversations(list);

      const requestedId = params.get("userId");

      setSelectedId((previous) => {
        if (
          requestedId &&
          list.some((c) => String(c.user?._id) === requestedId)
        ) {
          return requestedId;
        }

        if (
          previous &&
          list.some((c) => String(c.user?._id) === String(previous))
        ) {
          return previous;
        }

        return null; // Do not automatically open the first conversation
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load conversations",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!me?._id) return;

    loadConversations();
  }, [me?._id, params.get("userId")]);

  useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      return;
    }

    const version = ++loadVersionRef.current;

    const load = async () => {
      try {
        const response = await getMessages(selectedId);

        if (version !== loadVersionRef.current) return;

        setMessages(response.data.messages || []);

        await markRead(selectedId);
        loadConversations();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load messages");
      }
    };

    load();

    return () => {
      loadVersionRef.current += 1;
    };
  }, [selectedId]);

  // ========================================
  // SOCKET.IO
  // ========================================

  useEffect(() => {
    if (!me?._id) return;

    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      socket.emit("presence:get", (ids) => {
        setOnlineUsers(ids || []);
      });
    };

    const onNewMessage = async (message) => {
      const senderId = String(message.sender?._id || message.sender);
      const receiverId = String(message.recevier?._id || message.recevier);

      const active = String(selectedRef.current);

      if (active === senderId || active === receiverId) {
        setMessages((previous) =>
          previous.some((item) => String(item._id) === String(message._id))
            ? previous
            : [...previous, message],
        );

        if (senderId !== String(me._id) && active === senderId) {
          await markRead(senderId).catch(console.error);
        }
      }

      loadConversations();
    };

    const onRead = ({ readerId }) => {
      setMessages((previous) =>
        previous.map((message) =>
          String(message.recevier?._id || message.recevier) === String(readerId)
            ? { ...message, isRead: true }
            : message,
        ),
      );

      loadConversations();
    };

    const onPresence = ({ userId, online }) => {
      setOnlineUsers((previous) =>
        online
          ? [...new Set([...previous, userId])]
          : previous.filter((id) => id !== userId),
      );
    };

    const onTyping = ({ userId }) => {
      setTypingUsers((previous) => [...new Set([...previous, userId])]);
    };

    const onStopTyping = ({ userId }) => {
      setTypingUsers((previous) => previous.filter((id) => id !== userId));
    };

    const onSocketError = (error) => {
      console.error("Socket connection error:", error.message);
    };

    socket.on("connect", onConnect);
    socket.on("message:new", onNewMessage);
    socket.on("message:read", onRead);
    socket.on("presence:update", onPresence);
    socket.on("typing:start", onTyping);
    socket.on("typing:stop", onStopTyping);
    socket.on("connect_error", onSocketError);

    if (socket.connected) onConnect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("message:new", onNewMessage);
      socket.off("message:read", onRead);
      socket.off("presence:update", onPresence);
      socket.off("typing:start", onTyping);
      socket.off("typing:stop", onStopTyping);
      socket.off("connect_error", onSocketError);
      socket.disconnect();
    };
  }, [me?._id]);

  // ========================================
  // SCROLL
  // ========================================

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, selectedId]);

  // ========================================
  // SEND TEXT
  // ========================================

  const handleSend = async (event) => {
    event.preventDefault();

    if (!draft.trim() || !selectedId || sending) return;

    const text = draft.trim();

    setSending(true);

    try {
      await sendTextMessage(selectedId, text);
      setDraft("");

      socket.emit("typing:stop", { to: selectedId });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // ========================================
  // TYPING
  // ========================================

  const handleTyping = (value) => {
    setDraft(value);

    if (!selectedId) return;

    socket.emit("typing:start", { to: selectedId });

    clearTimeout(typingTimerRef.current);

    typingTimerRef.current = setTimeout(() => {
      socket.emit("typing:stop", { to: selectedId });
    }, 1200);
  };

  useEffect(() => {
    return () => clearTimeout(typingTimerRef.current);
  }, []);

  // ========================================
  // FILES AND IMAGES
  // ========================================

  const uploadFile = async (file, type) => {
    if (!file || !selectedId) return;

    try {
      setSending(true);
      await sendAttachment(selectedId, file, type);
      toast.success("Attachment sent");
    } catch (error) {
      toast.error(error.response?.data?.message || "Attachment failed");
    } finally {
      setSending(false);
    }
  };

  // ========================================
  // VOICE RECORDING
  // ========================================

  const stopRecordingTracks = () => {
    audioStreamRef.current?.getTracks().forEach((track) => track.stop());
    audioStreamRef.current = null;
    clearInterval(recordingTimerRef.current);
    recordingTimerRef.current = null;
  };

  const startRecording = async () => {
    if (!selectedId || recording || sending) return;
    if (!window.MediaRecorder || !navigator.mediaDevices?.getUserMedia) {
      toast.error(
        "Voice recording needs microphone support and HTTPS or localhost",
      );
      return;
    }

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      audioStreamRef.current = stream;
      recordingTargetRef.current = selectedId;

      const mimeType = [
        "audio/webm;codecs=opus",
        "audio/mp4",
        "audio/webm",
        "audio/ogg;codecs=opus",
      ].find((value) => MediaRecorder.isTypeSupported(value));

      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined,
      );
      const chunks = [];
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data?.size > 0) chunks.push(event.data);
      };

      recorder.onerror = (event) => {
        console.error("Recording error:", event);
        toast.error("Voice recording failed");
        stopRecordingTracks();
        setRecording(false);
      };

      recorder.onstop = async () => {
        stopRecordingTracks();
        setRecording(false);
        const actualMime = recorder.mimeType || mimeType || "audio/webm";
        const blob = new Blob(chunks, { type: actualMime });
        if (!blob.size) {
          toast.error("Recording was empty. Please try again.");
          return;
        }
        const extension = actualMime.includes("mp4")
          ? "m4a"
          : actualMime.includes("ogg")
            ? "ogg"
            : "webm";
        const file = new File([blob], `voice-${Date.now()}.${extension}`, {
          type: actualMime,
        });
        try {
          setSending(true);
          // Use the user selected when recording started.
          await sendAttachment(recordingTargetRef.current, file, "audio");
          toast.success("Voice message sent");
        } catch (error) {
          console.error("Voice upload error:", error);
          toast.error(
            error.response?.data?.message || "Could not send voice message",
          );
        } finally {
          setSending(false);
          recorderRef.current = null;
        }
      };

      recorder.start(250);
      recordingStartRef.current = Date.now();
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(
          Math.floor((Date.now() - recordingStartRef.current) / 1000),
        );
      }, 500);
      setRecording(true);
    } catch (error) {
      console.error("Microphone error:", error);
      stream?.getTracks().forEach((track) => track.stop());
      stopRecordingTracks();
      toast.error("Microphone access failed. Check browser permissions.");
    }
  };

  const stopRecording = () => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.requestData();
      recorderRef.current.stop();
    }
    clearInterval(recordingTimerRef.current);
    setRecording(false);
  };

  useEffect(() => {
    return () => {
      clearInterval(recordingTimerRef.current);
      if (recorderRef.current?.state === "recording") {
        recorderRef.current.onstop = null;
        recorderRef.current.stop();
      }
      audioStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // ========================================
  // FILTER CONVERSATIONS
  // ========================================

  const filtered = useMemo(
    () =>
      conversations.filter((item) =>
        (item.user?.fullName || "")
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [conversations, search],
  );

  const formatTime = (date) =>
    date
      ? new Date(date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

  const renderMessageContent = (message) => {
    const type = message.type || "text";
    const url = fileUrl(message.attachment?.url);

    if (type === "image" && url) {
      return (
        <a href={url} target="_blank" rel="noreferrer">
          <img
            src={url}
            alt="Shared image"
            className="max-h-64 max-w-full rounded-xl object-contain"
          />
        </a>
      );
    }

    if (type === "audio" && url) {
      return (
        <div className="min-w-[210px] max-w-full">
          <p className="mb-2 text-xs font-semibold">Voice message</p>
          <audio
            key={url}
            src={url}
            controls
            preload="metadata"
            playsInline
            className="w-full max-w-[300px]"
            onError={(event) => {
              console.error(
                "Audio playback failed:",
                url,
                event.currentTarget.error,
              );
            }}
          />
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="mt-1 block text-xs underline"
          >
            Open audio file
          </a>
        </div>
      );
    }

    if (type === "file" && url) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="break-all font-semibold underline"
        >
          {message.attachment?.name || "Open attachment"}
        </a>
      );
    }

    return (
      <p className="whitespace-pre-wrap break-words text-sm">
        {message.content}
      </p>
    );
  };

  // ========================================
  // JSX
  // ========================================

  return (
    <div className="h-[calc(100dvh-80px)] min-h-0 bg-slate-100 p-2 sm:p-3">
      <div className="grid h-full min-h-0 grid-cols-1 gap-3 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* LEFT: REAL CONVERSATIONS */}

        <aside
          className={`min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white ${
            mobileChat ? "hidden lg:flex" : "flex"
          }`}
        >
          <div className="border-b border-slate-100 p-4">
            <h2 className="text-xl font-bold text-slate-900">Messages</h2>

            <p className="mt-1 text-xs text-slate-500">
              Chat with your accepted connections
            </p>

            <div className="relative mt-4">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search connections..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {loading ? (
              <p className="p-5 text-sm text-slate-500">
                Loading conversations...
              </p>
            ) : filtered.length === 0 ? (
              <p className="p-5 text-sm text-slate-500">
                No connected users found. Accept a connection request to start
                chatting.
              </p>
            ) : (
              filtered.map((item) => {
                const user = item.user;
                const active = String(user._id) === String(selectedId);

                return (
                  <button
                    key={user._id}
                    onClick={() => {
                      setSelectedId(user._id);
                      setMobileChat(true);
                    }}
                    className={`flex w-full items-center gap-3 border-b border-slate-100 p-3 text-left ${
                      active ? "bg-emerald-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="relative">
                      <Avatar user={user} />

                      {onlineUsers.includes(String(user._id)) && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {user.fullName}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {item.lastmessage?.content ||
                          (item.lastmessage?.type
                            ? `Sent ${item.lastmessage.type}`
                            : "Start a conversation")}
                      </p>
                    </div>

                    {item.unread > 0 && (
                      <span className="rounded-full bg-emerald-700 px-2 py-1 text-xs font-bold text-white">
                        {item.unread}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* CENTER: CHAT */}

        <main
          className={`min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white ${
            mobileChat ? "flex" : "hidden lg:flex"
          }`}
        >
          {!otherUser ? (
            <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-white to-emerald-50 px-6 text-center">
              <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700 shadow-sm">
                <FiMessageCircle size={44} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Welcome to Educonnect Messages
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
                Stay in touch with your connections. Choose someone from your
                conversations to start chatting, share voice notes, or make a
                call.
              </p>
              <p className="mt-5 rounded-full bg-white px-4 py-2 text-xs font-medium text-emerald-700 shadow-sm">
                Select a conversation on the left to begin
              </p>
            </div>
          ) : (
            <>
              {/* CHAT HEADER */}

              <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-slate-100 px-3 sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    onClick={() => setMobileChat(false)}
                    className="lg:hidden"
                    title="Back"
                  >
                    <FiArrowLeft size={20} />
                  </button>

                  <Avatar user={otherUser} />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {otherUser.fullName}
                    </p>

                    <p className="text-xs text-emerald-600">
                      {typingUsers.includes(String(otherUser._id))
                        ? "Typing..."
                        : onlineUsers.includes(String(otherUser._id))
                          ? "Online"
                          : "Offline"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    title="Audio call"
                    onClick={() =>
                      calls
                        .startCall(otherUser._id, "audio")
                        .catch(() => toast.error("Unable to start audio call"))
                    }
                    className="rounded-full p-2 text-slate-600 hover:bg-emerald-50"
                  >
                    <FiPhone size={19} />
                  </button>

                  <button
                    title="Video call"
                    onClick={() =>
                      calls
                        .startCall(otherUser._id, "video")
                        .catch(() => toast.error("Unable to start video call"))
                    }
                    className="rounded-full p-2 text-slate-600 hover:bg-emerald-50"
                  >
                    <FiVideo size={20} />
                  </button>

                  <button
                    title="View profile"
                    onClick={() =>
                      navigate(`/educonnect/profile/${otherUser._id}`)
                    }
                    className="rounded-full p-2 text-slate-600 hover:bg-emerald-50"
                  >
                    <FiUser size={19} />
                  </button>
                </div>
              </header>

              {/* MESSAGES */}

              <section className="min-h-0 flex-1 overflow-y-auto bg-[#fafcfb] px-3 py-5 sm:px-5">
                <div className="space-y-3">
                  {messages.map((message) => {
                    const mine =
                      String(message.sender?._id || message.sender) ===
                      String(me?._id);

                    return (
                      <div
                        key={message._id}
                        className={`flex ${
                          mine ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[70%] ${
                            mine
                              ? "rounded-br-sm bg-emerald-100"
                              : "rounded-bl-sm bg-white shadow-sm"
                          }`}
                        >
                          {renderMessageContent(message)}

                          <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-slate-500">
                            {formatTime(message.createdAt)}

                            {mine &&
                              (message.isRead ? (
                                <FiCheckCircle className="text-emerald-700" />
                              ) : (
                                <FiCheck />
                              ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div ref={bottomRef} />
                </div>
              </section>

              {/* MESSAGE COMPOSER */}

              <footer className="shrink-0 border-t border-slate-100 bg-white p-3">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <label
                    title="Attach file"
                    className="cursor-pointer text-slate-500 hover:text-emerald-700"
                  >
                    <FiPaperclip size={20} />
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.txt"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        uploadFile(file, "file");
                        event.target.value = "";
                      }}
                    />
                  </label>

                  <label
                    title="Send image"
                    className="cursor-pointer text-slate-500 hover:text-emerald-700"
                  >
                    <FiImage size={20} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        uploadFile(file, "image");
                        event.target.value = "";
                      }}
                    />
                  </label>

                  <input
                    value={draft}
                    onChange={(event) => handleTyping(event.target.value)}
                    placeholder="Type a message..."
                    className="h-11 min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-emerald-500"
                  />

                  <button
                    type="button"
                    title={
                      recording
                        ? "Stop and send recording"
                        : "Record voice message"
                    }
                    onClick={recording ? stopRecording : startRecording}
                    disabled={sending}
                    className={`rounded-full p-2 ${
                      recording ? "bg-red-100 text-red-600" : "text-slate-500"
                    }`}
                  >
                    {recording ? <FiSquare size={19} /> : <FiMic size={20} />}
                  </button>

                  {recording && (
                    <span className="shrink-0 text-xs font-semibold text-red-600">
                      REC {Math.floor(recordingSeconds / 60)}:
                      {String(recordingSeconds % 60).padStart(2, "0")}
                    </span>
                  )}

                  <button
                    type="submit"
                    disabled={!draft.trim() || sending}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white disabled:opacity-40"
                  >
                    <FiSend size={18} />
                  </button>
                </form>
              </footer>
            </>
          )}
        </main>
      </div>

      {/* INCOMING CALL */}

      {calls.incoming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center">
            <FiPhone className="mx-auto text-emerald-700" size={32} />

            <h2 className="mt-4 text-lg font-bold">
              Incoming {calls.incoming.type} call
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              From a connected Educonnect member
            </p>

            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={calls.rejectCall}
                className="rounded-xl bg-red-600 px-5 py-3 text-white"
              >
                Decline
              </button>

              <button
                onClick={() =>
                  calls
                    .acceptCall()
                    .catch(() => toast.error("Could not accept call"))
                }
                className="rounded-xl bg-emerald-700 px-5 py-3 text-white"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE CALL */}

      {calls.call && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-4">
          <div className="w-full max-w-3xl text-center text-white">
            <h2 className="mb-4 text-xl font-bold">
              {calls.call.type === "video" ? "Video Call" : "Voice Call"}
            </h2>

            <p className="mb-4 text-sm text-slate-300">{calls.call.status}</p>

            <div className="relative min-h-56 overflow-hidden rounded-2xl bg-slate-900">
              <video
                ref={calls.remoteVideoRef}
                autoPlay
                playsInline
                className="h-80 w-full object-contain"
              />

              <video
                ref={calls.localVideoRef}
                autoPlay
                muted
                playsInline
                className="absolute bottom-3 right-3 h-28 w-36 rounded-xl bg-slate-800 object-cover"
              />
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={calls.toggleMute}
                className="rounded-full bg-slate-700 p-4"
                title="Toggle microphone"
              >
                <FiVolumeX size={20} />
              </button>

              {calls.call.type === "video" && (
                <button
                  onClick={calls.toggleCamera}
                  className="rounded-full bg-slate-700 p-4"
                  title="Toggle camera"
                >
                  <FiVideoOff size={20} />
                </button>
              )}

              <button
                onClick={calls.endCall}
                className="rounded-full bg-red-600 p-4"
                title="End call"
              >
                <FiPhoneOff size={22} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
