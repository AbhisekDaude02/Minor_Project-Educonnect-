
import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { motion, AnimatePresence } from "framer-motion";

import {
  FiBriefcase,
  FiMapPin,
  FiClock,
  FiSearch,
  FiBookmark,
  FiDollarSign,
  FiCalendar,
  FiArrowUpRight,
  FiX,
  FiMonitor,
  FiCheckCircle,
  FiUsers,
  FiSend,
  FiUploadCloud,
  FiFileText,
  FiAlertCircle,
  FiFilter,
} from "react-icons/fi";

import { AuthContext } from "../../context/authContext";
import { getAllJob } from "../../services/jobServices";


// ==============================
// Helper Functions
// ==============================

const formatType = (type) => {
  return type?.toLowerCase() === "internship"
    ? "Internship"
    : "Full-time Job";
};

const formatDate = (date) => {
  if (!date) return "Not specified";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getDaysLeft = (deadline) => {
  if (!deadline) return null;

  const today = new Date();
  const endDate = new Date(deadline);

  today.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  return Math.ceil(
    (endDate - today) / (1000 * 60 * 60 * 24)
  );
};


// ==============================
// Main Job Component
// ==============================

const Job = ({ userRole = "student" }) => {
  const isProfessional = userRole === "professional";

  // Jobs from AuthContext
  const { jobs = [], setJobs } = useContext(AuthContext);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [workMode, setWorkMode] = useState("all");
  const [type, setType] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  // Modals
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Local UI state
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);

  const [applicationForm, setApplicationForm] = useState({
    coverLetter: "",
    resume: null,
  });

  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ==============================
  // Fetch Jobs From Backend
  // ==============================

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getAllJob();

        const data = res?.data;

        const jobData = Array.isArray(data)
          ? data
          : Array.isArray(data?.jobs)
            ? data.jobs
            : Array.isArray(data?.data)
              ? data.data
              : [];

        setJobs(jobData);

      } catch (error) {
        console.error(
          "Error fetching jobs:",
          error.response?.data?.message || error.message
        );
      }
    };

    fetchJobs();
  }, [setJobs]);


  // ==============================
  // Dynamic Categories
  // ==============================

  const categories = useMemo(() => {
    return [
      "All Categories",
      ...new Set(
        jobs.map((job) => job.category).filter(Boolean)
      ),
    ];
  }, [jobs]);


  // ==============================
  // Search and Filtering
  // ==============================

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchText = search.toLowerCase();

      const skills = Array.isArray(job.skills)
        ? job.skills
        : [];

      const matchesSearch =
        (job.title || "").toLowerCase().includes(searchText) ||
        (job.company || "").toLowerCase().includes(searchText) ||
        (job.location || "").toLowerCase().includes(searchText) ||
        skills.some((skill) =>
          String(skill).toLowerCase().includes(searchText)
        );

      const matchesCategory =
        category === "All Categories" ||
        job.category === category;

      const matchesType =
        type === "all" ||
        job.type?.toLowerCase() === type;

      const matchesWorkMode =
        workMode === "all" ||
        job.workMode?.toLowerCase() === workMode;

      const matchesTab =
        activeTab === "all" ||
        (activeTab === "job" &&
          job.type?.toLowerCase() === "job") ||
        (activeTab === "internship" &&
          job.type?.toLowerCase() === "internship") ||
        (activeTab === "saved" &&
          bookmarkedJobs.includes(job._id));

      return (
        matchesSearch &&
        matchesCategory &&
        matchesType &&
        matchesWorkMode &&
        matchesTab
      );
    });
  }, [
    jobs,
    search,
    category,
    type,
    workMode,
    activeTab,
    bookmarkedJobs,
  ]);


  // ==============================
  // Bookmark Function
  // ==============================

  const toggleBookmark = (jobId) => {
    setBookmarkedJobs((previous) =>
      previous.includes(jobId)
        ? previous.filter((id) => id !== jobId)
        : [...previous, jobId]
    );
  };


  // ==============================
  // Apply Modal
  // ==============================

  const openApplyModal = (job) => {
    setSelectedJob(job);

    setApplicationForm({
      coverLetter: "",
      resume: null,
    });

    setFormError("");
    setShowApplyModal(true);
  };


  const updateApplicationForm = (event) => {
    const { name, value } = event.target;

    setApplicationForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // UI-only application submission.
  // Connect your applyJob API here when ready.

  const handleApplicationSubmit = (event) => {
    event.preventDefault();

    setFormError("");

    if (!applicationForm.coverLetter.trim()) {
      setFormError("Please enter your cover letter.");
      return;
    }

    if (!applicationForm.resume) {
      setFormError("Please upload your resume.");
      return;
    }

    if (applicationForm.resume.type !== "application/pdf") {
      setFormError("Please upload your resume in PDF format.");
      return;
    }

    if (applicationForm.resume.size > 10 * 1024 * 1024) {
      setFormError("Resume must be smaller than 10 MB.");
      return;
    }

    setAppliedJobs((previous) => [
      ...previous,
      selectedJob._id,
    ]);

    setShowApplyModal(false);
    setSuccessMessage("Your application has been submitted.");

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };


  // ==============================
  // Close Modals
  // ==============================

  const closeModal = () => {
    setSelectedJob(null);
    setShowApplyModal(false);
    setFormError("");
  };


  // ==============================
  // Render
  // ==============================

  return (
    <div className="min-h-screen bg-[#f7faf9] px-4 py-6 sm:px-6 lg:px-10">

      <div className="mx-auto max-w-7xl">

        {/* Page Header */}

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Jobs & Internships
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Discover opportunities and take the next step in your career.
          </p>
        </div>


        {/* Search and Filters */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex flex-col gap-3 lg:flex-row">

            <div className="relative flex-1">

              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs, companies, skills or locations..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-50"
              />

            </div>


            <div className="flex flex-col gap-3 sm:flex-row">

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>


              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
              >
                <option value="all">All Work Modes</option>
                <option value="remote">Remote</option>
                <option value="onsite">On-site</option>
                <option value="hybrid">Hybrid</option>
              </select>

            </div>

          </div>

        </div>


        {/* Tabs */}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">

          <div className="flex flex-wrap gap-2">

            {[
              { id: "all", label: "All Opportunities" },
              { id: "job", label: "Full-time Jobs" },
              { id: "internship", label: "Internships" },
              ...(!isProfessional
                ? [{ id: "saved", label: "Saved Jobs" }]
                : []),
            ].map((tab) => (

              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-700"
                }`}
              >
                {tab.label}
              </button>

            ))}

          </div>


          <div className="flex items-center gap-2 text-sm text-slate-500">
            <FiFilter />
            {filteredJobs.length} opportunities found
          </div>

        </div>


        {/* ==============================
            Job Cards
        ============================== */}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

          <AnimatePresence mode="popLayout">

            {filteredJobs.map((job) => {

              const skills = Array.isArray(job.skills)
                ? job.skills
                : [];

              const isSaved = bookmarkedJobs.includes(job._id);
              const isApplied = appliedJobs.includes(job._id);

              const daysLeft = getDaysLeft(job.deadline);

              return (

                <motion.div
                  key={job._id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md sm:p-6"
                >

                  {/* Company Information */}

                  <div className="mb-5 flex items-start justify-between gap-3">

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xl font-bold text-emerald-700">
                        {job.company?.charAt(0)?.toUpperCase() || "C"}
                      </div>

                      <div className="min-w-0">

                        <h3 className="truncate font-bold text-slate-900">
                          {job.company || "Company"}
                        </h3>

                        <p className="text-xs text-slate-500">
                          Posted {formatDate(job.createdAt)}
                        </p>

                      </div>

                    </div>


                    <div className="flex shrink-0 items-center gap-2">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          job.status?.toLowerCase() === "open"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {job.status || "Unknown"}
                      </span>


                      {!isProfessional && (
                        <button
                          onClick={() => toggleBookmark(job._id)}
                          title="Save job"
                          className={`rounded-lg p-2 transition ${
                            isSaved
                              ? "bg-emerald-50 text-emerald-700"
                              : "text-slate-400 hover:bg-slate-100 hover:text-emerald-700"
                          }`}
                        >
                          <FiBookmark
                            fill={isSaved ? "currentColor" : "none"}
                          />
                        </button>
                      )}

                    </div>

                  </div>


                  {/* Job Title */}

                  <h2 className="mb-3 text-xl font-bold text-slate-900">
                    {job.title}
                  </h2>


                  {/* Description */}

                  <p className="mb-5 line-clamp-2 text-sm leading-6 text-slate-500">
                    {job.description}
                  </p>


                  {/* Job Information */}

                  <div className="mb-5 flex flex-wrap gap-x-5 gap-y-3 text-xs text-slate-500">

                    <span className="flex items-center gap-1.5">
                      <FiMapPin className="text-emerald-600" />
                      {job.location || "Not specified"}
                    </span>

                    <span className="flex items-center gap-1.5 capitalize">
                      <FiMonitor className="text-emerald-600" />
                      {job.workMode || "Not specified"}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <FiBriefcase className="text-emerald-600" />
                      {formatType(job.type)}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <FiClock className="text-emerald-600" />
                      {job.experienceLevel || "Not specified"}
                    </span>

                  </div>


                  {/* Skills */}

                  <div className="mb-5 flex flex-wrap gap-2">

                    {skills.slice(0, 4).map((skill, index) => (

                      <span
                        key={`${skill}-${index}`}
                        className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600"
                      >
                        {skill}
                      </span>

                    ))}

                    {skills.length > 4 && (

                      <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs text-slate-500">
                        +{skills.length - 4} more
                      </span>

                    )}

                  </div>


                  {/* Salary and Deadline */}

                  <div className="mb-5 flex flex-col justify-between gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">

                    <div>

                      <p className="mb-1 text-xs text-slate-400">
                        Salary / Stipend
                      </p>

                      <p className="flex items-center gap-1 text-sm font-bold text-slate-800">
                        <FiDollarSign className="text-emerald-600" />
                        {job.salary || "Not specified"}
                      </p>

                    </div>


                    <div>

                      <p className="mb-1 text-xs text-slate-400">
                        Application Deadline
                      </p>

                      <p className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                        <FiCalendar className="text-emerald-600" />
                        {formatDate(job.deadline)}
                      </p>

                      {daysLeft !== null && (
                        <p className={`mt-1 text-xs font-medium ${
                          daysLeft < 0
                            ? "text-red-500"
                            : daysLeft <= 3
                              ? "text-orange-500"
                              : "text-emerald-600"
                        }`}>
                          {daysLeft < 0
                            ? "Application closed"
                            : daysLeft === 0
                              ? "Last day to apply"
                              : `${daysLeft} days remaining`}
                        </p>
                      )}

                    </div>

                  </div>


                  {/* Details and Apply Buttons */}

                  <div className="flex gap-3">

                    <button
                      onClick={() => setSelectedJob(job)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                    >
                      Details
                      <FiArrowUpRight />
                    </button>


                    {!isProfessional && (

                      <button
                        disabled={
                          isApplied ||
                          job.status?.toLowerCase() !== "open" ||
                          (daysLeft !== null && daysLeft < 0)
                        }
                        onClick={() => openApplyModal(job)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        {isApplied ? (
                          <>
                            <FiCheckCircle />
                            Applied
                          </>
                        ) : (
                          <>
                            Apply Now
                            <FiArrowUpRight />
                          </>
                        )}
                      </button>

                    )}

                  </div>

                </motion.div>

              );

            })}

          </AnimatePresence>

        </div>


        {/* Empty State */}

        {filteredJobs.length === 0 && (

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <FiSearch size={24} />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              No opportunities found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filter settings.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All Categories");
                setType("all");
                setWorkMode("all");
                setActiveTab("all");
              }}
              className="mt-5 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Clear Filters
            </button>

          </div>

        )}

      </div>


      {/* ==============================
          Success Message
      ============================== */}

      <AnimatePresence>

        {successMessage && (

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-5 right-5 z-[200] flex items-center gap-3 rounded-xl bg-slate-900 px-5 py-4 text-sm font-medium text-white shadow-xl"
          >

            <FiCheckCircle className="text-emerald-400" />

            {successMessage}

            <button
              onClick={() => setSuccessMessage("")}
              className="ml-2 text-slate-400 hover:text-white"
            >
              <FiX />
            </button>

          </motion.div>

        )}

      </AnimatePresence>


      {/* ==============================
          JOB DETAILS MODAL
      ============================== */}

      <Modal
        open={!!selectedJob && !showApplyModal}
        onClose={closeModal}
      >

        {selectedJob && (

          <div>

            {/* Modal Header */}

            <div className="mb-6 flex items-start justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 text-2xl font-bold text-emerald-700">
                  {selectedJob.company?.charAt(0)?.toUpperCase() || "C"}
                </div>

                <div>

                  <h3 className="font-bold text-slate-900">
                    {selectedJob.company}
                  </h3>

                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <FiMapPin />
                    {selectedJob.location || "Location not specified"}
                  </p>

                </div>

              </div>


              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800"
              >
                <FiX size={22} />
              </button>

            </div>


            {/* Title */}

            <h2 className="mb-4 text-2xl font-bold text-slate-900">
              {selectedJob.title}
            </h2>


            {/* Tags */}

            <div className="mb-6 flex flex-wrap gap-2">

              <Tag>{formatType(selectedJob.type)}</Tag>

              <Tag>{selectedJob.workMode}</Tag>

              <Tag>{selectedJob.experienceLevel}</Tag>

              <Tag>{selectedJob.category}</Tag>

            </div>


            {/* Job Information */}

            <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2">

              <InfoItem
                icon={<FiMapPin />}
                label="Location"
                value={selectedJob.location || "Not specified"}
              />

              <InfoItem
                icon={<FiDollarSign />}
                label="Salary / Stipend"
                value={selectedJob.salary || "Not specified"}
              />

              <InfoItem
                icon={<FiCalendar />}
                label="Application Deadline"
                value={formatDate(selectedJob.deadline)}
              />

              <InfoItem
                icon={<FiClock />}
                label="Remaining Days"
                value={
                  getDaysLeft(selectedJob.deadline) === null
                    ? "Not specified"
                    : getDaysLeft(selectedJob.deadline) < 0
                      ? "Expired"
                      : `${getDaysLeft(selectedJob.deadline)} days left`
                }
              />

              <InfoItem
                icon={<FiBriefcase />}
                label="Opportunity Type"
                value={formatType(selectedJob.type)}
              />

              <InfoItem
                icon={<FiUsers />}
                label="Experience Level"
                value={selectedJob.experienceLevel || "Not specified"}
              />

            </div>


            {/* Description */}

            <Section title="Job Description">

              <p className="text-sm leading-7 text-slate-600">
                {selectedJob.description || "No description provided."}
              </p>

            </Section>


            {/* Skills */}

            <Section title="Required Skills">

              <div className="flex flex-wrap gap-2">

                {(Array.isArray(selectedJob.skills)
                  ? selectedJob.skills
                  : []
                ).map((skill, index) => (

                  <Tag key={`${skill}-${index}`}>
                    {skill}
                  </Tag>

                ))}

              </div>

            </Section>


            {/* Application Instructions */}

            <Section title="Application Instructions">

              <p className="text-sm leading-7 text-slate-600">
                {selectedJob.applicationInstructions ||
                  "Please submit your updated resume and cover letter."}
              </p>

            </Section>


            {/* Status */}

            <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-50 p-4">

              <span className="text-sm font-semibold text-slate-600">
                Opportunity Status
              </span>

              <span className={`flex items-center gap-2 text-sm font-bold ${
                selectedJob.status?.toLowerCase() === "open"
                  ? "text-emerald-600"
                  : "text-red-600"
              }`}>

                <FiCheckCircle />

                {selectedJob.status || "Unknown"}

              </span>

            </div>


            {/* Details Modal Buttons */}

            <div className="mt-6 flex gap-3">

              <button
                onClick={closeModal}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>


              {!isProfessional && (

                <button
                  disabled={
                    appliedJobs.includes(selectedJob._id) ||
                    selectedJob.status?.toLowerCase() !== "open" ||
                    (getDaysLeft(selectedJob.deadline) !== null &&
                      getDaysLeft(selectedJob.deadline) < 0)
                  }
                  onClick={() => openApplyModal(selectedJob)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >

                  <FiSend />

                  {appliedJobs.includes(selectedJob._id)
                    ? "Already Applied"
                    : "Apply for this Opportunity"}

                </button>

              )}

            </div>

          </div>

        )}

      </Modal>


      {/* ==============================
          APPLY MODAL
      ============================== */}

      <Modal
        open={showApplyModal}
        onClose={closeModal}
      >

        <div>

          {/* Apply Header */}

          <div className="mb-6 flex items-start justify-between">

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Apply for Opportunity
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Complete your application for{" "}
                <span className="font-semibold text-emerald-700">
                  {selectedJob?.title}
                </span>
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {selectedJob?.company}
              </p>

            </div>


            <button
              onClick={closeModal}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
            >
              <FiX size={22} />
            </button>

          </div>


          {/* Application Form */}

          <form
            onSubmit={handleApplicationSubmit}
            className="space-y-5"
          >

            {/* Cover Letter */}

            <FormField label="Cover Letter *">

              <textarea
                name="coverLetter"
                value={applicationForm.coverLetter}
                onChange={updateApplicationForm}
                rows="6"
                placeholder="Introduce yourself and explain why you are suitable for this opportunity..."
                className="form-input w-full resize-none"
              />

            </FormField>


            {/* Resume Upload */}

            <FormField label="Upload Resume (PDF) *">

              <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center transition hover:border-emerald-400 hover:bg-emerald-50/50">

                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <FiUploadCloud size={25} />
                </div>

                <span className="text-sm font-semibold text-slate-700">
                  {applicationForm.resume
                    ? applicationForm.resume.name
                    : "Click to upload your resume"}
                </span>

                <span className="mt-2 text-xs text-slate-400">
                  PDF only · Maximum 10 MB
                </span>

                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  onChange={(event) =>
                    setApplicationForm((previous) => ({
                      ...previous,
                      resume: event.target.files?.[0] || null,
                    }))
                  }
                />

              </label>

            </FormField>


            {/* Error */}

            {formError && (
              <ErrorMessage message={formError} />
            )}


            {/* Submit */}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 font-semibold text-white transition hover:bg-emerald-700"
            >
              <FiSend />
              Submit Application
            </button>


            <p className="text-center text-xs text-slate-400">
              Make sure your resume and application details are correct before submitting.
            </p>

          </form>

        </div>

      </Modal>

    </div>
  );
};


// ==============================
// Reusable Components
// ==============================

const Modal = ({ open, onClose, children }) => (

  <AnimatePresence>

    {open && (

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
      >

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-8"
        >

          {children}

        </motion.div>

      </motion.div>

    )}

  </AnimatePresence>

);


const Tag = ({ children }) => (

  <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold capitalize text-emerald-700">
    {children || "Not specified"}
  </span>

);


const InfoItem = ({ icon, label, value }) => (

  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">

    <div className="mb-2 flex items-center gap-2 text-emerald-600">

      {icon}

      <span className="text-xs font-medium text-slate-500">
        {label}
      </span>

    </div>

    <p className="break-words text-sm font-semibold text-slate-800">
      {value || "Not specified"}
    </p>

  </div>

);


const Section = ({ title, children }) => (

  <div className="mb-6">

    <h3 className="mb-3 font-bold text-slate-900">
      {title}
    </h3>

    {children}

  </div>

);


const FormField = ({ label, children }) => (

  <div>

    <label className="mb-2 block text-sm font-semibold text-slate-700">
      {label}
    </label>

    {children}

  </div>

);


const ErrorMessage = ({ message }) => (

  <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
    <FiAlertCircle />
    {message}
  </div>

);


export default Job;
