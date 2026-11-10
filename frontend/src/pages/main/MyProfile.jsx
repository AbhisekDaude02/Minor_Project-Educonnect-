
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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
  FiSettings,
  FiShare2,
  FiGlobe,
  FiGithub,
  FiLinkedin,
  FiAward,
  FiExternalLink,
  FiArrowUpRight,
} from "react-icons/fi";

import { BsCardList } from "react-icons/bs";

import UploadJob from "../../components/UploadJob";
import Mypost from "../../components/Mypost";
import MyApplications from "../../components/MyApplications";
import EditProfile from "../../components/EditProfile";
import MyStudyMaterials from "../../components/MyStudyMaterials";

import { AuthContext } from "../../context/authContext";
import { getMyFriends } from "../../services/connectionServices";

// ------------------------------------------
// Reusable section
// ------------------------------------------

const Section = ({ title, description, children }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    <div className="mb-5">
      <h2 className="text-base font-bold text-slate-900">
        {title}
      </h2>
      {description && (
        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      )}
    </div>
    {children}
  </section>
);

const MyProfile = () => {
  const navigate = useNavigate();
  const { users, setUsers, authLoading } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("overview");
  const [showEditProfile, setShowEditProfile] = useState(false);

  const [connectionCount, setConnectionCount] = useState(null);
  const [connectionLoading, setConnectionLoading] = useState(true);

  const isStudent = users?.role?.toLowerCase() === "student";
  const isProfessional =
    users?.role?.toLowerCase() === "professional";

  // ------------------------------------------
  // Fetch actual accepted connection count
  // ------------------------------------------

  useEffect(() => {
    if (!users?._id) {
      setConnectionCount(null);
      setConnectionLoading(false);
      return;
    }

    let active = true;

    const fetchConnections = async () => {
      try {
        setConnectionLoading(true);

        const response = await getMyFriends();

        if (!active) return;

        const friends = response.data.friends;

        setConnectionCount(
          Array.isArray(friends) ? friends.length : 0
        );
      } catch (error) {
        console.error("Connection count error:", error);

        if (active) {
          setConnectionCount(null);
        }
      } finally {
        if (active) setConnectionLoading(false);
      }
    };

    fetchConnections();

    return () => {
      active = false;
    };
  }, [users?._id]);

  // ------------------------------------------
  // Profile update
  // ------------------------------------------

  const handleProfileUpdated = (updatedUser) => {
    setUsers((previous) => ({
      ...previous,
      ...updatedUser,
    }));

    setShowEditProfile(false);
    toast.success("Profile updated successfully");
  };

  // ------------------------------------------
  // Share profile
  // ------------------------------------------

  const handleShare = async () => {
    const profileUrl = `${window.location.origin}/profile/${users._id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${users.fullName}'s Educonnect Profile`,
          text: `View ${users.fullName}'s profile on Educonnect`,
          url: profileUrl,
        });
      } else {
        await navigator.clipboard.writeText(profileUrl);
        toast.success("Profile link copied");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        toast.error("Unable to share profile");
      }
    }
  };

  // ------------------------------------------
  // Loading / unauthenticated
  // ------------------------------------------

  if (authLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
          <p className="mt-3 text-sm text-slate-500">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!users) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
        <FiUser size={36} className="text-slate-400" />
        <h2 className="text-lg font-bold text-slate-900">
          Please sign in to view your profile
        </h2>
      </div>
    );
  }

  // ------------------------------------------
  // Profile information
  // ------------------------------------------

  const roleLabel = isStudent
    ? "Student"
    : isProfessional
    ? "Professional"
    : users.role || "Educonnect Member";

  const joinedDate = users.createdAt
    ? new Date(users.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  const initials = (users.fullName || "U")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const navigation = [
    {
      id: "overview",
      label: "Overview",
      icon: FiGrid,
    },
    {
      id: "post",
      label: "My Posts",
      icon: FiFileText,
    },
    ...(isProfessional
      ? [
          {
            id: "job",
            label: "Upload Job",
            icon: BsCardList,
          },
        ]
      : []),
    ...(isStudent
      ? [
          {
            id: "application",
            label: "My Applications",
            icon: FiBriefcase,
          },
        ]
      : []),
    {
      id: "study",
      label: "Study Materials",
      icon: FiBookOpen,
    },
    {
      id: "settings",
      label: "Account Settings",
      icon: FiSettings,
    },
  ];

  const socialLinks = [
    {
      label: "Website",
      url: users.website,
      icon: FiGlobe,
    },
    {
      label: "LinkedIn",
      url: users.linkedin,
      icon: FiLinkedin,
    },
    {
      label: "GitHub",
      url: users.github,
      icon: FiGithub,
    },
  ].filter(({ url }) => {
    if (!url) return false;

    try {
      const parsed = new URL(url);
      return ["http:", "https:"].includes(parsed.protocol);
    } catch {
      return false;
    }
  });

  return (
    <div className="min-h-screen bg-[#f5f8f7] pb-12 text-slate-800">
      <div className="mx-auto max-w-[1250px] px-4 py-6 sm:px-6 lg:px-8">

        {/* BREADCRUMB */}

        <div className="mb-5 flex items-center gap-2 text-sm">
          <span className="text-slate-400">Educonnect</span>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-emerald-700">
            My Profile
          </span>
        </div>

        {/* PROFILE HEADER */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* COVER */}

          <div className="relative h-44 overflow-hidden bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-700 sm:h-56">
            <div className="absolute -right-12 -top-20 h-72 w-72 rounded-full border-[35px] border-white/5" />
            <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full border-[35px] border-white/5" />

            <div className="absolute bottom-6 left-6 text-white sm:left-9">
              <p className="text-xs font-semibold uppercase tracking-[3px] text-emerald-100">
                Your Learning Journey
              </p>

              <h2 className="mt-2 text-xl font-bold sm:text-2xl">
                Welcome to your profile
              </h2>
            </div>
          </div>

          {/* PROFILE DETAILS */}

          <div className="px-5 pb-7 sm:px-9">
            <div className="-mt-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">

                {/* AVATAR */}

                <div className="relative w-fit shrink-0">
                  {users.profilepic ? (
                    <img
                      src={users.profilepic}
                      alt={users.fullName || "Profile"}
                      className="h-28 w-28 rounded-2xl border-4 border-white bg-white object-cover shadow-md"
                    />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-white bg-emerald-100 text-3xl font-bold text-emerald-700 shadow-md">
                      {initials}
                    </div>
                  )}
                </div>

                {/* NAME */}

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold text-slate-900">
                      {users.fullName || "Educonnect Member"}
                    </h1>

                    {users.isverified && (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                        VERIFIED
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {users.jobTitle ||
                      users.program ||
                      roleLabel}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">

                    {users.location && (
                      <span className="flex items-center gap-1.5">
                        <FiMapPin size={13} />
                        {users.location}
                      </span>
                    )}

                    {joinedDate && (
                      <span className="flex items-center gap-1.5">
                        <FiCalendar size={13} />
                        Joined {joinedDate}
                      </span>
                    )}

                    {/* SMALL REAL CONNECTION COUNT */}

                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700">
                      <FiUsers size={14} />
                      {connectionLoading
                        ? "Loading..."
                        : connectionCount === null
                        ? "Unavailable"
                        : connectionCount}{" "}
                      Connections
                    </span>
                  </div>
                </div>
              </div>

              {/* PROFILE ACTIONS */}

              <div className="flex flex-wrap gap-2 pb-1">
                <button
                  onClick={() => setShowEditProfile(true)}
                  className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-800"
                >
                  <FiEdit size={14} />
                  Edit Profile
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <FiShare2 size={14} />
                  Share Profile
                </button>
              </div>
            </div>

            {/* BIO */}

            <div className="mt-6 max-w-3xl">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                About Me
              </h3>

              <p className="text-sm leading-7 text-slate-600">
                {users.bio ||
                  "No bio added yet. Tell others something about yourself."}
              </p>
            </div>

            {/* CONTACT DETAILS */}

            <div className="mt-5 flex flex-wrap gap-4 text-xs text-slate-500">
              {users.email && (
                <span className="flex items-center gap-2">
                  <FiMail className="text-emerald-700" />
                  {users.email}
                </span>
              )}

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
            </div>

            {/* SOCIAL LINKS */}

            {socialLinks.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-4">
                {socialLinks.map(({ label, url, icon: Icon }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-medium text-emerald-700 hover:underline"
                  >
                    <Icon size={14} />
                    {label}
                    <FiArrowUpRight size={12} />
                  </a>
                ))}
              </div>
            )}

            {/* SKILLS */}

            {Array.isArray(users.skills) &&
              users.skills.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Skills
                  </h3>

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

        {/* EDIT PROFILE MODAL */}

        <EditProfile
          isOpen={showEditProfile}
          onClose={() => setShowEditProfile(false)}
          user={users}
          onUpdated={handleProfileUpdated}
        />

        {/* MAIN DASHBOARD */}

        <div className="mt-6 grid grid-cols-1 items-start gap-5 lg:grid-cols-[245px_minmax(0,1fr)]">

          {/* LEFT NAVIGATION */}

          <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="px-3 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Profile Dashboard
            </p>

            <nav className="space-y-1">
              {navigation.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                    activeTab === id
                      ? "bg-emerald-50 font-semibold text-emerald-800"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={17} />
                  {label}
                </button>
              ))}
            </nav>

            {/* ROLE INFORMATION */}

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
                    <p className="text-xs font-bold">
                      Professional Information
                    </p>
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

            {/* OVERVIEW */}

            {activeTab === "overview" && (
              <div className="space-y-5">

                <Section
                  title="Profile Overview"
                  description="Your information and activity on Educonnect"
                >
                  <div className="grid gap-4 sm:grid-cols-2">

                    <div className="rounded-xl border border-slate-100 p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
                          <FiUser size={20} />
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            Account Type
                          </p>

                          <h3 className="mt-1 font-bold text-slate-900">
                            {roleLabel}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-100 p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                          <FiUsers size={20} />
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            Connections
                          </p>

                          <h3 className="mt-1 font-bold text-slate-900">
                            {connectionLoading
                              ? "Loading..."
                              : connectionCount ?? "Unavailable"}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </Section>

                {/* EDUCATION OR CAREER */}

                <Section
                  title={
                    isStudent
                      ? "Education Details"
                      : "Professional Details"
                  }
                  description="Information added to your profile"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    {(isStudent
                      ? [
                          ["University", users.university],
                          ["Program", users.program],
                          ["Semester", users.semester],
                        ]
                      : [
                          ["Job Title", users.jobTitle],
                          ["Company", users.company],
                          ["Experience", users.experienceLevel],
                        ]
                    ).map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-xl bg-slate-50 p-4"
                      >
                        <p className="text-xs text-slate-500">
                          {label}
                        </p>

                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          {value || "Not provided"}
                        </p>
                      </div>
                    ))}
                  </div>
                </Section>

                {/* QUICK ACTIONS */}

                <Section
                  title="Quick Actions"
                  description="Manage your Educonnect activity"
                >
                  <div className="grid gap-3 sm:grid-cols-2">

                    <button
                      onClick={() => setActiveTab("post")}
                      className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50/30"
                    >
                      <span className="flex items-center gap-3">
                        <FiFileText className="text-emerald-700" />
                        <span className="text-sm font-semibold">
                          My Posts
                        </span>
                      </span>
                      <FiArrowUpRight />
                    </button>

                    <button
                      onClick={() => setActiveTab("study")}
                      className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50/30"
                    >
                      <span className="flex items-center gap-3">
                        <FiBookOpen className="text-emerald-700" />
                        <span className="text-sm font-semibold">
                          Study Materials
                        </span>
                      </span>
                      <FiArrowUpRight />
                    </button>

                    {isStudent && (
                      <button
                        onClick={() => setActiveTab("application")}
                        className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-left hover:border-emerald-200"
                      >
                        <span className="flex items-center gap-3">
                          <FiBriefcase className="text-emerald-700" />
                          <span className="text-sm font-semibold">
                            My Applications
                          </span>
                        </span>
                        <FiArrowUpRight />
                      </button>
                    )}

                    {isProfessional && (
                      <button
                        onClick={() => setActiveTab("job")}
                        className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-left hover:border-emerald-200"
                      >
                        <span className="flex items-center gap-3">
                          <FiBriefcase className="text-emerald-700" />
                          <span className="text-sm font-semibold">
                            Upload Job
                          </span>
                        </span>
                        <FiArrowUpRight />
                      </button>
                    )}
                  </div>
                </Section>

                {/* PUBLIC PROFILE */}

                <Section
                  title="Public Profile"
                  description="See how other Educonnect members view your profile"
                >
                  <button
                    onClick={() => navigate(`/profile/${users._id}`)}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
                  >
                    <FiExternalLink />
                    View My Public Profile
                  </button>
                </Section>
              </div>
            )}

            {/* MY POSTS */}

            {activeTab === "post" && <Mypost />}

            {/* UPLOAD JOB */}

            {activeTab === "job" && isProfessional && (
              <UploadJob />
            )}

            {/* MY APPLICATIONS */}

            {activeTab === "application" && isStudent && (
              <MyApplications />
            )}

            {/* STUDY MATERIALS */}

            {activeTab === "study" && (
              <MyStudyMaterials user={users} />
            )}

            {/* SETTINGS */}

            {activeTab === "settings" && (
              <Section
                title="Account Settings"
                description="Manage your profile and account information"
              >
                <div className="space-y-3">

                  <button
                    onClick={() => setShowEditProfile(true)}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50/30"
                  >
                    <div className="flex items-center gap-3">
                      <FiEdit className="text-emerald-700" />

                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Edit Personal Information
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Update your name, bio, skills and profile details.
                        </p>
                      </div>
                    </div>

                    <FiArrowUpRight className="text-slate-400" />
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50/30"
                  >
                    <div className="flex items-center gap-3">
                      <FiShare2 className="text-emerald-700" />

                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Share Profile
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Copy or share your public profile link.
                        </p>
                      </div>
                    </div>

                    <FiArrowUpRight className="text-slate-400" />
                  </button>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-slate-700">
                      <FiAward className="text-emerald-700" />
                      <p className="text-sm font-semibold">
                        Educonnect Account
                      </p>
                    </div>

                    <p className="mt-2 text-xs leading-6 text-slate-500">
                      Your account information is managed securely
                      through your existing authentication system.
                    </p>
                  </div>
                </div>
              </Section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
