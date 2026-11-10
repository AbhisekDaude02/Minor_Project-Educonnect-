import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FiUsers,
  FiSearch,
  FiArrowUpRight,
  FiRefreshCw,
  FiBriefcase,
  FiMapPin,
  FiUser,
  FiUserPlus,
  FiUserCheck,
  FiClock,
  FiCheck,
  FiX,
  FiMail,
} from "react-icons/fi";

import { AuthContext } from "../../context/authContext";

import {
  getCommunityUsers,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
} from "../../services/connectionServices";

// ============================================
// FILTERS
// ============================================

const filters = ["All People", "Students", "Professionals", "Mentors"];

const getCategory = (role = "") => {
  const value = String(role).toLowerCase();

  if (value.includes("student")) return "Student";
  if (value.includes("mentor")) return "Mentor";
  if (value.includes("professional")) return "Professional";

  return "Other";
};

// ============================================
// USER PROFILE PICTURE
// Uses the actual user's profilepic
// returned by the backend.
// ============================================

const UserAvatar = ({ user }) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [user.profilepic]);

  const name = user.fullName || "Educonnect User";

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  if (user.profilepic && !imageError) {
    return (
      <img
        src={user.profilepic}
        alt={name}
        onError={() => setImageError(true)}
        className="h-16 w-16 rounded-2xl border-2 border-white bg-slate-100 object-cover shadow-sm"
      />
    );
  }

  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-bold text-emerald-700">
      {initials || "U"}
    </div>
  );
};

// ============================================
// LOADING SKELETON
// ============================================

const LoadingCards = () => (
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }, (_, index) => (
      <div
        key={index}
        className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
      >
        <div className="mb-5 h-16 w-16 rounded-2xl bg-slate-100" />

        <div className="mb-3 h-4 w-3/4 rounded bg-slate-100" />

        <div className="mb-5 h-3 w-1/2 rounded bg-slate-100" />

        <div className="mb-3 h-10 rounded-xl bg-slate-100" />

        <div className="h-10 rounded-xl bg-slate-100" />
      </div>
    ))}
  </div>
);

// ============================================
// FRIEND / CONNECTION PAGE
// ============================================

const Friend = () => {
  const navigate = useNavigate();

  const { users: loggedInUser, authLoading } = useContext(AuthContext);

  const [people, setPeople] = useState([]);

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All People");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [processingIds, setProcessingIds] = useState([]);

  // Prevent overlapping connection actions for the same user.
  const processingRef = useRef(new Set());

  // Ignore stale fetch results when multiple refreshes overlap.
  const fetchVersionRef = useRef(0);

  // ============================================
  // FETCH REGISTERED USERS FROM MONGODB
  // ============================================

  const fetchPeople = useCallback(async (refresh = false) => {
    const fetchVersion = ++fetchVersionRef.current;

    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await getCommunityUsers();

      if (fetchVersion !== fetchVersionRef.current) return;

      const registeredUsers = response.data.users;

      setPeople(Array.isArray(registeredUsers) ? registeredUsers : []);
    } catch (error) {
      if (fetchVersion !== fetchVersionRef.current) return;

      console.error("Get community users error:", error);

      toast.error(
        error.response?.data?.message || "Failed to load registered users",
      );
    } finally {
      if (fetchVersion === fetchVersionRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (loggedInUser?._id) {
      fetchPeople();
    } else {
      setPeople([]);
      setLoading(false);
    }

    return () => {
      fetchVersionRef.current += 1;
    };
  }, [authLoading, loggedInUser?._id, fetchPeople]);

  // ============================================
  // PROCESSING HELPERS
  // ============================================

  const startProcessing = (userId) => {
    const id = String(userId);

    if (processingRef.current.has(id)) {
      return false;
    }

    processingRef.current.add(id);

    setProcessingIds((previous) => [...previous, id]);

    return true;
  };

  const stopProcessing = (userId) => {
    const id = String(userId);

    processingRef.current.delete(id);

    setProcessingIds((previous) => previous.filter((item) => item !== id));
  };

  const isProcessing = (userId) => processingIds.includes(String(userId));

  // ============================================
  // UPDATE A USER'S CONNECTION STATUS
  // ============================================

  const updateUserStatus = (userId, connectionStatus, connectionId = null) => {
    setPeople((previous) =>
      previous.map((person) =>
        String(person._id) === String(userId)
          ? {
              ...person,
              connectionStatus,
              connectionId,
            }
          : person,
      ),
    );
  };

  // ============================================
  // SEND FRIEND REQUEST
  // POST /connections/sendrequest/:userId
  // ============================================

  const handleSendRequest = async (userId) => {
    if (!startProcessing(userId)) return;

    try {
      const response = await sendFriendRequest(userId);

      updateUserStatus(userId, "sent", response.data.connection?._id || null);

      toast.success(
        response.data.message || "Friend request sent successfully",
      );
    } catch (error) {
      console.error("Send request error:", error);

      toast.error(
        error.response?.data?.message || "Failed to send friend request",
      );

      // Sync the card with MongoDB in case another
      // request already exists.
      await fetchPeople(true);
    } finally {
      stopProcessing(userId);
    }
  };

  // ============================================
  // ACCEPT FRIEND REQUEST
  // PUT /connections/acceptrequest/:requestId
  // ============================================

  const handleAcceptRequest = async (userId, requestId) => {
    if (!requestId || !startProcessing(userId)) return;

    try {
      const response = await acceptFriendRequest(requestId);

      updateUserStatus(
        userId,
        "friends",
        response.data.connection?._id || requestId,
      );

      toast.success(response.data.message || "Friend request accepted");
    } catch (error) {
      console.error("Accept request error:", error);

      toast.error(error.response?.data?.message || "Failed to accept request");

      await fetchPeople(true);
    } finally {
      stopProcessing(userId);
    }
  };

  // ============================================
  // REJECT FRIEND REQUEST
  // PUT /connections/rejectrequest/:requestId
  // ============================================

  const handleRejectRequest = async (userId, requestId) => {
    if (!requestId || !startProcessing(userId)) return;

    try {
      const response = await rejectFriendRequest(requestId);

      updateUserStatus(userId, "none", null);

      toast.success(response.data.message || "Friend request rejected");
    } catch (error) {
      console.error("Reject request error:", error);

      toast.error(error.response?.data?.message || "Failed to reject request");

      await fetchPeople(true);
    } finally {
      stopProcessing(userId);
    }
  };

  // ============================================
  // SEARCH + FILTER
  // ============================================

  const filteredPeople = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const categoryMap = {
      Students: "Student",
      Professionals: "Professional",
      Mentors: "Mentor",
    };

    return people.filter((person) => {
      // Exclude the logged-in user.
      if (
        loggedInUser?._id &&
        String(person._id) === String(loggedInUser._id)
      ) {
        return false;
      }

      const searchableText = [
        person.fullName,
        person.role,
        person.email,
        person.location,
        person.jobTitle,
        person.program,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(keyword);

      const matchesFilter =
        activeFilter === "All People" ||
        getCategory(person.role) === categoryMap[activeFilter];

      return matchesSearch && matchesFilter;
    });
  }, [people, search, activeFilter, loggedInUser?._id]);

  // ============================================
  // RENDER CONNECTION ACTIONS
  // ============================================

  const renderConnectionAction = (person) => {
    const status = person.connectionStatus || "none";

    const busy = isProcessing(person._id);

    // Already connected
    if (status === "friends") {
      return (
        <button
          type="button"
          onClick={() => navigate(`/educonnect/message?userId=${person._id}`)}
          className="flex h-11 w-full items-center justify-center rounded-xl bg-emerald-700 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          Message
        </button>
      );
    }

    // Request sent by logged-in user
    if (status === "sent") {
      return (
        <button
          type="button"
          disabled
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 text-sm font-semibold text-amber-700"
        >
          <FiClock size={16} />
          Request Sent
        </button>
      );
    }

    // Incoming friend request
    if (status === "received") {
      return (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={busy || !person.connectionId}
            onClick={() => handleAcceptRequest(person._id, person.connectionId)}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            {busy ? <FiRefreshCw className="animate-spin" /> : <FiCheck />}
            Accept
          </button>

          <button
            type="button"
            disabled={busy || !person.connectionId}
            onClick={() => handleRejectRequest(person._id, person.connectionId)}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            <FiX />
            Reject
          </button>
        </div>
      );
    }

    // No existing connection
    return (
      <button
        type="button"
        disabled={busy}
        onClick={() => handleSendRequest(person._id)}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
      >
        {busy ? (
          <FiRefreshCw size={16} className="animate-spin" />
        ) : (
          <FiUserPlus size={16} />
        )}

        {busy ? "Sending..." : "Send Request"}
      </button>
    );
  };

  // ============================================
  // JSX
  // ============================================

  return (
    <div className="min-h-screen bg-[#f7f9f8]">
      <div className="mx-auto max-w-[1350px] px-4 py-8 sm:px-6 lg:px-8">
        {/* PAGE HEADER */}

        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-700">
              Educonnect Network
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Connect With People
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Discover registered students, professionals, and mentors. Send
              requests and build your network.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchPeople(true)}
            disabled={refreshing || loading}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <FiRefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </header>

        {/* SEARCH AND FILTER */}

        <section className="mb-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, role or email..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                type="button"
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                  activeFilter === filter
                    ? "bg-emerald-700 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {/* PEOPLE COUNT */}

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Registered People
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {loading
                ? "Loading registered users..."
                : `${filteredPeople.length} people found`}
            </p>
          </div>

          <FiUsers size={22} className="text-emerald-700" />
        </div>

        {/* PEOPLE CARDS */}

        {loading || authLoading ? (
          <LoadingCards />
        ) : filteredPeople.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-5 text-center">
            <FiUser size={32} className="text-slate-400" />

            <h3 className="mt-4 font-semibold text-slate-900">
              No registered people found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try another search or category filter.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPeople.map((person) => (
              <article
                key={person._id}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
              >
                {/* REAL REGISTERED USER PICTURE */}

                <div className="mb-5 flex items-start justify-between">
                  <UserAvatar user={person} />

                  <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                    {getCategory(person.role)}
                  </span>
                </div>

                {/* USER NAME */}

                <h3 className="truncate text-base font-bold text-slate-900">
                  {person.fullName || "Educonnect Member"}
                </h3>

                {/* USER ROLE */}

                <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                  <FiBriefcase size={14} />

                  {person.jobTitle || person.program || person.role || "Member"}
                </p>

                {/* EMAIL */}

                {person.email && (
                  <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                    <FiMail size={14} />

                    <span className="truncate">{person.email}</span>
                  </p>
                )}

                {/* LOCATION */}

                {person.location && (
                  <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                    <FiMapPin size={14} />
                    {person.location}
                  </p>
                )}

                {/* ACTION BUTTONS */}

                <div className="mt-auto space-y-2 pt-6">
                  {renderConnectionAction(person)}

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/educonnect/profile/${person._id}`)
                    }
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    View Profile
                    <FiArrowUpRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Friend;
