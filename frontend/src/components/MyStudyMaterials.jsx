
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  FiBookOpen,
  FiSearch,
  FiUploadCloud,
  FiFileText,
  FiDownload,
  FiEye,
  FiPlus,
  FiX,
  FiBook,
  FiClock,
  FiUser,
  FiFolder,
  FiRefreshCw,
  FiTrash2,
  FiCheckCircle,
  FiGrid,
  FiList,
  FiBookmark,
  FiFile,
} from "react-icons/fi";

import {
  uploadNote,
  getAllNotes,
  previewNote,
  downloadNote,
  deleteNote,
} from "../services/noteServices";

const categories = [
  "All Materials",
  "Notes",
  "Question Paper",
  "Assignment",
  "Lab Report",
  "Other",
];

const initialForm = {
  title: "",
  subject: "",
  university: "",
  program: "",
  semester: "",
  noteType: "Notes",
  description: "",
};

const fileColors = {
  Notes: "bg-blue-50 text-blue-600",
  "Question Paper": "bg-purple-50 text-purple-600",
  Assignment: "bg-orange-50 text-orange-600",
  "Lab Report": "bg-emerald-50 text-emerald-600",
  Other: "bg-pink-50 text-pink-600",
};

const MyStudyMaterials = ({ user }) => {
  const [materials, setMaterials] = useState([]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Materials");
  const [view, setView] = useState("grid");

  const [showUpload, setShowUpload] = useState(false);

  const [form, setForm] = useState(initialForm);
  const [selectedFile, setSelectedFile] = useState(null);

  const [preview, setPreview] = useState(null);

  // ==========================================
  // GET CURRENT USER ID
  // ==========================================

  const currentUserId = user?._id || user?.userId;

  // ==========================================
  // CHECK WHETHER MATERIAL BELONGS TO USER
  // ==========================================

  const isMyUpload = useCallback(
    (material) => {
      const uploader = material.uploadedby;

      const uploaderId =
        typeof uploader === "object"
          ? uploader?._id || uploader?.userId
          : uploader;

      return (
        currentUserId &&
        uploaderId &&
        String(currentUserId) === String(uploaderId)
      );
    },
    [currentUserId]
  );

  // ==========================================
  // FETCH MY MATERIALS
  // ==========================================

  const fetchMaterials = useCallback(async () => {
    if (!currentUserId) {
      setMaterials([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await getAllNotes();

      const allNotes = response.data.notes || [];

      const ownNotes = allNotes.filter((note) => {
        const uploader = note.uploadedby;

        const uploaderId =
          typeof uploader === "object"
            ? uploader?._id || uploader?.userId
            : uploader;

        return String(uploaderId) === String(currentUserId);
      });

      setMaterials(ownNotes);
    } catch (error) {
      console.error("Fetch materials error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch your study materials"
      );
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  // ==========================================
  // FORM HANDLING
  // ==========================================

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // PDF VALIDATION
  // ==========================================

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Maximum PDF size is 10MB");
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  // ==========================================
  // UPLOAD MATERIAL
  // ==========================================

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please select a PDF file");
      return;
    }

    if (
      !form.title.trim() ||
      !form.subject.trim() ||
      !form.university.trim() ||
      !form.program.trim() ||
      !form.semester.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      formData.append("pdf", selectedFile);

      const response = await uploadNote(formData);

      toast.success(
        response.data.message || "Material uploaded successfully"
      );

      setForm(initialForm);
      setSelectedFile(null);
      setShowUpload(false);

      await fetchMaterials();
    } catch (error) {
      console.error("Upload material error:", error);

      toast.error(
        error.response?.data?.message || "Failed to upload material"
      );
    } finally {
      setUploading(false);
    }
  };

  // ==========================================
  // PREVIEW PDF
  // ==========================================

  const handlePreview = async (material) => {
    try {
      setPreviewLoading(true);

      const response = await previewNote(material._id);

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);

      setPreview((previous) => {
        if (previous?.url) {
          URL.revokeObjectURL(previous.url);
        }

        return {
          id: material._id,
          title: material.title,
          url,
        };
      });
    } catch (error) {
      console.error("Preview error:", error);

      toast.error(
        error.response?.data?.message || "Unable to preview PDF"
      );
    } finally {
      setPreviewLoading(false);
    }
  };

  // ==========================================
  // CLOSE PREVIEW
  // ==========================================

  const closePreview = () => {
    setPreview((previous) => {
      if (previous?.url) {
        URL.revokeObjectURL(previous.url);
      }

      return null;
    });
  };

  // ==========================================
  // DOWNLOAD PDF
  // ==========================================

  const handleDownload = async (id, title) => {
    try {
      setDownloadingId(id);

      const response = await downloadNote(id);

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `${title || "study-material"}.pdf`.replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      );

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);

      toast.error(
        error.response?.data?.message || "Failed to download PDF"
      );
    } finally {
      setDownloadingId(null);
    }
  };

  // ==========================================
  // DELETE MATERIAL
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this study material? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      await deleteNote(id);

      setMaterials((previous) =>
        previous.filter((material) => material._id !== id)
      );

      toast.success("Study material deleted successfully");
    } catch (error) {
      console.error("Delete material error:", error);

      toast.error(
        error.response?.data?.message || "Failed to delete material"
      );
    }
  };

  // ==========================================
  // SEARCH AND FILTER
  // ==========================================

  const filteredMaterials = useMemo(() => {
    let result = materials.filter((material) => {
      const searchableText = `
        ${material.title || ""}
        ${material.subject || ""}
        ${material.university || ""}
        ${material.program || ""}
        ${material.semester || ""}
        ${material.description || ""}
      `.toLowerCase();

      const matchesSearch = searchableText.includes(
        search.toLowerCase()
      );

      const matchesCategory =
        activeCategory === "All Materials" ||
        material.noteType === activeCategory;

      return matchesSearch && matchesCategory;
    });

    result.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return result;
  }, [materials, search, activeCategory]);

  // ==========================================
  // STATISTICS
  // ==========================================

  const statistics = [
    {
      label: "Total Uploads",
      value: materials.length,
      icon: FiBookOpen,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Study Notes",
      value: materials.filter((m) => m.noteType === "Notes").length,
      icon: FiFileText,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Question Papers",
      value: materials.filter(
        (m) => m.noteType === "Question Paper"
      ).length,
      icon: FiBookmark,
      color: "bg-purple-50 text-purple-700",
    },
    {
      label: "Other Materials",
      value: materials.filter(
        (m) => !["Notes", "Question Paper"].includes(m.noteType)
      ).length,
      icon: FiFolder,
      color: "bg-orange-50 text-orange-700",
    },
  ];

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "Recently uploaded";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ==========================================
  // PREVIEW CLEANUP
  // ==========================================

  useEffect(() => {
    return () => {
      if (preview?.url) {
        URL.revokeObjectURL(preview.url);
      }
    };
  }, [preview?.url]);

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <section className="space-y-5">

      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
              <FiBookOpen size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                My Study Materials
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Manage and share your uploaded learning resources.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchMaterials}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-xs font-semibold text-white transition hover:bg-emerald-800"
          >
            <FiPlus size={16} />
            Upload Material
          </button>
        </div>
      </div>

      {/* STATISTICS */}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statistics.map((stat) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.label}
              whileHover={{ y: -3 }}
              className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-lg p-3 ${stat.color}`}>
                  <Icon size={20} />
                </div>
              </div>

              <h3 className="mt-4 text-2xl font-bold text-slate-900">
                {stat.value}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                {stat.label}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* CATEGORY FILTERS */}

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-800">
            Your Resources
          </h3>

          <span className="text-xs text-slate-500">
            {filteredMaterials.length} materials found
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                activeCategory === category
                  ? "bg-emerald-700 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* SEARCH AND VIEW */}

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your uploaded materials..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500"
          />
        </div>

        <div className="flex w-fit rounded-xl border border-slate-200 bg-white p-1">
          <button
            onClick={() => setView("grid")}
            className={`rounded-lg p-2 ${
              view === "grid"
                ? "bg-emerald-50 text-emerald-700"
                : "text-slate-400"
            }`}
          >
            <FiGrid size={18} />
          </button>

          <button
            onClick={() => setView("list")}
            className={`rounded-lg p-2 ${
              view === "list"
                ? "bg-emerald-50 text-emerald-700"
                : "text-slate-400"
            }`}
          >
            <FiList size={18} />
          </button>
        </div>
      </div>

      {/* MATERIALS */}

      {loading ? (
        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-100 bg-white">
          <div className="text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />

            <p className="mt-3 text-sm text-slate-500">
              Loading your materials...
            </p>
          </div>
        </div>
      ) : filteredMaterials.length > 0 ? (
        <motion.div
          layout
          className={
            view === "grid"
              ? "grid grid-cols-1 gap-4 md:grid-cols-2"
              : "flex flex-col gap-3"
          }
        >
          <AnimatePresence mode="popLayout">
            {filteredMaterials.map((material) => {
              const color =
                fileColors[material.noteType] || fileColors.Other;

              return (
                <motion.div
                  layout
                  key={material._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -3 }}
                  className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md ${
                    view === "list"
                      ? "flex flex-col sm:flex-row"
                      : ""
                  }`}
                >
                  {/* FILE HEADER */}

                  <div
                    className={`flex items-center gap-3 bg-slate-50 p-4 ${
                      view === "list"
                        ? "sm:w-52 sm:shrink-0"
                        : ""
                    }`}
                  >
                    <div className={`rounded-xl p-4 ${color}`}>
                      <FiFileText size={26} />
                    </div>

                    <div>
                      <span className="rounded-md bg-white px-2 py-1 text-[10px] font-bold text-slate-500">
                        PDF DOCUMENT
                      </span>

                      <p className="mt-2 text-xs text-slate-400">
                        {material.noteType}
                      </p>
                    </div>
                  </div>

                  {/* CONTENT */}

                  <div className="flex min-w-0 flex-1 flex-col p-4">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-semibold text-emerald-700">
                        My Upload
                      </span>

                      <span className="text-[11px] text-slate-400">
                        {formatDate(material.createdAt)}
                      </span>
                    </div>

                    <h3 className="line-clamp-2 text-sm font-bold text-slate-800 transition group-hover:text-emerald-700">
                      {material.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                      {material.description ||
                        "No description provided."}
                    </p>

                    <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
                      <p className="flex items-center gap-2">
                        <FiBook size={14} />
                        {material.subject}
                      </p>

                      <p className="flex items-center gap-2">
                        <FiFolder size={14} />
                        {material.program} · {material.semester}
                      </p>

                      <p className="flex items-center gap-2">
                        <FiUser size={14} />
                        {user?.fullName || "You"}
                      </p>

                      <p className="flex items-center gap-2">
                        <FiClock size={14} />
                        {formatDate(material.createdAt)}
                      </p>
                    </div>

                    {/* ACTIONS */}

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handlePreview(material)}
                        disabled={previewLoading}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-emerald-200 py-2.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50"
                      >
                        <FiEye size={14} />
                        Preview
                      </button>

                      <button
                        onClick={() =>
                          handleDownload(
                            material._id,
                            material.title
                          )
                        }
                        disabled={downloadingId === material._id}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-700 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50"
                      >
                        <FiDownload size={14} />

                        {downloadingId === material._id
                          ? "Downloading..."
                          : "Download"}
                      </button>

                      {isMyUpload(material) && (
                        <button
                          onClick={() => handleDelete(material._id)}
                          title="Delete material"
                          className="flex items-center justify-center rounded-lg border border-red-200 px-3 text-red-500 transition hover:bg-red-50"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <FiBookOpen size={30} />
          </div>

          <h3 className="text-base font-bold text-slate-800">
            No study materials found
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-500">
            You haven't uploaded any materials in this category yet.
            Upload your first PDF and share your knowledge.
          </p>

          <button
            onClick={() => {
              setActiveCategory("All Materials");
              setSearch("");
            }}
            className="mt-4 text-xs font-semibold text-emerald-700 hover:underline"
          >
            Clear search and filters
          </button>

          {materials.length === 0 && (
            <div>
              <button
                onClick={() => setShowUpload(true)}
                className="mt-4 flex items-center gap-2 mx-auto rounded-lg bg-emerald-700 px-5 py-3 text-xs font-semibold text-white hover:bg-emerald-800"
              >
                <FiPlus />
                Upload Your First Material
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          UPLOAD MODAL
      ========================================== */}

      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget && !uploading) {
                setShowUpload(false);
              }
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Upload Study Material
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Share your learning resources.
                  </p>
                </div>

                <button
                  disabled={uploading}
                  onClick={() => setShowUpload(false)}
                  className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
                >
                  <FiX size={19} />
                </button>
              </div>

              <form onSubmit={handleUpload} className="space-y-4 p-5">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Material Title *
                  </label>

                  <input
                    required
                    name="title"
                    value={form.title}
                    onChange={handleFormChange}
                    placeholder="Enter material title"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    ["subject", "Subject", "e.g. Database Management"],
                    ["university", "University", "University name"],
                    ["program", "Program", "e.g. BE Computer"],
                    ["semester", "Semester", "e.g. 4th Semester"],
                  ].map(([name, label, placeholder]) => (
                    <div key={name}>
                      <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                        {label} *
                      </label>

                      <input
                        required
                        name={name}
                        value={form[name]}
                        onChange={handleFormChange}
                        placeholder={placeholder}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Material Type
                  </label>

                  <select
                    name="noteType"
                    value={form.noteType}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  >
                    {categories.slice(1).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    rows={3}
                    placeholder="Describe your study material..."
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-700">
                    PDF File *
                  </label>

                  <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 px-4 py-7 transition hover:bg-emerald-50">
                    <FiUploadCloud
                      size={30}
                      className="mb-3 text-emerald-700"
                    />

                    <p className="text-sm font-semibold text-slate-800">
                      {selectedFile
                        ? selectedFile.name
                        : "Click to select PDF"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      PDF only · Maximum 10MB
                    </p>

                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  {selectedFile && (
                    <div className="mt-3 flex items-center justify-between rounded-lg bg-emerald-50 p-3">
                      <div className="flex min-w-0 items-center gap-2 text-xs text-emerald-800">
                        <FiCheckCircle size={17} />

                        <span className="truncate">
                          {selectedFile.name}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="ml-2 text-red-500"
                      >
                        <FiX />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => setShowUpload(false)}
                    className="rounded-xl border border-slate-200 px-5 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
                  >
                    {uploading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FiUploadCloud size={16} />
                        Upload Material
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          PDF PREVIEW MODAL
      ========================================== */}

      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closePreview();
              }
            }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-2 sm:p-5"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                    <FiFileText size={20} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-slate-800">
                      {preview.title}
                    </h3>

                    <p className="text-xs text-slate-400">
                      PDF Preview
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() =>
                      handleDownload(preview.id, preview.title)
                    }
                    className="flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
                  >
                    <FiDownload size={15} />
                    Download
                  </button>

                  <button
                    onClick={closePreview}
                    className="rounded-lg bg-slate-100 p-2 text-slate-600 hover:bg-red-50 hover:text-red-600"
                  >
                    <FiX size={19} />
                  </button>
                </div>
              </div>

              <div className="min-h-0 flex-1 bg-slate-200">
                <iframe
                  src={preview.url}
                  title={preview.title}
                  className="h-full w-full border-0"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MyStudyMaterials;
