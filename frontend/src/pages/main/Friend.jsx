
import React, { useMemo, useState } from "react";
import {
  FiUsers,
  FiSearch,
  FiSliders,
  FiMoreHorizontal,
  FiUserPlus,
  FiUserCheck,
  FiArrowRight,
  FiAward,
  FiMonitor,
  FiX,
} from "react-icons/fi";

const usersData = [
  {
    id: 1,
    name: "Rohan Thapa",
    role: "Computer Engineering Student",
    category: "Student",
    avatar: "https://i.pravatar.cc/150?img=12",
    mutual: 12,
    online: true,
  },
  {
    id: 2,
    name: "Anjali Sharma",
    role: "BSc CSIT Student",
    category: "Student",
    avatar: "https://i.pravatar.cc/150?img=47",
    mutual: 8,
    online: true,
  },
  {
    id: 3,
    name: "Dipesh Chaudhary",
    role: "AI Enthusiast",
    category: "Student",
    avatar: "https://i.pravatar.cc/150?img=13",
    mutual: 15,
    online: true,
  },
  {
    id: 4,
    name: "Sita Bhandari",
    role: "Software Developer",
    category: "Professional",
    avatar: "https://i.pravatar.cc/150?img=44",
    mutual: 20,
    online: true,
  },
  {
    id: 5,
    name: "Kiran Adhikari",
    role: "Data Science Student",
    category: "Student",
    avatar: "https://i.pravatar.cc/150?img=11",
    mutual: 10,
    online: true,
  },
  {
    id: 6,
    name: "Maya Gurung",
    role: "BCA Student",
    category: "Student",
    avatar: "https://i.pravatar.cc/150?img=45",
    mutual: 7,
    online: true,
  },
  {
    id: 7,
    name: "Suman Pokharel",
    role: "Full Stack Developer",
    category: "Professional",
    avatar: "https://i.pravatar.cc/150?img=14",
    mutual: 14,
    online: false,
  },
  {
    id: 8,
    name: "Nisha Lamichhane",
    role: "UI/UX Designer",
    category: "Professional",
    avatar: "https://i.pravatar.cc/150?img=48",
    mutual: 11,
    online: true,
  },
  {
    id: 9,
    name: "Aarav Joshi",
    role: "Software Engineering Student",
    category: "Student",
    avatar: "https://i.pravatar.cc/150?img=15",
    mutual: 6,
    online: false,
  },
  {
    id: 10,
    name: "Pratik Karki",
    role: "Engineering Mentor",
    category: "Mentor",
    avatar: "https://i.pravatar.cc/150?img=60",
    mutual: 18,
    online: true,
  },
  {
    id: 11,
    name: "Samiksha Rai",
    role: "Frontend Developer",
    category: "Professional",
    avatar: "https://i.pravatar.cc/150?img=49",
    mutual: 9,
    online: true,
  },
  {
    id: 12,
    name: "Nabin Shah",
    role: "Career Mentor",
    category: "Mentor",
    avatar: "https://i.pravatar.cc/150?img=68",
    mutual: 5,
    online: false,
  },
];

const trendingCommunities = [
  {
    name: "AI & Machine Learning",
    members: "24.5k members",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=150",
  },
  {
    name: "Web Development",
    members: "32.1k members",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=150",
  },
];

const filters = [
  "All People",
  "Students",
  "Professionals",
  "Mentors",
];

const Community = () => {
  const [activeFilter, setActiveFilter] = useState("All People");
  const [search, setSearch] = useState("");
  const [sentRequests, setSentRequests] = useState([]);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  // Search and filter users
  const filteredUsers = useMemo(() => {
    return usersData.filter((user) => {
      const matchesFilter =
        activeFilter === "All People" ||
        user.category === activeFilter.slice(0, -1);

      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.role.toLowerCase().includes(search.toLowerCase());

      const matchesOnline = !onlineOnly || user.online;

      return matchesFilter && matchesSearch && matchesOnline;
    });
  }, [activeFilter, search, onlineOnly]);

  // Send friend request
  const sendRequest = (userId) => {
    setSentRequests((prev) => [...prev, userId]);

    // Connect your friend request API here.
  };

  // Join or leave community
  const toggleCommunity = (name) => {
    setJoinedCommunities((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden bg-[#f4f6f9]">

      <div className="mx-auto grid h-full max-w-[1650px] grid-cols-1 gap-3 px-3 py-3 sm:px-4 lg:grid-cols-[minmax(0,1fr)_290px] xl:grid-cols-[minmax(0,1fr)_320px]">

        {/* ================================
             CENTER COMMUNITY SECTION
        ================================= */}

        <main className="community-scroll min-h-0 min-w-0 overflow-y-auto pr-1">

          {/* COMMUNITY HEADER */}

          <section className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">

            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <FiUsers size={24} />
                </div>

                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    My Community
                  </h1>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Connect with students, professionals and mentors
                  </p>
                </div>

              </div>

              <div className="flex w-full items-center gap-2 sm:w-auto">

                <div className="relative min-w-0 flex-1 sm:w-[240px]">

                  <FiSearch
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search people..."
                    className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-xs outline-none transition focus:border-emerald-500 focus:bg-white"
                  />

                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`rounded-full border p-2.5 transition ${
                    showFilters
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                  title="Filters"
                >
                  <FiSliders size={18} />
                </button>

              </div>

            </div>

            {/* CATEGORY FILTERS */}

            <div className="flex gap-6 overflow-x-auto border-t border-slate-100 px-4">

              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`relative shrink-0 py-3 text-xs font-semibold transition ${
                    activeFilter === filter
                      ? "text-emerald-700"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {filter}

                  {activeFilter === filter && (
                    <span className="absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-emerald-600" />
                  )}

                </button>
              ))}

            </div>

          </section>

          {/* ADVANCED FILTER */}

          {showFilters && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-white p-3 shadow-sm">

              <div>
                <p className="text-xs font-semibold text-slate-800">
                  Filter people
                </p>

                <p className="mt-0.5 text-[11px] text-slate-500">
                  Show people who are currently online
                </p>
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={onlineOnly}
                  onChange={(e) => setOnlineOnly(e.target.checked)}
                  className="accent-emerald-600"
                />
                Online now
              </label>

            </div>
          )}

          {/* NETWORK BANNER */}

          {showBanner && (
            <section className="relative mt-3 flex min-h-[85px] flex-wrap items-center justify-between gap-3 overflow-hidden rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-cyan-50 to-teal-50 px-4 py-3">

              <button
                onClick={() => setShowBanner(false)}
                className="absolute right-2 top-2 rounded-full p-1 text-slate-500 hover:bg-white"
              >
                <FiX size={15} />
              </button>

              <div className="flex min-w-0 items-center gap-4">

                <div className="hidden h-14 w-16 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 sm:flex">
                  <FiUsers size={32} />
                </div>

                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Grow Your Network
                  </h2>

                  <p className="mt-0.5 max-w-md text-[11px] text-slate-600">
                    Connect, learn and grow together in the Educonnect community.
                  </p>
                </div>

              </div>

              <button
                onClick={() => {
                  setActiveFilter("All People");
                  setSearch("");
                }}
                className="flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-[11px] font-bold text-white transition hover:bg-emerald-800"
              >
                Explore People <FiArrowRight size={14} />
              </button>

            </section>
          )}

          {/* PEOPLE HEADER */}

          <div className="mb-3 mt-4 flex items-center justify-between gap-2">

            <div>
              <h2 className="text-sm font-bold text-slate-800">
                People you may know
              </h2>

              <p className="mt-0.5 text-[11px] text-slate-500">
                {filteredUsers.length} people found
              </p>
            </div>

            <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-600 outline-none">
              <option>Recommended</option>
              <option>Recently Joined</option>
              <option>Most Mutual Friends</option>
            </select>

          </div>

          {/* USER CARDS */}

          {filteredUsers.length > 0 ? (

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">

              {filteredUsers.map((user) => {
                const requestSent = sentRequests.includes(user.id);

                return (
                  <article
                    key={user.id}
                    className="group relative flex min-w-0 flex-col items-center rounded-xl border border-slate-100 bg-white px-3 pb-3 pt-3 text-center shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-100 hover:shadow-md"
                  >

                    {/* MORE OPTIONS */}

                    <button
                      className="absolute right-2 top-2 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      title="More options"
                    >
                      <FiMoreHorizontal size={18} />
                    </button>

                    {/* PROFILE IMAGE */}

                    <div className="relative">

                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-16 w-16 rounded-full border-2 border-white object-cover shadow-sm"
                      />

                      <span
                        className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${
                          user.online
                            ? "bg-emerald-500"
                            : "bg-slate-300"
                        }`}
                      />

                    </div>

                    {/* USER DETAILS */}

                    <h3 className="mt-2 max-w-full truncate text-xs font-bold text-slate-900">
                      {user.name}
                    </h3>

                    <p className="mt-0.5 min-h-4 w-full truncate text-[11px] text-slate-500">
                      {user.role}
                    </p>

                    <span className="mt-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-semibold text-emerald-700">
                      {user.category}
                    </span>

                    {/* MUTUAL FRIENDS */}

                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500">
                      <FiUsers size={13} />
                      {user.mutual} mutual friends
                    </div>

                    {/* ACTION BUTTONS */}

                    <div className="mt-3 grid w-full grid-cols-2 gap-1.5">

                      <button
                        onClick={() => sendRequest(user.id)}
                        disabled={requestSent}
                        className={`flex items-center justify-center gap-1 rounded-md px-1 py-2 text-[10px] font-semibold transition ${
                          requestSent
                            ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "bg-emerald-700 text-white hover:bg-emerald-800"
                        }`}
                      >
                        {requestSent ? (
                          <>
                            <FiUserCheck size={12} />
                            Sent
                          </>
                        ) : (
                          <>
                            Send Request
                            <FiUserPlus size={12} />
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          window.location.href = `/profile/${user.id}`;
                        }}
                        className="rounded-md border border-emerald-200 px-1 py-2 text-[10px] font-semibold text-emerald-800 transition hover:bg-emerald-50"
                      >
                        View Profile
                      </button>

                    </div>

                  </article>
                );
              })}

            </div>

          ) : (

            <div className="rounded-xl border border-slate-100 bg-white py-14 text-center">

              <FiUsers className="mx-auto text-3xl text-slate-300" />

              <h3 className="mt-3 text-sm font-bold text-slate-800">
                No people found
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Try searching with a different name or category.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setActiveFilter("All People");
                  setOnlineOnly(false);
                }}
                className="mt-3 text-xs font-semibold text-emerald-700"
              >
                Clear filters
              </button>

            </div>

          )}

          <div className="py-5 text-center text-[11px] text-slate-400">
            You're growing your Educonnect network 🌱
          </div>

        </main>

        {/* ================================
             RIGHT SIDEBAR - FIXED
        ================================= */}

        <aside className="hidden h-full min-h-0 flex-col gap-3 overflow-hidden lg:flex">

          {/* LEARNING BANNER */}

          <section className="relative shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 p-5 text-white shadow-sm">

            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border-[25px] border-white/5" />

            <FiAward className="relative mb-3 text-3xl text-yellow-300" />

            <h2 className="relative text-lg font-bold leading-6">
              Keep Learning,
              <br />
              Keep Growing!
            </h2>

            <p className="relative mt-2 text-[11px] leading-5 text-emerald-50">
              Be the best version of yourself with Educonnect.
            </p>

            <button
              onClick={() => {
                window.location.href = "/studymaterials";
              }}
              className="relative mt-3 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[11px] font-bold text-emerald-800 transition hover:bg-emerald-50"
            >
              Explore Resources <FiArrowRight size={14} />
            </button>

          </section>

          {/* FIND FRIENDS */}

          <section className="shrink-0 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">

            <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-3">

              <FiSearch className="text-lg text-emerald-700" />

              <h3 className="text-sm font-bold text-slate-900">
                Find Friends
              </h3>

            </div>

            <div className="space-y-1">

              {[
                {
                  icon: FiUsers,
                  label: "People You May Know",
                  filter: "All People",
                },
                {
                  icon: FiAward,
                  label: "From Your College",
                  filter: "Students",
                },
                {
                  icon: FiMonitor,
                  label: "In Your Field",
                  filter: "Professionals",
                },
                {
                  icon: FiUserPlus,
                  label: "Mentors",
                  filter: "Mentors",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      setActiveFilter(item.filter);
                      setSearch("");
                      setOnlineOnly(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg p-2 text-left transition hover:bg-emerald-50"
                  >

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                      <Icon size={17} />
                    </span>

                    <span className="text-[11px] font-semibold text-slate-700">
                      {item.label}
                    </span>

                  </button>
                );
              })}

            </div>

          </section>

          {/* TRENDING COMMUNITIES */}

          <section className="shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">

            <div className="flex items-center justify-between px-4 pb-3 pt-4">

              <h3 className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <span className="text-base">🔥</span>
                Trending Communities
              </h3>

              <button className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                See all <FiArrowRight size={12} />
              </button>

            </div>

            {trendingCommunities.map((community) => {
              const joined = joinedCommunities.includes(community.name);

              return (
                <div
                  key={community.name}
                  className="flex items-center gap-2.5 border-t border-slate-100 px-3 py-2.5"
                >

                  <img
                    src={community.image}
                    alt={community.name}
                    className="h-10 w-10 shrink-0 rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1">

                    <h4 className="truncate text-[11px] font-bold text-slate-800">
                      {community.name}
                    </h4>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {community.members}
                    </p>

                  </div>

                  <button
                    onClick={() => toggleCommunity(community.name)}
                    className={`rounded-md px-2.5 py-1.5 text-[10px] font-bold transition ${
                      joined
                        ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "bg-emerald-700 text-white hover:bg-emerald-800"
                    }`}
                  >
                    {joined ? "Joined" : "Join"}
                  </button>

                </div>
              );
            })}

          </section>

          {/* FOOTER */}

          <div className="mt-auto px-2 pb-2 text-center text-[10px] leading-5 text-slate-400">
            About · Privacy · Terms · Help Center
            <br />
            © 2026 Educonnect
          </div>

        </aside>

      </div>

      {/* SCROLLBAR STYLING */}

      <style>{`
        .community-scroll {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }

        .community-scroll::-webkit-scrollbar {
          width: 5px;
        }

        .community-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 20px;
        }

        .community-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>

    </div>
  );
};

export default Community;
