
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "react-icons/fi";

// Sample materials
const sampleMaterials = [
  {
    id: 1,
    title: "Database Management System Complete Notes",
    subject: "Database Management System",
    university: "Far Western University",
    program: "BE Computer",
    semester: "6th Semester",
    noteType: "Notes",
    description:
      "Complete DBMS notes covering normalization, SQL, transactions and database architecture.",
    uploader: "Sujan Bhandari",
    date: "2 hours ago",
    size: "2.4 MB",
    color: "blue",
  },
  {
    id: 2,
    title: "Data Structures and Algorithms",
    subject: "Data Structures",
    university: "Tribhuvan University",
    program: "BSc CSIT",
    semester: "3rd Semester",
    noteType: "Notes",
    description:
      "Detailed explanations of trees, graphs, sorting and searching algorithms.",
    uploader: "Anjali Sharma",
    date: "5 hours ago",
    size: "3.1 MB",
    color: "purple",
  },
  {
    id: 3,
    title: "Computer Networks Question Paper 2025",
    subject: "Computer Networks",
    university: "Far Western University",
    program: "BE Computer",
    semester: "5th Semester",
    noteType: "Question Paper",
    description:
      "Previous year examination questions for computer engineering students.",
    uploader: "Rohan Thapa",
    date: "1 day ago",
    size: "1.2 MB",
    color: "orange",
  },
  {
    id: 4,
    title: "Operating System Lab Report",
    subject: "Operating System",
    university: "Pokhara University",
    program: "BE Computer",
    semester: "4th Semester",
    noteType: "Lab Report",
    description:
      "Practical implementations and experiments of operating systems.",
    uploader: "Dipesh Chaudhary",
    date: "2 days ago",
    size: "1.8 MB",
    color: "emerald",
  },
  {
    id: 5,
    title: "Software Engineering Assignment",
    subject: "Software Engineering",
    university: "Far Western University",
    program: "BE Computer",
    semester: "6th Semester",
    noteType: "Assignment",
    description:
      "Software development lifecycle, UML diagrams and project management.",
    uploader: "Sita Bhandari",
    date: "3 days ago",
    size: "980 KB",
    color: "pink",
  },
  {
    id: 6,
    title: "Artificial Intelligence Fundamentals",
    subject: "Artificial Intelligence",
    university: "Tribhuvan University",
    program: "BSc CSIT",
    semester: "7th Semester",
    noteType: "Notes",
    description:
      "Introduction to machine learning, search algorithms and knowledge representation.",
    uploader: "Kiran Adhikari",
    date: "4 days ago",
    size: "2.8 MB",
    color: "indigo",
  },
];

const categories = [
  { name: "All Materials", icon: FiGrid },
  { name: "Notes", icon: FiBookOpen },
  { name: "Question Paper", icon: FiFileText },
  { name: "Assignment", icon: FiBookmark },
  { name: "Lab Report", icon: FiFile },
  { name: "Other", icon: FiFolder },
];

const fileColors = {
  blue: "bg-blue-50 text-blue-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
  emerald: "bg-emerald-50 text-emerald-600",
  pink: "bg-pink-50 text-pink-600",
  indigo: "bg-indigo-50 text-indigo-600",
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
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
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 15,
    transition: { duration: 0.2 },
  },
};

const StudyMaterials = () => {
  const [materials, setMaterials] = useState(sampleMaterials);

  const [activeCategory, setActiveCategory] = useState("All Materials");
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("Latest");
  const [selectedFile, setSelectedFile] = useState(null);

  const [filters, setFilters] = useState({
    university: "",
    program: "",
    semester: "",
  });

  const [form, setForm] = useState({
    title: "",
    subject: "",
    university: "",
    program: "",
    semester: "",
    noteType: "Notes",
    description: "",
  });

  // Filter materials
  const filteredMaterials = useMemo(() => {
    let result = materials.filter((item) => {
      const text =
        `${item.title} ${item.subject} ${item.uploader} ${item.description}`.toLowerCase();

      return (
        text.includes(search.toLowerCase()) &&
        (activeCategory === "All Materials" ||
          item.noteType === activeCategory) &&
        (!filters.university ||
          item.university === filters.university) &&
        (!filters.program ||
          item.program === filters.program) &&
        (!filters.semester ||
          item.semester === filters.semester)
      );
    });

    if (sort === "A-Z") {
      result = [...result].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    return result;
  }, [materials, search, activeCategory, filters, sort]);

  // Form handling
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // PDF validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please select a PDF file.");
      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Maximum file size is 10MB.");
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  // Upload material (frontend demonstration)
  const handleUpload = (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select a PDF file.");
      return;
    }

    const newMaterial = {
      ...form,
      id: Date.now(),
      uploader: "You",
      date: "Just now",
      size: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
      color: "emerald",
    };

    setMaterials((prev) => [newMaterial, ...prev]);

    setShowUpload(false);

    setForm({
      title: "",
      subject: "",
      university: "",
      program: "",
      semester: "",
      noteType: "Notes",
      description: "",
    });

    setSelectedFile(null);
  };

  const clearFilters = () => {
    setSearch("");
    setActiveCategory("All Materials");
    setFilters({
      university: "",
      program: "",
      semester: "",
    });
  };

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

          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowUpload(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
          >
            <FiPlus size={18} />
            Upload Material
          </motion.button>
        </motion.div>

        {/* STATISTICS */}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4"
        >
          {[
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
              value: materials.filter(
                (m) => m.noteType === "Question Paper"
              ).length,
              icon: FiBookmark,
              color: "purple",
            },
            {
              label: "My Uploads",
              value: materials.filter((m) => m.uploader === "You").length,
              icon: FiUploadCloud,
              color: "orange",
            },
          ].map((stat) => {
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
                  <p className="text-xs text-slate-500">
                    {stat.label}
                  </p>
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
                    : materials.filter(
                        (m) => m.noteType === category.name
                      ).length;

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

                    <span className="text-xs text-slate-400">
                      {count}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-6 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
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
                  <option>Latest</option>
                  <option>A-Z</option>
                </select>
              </div>

              {/* ANIMATED FILTER PANEL */}

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
                          options: [
                            "Far Western University",
                            "Tribhuvan University",
                            "Pokhara University",
                          ],
                        },
                        {
                          name: "program",
                          label: "Program",
                          options: ["BE Computer", "BSc CSIT"],
                        },
                        {
                          name: "semester",
                          label: "Semester",
                          options: [
                            "3rd Semester",
                            "4th Semester",
                            "5th Semester",
                            "6th Semester",
                            "7th Semester",
                          ],
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
                            <option value="">
                              All {filter.label}
                            </option>

                            {filter.options.map((option) => (
                              <option key={option}>{option}</option>
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
                {filteredMaterials.map((material) => (
                  <motion.div
                    layout
                    key={material.id}
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
                      view === "list"
                        ? "flex flex-col sm:flex-row"
                        : ""
                    }`}
                  >
                    {/* FILE HEADER */}

                    <div
                      className={`flex items-start gap-3 bg-slate-50 p-4 ${
                        view === "list"
                          ? "sm:w-52 sm:items-center"
                          : ""
                      }`}
                    >
                      <div
                        className={`rounded-xl p-4 ${
                          fileColors[material.color] || fileColors.emerald
                        }`}
                      >
                        <FiFileText size={27} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <span className="rounded-md bg-white px-2 py-1 text-[10px] font-semibold text-slate-500">
                          PDF DOCUMENT
                        </span>

                        <p className="mt-2 text-xs text-slate-400">
                          {material.size}
                        </p>
                      </div>
                    </div>

                    {/* CARD CONTENT */}

                    <div className="flex flex-1 flex-col p-4">

                      <span className="mb-2 w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                        {material.noteType}
                      </span>

                      <h3 className="line-clamp-2 text-sm font-bold leading-5 text-slate-800 transition-colors group-hover:text-emerald-700">
                        {material.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                        {material.description}
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
                          {material.uploader}
                        </p>

                        <p className="flex items-center gap-2">
                          <FiClock size={14} />
                          {material.date}
                        </p>
                      </div>

                      {/* ACTION BUTTONS */}

                      <div className="mt-4 flex gap-2">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            alert("Connect your PDF preview functionality here.")
                          }
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-emerald-200 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
                        >
                          <FiEye size={14} />
                          Preview
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            alert("Connect your PDF download functionality here.")
                          }
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-700 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800"
                        >
                          <FiDownload size={14} />
                          Download
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* EMPTY STATE */}

            <AnimatePresence>
              {filteredMaterials.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
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
            </AnimatePresence>
          </section>
        </div>
      </div>

      {/* UPLOAD MODAL */}

      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
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
                  onClick={() => setShowUpload(false)}
                  className="rounded-full bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200"
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
                      placeholder: "e.g. 6th Semester",
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
                      <option key={type}>{type}</option>
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
                        initial={{ opacity: 0, height: 0, y: 10 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
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
                    onClick={() => setShowUpload(false)}
                    className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                  >
                    <FiUploadCloud size={17} />
                    Upload Material
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudyMaterials;
