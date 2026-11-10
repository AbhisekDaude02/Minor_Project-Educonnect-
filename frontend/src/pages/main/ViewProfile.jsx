
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FiArrowLeft,
  FiUser,
  FiUsers,
  FiMapPin,
  FiCalendar,
  FiBookOpen,
  FiBriefcase,
  FiGlobe,
  FiGithub,
  FiLinkedin,
  FiAward,
} from "react-icons/fi";

import { getPublicProfile } from "../../services/connectionServices";

const ViewProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [connectionCount, setConnectionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await getPublicProfile(userId);

        if (!active) return;

        setProfile(response.data.user);
        setConnectionCount(response.data.connectionCount ?? 0);
      } catch (error) {
        if (!active) return;

        const message =
          error.response?.data?.message || "Unable to load profile";

        setErrorMessage(message);
        toast.error(message);
      } finally {
        if (active) setLoading(false);
      }
    };

    if (userId) fetchProfile();

    return () => {
      active = false;
    };
  }, [userId]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f7f9f8]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />
          <p className="mt-4 text-sm text-slate-500">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
        <FiUser size={36} className="text-slate-400" />
        <h2 className="text-xl font-bold">Profile unavailable</h2>
        <p className="text-sm text-slate-500">{errorMessage}</p>
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg bg-emerald-700 px-5 py-2 text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isStudent = profile.role?.toLowerCase() === "student";

  const joinedDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  const initials = (profile.fullName || "U")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#f7f9f8] pb-12">
      <div className="mx-auto max-w-[1050px] px-4 py-7 sm:px-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700"
        >
          <FiArrowLeft />
          Back to Community
        </button>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="relative h-40 bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-700 sm:h-52">
            <div className="absolute -right-12 -top-16 h-64 w-64 rounded-full border-[30px] border-white/5" />
            <div className="absolute bottom-5 left-6 text-sm font-semibold text-emerald-50">
              Educonnect Member Profile
            </div>
          </div>

          <div className="px-5 pb-7 sm:px-8">
            <div className="-mt-12 flex flex-wrap items-end justify-between gap-5">
              {profile.profilepic ? (
                <img
                  src={profile.profilepic}
                  alt={profile.fullName}
                  className="h-28 w-28 rounded-2xl border-4 border-white bg-white object-cover shadow-md"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-white bg-emerald-100 text-3xl font-bold text-emerald-700 shadow-md">
                  {initials}
                </div>
              )}

              <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                <FiUsers className="text-emerald-700" size={18} />
                <div>
                  <p className="text-lg font-bold leading-none text-slate-900">
                    {connectionCount}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Connections
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <h1 className="text-2xl font-bold text-slate-900">
                {profile.fullName}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {profile.jobTitle ||
                  profile.program ||
                  profile.role ||
                  "Educonnect Member"}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                {profile.location && (
                  <span className="flex items-center gap-1.5">
                    <FiMapPin />
                    {profile.location}
                  </span>
                )}

                {joinedDate && (
                  <span className="flex items-center gap-1.5">
                    <FiCalendar />
                    Joined {joinedDate}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-6">
              <h2 className="text-sm font-bold text-slate-900">
                About
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {profile.bio || "This member hasn't added a bio yet."}
              </p>
            </div>

            {Array.isArray(profile.skills) &&
              profile.skills.length > 0 && (
                <div className="mt-6">
                  <h2 className="mb-3 text-sm font-bold text-slate-900">
                    Skills
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </section>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              {isStudent ? (
                <FiBookOpen className="text-emerald-700" />
              ) : (
                <FiBriefcase className="text-emerald-700" />
              )}

              <h2 className="font-bold text-slate-900">
                {isStudent ? "Education" : "Professional Details"}
              </h2>
            </div>

            {isStudent ? (
              <div className="space-y-4 text-sm">
                <p>
                  <span className="text-slate-500">University: </span>
                  <strong>{profile.university || "Not provided"}</strong>
                </p>

                <p>
                  <span className="text-slate-500">Program: </span>
                  <strong>{profile.program || "Not provided"}</strong>
                </p>

                <p>
                  <span className="text-slate-500">Semester: </span>
                  <strong>{profile.semester || "Not provided"}</strong>
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                <p>
                  <span className="text-slate-500">Job Title: </span>
                  <strong>{profile.jobTitle || "Not provided"}</strong>
                </p>

                <p>
                  <span className="text-slate-500">Company: </span>
                  <strong>{profile.company || "Not provided"}</strong>
                </p>

                <p>
                  <span className="text-slate-500">Experience: </span>
                  <strong>
                    {profile.experienceLevel || "Not provided"}
                  </strong>
                </p>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <FiAward className="text-emerald-700" />
              <h2 className="font-bold text-slate-900">
                Online Presence
              </h2>
            </div>

            <div className="space-y-3">
              {[
                {
                  label: "Website",
                  url: profile.website,
                  icon: FiGlobe,
                },
                {
                  label: "GitHub",
                  url: profile.github,
                  icon: FiGithub,
                },
                {
                  label: "LinkedIn",
                  url: profile.linkedin,
                  icon: FiLinkedin,
                },
              ]
                .filter((item) => {
                  if (!item.url) return false;
                  try {
                    const url = new URL(item.url);
                    return ["http:", "https:"].includes(url.protocol);
                  } catch {
                    return false;
                  }
                })
                .map((item) => {
                  const Icon = item.icon;

                  return (
                    <a
                      key={item.label}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 text-sm text-slate-600 hover:border-emerald-200 hover:text-emerald-700"
                    >
                      <span className="flex items-center gap-3">
                        <Icon />
                        {item.label}
                      </span>

                      <FiArrowLeft className="rotate-[135deg]" />
                    </a>
                  );
                })}

              {!profile.website &&
                !profile.github &&
                !profile.linkedin && (
                  <p className="text-sm text-slate-500">
                    No social links added yet.
                  </p>
                )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
