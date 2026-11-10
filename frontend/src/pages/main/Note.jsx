import React, {
  useEffect,
  useMemo,
  useState,
  useContext,
  useCallback,
} from "react";

import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import {
  FiBookOpen,
  FiSearch,
  FiUploadCloud,
  FiFileText,
  FiDownload,
  FiEye,
  FiFilter,
  FiPlus,
  FiX,
  FiBook,
  FiClock,
  FiUser,
  FiChevronDown,
  FiFolder,
  FiBookmark,
  FiTrendingUp,
  FiGrid,
  FiList,
  FiFile,
  FiCheckCircle,
  FiRefreshCw,
  FiTrash2,
} from "react-icons/fi";

import {
  uploadNote,
  getAllNotes,
  previewNote,
  downloadNote,
  deleteNote,
} from "../../services/noteServices";

import { AuthContext } from "../../context/authContext";
// ==========================================
// ANIMATION VARIANTS
// ==========================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    y: 25,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 15,
    transition: { duration: 0.2 },
  },
};

// ==========================================
// CATEGORIES
// ==========================================

const categories = [
  { name: "All Materials", icon: FiGrid },
  { name: "Notes", icon: FiBookOpen },
  { name: "Question Paper", icon: FiFileText },
  { name: "Assignment", icon: FiBookmark },
  { name: "Lab Report", icon: FiFile },
  { name: "Other", icon: FiFolder },
];

const fileColors = {
  Notes: "bg-blue-50 text-blue-600",
  "Question Paper": "bg-purple-50 text-purple-600",
  Assignment: "bg-orange-50 text-orange-600",
  "Lab Report": "bg-emerald-50 text-emerald-600",
  Other: "bg-pink-50 text-pink-600",
};

const initialForm = {
  title: "",
  subject: "",
  university: "",
  program: "",
  semester: "",
  noteType: "Notes",
  description: "",
};

// ==========================================
// MAIN NOTE COMPONENT
// ==========================================

const Note = () => {
  // ========================================
  // AUTH CONTEXT
  // ========================================

  const { users, authLoading } = useContext(AuthContext);

  // ========================================
  // MAIN STATES
  // ========================================

  const [materials, setMaterials] = useState([]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  // Search and filters

  const [activeCategory, setActiveCategory] = useState("All Materials");

  const [search, setSearch] = useState("");

  const [showUpload, setShowUpload] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("Latest");

  const [filters, setFilters] = useState({
    university: "",
    program: "",
    semester: "",
  });

  // Upload form

  const [form, setForm] = useState(initialForm);
  const [selectedFile, setSelectedFile] = useState(null);

  // PDF preview

  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // ========================================
  // FETCH ALL NOTES
  // ========================================

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getAllNotes();

      setMaterials(response.data.notes || []);
    } catch (error) {
      console.error("Error fetching notes:", error);

      toast.error(
        error.response?.data?.message || "Failed to fetch study materials",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch only after authentication check

  useEffect(() => {
    if (authLoading) return;

    if (users) {
      fetchNotes();
    } else {
      setMaterials([]);
      setLoading(false);
    }
  }, [authLoading, users, fetchNotes]);

  // ========================================
  // FORM HANDLING
  // ========================================

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ========================================
  // PDF VALIDATION
  // ========================================

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

  // ========================================
  // UPLOAD NOTE
  // ========================================

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

      formData.append("title", form.title.trim());
      formData.append("subject", form.subject.trim());
      formData.append("university", form.university.trim());
      formData.append("program", form.program.trim());
      formData.append("semester", form.semester.trim());
      formData.append("noteType", form.noteType);
      formData.append("description", form.description.trim());

      // Must match pdfUpload.single("pdf")

      formData.append("pdf", selectedFile);

      const response = await uploadNote(formData);

      toast.success(response.data.message || "Note uploaded successfully");

      setForm(initialForm);
      setSelectedFile(null);
      setShowUpload(false);

      // Refresh notes

      await fetchNotes();
    } catch (error) {
      console.error("Upload error:", error);

      toast.error(
        error.response?.data?.message || "Failed to upload study material",
      );
    } finally {
      setUploading(false);
    }
  };

  // ========================================
  // IDENTIFY CURRENT USER UPLOADS
  // ========================================

  const isMyUpload = (material) => {
    if (!users || !material.uploadedby) {
      return false;
    }

    const currentUserId = users._id || users.userId;

    const uploaderId = material.uploadedby._id || material.uploadedby;

    return currentUserId && String(currentUserId) === String(uploaderId);
  };

  // ========================================
  // PREVIEW PDF
  // ========================================

  const handlePreview = async (id) => {
    try {
      setPreviewLoading(true);

      const response = await previewNote(id);

      const pdfBlob = new Blob([response.data], { type: "application/pdf" });

      const pdfUrl = URL.createObjectURL(pdfBlob);

      const material = materials.find((item) => item._id === id);

      setPreview({
        id,
        url: pdfUrl,
        title: material?.title || "Study Material",
      });
    } catch (error) {
      console.error("Preview error:", error);

      toast.error(error.response?.data?.message || "Unable to preview PDF");
    } finally {
      setPreviewLoading(false);
    }
  };

  // ========================================
  // CLOSE PREVIEW
  // ========================================

  const closePreview = () => {
    setPreview((current) => {
      if (current?.url) {
        URL.revokeObjectURL(current.url);
      }

      return null;
    });
  };

  // ========================================
  // DOWNLOAD PDF
  // ========================================

  const handleDownload = async (id, title) => {
    try {
      setDownloadingId(id);

      const response = await downloadNote(id);

      const blob = new Blob([response.data], { type: "application/pdf" });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `${title || "study-material"}.pdf`.replace(
        /[^a-zA-Z0-9._-]/g,
        "_",
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);

      toast.error(error.response?.data?.message || "Failed to download PDF");
    } finally {
      setDownloadingId(null);
    }
  };

  // ========================================
  // DELETE OWN NOTE
  // ========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this study material?",
    );

    if (!confirmed) return;

    try {
      await deleteNote(id);

      setMaterials((prev) => prev.filter((item) => item._id !== id));

      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);

      toast.error(error.response?.data?.message || "Failed to delete note");
    }
  };

  // ========================================
  // SEARCH AND FILTER MATERIALS
  // ========================================

  const filteredMaterials = useMemo(() => {
    let result = materials.filter((item) => {
      const uploader = item.uploadedby?.fullName || "";

      const searchableText = `
        ${item.title}
        ${item.subject}
        ${item.university}
        ${item.program}
        ${item.semester}
        ${item.description || ""}
        ${uploader}
      `.toLowerCase();

      const matchesSearch = searchableText.includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "All Materials" || item.noteType === activeCategory;

      const matchesUniversity =
        !filters.university || item.university === filters.university;

      const matchesProgram =
        !filters.program || item.program === filters.program;

      const matchesSemester =
        !filters.semester || item.semester === filters.semester;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesUniversity &&
        matchesProgram &&
        matchesSemester
      );
    });

    if (sort === "A-Z") {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    } else {
      result = [...result].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    }

    return result;
  }, [materials, search, activeCategory, filters, sort]);

  // ========================================
  // DYNAMIC FILTER OPTIONS
  // ========================================

  const universities = [
    ...new Set(materials.map((item) => item.university).filter(Boolean)),
  ];

  const programs = [
    ...new Set(materials.map((item) => item.program).filter(Boolean)),
  ];

  const semesters = [
    ...new Set(materials.map((item) => item.semester).filter(Boolean)),
  ];

  // ========================================
  // CLEAR FILTERS
  // ========================================

  const clearFilters = () => {
    setSearch("");

    setActiveCategory("All Materials");

    setFilters({
      university: "",
      program: "",
      semester: "",
    });
  };

  // ========================================
  // FORMAT DATE
  // ========================================

  const formatDate = (date) => {
    if (!date) return "Recently uploaded";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ========================================
  // STATISTICS
  // ========================================

  const myUploads = materials.filter(isMyUpload).length;

  const statistics = [
    {
      label: "Total Materials",
      value: materials.length,
      icon: FiBookOpen,
      color: "emerald",
    },
    {
      label: "Study Notes",
      value: materials.filter((m) => m.noteType === "Notes").length,
      icon: FiFileText,
      color: "blue",
    },
    {
      label: "Question Papers",
      value: materials.filter((m) => m.noteType === "Question Paper").length,
      icon: FiBookmark,
      color: "purple",
    },
    {
      label: "My Uploads",
      value: myUploads,
      icon: FiUploadCloud,
      color: "orange",
    },
  ];

  // ========================================
  // PREVIEW CLEANUP
  // ========================================

  useEffect(() => {
    return () => {
      if (preview?.url) {
        URL.revokeObjectURL(preview.url);
      }
    };
  }, [preview?.url]);

  // ========================================
  // KEYBOARD ESCAPE TO CLOSE PREVIEW
  // ========================================

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && preview) {
        closePreview();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [preview]);

  // ========================================
  // AUTHENTICATION LOADING
  // ========================================

  if (authLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />

          <p className="text-sm text-slate-500">Checking your account...</p>
        </div>
      </div>
    );
  }

  // ========================================
  // MAIN UI
  // ========================================

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 px-3 py-5 sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1500px]">
        {/* PAGE HEADER */}

        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
        >
          <div>
            <div className="mb-1 flex items-center gap-3">
              <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
                <FiBookOpen size={23} />
              </div>

              <h1 className="text-2xl font-bold text-slate-900">
                Study Materials
              </h1>
            </div>

            <p className="text-sm text-slate-500">
              Discover, share and access learning resources from your community.
            </p>
          </div>

          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={fetchNotes}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
              Refresh
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowUpload(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
            >
              <FiPlus size={18} />
              Upload Material
            </motion.button>
          </div>
        </motion.div>

        {/* STATISTICS */}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4"
        >
          {statistics.map((stat) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div
                  className={`rounded-xl p-3 ${
                    stat.color === "emerald"
                      ? "bg-emerald-50 text-emerald-600"
                      : stat.color === "blue"
                        ? "bg-blue-50 text-blue-600"
                        : stat.color === "purple"
                          ? "bg-purple-50 text-purple-600"
                          : "bg-orange-50 text-orange-600"
                  }`}
                >
                  <Icon size={21} />
                </div>

                <div>
                  <p className="text-xl font-bold text-slate-900">
                    {stat.value}
                  </p>

                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* MAIN LAYOUT */}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[220px_minmax(0,1fr)]">
          {/* CATEGORIES */}

          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
              Categories
            </h3>

            <div className="space-y-1.5">
              {categories.map((category) => {
                const Icon = category.icon;

                const count =
                  category.name === "All Materials"
                    ? materials.length
                    : materials.filter((m) => m.noteType === category.name)
                        .length;

                return (
                  <motion.button
                    key={category.name}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveCategory(category.name)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm transition ${
                      activeCategory === category.name
                        ? "bg-emerald-50 font-semibold text-emerald-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={17} />
                      {category.name}
                    </span>

                    <span className="text-xs text-slate-400">{count}</span>
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-6 rounded-xl bg-emerald-50 p-4">
              <div className="mb-2 text-emerald-700">
                <FiTrendingUp size={22} />
              </div>

              <h4 className="text-sm font-bold text-slate-800">
                Share Knowledge
              </h4>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Help other students by sharing your study resources.
              </p>

              <button
                onClick={() => setShowUpload(true)}
                className="mt-3 text-xs font-semibold text-emerald-700 hover:underline"
              >
                Upload a resource →
              </button>
            </div>
          </motion.aside>

          {/* MATERIALS SECTION */}

          <section className="min-w-0">
            {/* SEARCH AND FILTERS */}

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col gap-3 lg:flex-row">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by title, subject or contributor..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${
                    showFilters
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 text-slate-600"
                  }`}
                >
                  <FiFilter />
                  Filters
                  <FiChevronDown
                    className={`transition-transform ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                </motion.button>

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none"
                >
                  <option value="Latest">Latest</option>
                  <option value="A-Z">A-Z</option>
                </select>
              </div>

              {/* FILTER PANEL */}

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-3">
                      {[
                        {
                          name: "university",
                          label: "University",
                          options: universities,
                        },
                        {
                          name: "program",
                          label: "Program",
                          options: programs,
                        },
                        {
                          name: "semester",
                          label: "Semester",
                          options: semesters,
                        },
                      ].map((filter) => (
                        <div key={filter.name}>
                          <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                            {filter.label}
                          </label>

                          <select
                            value={filters[filter.name]}
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                [filter.name]: e.target.value,
                              }))
                            }
                            className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-sm outline-none focus:border-emerald-500"
                          >
                            <option value="">All {filter.label}</option>

                            {filter.options.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}

                      <button
                        onClick={() =>
                          setFilters({
                            university: "",
                            program: "",
                            semester: "",
                          })
                        }
                        className="text-left text-xs font-semibold text-red-500 sm:col-span-3"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* MATERIAL HEADING */}

            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {activeCategory === "All Materials"
                    ? "Explore Materials"
                    : activeCategory}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {filteredMaterials.length} resources available
                </p>
              </div>

              <div className="flex rounded-lg border border-slate-200 bg-white p-1">
                <button
                  onClick={() => setView("grid")}
                  className={`rounded-md p-2 transition ${
                    view === "grid"
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-400"
                  }`}
                >
                  <FiGrid size={17} />
                </button>

                <button
                  onClick={() => setView("list")}
                  className={`rounded-md p-2 transition ${
                    view === "list"
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-400"
                  }`}
                >
                  <FiList size={17} />
                </button>
              </div>
            </div>

            {/* LOADING */}

            {loading ? (
              <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
                <div className="text-center">
                  <div className="mx-auto mb-3 h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-700" />

                  <p className="text-sm text-slate-500">
                    Loading study materials...
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* MATERIAL CARDS */}

                <motion.div
                  layout
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className={
                    view === "grid"
                      ? "grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3"
                      : "flex flex-col gap-3"
                  }
                >
                  <AnimatePresence mode="popLayout">
                    {filteredMaterials.map((material) => {
                      const uploader =
                        material.uploadedby?.fullName || "Unknown User";

                      const color =
                        fileColors[material.noteType] || fileColors.Other;

                      return (
                        <motion.div
                          layout
                          key={material._id}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit={{
                            opacity: 0,
                            scale: 0.95,
                            transition: { duration: 0.2 },
                          }}
                          whileHover={{
                            y: -5,
                            transition: { duration: 0.2 },
                          }}
                          className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg ${
                            view === "list" ? "flex flex-col sm:flex-row" : ""
                          }`}
                        >
                          {/* FILE HEADER */}

                          <div
                            className={`flex items-start gap-3 bg-slate-50 p-4 ${
                              view === "list" ? "sm:w-52 sm:items-center" : ""
                            }`}
                          >
                            <div className={`rounded-xl p-4 ${color}`}>
                              <FiFileText size={27} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <span className="rounded-md bg-white px-2 py-1 text-[10px] font-semibold text-slate-500">
                                PDF DOCUMENT
                              </span>

                              <p className="mt-2 text-xs text-slate-400">
                                PDF File
                              </p>
                            </div>
                          </div>

                          {/* CARD CONTENT */}

                          <div className="flex flex-1 flex-col p-4">
                            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                              <span className="w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                                {material.noteType}
                              </span>

                              {isMyUpload(material) && (
                                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-600">
                                  My Upload
                                </span>
                              )}
                            </div>

                            <h3 className="line-clamp-2 text-sm font-bold leading-5 text-slate-800 transition-colors group-hover:text-emerald-700">
                              {material.title}
                            </h3>

                            <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                              {material.description ||
                                "No description provided."}
                            </p>

                            <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
                              <p className="flex items-center gap-2">
                                <FiBook size={14} />
                                <span className="line-clamp-1">
                                  {material.subject}
                                </span>
                              </p>

                              <p className="flex items-center gap-2">
                                <FiFolder size={14} />
                                <span className="line-clamp-1">
                                  {material.program} · {material.semester}
                                </span>
                              </p>

                              <p className="flex items-center gap-2">
                                <FiUser size={14} />
                                {uploader}
                              </p>

                              <p className="flex items-center gap-2">
                                <FiClock size={14} />
                                {formatDate(material.createdAt)}
                              </p>
                            </div>

                            {/* ACTION BUTTONS */}

                            <div className="mt-4 flex gap-2">
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                disabled={previewLoading}
                                onClick={() => handlePreview(material._id)}
                                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-emerald-200 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50"
                              >
                                {previewLoading ? (
                                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent" />
                                ) : (
                                  <FiEye size={14} />
                                )}
                                Preview
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={downloadingId === material._id}
                                onClick={() =>
                                  handleDownload(material._id, material.title)
                                }
                                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-700 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50"
                              >
                                {downloadingId === material._id ? (
                                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : (
                                  <FiDownload size={14} />
                                )}

                                {downloadingId === material._id
                                  ? "Downloading"
                                  : "Download"}
                              </motion.button>

                              {isMyUpload(material) && (
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleDelete(material._id)}
                                  title="Delete your upload"
                                  className="flex items-center justify-center rounded-lg border border-red-200 px-3 text-red-500 transition hover:bg-red-50"
                                >
                                  <FiTrash2 size={15} />
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>

                {/* EMPTY STATE */}

                {filteredMaterials.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-slate-200 bg-white py-16 text-center"
                  >
                    <FiFileText
                      className="mx-auto mb-3 text-slate-300"
                      size={40}
                    />

                    <h3 className="font-semibold text-slate-800">
                      No materials found
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Try changing your search or filters.
                    </p>

                    <button
                      onClick={clearFilters}
                      className="mt-4 text-sm font-semibold text-emerald-700"
                    >
                      Clear filters
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </section>
        </div>
      </div>

      {/* =====================================
          UPLOAD MODAL
      ====================================== */}

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
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:p-5"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            >
              {/* MODAL HEADER */}

              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Upload Study Material
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Share useful learning resources with your community.
                  </p>
                </div>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  disabled={uploading}
                  onClick={() => setShowUpload(false)}
                  className="rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200 disabled:opacity-50"
                >
                  <FiX size={20} />
                </motion.button>
              </div>

              {/* UPLOAD FORM */}

              <form onSubmit={handleUpload} className="space-y-4 p-6">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Material Title *
                  </label>

                  <input
                    required
                    name="title"
                    value={form.title}
                    onChange={handleFormChange}
                    placeholder="Enter material title"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    {
                      name: "subject",
                      label: "Subject *",
                      placeholder: "e.g. Database Management",
                    },
                    {
                      name: "university",
                      label: "University *",
                      placeholder: "Enter university name",
                    },
                    {
                      name: "program",
                      label: "Program *",
                      placeholder: "e.g. BE Computer",
                    },
                    {
                      name: "semester",
                      label: "Semester *",
                      placeholder: "e.g. 4th Semester",
                    },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                        {field.label}
                      </label>

                      <input
                        required
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleFormChange}
                        placeholder={field.placeholder}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Material Type *
                  </label>

                  <select
                    name="noteType"
                    value={form.noteType}
                    onChange={handleFormChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
                  >
                    {[
                      "Notes",
                      "Question Paper",
                      "Assignment",
                      "Lab Report",
                      "Other",
                    ].map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    rows={3}
                    placeholder="Briefly describe this study material..."
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* PDF UPLOAD */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Upload PDF *
                  </label>

                  <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 px-4 py-8 transition hover:border-emerald-400 hover:bg-emerald-50">
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="mb-3 rounded-full bg-white p-3 text-emerald-700 shadow-sm"
                    >
                      <FiUploadCloud size={27} />
                    </motion.div>

                    <p className="text-sm font-semibold text-slate-800">
                      {selectedFile
                        ? selectedFile.name
                        : "Click to upload your PDF"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      PDF files only · Maximum size 10MB
                    </p>

                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  <AnimatePresence>
                    {selectedFile && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          height: 0,
                          y: 10,
                        }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          height: 0,
                        }}
                        className="mt-3 overflow-hidden"
                      >
                        <div className="flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                          <div className="flex min-w-0 items-center gap-2 text-sm text-emerald-800">
                            <FiCheckCircle size={20} />

                            <span className="truncate">
                              {selectedFile.name}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectedFile(null)}
                            className="ml-2 text-red-500"
                          >
                            <FiX size={18} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* FORM BUTTONS */}

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    disabled={uploading}
                    onClick={() => setShowUpload(false)}
                    className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    whileHover={{
                      scale: uploading ? 1 : 1.02,
                    }}
                    whileTap={{ scale: 0.96 }}
                    disabled={uploading}
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {uploading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FiUploadCloud size={17} />
                        Upload Material
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================
          PDF PREVIEW MODAL
      ====================================== */}

      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-2 sm:p-5"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closePreview();
              }
            }}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
              }}
              className="flex h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              {/* PREVIEW HEADER */}

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
                      PDF Document Preview
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => handleDownload(preview.id, preview.title)}
                    className="flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800 sm:px-4"
                  >
                    <FiDownload size={15} />
                    <span className="hidden sm:inline">Download</span>
                  </button>

                  <button
                    onClick={closePreview}
                    className="rounded-lg bg-slate-100 p-2 text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>

              {/* PDF VIEWER */}

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
    </div>
  );
};

export default Note;
