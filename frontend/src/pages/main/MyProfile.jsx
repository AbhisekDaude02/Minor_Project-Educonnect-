import React, { useContext, useMemo, useState } from "react";

import {
  FiUser,
  FiEdit,
  FiMapPin,
  FiMail,
  FiCalendar,
  FiBriefcase,
  FiBookOpen,
  FiUsers,
  FiGrid,
  FiFileText,
  FiBookmark,
  FiSettings,
  FiMoreHorizontal,
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiDownload,
  FiEye,
  FiSearch,
  FiExternalLink,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiAward,
  FiTrendingUp,
  FiUploadCloud,
  FiGlobe,
  FiGithub,
  FiLinkedin,
} from "react-icons/fi";

import { BsCardList } from "react-icons/bs";

import UploadJob from "../../components/UploadJob";
import Mypost from "../../components/Mypost";
import MyApplications from "../../components/MyApplications";
import EditProfile from "../../components/EditProfile";

import { AuthContext } from "../../context/authContext";
import MyStudyMaterials from "../../components/MyStudyMaterials";

// ==========================================
// SAMPLE DATA
// Replace these with API data when ready
// ==========================================

const myPosts = [
  {
    id: 1,
    content:
      "Started learning Machine Learning! Currently exploring Python, NumPy and Pandas. Excited to build some real-world AI projects.",
    date: "2 hours ago",
    likes: 24,
    comments: 8,
  },
  {
    id: 2,
    content:
      "Working on Educonnect, a platform where students can connect, share study materials and discover internship opportunities. Building something meaningful!",
    date: "Yesterday",
    likes: 42,
    comments: 12,
  },
  {
    id: 3,
    content:
      "Consistency is more important than perfection. Keep learning, keep building and never stop improving.",
    date: "3 days ago",
    likes: 18,
    comments: 5,
  },
];

const applications = [
  {
    id: 1,
    title: "MERN Stack Developer Intern",
    company: "TechNova Solutions",
    location: "Remote",
    type: "Internship",
    applied: "Oct 28, 2026",
    status: "Shortlisted",
    logo: "T",
  },
  {
    id: 2,
    title: "Frontend Developer Intern",
    company: "CodeCraft Nepal",
    location: "Kathmandu",
    type: "Internship",
    applied: "Oct 25, 2026",
    status: "Pending",
    logo: "C",
  },
  {
    id: 3,
    title: "Junior React Developer",
    company: "Digital Horizon",
    location: "Remote",
    type: "Job",
    applied: "Oct 20, 2026",
    status: "Rejected",
    logo: "D",
  },
  {
    id: 4,
    title: "Backend Developer Intern",
    company: "Innovate Nepal",
    location: "Pokhara",
    type: "Internship",
    applied: "Oct 15, 2026",
    status: "Accepted",
    logo: "I",
  },
];

const materials = [
  {
    id: 1,
    title: "Database Management System Notes",
    subject: "DBMS",
    university: "Far Western University",
    semester: "4th Semester",
    type: "Notes",
    date: "Oct 29, 2026",
    downloads: 45,
    size: "2.4 MB",
  },
  {
    id: 2,
    title: "Data Structures and Algorithms",
    subject: "DSA",
    university: "Far Western University",
    semester: "4th Semester",
    type: "Question Paper",
    date: "Oct 24, 2026",
    downloads: 32,
    size: "1.8 MB",
  },
  {
    id: 3,
    title: "Operating System Lab Report",
    subject: "Operating System",
    university: "Far Western University",
    semester: "4th Semester",
    type: "Lab Report",
    date: "Oct 18, 2026",
    downloads: 21,
    size: "3.1 MB",
  },
];

// ==========================================
// STATUS BADGE
// ==========================================

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Shortlisted: "bg-blue-50 text-blue-700 border-blue-200",
    Rejected: "bg-red-50 text-red-700 border-red-200",
    Accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  const icons = {
    Pending: FiClock,
    Shortlisted: FiCheckCircle,
    Rejected: FiXCircle,
    Accepted: FiAward,
  };

  const Icon = icons[status] || FiClock;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
        styles[status] || styles.Pending
      }`}
    >
      <Icon size={13} />
      {status}
    </span>
  );
};

// ==========================================
// MAIN PROFILE COMPONENT
// ==========================================

const MyProfile = () => {
  const { users, setUsers } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("Overview");
  const [actionvalue, setActionvalue] = useState("overview");

  const [searchMaterial, setSearchMaterial] = useState("");
  const [showEditProfile, setShowEditProfile] = useState(false);

  // ==========================================
  // FILTER MATERIALS
  // ==========================================

  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      const search = searchMaterial.toLowerCase();

      return (
        material.title.toLowerCase().includes(search) ||
        material.subject.toLowerCase().includes(search) ||
        material.type.toLowerCase().includes(search)
      );
    });
  }, [searchMaterial]);

  // ==========================================
  // PROFILE INFORMATION
  // ==========================================

  if (!users) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
          <p className="mt-3 text-sm text-gray-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const isStudent = users.role === "student";
  const isProfessional = users.role === "professional";

  const roleLabel = isStudent
    ? "Student"
    : isProfessional
      ? "Professional"
      : "Educonnect Member";

  const joinedDate = users.createdAt
    ? new Date(users.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Educonnect Member";

  const stats = [
    {
      label: "Posts Shared",
      value: "24",
      icon: FiFileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Applications",
      value: "12",
      icon: FiBriefcase,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Study Materials",
      value: "08",
      icon: FiBookOpen,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Connections",
      value: "156",
      icon: FiUsers,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  // ==========================================
  // NAVIGATION
  // ==========================================

  const handleAction = (action) => {
    setActionvalue(action);
    setActiveTab("Overview");
  };

  // ==========================================
  // PROFILE UPDATE CALLBACK
  // ==========================================

  const handleProfileUpdated = (updatedUser) => {
    setUsers((previousUser) => ({
      ...previousUser,
      ...updatedUser,
    }));
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen bg-[#f4f7f8] pb-10 text-slate-800">
      <div className="mx-auto max-w-[1250px] px-4 py-6 sm:px-6 lg:px-8">
        {/* BREADCRUMB */}

        <div className="mb-5 flex items-center gap-2 text-sm">
          <span className="text-slate-400">Educonnect</span>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-emerald-700">My Profile</span>
        </div>

        {/* ======================================
            PROFILE HEADER
        ====================================== */}

        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          {/* COVER */}

          <div className="relative h-44 overflow-hidden bg-linear-to-r from-emerald-950 via-emerald-800 to-teal-700 sm:h-56">
            <div className="absolute -right-10 -top-20 h-72 w-72 rounded-full border-[35px] border-white/5" />

            <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full border-[35px] border-white/5" />

            <div className="absolute bottom-5 left-6 text-white sm:left-10">
              <p className="text-xs font-medium uppercase tracking-[3px] text-emerald-100">
                Your learning journey
              </p>

              <h2 className="mt-2 text-xl font-bold sm:text-2xl">
                Welcome to your profile
              </h2>
            </div>
          </div>

          {/* PROFILE INFORMATION */}

          <div className="px-5 pb-6 sm:px-9">
            <div className="-mt-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                {/* PROFILE PICTURE */}

                <div className="relative w-fit">
                  {users.profilepic ? (
                    <img
                      src={users.profilepic}
                      alt={users.fullName || "Profile"}
                      className="h-28 w-28 rounded-2xl border-4 border-white bg-white object-cover shadow-md"
                    />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-white bg-emerald-100 text-4xl font-bold text-emerald-700 shadow-md">
                      {users.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}

                  <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
                </div>

                {/* NAME AND ROLE */}

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold text-slate-900">
                      {users.fullName}
                    </h1>

                    {users.isverified && (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                        VERIFIED MEMBER
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {isProfessional
                      ? users.jobTitle || roleLabel
                      : isStudent
                        ? users.program || roleLabel
                        : roleLabel}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                    {users.location && (
                      <span className="flex items-center gap-1">
                        <FiMapPin size={13} />
                        {users.location}
                      </span>
                    )}

                    <span className="flex items-center gap-1">
                      <FiCalendar size={13} />
                      Joined {joinedDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* PROFILE ACTIONS */}

              <div className="flex flex-wrap gap-2 pb-1">
                <button
                  onClick={() => setShowEditProfile(true)}
                  className="flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-800"
                >
                  <FiEdit size={14} />
                  Edit Profile
                </button>

                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator
                        .share({
                          title: `${users.fullName}'s Educonnect Profile`,
                          text: `Connect with ${users.fullName} on Educonnect.`,
                          url: window.location.href,
                        })
                        .catch(() => {});
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <FiShare2 size={14} />
                  Share Profile
                </button>
              </div>
            </div>

            {/* BIO */}

            <div className="mt-6 max-w-3xl">
              <p className="text-sm leading-7 text-slate-600">
                {users.bio ||
                  "No bio added yet. Tell the community something about yourself."}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-2">
                  <FiMail className="text-emerald-700" />
                  {users.email}
                </span>

                {isStudent && users.university && (
                  <span className="flex items-center gap-2">
                    <FiBookOpen className="text-emerald-700" />
                    {users.university}
                  </span>
                )}

                {isProfessional && users.company && (
                  <span className="flex items-center gap-2">
                    <FiBriefcase className="text-emerald-700" />
                    {users.company}
                  </span>
                )}

                {users.website && (
                  <a
                    href={users.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 transition hover:text-emerald-700"
                  >
                    <FiGlobe className="text-emerald-700" />
                    Website
                  </a>
                )}

                {users.linkedin && (
                  <a
                    href={users.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 transition hover:text-emerald-700"
                  >
                    <FiLinkedin className="text-emerald-700" />
                    LinkedIn
                  </a>
                )}

                {users.github && (
                  <a
                    href={users.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 transition hover:text-emerald-700"
                  >
                    <FiGithub className="text-emerald-700" />
                    GitHub
                  </a>
                )}
              </div>
            </div>

            {/* SKILLS */}

            {users.skills?.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Skills
                </p>

                <div className="flex flex-wrap gap-2">
                  {users.skills.map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ======================================
            EDIT PROFILE MODAL
        ====================================== */}

        <EditProfile
          isOpen={showEditProfile}
          onClose={() => setShowEditProfile(false)}
          user={users}
          onUpdated={handleProfileUpdated}
        />

        {/* ======================================
            STATISTICS
        ====================================== */}

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className={`rounded-lg p-2.5 ${stat.bg} ${stat.color}`}>
                    <Icon size={19} />
                  </div>

                  <FiTrendingUp className="text-emerald-600" />
                </div>

                <h3 className="mt-4 text-2xl font-bold text-slate-900">
                  {stat.value}
                </h3>

                <p className="mt-1 text-xs text-slate-500">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* ======================================
            MAIN CONTENT
        ====================================== */}

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[235px_minmax(0,1fr)]">
          {/* LEFT NAVIGATION */}

          <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
            <p className="px-3 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Profile Dashboard
            </p>

            <div className="ml-2 flex flex-col space-y-2">
              <button
                onClick={() => handleAction("overview")}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                  actionvalue === "overview"
                    ? "bg-emerald-50 font-semibold text-emerald-800"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <FiGrid />
                Overview
              </button>

              <button
                onClick={() => handleAction("post")}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                  actionvalue === "post"
                    ? "bg-emerald-50 font-semibold text-emerald-800"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <FiFileText />
                My Posts
              </button>

              {isProfessional && (
                <button
                  onClick={() => handleAction("job")}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                    actionvalue === "job"
                      ? "bg-emerald-50 font-semibold text-emerald-800"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <BsCardList />
                  Upload Job
                </button>
              )}

              {isStudent && (
                <button
                  onClick={() => handleAction("application")}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                    actionvalue === "application"
                      ? "bg-emerald-50 font-semibold text-emerald-800"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <FiBriefcase />
                  My Applications
                </button>
              )}

              <button
                onClick={() => handleAction("study")}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                  actionvalue === "study"
                    ? "bg-emerald-50 font-semibold text-emerald-800"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <FiBookOpen />
                Study Materials
              </button>
            </div>

            <div className="my-3 border-t border-slate-100" />

            <button
              onClick={() => setActiveTab("Settings")}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm ${
                activeTab === "Settings"
                  ? "bg-emerald-50 text-emerald-800"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <FiSettings size={18} />
              Account Settings
            </button>

            {/* ROLE-BASED INFORMATION CARD */}

            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              {isStudent ? (
                <>
                  <div className="flex items-center gap-2 text-emerald-700">
                    <FiBookOpen size={17} />
                    <p className="text-xs font-bold">Education</p>
                  </div>

                  <p className="mt-3 text-sm font-semibold text-slate-800">
                    {users.university || "University not added"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {users.program || "Program not added"}
                  </p>

                  <p className="mt-2 text-xs font-medium text-emerald-700">
                    {users.semester || "Semester not added"}
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-emerald-700">
                    <FiBriefcase size={17} />
                    <p className="text-xs font-bold">Professional</p>
                  </div>

                  <p className="mt-3 text-sm font-semibold text-slate-800">
                    {users.jobTitle || "Job title not added"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {users.company || "Company not added"}
                  </p>

                  <p className="mt-2 text-xs font-medium text-emerald-700">
                    {users.experienceLevel || "Experience not added"}
                  </p>
                </>
              )}
            </div>
          </aside>

          {/* RIGHT CONTENT */}

          <main className="min-w-0">
            {/* ======================================
                OVERVIEW
            ====================================== */}

            {actionvalue === "overview" && activeTab !== "Settings" && (
              <div className="space-y-5">
                {/* PROFILE OVERVIEW */}

                <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Profile Overview
                      </h2>

                      <p className="mt-1 text-xs text-slate-500">
                        Your activity and contributions on Educonnect
                      </p>
                    </div>

                    <FiMoreHorizontal className="text-slate-400" size={20} />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-100 p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                          <FiBriefcase size={20} />
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            Job Applications
                          </p>

                          <h3 className="text-xl font-bold">12</h3>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Shortlisted</span>
                        <span className="font-bold text-blue-600">3</span>
                      </div>

                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full w-1/4 rounded-full bg-blue-500" />
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-100 p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
                          <FiBookOpen size={20} />
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            Shared Resources
                          </p>

                          <h3 className="text-xl font-bold">08</h3>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Total Downloads</span>
                        <span className="font-bold text-emerald-600">98</span>
                      </div>

                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full w-3/4 rounded-full bg-emerald-500" />
                      </div>
                    </div>
                  </div>
                </section>

                {/* RECENT APPLICATIONS */}

                {isStudent && (
                  <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <h2 className="text-base font-bold text-slate-900">
                          Recent Applications
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                          Track your job and internship applications
                        </p>
                      </div>

                      <button
                        onClick={() => handleAction("application")}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
                      >
                        View All
                      </button>
                    </div>

                    <div className="space-y-3">
                      {applications.slice(0, 3).map((application) => (
                        <div
                          key={application.id}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 font-bold text-emerald-700">
                              {application.logo}
                            </div>

                            <div>
                              <h3 className="text-sm font-semibold">
                                {application.title}
                              </h3>

                              <p className="mt-1 text-xs text-slate-500">
                                {application.company} · {application.applied}
                              </p>
                            </div>
                          </div>

                          <StatusBadge status={application.status} />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* RECENT POSTS */}

                <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Recent Posts
                      </h2>

                      <p className="mt-1 text-xs text-slate-500">
                        Your latest community activity
                      </p>
                    </div>

                    <button
                      onClick={() => handleAction("post")}
                      className="text-xs font-semibold text-emerald-700"
                    >
                      View All
                    </button>
                  </div>

                  {myPosts.slice(0, 2).map((post) => (
                    <div
                      key={post.id}
                      className="mb-3 rounded-xl border border-slate-100 p-4 last:mb-0"
                    >
                      <p className="text-sm leading-6 text-slate-700">
                        {post.content}
                      </p>

                      <p className="mt-3 text-xs text-slate-400">{post.date}</p>

                      <div className="mt-3 flex gap-5 border-t border-slate-100 pt-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <FiHeart className="text-rose-500" />
                          {post.likes} Likes
                        </span>

                        <span className="flex items-center gap-1">
                          <FiMessageCircle />
                          {post.comments} Comments
                        </span>
                      </div>
                    </div>
                  ))}
                </section>
              </div>
            )}

            {/* UPLOAD JOB */}

            {actionvalue === "job" && isProfessional && <UploadJob />}

            {/* MY POSTS */}

            {actionvalue === "post" && <Mypost />}

            {/* MY APPLICATIONS */}

            {actionvalue === "application" && isStudent && <MyApplications />}

            {/* ======================================
                STUDY MATERIALS
            ====================================== */}

            {actionvalue === "study" && <MyStudyMaterials user={users} />}

            {/* ======================================
                ACCOUNT SETTINGS
            ====================================== */}

            {activeTab === "Settings" && (
              <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">
                  Account Settings
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Manage your personal information and account preferences.
                </p>

                <div className="mt-6 space-y-4">
                  {[
                    [
                      "Personal Information",
                      "Manage your name, email and bio.",
                    ],
                    ["Change Password", "Update your account password."],
                    ["Privacy Settings", "Control your profile visibility."],
                    [
                      "Notification Preferences",
                      "Manage email and app notifications.",
                    ],
                  ].map(([title, description]) => (
                    <button
                      key={title}
                      onClick={() => {
                        if (title === "Personal Information") {
                          setShowEditProfile(true);
                        }
                      }}
                      className="flex w-full items-center justify-between rounded-xl border border-slate-100 p-4 text-left hover:border-emerald-200 hover:bg-emerald-50/30"
                    >
                      <div>
                        <h3 className="text-sm font-semibold">{title}</h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {description}
                        </p>
                      </div>

                      <FiExternalLink className="text-slate-400" />
                    </button>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
