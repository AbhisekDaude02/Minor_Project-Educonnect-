
import React, { use, useState } from "react";
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
  FiPlus,
  FiSearch,
  FiFilter,
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


// ==========================================
// SAMPLE PROFILE DATA
// Replace these values with API data later
// ==========================================

const profile = {
  fullName: "Abhisek Abhisek",
  username: "@abhisekdaude",
  role: "Computer Engineering Student",
  email: "abhisekdaude02@gmail.com",
  location: "Mahendranagar, Nepal",
  university: "Far Western University",
  program: "BE Computer Engineering",
  semester: "4th Semester",
  joined: "October 2025",
  bio: "Passionate Computer Engineering student interested in MERN Stack Development, AI/ML and building meaningful technology. Always learning, sharing and growing.",
  profilepic: "https://i.pravatar.cc/300?img=12",
  cover: "",
  website: "https://github.com",
};

// ==========================================
// SAMPLE POSTS
// ==========================================

const myPosts = [
  {
    id: 1,
    content:
      "Started learning Machine Learning! Currently exploring Python, NumPy and Pandas. Excited to build some real-world AI projects.",
    image: "",
    date: "2 hours ago",
    likes: 24,
    comments: 8,
    shares: 3,
  },
  {
    id: 2,
    content:
      "Working on Educonnect, a platform where students can connect, share study materials and discover internship opportunities. Building something meaningful!",
    image: "",
    date: "Yesterday",
    likes: 42,
    comments: 12,
    shares: 7,
  },
  {
    id: 3,
    content:
      "Consistency is more important than perfection. Keep learning, keep building and never stop improving.",
    image: "",
    date: "3 days ago",
    likes: 18,
    comments: 5,
    shares: 2,
  },
];

// ==========================================
// SAMPLE APPLICATIONS
// ==========================================

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

// ==========================================
// SAMPLE STUDY MATERIALS
// ==========================================

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
// STATUS COMPONENT
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
// MAIN COMPONENT
// ==========================================

const MyProfile = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [applicationFilter, setApplicationFilter] = useState("All");
  const [searchMaterial, setSearchMaterial] = useState("");
  const [actionvalue, setActionvalue] = useState("overview");

  const handleAction = (action)=>{
    setActionvalue(action)

  }

  const tabs = [
    { name: "Overview", icon: FiGrid },
    { name: "My Posts", icon: FiFileText },
    { name: "Applications", icon: FiBriefcase },
    { name: "Study Materials", icon: FiBookOpen },
    { name: "Saved Posts", icon: FiBookmark },
  ];

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

  const filteredApplications =
    applicationFilter === "All"
      ? applications
      : applications.filter(
          (application) => application.status === applicationFilter
        );

  const filteredMaterials = materials.filter((material) =>
    `${material.title} ${material.subject}`
      .toLowerCase()
      .includes(searchMaterial.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f4f7f8] pb-10 text-slate-800">
      <div className="mx-auto max-w-[1250px] px-4 py-6 sm:px-6 lg:px-8">

        {/* PAGE BREADCRUMB */}

        <div className="mb-5 flex items-center gap-2 text-sm">
          <span className="text-slate-400">Educonnect</span>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-emerald-700">
            My Profile
          </span>
        </div>

        {/* PROFILE HEADER */}

        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">

          {/* COVER */}

          <div className="relative h-44 overflow-hidden bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-700 sm:h-56">
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

            <button className="absolute right-5 top-5 flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur hover:bg-white/20">
              <FiEdit size={14} />
              Edit Cover
            </button>
          </div>

          {/* PROFILE INFORMATION */}

          <div className="px-5 pb-6 sm:px-9">

            <div className="-mt-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="relative w-fit">
                  <img
                    src={profile.profilepic}
                    alt="Profile"
                    className="h-28 w-28 rounded-2xl border-4 border-white object-cover shadow-md"
                  />
                  <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
                </div>

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold text-slate-900">
                      {profile.fullName}
                    </h1>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                      VERIFIED MEMBER
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {profile.username} · {profile.role}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <FiMapPin size={13} />
                      {profile.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiCalendar size={13} />
                      Joined {profile.joined}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pb-1">
                <button className="flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-800">
                  <FiEdit size={14} />
                  Edit Profile
                </button>

                <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                  <FiShare2 size={14} />
                  Share Profile
                </button>
              </div>

            </div>

            {/* BIO */}

            <div className="mt-6 max-w-3xl">
              <p className="text-sm leading-7 text-slate-600">
                {profile.bio}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-2">
                  <FiMail className="text-emerald-700" />
                  {profile.email}
                </span>

                <span className="flex items-center gap-2">
                  <FiBookOpen className="text-emerald-700" />
                  {profile.university}
                </span>

                <span className="flex items-center gap-2">
                  <FiGlobe className="text-emerald-700" />
                  {profile.website}
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* STATISTICS */}

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
                <p className="mt-1 text-xs text-slate-500">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* MAIN CONTENT */}

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[235px_minmax(0,1fr)]">

          {/* LEFT NAVIGATION */}

          <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
            <p className="px-3 py-3 text-[10px] font-bold uppercase  text-slate-400">
              Profile Dashboard
            </p>

            <div className=" text-[10px] tracking-widest text-emerald-50 flex flex-col ml-4 space-y-2 ">
              < button onClick={()=>handleAction("overview")} className="flex w-full items-center gap-3 rounded-xl px-1 py-3 text-sm text-slate-600 hover:bg-slate-50">
               <FiGrid/> Overview
              </button>
              < button onClick={()=>handleAction("post")} className="flex w-full items-center gap-3 rounded-xl px-1 py-3 text-sm text-slate-600 hover:bg-slate-50">
               <FiFileText/> My post
              </button>
             < button onClick={()=>handleAction("job")} className="flex w-full items-center gap-3 rounded-xl px-1 py-3 text-sm text-slate-600 hover:bg-slate-50">
              <BsCardList/> Upload Job
              </button>
              < button onClick={()=>handleAction("application")} className="flex w-full items-center gap-3 rounded-xl px-1 py-3 text-sm text-slate-600 hover:bg-slate-50">
              <FiBriefcase/>  My Application
              </button>

              < button onClick={()=>handleAction("study")} className="flex w-full items-center gap-3 rounded-xl px-1 py-3 text-sm text-slate-600 hover:bg-slate-50">
               <FiBookOpen /> Study Matarials
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

            {/* EDUCATION CARD */}

            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-emerald-700">
                <FiBookOpen size={17} />
                <p className="text-xs font-bold">Education</p>
              </div>

              <p className="mt-3 text-sm font-semibold text-slate-800">
                {profile.university}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {profile.program}
              </p>
              <p className="mt-2 text-xs font-medium text-emerald-700">
                {profile.semester}
              </p>
            </div>
          </aside>

          {/* RIGHT CONTENT */}

          <main className="min-w-0">

            {/* OVERVIEW */}

            {actionvalue === "overview" && (
              <div className="space-y-5">

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
                      onClick={() => setActiveTab("Applications")}
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
                      onClick={() => setActiveTab("My Posts")}
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

                      <p className="mt-3 text-xs text-slate-400">
                        {post.date}
                      </p>

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
             {/* Upload the jobs */}
             {actionvalue==="job" && (<UploadJob/>)}


            {/* MY POSTS */}

            {actionvalue === "post" && (<Mypost/>)}

            {/* APPLICATIONS */}

            {actionvalue=== "application" && (
              <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-slate-900">
                    My Applications
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Manage and track all your job and internship applications
                  </p>
                </div>

                {/* APPLICATION SUMMARY */}

                <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Total", count: applications.length },
                    {
                      label: "Pending",
                      count: applications.filter((a) => a.status === "Pending").length,
                    },
                    {
                      label: "Shortlisted",
                      count: applications.filter((a) => a.status === "Shortlisted").length,
                    },
                    {
                      label: "Rejected",
                      count: applications.filter((a) => a.status === "Rejected").length,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl bg-slate-50 p-3"
                    >
                      <h3 className="text-xl font-bold text-slate-900">
                        {item.count}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* FILTERS */}

                <div className="mb-5 flex flex-wrap gap-2">
                  {["All", "Pending", "Shortlisted", "Rejected", "Accepted"].map(
                    (filter) => (
                      <button
                        key={filter}
                        onClick={() => setApplicationFilter(filter)}
                        className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                          applicationFilter === filter
                            ? "bg-emerald-700 text-white"
                            : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {filter}
                      </button>
                    )
                  )}
                </div>

                {/* APPLICATION LIST */}

                <div className="space-y-3">
                  {filteredApplications.map((application) => (
                    <div
                      key={application.id}
                      className="rounded-xl border border-slate-100 p-4 transition hover:border-emerald-200"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-lg font-bold text-emerald-700">
                            {application.logo}
                          </div>

                          <div>
                            <h3 className="text-sm font-bold text-slate-900">
                              {application.title}
                            </h3>
                            <p className="mt-1 text-xs text-slate-600">
                              {application.company}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
                              <span className="flex items-center gap-1">
                                <FiMapPin />
                                {application.location}
                              </span>
                              <span>{application.type}</span>
                              <span>Applied {application.applied}</span>
                            </div>
                          </div>
                        </div>

                        <StatusBadge status={application.status} />
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                        <span className="text-xs text-slate-400">
                          Application ID: EC-00{application.id}
                        </span>

                        <button className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900">
                          View Details
                          <FiExternalLink />
                        </button>
                      </div>
                    </div>
                  ))}

                  {filteredApplications.length === 0 && (
                    <div className="py-12 text-center">
                      <FiBriefcase className="mx-auto text-3xl text-slate-300" />
                      <p className="mt-3 text-sm text-slate-500">
                        No applications found.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* STUDY MATERIALS */}

            {actionvalue === "study" && (
              <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      My Study Materials
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Manage all the educational resources you have uploaded
                    </p>
                  </div>

                  <button className="flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800">
                    <FiUploadCloud />
                    Upload Material
                  </button>
                </div>

                {/* MATERIAL STATS */}

                <div className="mb-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-emerald-50 p-4">
                    <p className="text-xs text-emerald-700">Total Uploads</p>
                    <h3 className="mt-1 text-2xl font-bold text-emerald-800">
                      08
                    </h3>
                  </div>

                  <div className="rounded-xl bg-blue-50 p-4">
                    <p className="text-xs text-blue-700">Total Downloads</p>
                    <h3 className="mt-1 text-2xl font-bold text-blue-800">
                      98
                    </h3>
                  </div>
                </div>

                {/* SEARCH */}

                <div className="relative mb-5">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={searchMaterial}
                    onChange={(e) => setSearchMaterial(e.target.value)}
                    placeholder="Search your uploaded materials..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                {/* MATERIAL LIST */}

                <div className="space-y-3">
                  {filteredMaterials.map((material) => (
                    <div
                      key={material.id}
                      className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-100 p-4 hover:border-emerald-200"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                          <FiFileText size={22} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-bold text-slate-800">
                            {material.title}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            {material.subject} · {material.semester}
                          </p>

                          <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-slate-400">
                            <span>{material.type}</span>
                            <span>{material.size}</span>
                            <span>{material.date}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="hidden items-center gap-1 text-xs text-slate-500 sm:flex">
                          <FiDownload />
                          {material.downloads}
                        </span>

                        <button
                          title="View material"
                          className="rounded-lg border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50 hover:text-emerald-700"
                        >
                          <FiEye size={16} />
                        </button>

                        <button
                          title="Download material"
                          className="rounded-lg border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50 hover:text-emerald-700"
                        >
                          <FiDownload size={16} />
                        </button>

                        <button
                          title="More options"
                          className="rounded-lg border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50"
                        >
                          <FiMoreHorizontal size={16} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {filteredMaterials.length === 0 && (
                    <div className="py-12 text-center text-sm text-slate-500">
                      No study materials found.
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* SAVED POSTS */}

            {activeTab === "Saved Posts" && (
              <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-slate-900">
                    Saved Posts
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Posts you bookmarked for later
                  </p>
                </div>

                <div className="space-y-3">
                  {myPosts.slice(0, 2).map((post) => (
                    <div
                      key={post.id}
                      className="rounded-xl border border-slate-100 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                          <FiBookmark />
                          Saved Post
                        </span>
                        <button className="text-slate-400 hover:text-red-500">
                          <FiMoreHorizontal />
                        </button>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-700">
                        {post.content}
                      </p>
                      <p className="mt-3 text-xs text-slate-400">
                        {post.date}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SETTINGS */}

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
                    ["Personal Information", "Manage your name, email and bio."],
                    ["Change Password", "Update your account password."],
                    ["Privacy Settings", "Control your profile visibility."],
                    ["Notification Preferences", "Manage email and app notifications."],
                  ].map(([title, description]) => (
                    <button
                      key={title}
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
