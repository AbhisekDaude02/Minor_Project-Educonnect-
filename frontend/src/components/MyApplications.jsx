
import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  FiBriefcase,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiSearch,
  FiRefreshCw,
  FiFileText,
  FiExternalLink,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiAward,
  FiArrowUpRight,
  FiInbox,
} from "react-icons/fi";

import { getMyApplications } from "../services/jobServices";

// ==========================================
// STATUS CONFIGURATION
// ==========================================

const statusConfig = {
  pending: {
    label: "Pending",
    icon: FiClock,
    style: "bg-amber-50 text-amber-700 border-amber-200",
    description: "Your application is waiting for review.",
  },

  shortlisted: {
    label: "Shortlisted",
    icon: FiCheckCircle,
    style: "bg-blue-50 text-blue-700 border-blue-200",
    description: "Your application has been shortlisted.",
  },

  selected: {
    label: "Selected",
    icon: FiAward,
    style: "bg-emerald-50 text-emerald-700 border-emerald-200",
    description: "Congratulations! You have been selected.",
  },

  rejected: {
    label: "Rejected",
    icon: FiXCircle,
    style: "bg-red-50 text-red-700 border-red-200",
    description: "Your application was not selected.",
  },
};

// ==========================================
// FORMAT DATE
// ==========================================

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// ==========================================
// STATUS BADGE
// ==========================================

const StatusBadge = ({ status }) => {
  const normalizedStatus = String(status || "pending").toLowerCase();

  const config = statusConfig[normalizedStatus] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${config.style}`}
    >
      <Icon size={14} />
      {config.label}
    </span>
  );
};

// ==========================================
// APPLICATION CARD
// ==========================================

const ApplicationCard = ({ application }) => {
  const job =
    application?.job && typeof application.job === "object"
      ? application.job
      : {};

  const title = job.title || "Job information unavailable";
  const company = job.company || "Company unavailable";
  const location = job.location || "Location not specified";

  const type = job.type || "Job";
  const workMode = job.workMode || "Not specified";

  const status = String(application?.status || "pending").toLowerCase();

  const config = statusConfig[status] || statusConfig.pending;

  const applicationDate = formatDate(application?.createdAt);

  const resumeUrl = application?.resumeUrl;

  const [showCoverLetter, setShowCoverLetter] = useState(false);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md">

      {/* TOP SECTION */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

        <div className="flex min-w-0 items-start gap-3">

          {/* COMPANY ICON */}

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <FiBriefcase size={22} />
          </div>

          {/* JOB DETAILS */}

          <div className="min-w-0">

            <h3 className="break-words text-base font-bold text-slate-900">
              {title}
            </h3>

            <p className="mt-1 text-sm font-medium text-slate-600">
              {company}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">

              <span className="flex items-center gap-1.5">
                <FiMapPin size={13} />
                {location}
              </span>

              <span className="flex items-center gap-1.5">
                <FiBriefcase size={13} />
                {String(type).charAt(0).toUpperCase() + String(type).slice(1)}
              </span>

              <span className="flex items-center gap-1.5">
                <FiClock size={13} />
                {workMode}
              </span>

            </div>
          </div>
        </div>

        {/* STATUS */}

        <div className="shrink-0">
          <StatusBadge status={status} />
        </div>

      </div>

      {/* STATUS MESSAGE */}

      <div className={`mt-5 flex items-start gap-2 rounded-xl p-3 ${config.style.split(" ")[0]}`}>

        <FiAlertCircle className="mt-0.5 shrink-0" size={15} />

        <p className="text-xs leading-5">
          {config.description}
        </p>

      </div>

      {/* APPLICATION INFORMATION */}

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

        <div className="rounded-xl bg-slate-50 p-3">

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <FiCalendar size={14} />
            Applied Date
          </div>

          <p className="mt-2 text-sm font-semibold text-slate-800">
            {applicationDate}
          </p>

        </div>

        <div className="rounded-xl bg-slate-50 p-3">

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <FiFileText size={14} />
            Resume
          </div>

          <p className="mt-2 text-sm font-semibold text-slate-800">
            {resumeUrl ? "Resume submitted" : "Resume unavailable"}
          </p>

        </div>

      </div>

      {/* COVER LETTER */}

      {application?.coverLetter && (
        <div className="mt-4">

          <button
            type="button"
            onClick={() => setShowCoverLetter((previous) => !previous)}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
          >
            {showCoverLetter ? "Hide cover letter" : "View cover letter"}
          </button>

          {showCoverLetter && (
            <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-4">

              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {application.coverLetter}
              </p>

            </div>
          )}

        </div>
      )}

      {/* BOTTOM ACTIONS */}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">

        <span className="text-xs text-slate-400">
          Application ID: {application?._id || "Unavailable"}
        </span>

        {resumeUrl && (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
          >
            View Resume
            <FiExternalLink size={14} />
          </a>
        )}

      </div>

    </article>
  );
};

// ==========================================
// MAIN MY APPLICATIONS COMPONENT
// ==========================================

const MyApplications = () => {

  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [activeFilter, setActiveFilter] = useState("all");

  // ==========================================
  // FETCH APPLICATIONS
  // ==========================================

  const fetchApplications = useCallback(async () => {

    try {

      setLoading(true);
      setError("");

      const response = await getMyApplications();

      const applicationData = response?.data?.applications;

      setApplications(
        Array.isArray(applicationData) ? applicationData : []
      );

    } catch (error) {

      console.error("Error fetching applications:", error);

      setError(
        error?.response?.data?.message ||
        "Unable to load your applications. Please try again."
      );

    } finally {

      setLoading(false);

    }

  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // ==========================================
  // APPLICATION STATISTICS
  // ==========================================

  const statistics = useMemo(() => {

    return {
      total: applications.length,

      pending: applications.filter(
        (item) => item.status?.toLowerCase() === "pending"
      ).length,

      shortlisted: applications.filter(
        (item) => item.status?.toLowerCase() === "shortlisted"
      ).length,

      selected: applications.filter(
        (item) => item.status?.toLowerCase() === "selected"
      ).length,

      rejected: applications.filter(
        (item) => item.status?.toLowerCase() === "rejected"
      ).length,
    };

  }, [applications]);

  // ==========================================
  // FILTER APPLICATIONS
  // ==========================================

  const filteredApplications = useMemo(() => {

    return applications.filter((application) => {

      const job =
        application?.job && typeof application.job === "object"
          ? application.job
          : {};

      const searchText = [
        job.title,
        job.company,
        job.location,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase());

      const matchesStatus =
        activeFilter === "all" ||
        application?.status?.toLowerCase() === activeFilter;

      return matchesSearch && matchesStatus;

    });

  }, [applications, search, activeFilter]);

  // ==========================================
  // FILTER OPTIONS
  // ==========================================

  const filters = [
    { label: "All", value: "all", count: statistics.total },
    { label: "Pending", value: "pending", count: statistics.pending },
    {
      label: "Shortlisted",
      value: "shortlisted",
      count: statistics.shortlisted,
    },
    { label: "Selected", value: "selected", count: statistics.selected },
    { label: "Rejected", value: "rejected", count: statistics.rejected },
  ];

  // ==========================================
  // RENDER
  // ==========================================

  return (

    <section className="space-y-5">

      {/* PAGE HEADER */}

      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">

        <div className="flex flex-wrap items-center justify-between gap-4">

          <div>

            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                <FiBriefcase size={20} />
              </div>

              <h2 className="text-lg font-bold text-slate-900">
                My Applications
              </h2>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Track the progress of your job and internship applications.
            </p>

          </div>

          <button
            type="button"
            onClick={fetchApplications}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

        </div>

      </div>

      {/* STATISTICS */}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">

        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">

          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Total</p>
            <FiBriefcase className="text-slate-400" />
          </div>

          <h3 className="mt-3 text-2xl font-bold text-slate-900">
            {statistics.total}
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Applications
          </p>

        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">

          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Pending</p>
            <FiClock className="text-amber-500" />
          </div>

          <h3 className="mt-3 text-2xl font-bold text-amber-600">
            {statistics.pending}
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Under review
          </p>

        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">

          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Shortlisted</p>
            <FiCheckCircle className="text-blue-500" />
          </div>

          <h3 className="mt-3 text-2xl font-bold text-blue-600">
            {statistics.shortlisted}
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Shortlisted
          </p>

        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">

          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Selected</p>
            <FiAward className="text-emerald-500" />
          </div>

          <h3 className="mt-3 text-2xl font-bold text-emerald-600">
            {statistics.selected}
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Selected
          </p>

        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">

          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Rejected</p>
            <FiXCircle className="text-red-500" />
          </div>

          <h3 className="mt-3 text-2xl font-bold text-red-600">
            {statistics.rejected}
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Not selected
          </p>

        </div>

      </div>

      {/* APPLICATION LIST CONTAINER */}

      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">

        {/* TITLE */}

        <div className="mb-5">

          <h3 className="text-base font-bold text-slate-900">
            Your Submitted Applications
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            View your application details and current status.
          </p>

        </div>

        {/* SEARCH */}

        <div className="relative mb-5">

          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by job title, company or location..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
          />

        </div>

        {/* FILTER BUTTONS */}

        <div className="mb-6 flex flex-wrap gap-2">

          {filters.map((filter) => (

            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                activeFilter === filter.value
                  ? "bg-emerald-700 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50"
              }`}
            >

              {filter.label}

              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                  activeFilter === filter.value
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {filter.count}
              </span>

            </button>

          ))}

        </div>

        {/* LOADING */}

        {loading && (

          <div className="flex flex-col items-center justify-center py-16">

            <div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />

            <p className="mt-4 text-sm font-medium text-slate-500">
              Loading your applications...
            </p>

          </div>

        )}

        {/* ERROR */}

        {!loading && error && (

          <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center">

            <FiAlertCircle className="mx-auto text-3xl text-red-500" />

            <p className="mt-3 text-sm font-semibold text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchApplications}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-red-700"
            >
              <FiRefreshCw size={14} />
              Try Again
            </button>

          </div>

        )}

        {/* APPLICATIONS */}

        {!loading && !error && filteredApplications.length > 0 && (

          <div className="space-y-4">

            {filteredApplications.map((application) => (

              <ApplicationCard
                key={application._id}
                application={application}
              />

            ))}

          </div>

        )}

        {/* EMPTY STATE */}

        {!loading && !error && filteredApplications.length === 0 && (

          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-14 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
              <FiInbox size={26} />
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-800">
              {applications.length === 0
                ? "No applications yet"
                : "No matching applications"}
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              {applications.length === 0
                ? "When you apply for a job or internship on Educonnect, your applications will appear here."
                : "Try changing your search keyword or selecting another status filter."}
            </p>

            {applications.length > 0 && (

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveFilter("all");
                }}
                className="mt-4 text-xs font-semibold text-emerald-700 hover:text-emerald-900"
              >
                Clear filters
              </button>

            )}

          </div>

        )}

      </div>

    </section>
  );
};

export default MyApplications;
