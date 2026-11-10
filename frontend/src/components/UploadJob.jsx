
import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoBagHandleSharp } from "react-icons/io5";
import { MdCreateNewFolder } from "react-icons/md";

import {
  FiX,
  FiBriefcase,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiLayers,
  FiCheckCircle,
  FiUser,
  FiClock,
  FiPlus,
  FiRefreshCw,
  FiArrowUpRight,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

import {
  getOwnjob,
  uploadJob,
  editOwnJob,
  deleteOwnJob,
} from "../services/jobServices";

import toast from "react-hot-toast";

const initialFormData = {
  title: "",
  company: "",
  description: "",
  type: "",
  category: "",
  location: "",
  workMode: "",
  salary: "",
  skills: "",
  experienceLevel: "",
  deadline: "",
  applicationInstructions: "",
};

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 25,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 },
  },
};

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
};

const UploadJob = () => {
  // Modal states
  const [showuploadform, setShowuploadform] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingJobId, setDeletingJobId] = useState(null);

  // Job data
  const [myJob, setMyJob] = useState([]);

  // Form data
  const [formData, setFormData] = useState(initialFormData);

  // Handle form input
  const handleJobForm = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fetch user's own jobs
  const fetchMyJob = useCallback(async () => {
    try {
      setLoading(true);

      const res = await getOwnjob();

      const jobs =
        res.data?.job ??
        res.data?.jobs ??
        res.data?.posts ??
        res.data?.ownJobs ??
        (Array.isArray(res.data) ? res.data : []);

      setMyJob(Array.isArray(jobs) ? jobs : []);
    } catch (error) {
      console.error(
        "Fetch jobs error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch your posted jobs"
      );

      setMyJob([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyJob();
  }, [fetchMyJob]);

  // Open modal for creating a new job
  const openCreateModal = () => {
    setEditingJobId(null);
    setFormData({ ...initialFormData });
    setShowuploadform(true);
  };

  // Open the SAME modal for editing an existing job
  const handleEditJob = (job) => {
    setEditingJobId(job._id);

    setFormData({
      title: job.title || "",
      company: job.company || "",
      description: job.description || "",
      type: job.type || "",
      category: job.category || "",
      location: job.location || "",
      workMode: job.workMode || "",
      salary: job.salary || "",
      skills: Array.isArray(job.skills)
        ? job.skills.join(", ")
        : job.skills || "",
      experienceLevel: job.experienceLevel || "",
      deadline: job.deadline
        ? new Date(job.deadline).toISOString().split("T")[0]
        : "",
      applicationInstructions: job.applicationInstructions || "",
    });

    setShowuploadform(true);
  };

  // Close modal
  const closeModal = () => {
    if (uploading) return;

    setShowuploadform(false);
    setEditingJobId(null);
    setFormData({ ...initialFormData });
  };

  // Submit create OR edit form
  const handleJobFormSubmit = async (e) => {
    e.preventDefault();

    try {
      setUploading(true);

      const jobData = {
        ...formData,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      let response;

      if (editingJobId) {
        // Update existing job
        response = await editOwnJob(editingJobId, jobData);

        toast.success(
          response.data?.message || "Opportunity updated successfully!"
        );
      } else {
        // Create new job
        response = await uploadJob(jobData);

        toast.success(
          response.data?.message || "Opportunity published successfully!"
        );
      }

      // Reset form and close modal
      setFormData({ ...initialFormData });
      setEditingJobId(null);
      setShowuploadform(false);

      // Refresh jobs
      await fetchMyJob();
    } catch (error) {
      console.error(
        "Submit job error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          (editingJobId
            ? "Failed to update opportunity"
            : "Failed to publish opportunity")
      );
    } finally {
      setUploading(false);
    }
  };

  // Delete job with one confirmation
  const handleDeleteJob = async (job) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${job.title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingJobId(job._id);

      const response = await deleteOwnJob(job._id);

      toast.success(
        response.data?.message || "Opportunity deleted successfully!"
      );

      // Immediately remove deleted job from UI
      setMyJob((prev) =>
        prev.filter((item) => item._id !== job._id)
      );
    } catch (error) {
      console.error(
        "Delete job error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete opportunity"
      );
    } finally {
      setDeletingJobId(null);
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "Not specified";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="w-full rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">

      {/* ================= UPLOAD BANNER ================= */}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col justify-between gap-5 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 sm:flex-row sm:items-center"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-white text-emerald-600 shadow-sm">
            <IoBagHandleSharp className="text-3xl" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Post a Job or Internship
            </h2>

            <p className="mt-1 max-w-md text-sm leading-relaxed text-slate-500">
              Share exciting career opportunities with the EduConnect
              community and connect with talented students.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
        >
          <FiPlus className="text-lg" />
          Create Opportunity
        </button>
      </motion.div>

      {/* ================= CREATE / EDIT MODAL ================= */}

      <AnimatePresence>
        {showuploadform && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:p-5"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            >

              {/* Modal Header */}

              <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <MdCreateNewFolder className="text-2xl" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                      {editingJobId
                        ? "Edit Opportunity"
                        : "Create Opportunity"}
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      {editingJobId
                        ? "Update the details of your opportunity."
                        : "Fill in the details to publish your opportunity."}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={uploading}
                  onClick={closeModal}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              {/* Form Content */}

              <div className="overflow-y-auto px-5 py-6 sm:px-6">
                <form
                  id="job-upload-form"
                  onSubmit={handleJobFormSubmit}
                  className="space-y-6"
                >

                  {/* Basic Information */}

                  <div>
                    <div className="mb-4 flex items-center gap-2">
                      <FiBriefcase className="text-lg text-emerald-600" />
                      <h3 className="font-bold text-slate-800">
                        Basic Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                      <div className="sm:col-span-2">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Opportunity Title *
                        </label>

                        <input
                          required
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleJobForm}
                          placeholder="e.g. Frontend Developer Intern"
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Company / Organization *
                        </label>

                        <input
                          required
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleJobForm}
                          placeholder="Enter company name"
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Opportunity Type *
                        </label>

                        <select
                          required
                          name="type"
                          value={formData.type}
                          onChange={handleJobForm}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        >
                          <option value="">Select type</option>
                          <option value="job">Job</option>
                          <option value="internship">Internship</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Category
                        </label>

                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleJobForm}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
                        >
                          <option value="">Select category</option>
                          <option value="Software Development">Software Development</option>
                          <option value="Web Development">Web Development</option>
                          <option value="UI/UX Design">UI/UX Design</option>
                          <option value="Data Science">Data Science</option>
                          <option value="AI / Machine Learning">AI / Machine Learning</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Business">Business</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Work Mode
                        </label>

                        <select
                          name="workMode"
                          value={formData.workMode}
                          onChange={handleJobForm}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
                        >
                          <option value="">Select work mode</option>
                          <option value="Remote">Remote</option>
                          <option value="On-site">On-site</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100" />

                  {/* Description */}

                  <div>
                    <div className="mb-4 flex items-center gap-2">
                      <FiFileText className="text-lg text-emerald-600" />
                      <h3 className="font-bold text-slate-800">
                        Opportunity Description
                      </h3>
                    </div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Job Description *
                    </label>

                    <textarea
                      required
                      rows={5}
                      name="description"
                      value={formData.description}
                      onChange={handleJobForm}
                      placeholder="Describe the role, responsibilities, requirements and what candidates can expect..."
                      className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <div className="border-t border-slate-100" />

                  {/* Location and Requirements */}

                  <div>
                    <div className="mb-4 flex items-center gap-2">
                      <FiMapPin className="text-lg text-emerald-600" />
                      <h3 className="font-bold text-slate-800">
                        Location & Requirements
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Location *
                        </label>

                        <input
                          required
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleJobForm}
                          placeholder="e.g. Kathmandu, Nepal"
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Experience Level
                        </label>

                        <select
                          name="experienceLevel"
                          value={formData.experienceLevel}
                          onChange={handleJobForm}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
                        >
                          <option value="">Select experience</option>
                          <option value="Entry-Level">Entry-Level</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Experienced">Experienced</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Salary / Stipend
                        </label>

                        <div className="relative">
                          <FiDollarSign className="absolute left-4 top-3.5 text-slate-400" />

                          <input
                            type="text"
                            name="salary"
                            value={formData.salary}
                            onChange={handleJobForm}
                            placeholder="NPR 15,000/month"
                            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Application Deadline *
                        </label>

                        <div className="relative">
                          <FiCalendar className="absolute left-4 top-3.5 text-slate-400" />

                          <input
                            required
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleJobForm}
                            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100" />

                  {/* Skills and Application */}

                  <div>
                    <div className="mb-4 flex items-center gap-2">
                      <FiLayers className="text-lg text-emerald-600" />
                      <h3 className="font-bold text-slate-800">
                        Skills & Application
                      </h3>
                    </div>

                    <div className="space-y-4">

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Required Skills
                        </label>

                        <input
                          type="text"
                          name="skills"
                          value={formData.skills}
                          onChange={handleJobForm}
                          placeholder="React, Node.js, MongoDB, JavaScript"
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                        />

                        <p className="mt-2 text-xs text-slate-400">
                          Separate multiple skills with commas.
                        </p>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Application Instructions
                        </label>

                        <textarea
                          rows={3}
                          name="applicationInstructions"
                          value={formData.applicationInstructions}
                          onChange={handleJobForm}
                          placeholder="Explain how candidates should apply and which documents are required..."
                          className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Modal Footer */}

              <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                <p className="text-xs text-slate-500">
                  <span className="text-red-500">*</span> Required fields
                </p>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={closeModal}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    form="job-upload-form"
                    type="submit"
                    disabled={uploading}
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {uploading ? (
                      <>
                        <FiRefreshCw className="animate-spin" />
                        {editingJobId ? "Updating..." : "Publishing..."}
                      </>
                    ) : (
                      <>
                        <FiCheckCircle />
                        {editingJobId
                          ? "Update Opportunity"
                          : "Publish Opportunity"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= MY JOB SECTION ================= */}

      <div className="mt-8">

        {/* Header */}

        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              My Job Uploads
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage your posted jobs and internships.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!loading && (
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                {myJob.length} Opportunities
              </span>
            )}

            <button
              type="button"
              onClick={fetchMyJob}
              disabled={loading}
              title="Refresh jobs"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-50"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Loading State */}

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-100 p-5"
              >
                <div className="h-5 w-1/2 rounded bg-slate-200" />
                <div className="mt-4 h-4 w-1/3 rounded bg-slate-100" />
                <div className="mt-5 h-4 w-full rounded bg-slate-100" />
                <div className="mt-3 h-4 w-2/3 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : myJob.length === 0 ? (

          /* Empty State */

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-12 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <IoBagHandleSharp className="text-3xl" />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-800">
              No opportunities posted yet
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
              You haven't uploaded any jobs or internships. Start sharing
              opportunities with the EduConnect community.
            </p>

            <button
              type="button"
              onClick={openCreateModal}
              className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <FiPlus />
              Post Your First Opportunity
            </button>
          </motion.div>

        ) : (

          /* Job Cards */

          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {myJob.map((job) => {
              const skills = Array.isArray(job.skills)
                ? job.skills
                : typeof job.skills === "string"
                  ? job.skills.split(",").map((s) => s.trim()).filter(Boolean)
                  : [];

              const isDeleting = deletingJobId === job._id;

              return (
                <motion.div
                  key={job._id}
                  variants={cardVariants}
                  layout
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:border-emerald-200 hover:shadow-md sm:p-6"
                >

                  {/* Title and Actions */}

                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold text-slate-800 transition group-hover:text-emerald-700">
                          {job.title}
                        </h3>

                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700">
                          {job.type}
                        </span>

                        {job.status && (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            {job.status}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                        <span className="flex items-center gap-2">
                          <FiBriefcase className="text-emerald-600" />
                          {job.company}
                        </span>

                        <span className="flex items-center gap-2">
                          <FiMapPin className="text-emerald-600" />
                          {job.location || "Location not specified"}
                        </span>

                        {job.workMode && (
                          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                            {job.workMode}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Edit and Delete Buttons */}

                    <div className="flex shrink-0 items-center gap-2">

                      <button
                        type="button"
                        onClick={() => handleEditJob(job)}
                        disabled={isDeleting}
                        className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
                      >
                        <FiEdit2 />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteJob(job)}
                        disabled={isDeleting || deletingJobId !== null}
                        className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isDeleting ? (
                          <FiRefreshCw className="animate-spin" />
                        ) : (
                          <FiTrash2 />
                        )}
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>

                    </div>
                  </div>

                  {/* Description */}

                  <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-600">
                    {job.description}
                  </p>

                  {/* Job Information */}

                  <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-4">

                    <div className="flex items-center gap-3">
                      <FiCalendar className="shrink-0 text-emerald-600" />
                      <div>
                        <p className="text-xs text-slate-400">Deadline</p>
                        <p className="mt-0.5 text-sm font-semibold text-slate-700">
                          {formatDate(job.deadline)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FiUser className="shrink-0 text-emerald-600" />
                      <div>
                        <p className="text-xs text-slate-400">Experience</p>
                        <p className="mt-0.5 text-sm font-semibold text-slate-700">
                          {job.experienceLevel || "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FiDollarSign className="shrink-0 text-emerald-600" />
                      <div>
                        <p className="text-xs text-slate-400">Salary</p>
                        <p className="mt-0.5 text-sm font-semibold text-slate-700">
                          {job.salary || "Negotiable"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FiClock className="shrink-0 text-emerald-600" />
                      <div>
                        <p className="text-xs text-slate-400">Category</p>
                        <p className="mt-0.5 text-sm font-semibold text-slate-700">
                          {job.category || "General"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}

                  {skills.length > 0 && (
                    <div className="mt-5">
                      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                        Required Skills
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                          <span
                            key={`${job._id}-${index}`}
                            className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Application Instructions */}

                  {job.applicationInstructions && (
                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                        Application Instructions
                      </p>

                      <p className="text-sm leading-relaxed text-slate-600">
                        {job.applicationInstructions}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-end border-t border-slate-100 pt-3">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                      <FiArrowUpRight />
                      Your post
                    </span>
                  </div>

                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default UploadJob;
