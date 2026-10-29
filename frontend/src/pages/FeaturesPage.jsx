
import React from "react";
import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiBriefcase,
  FiMessageCircle,
  FiShield,
  FiCheckCircle,
  FiDownload,
  FiSearch,
  FiBookmark,
  FiUsers,
  FiBell,
  FiArrowUpRight,
  FiLock,
  FiSmartphone,
  FiUser,
  FiStar,
  FiFileText,
  FiSend,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";

const features = [
  {
    id: "academic",
    number: "01",
    eyebrow: "LEARN WITHOUT LIMITS",
    title: "Academic repository",
    description:
      "Your academic resources, all in one place. Find the notes, question papers, and study materials you need to learn smarter.",
    points: [
      "Upload and download study resources",
      "Search and filter by subject or semester",
      "Discover materials shared by your community",
      "Save useful resources for later",
    ],
    icon: FiBookOpen,
    color: "indigo",
    preview: "academic",
  },
  {
    id: "career",
    number: "02",
    eyebrow: "YOUR NEXT BIG OPPORTUNITY",
    title: "Internships & jobs",
    description:
      "Take the next step in your career. Discover relevant openings or help students find their next opportunity.",
    points: [
      "Explore jobs and internships",
      "Filter by location, type, and work mode",
      "Apply using a resume and cover letter",
      "Professionals manage their own openings",
    ],
    icon: FiBriefcase,
    color: "teal",
    preview: "career",
  },
  {
    id: "community",
    number: "03",
    eyebrow: "STAY CONNECTED",
    title: "Social & real-time chat",
    description:
      "Learning gets better together. Share your ideas, grow your network, and stay connected with your community.",
    points: [
      "Share posts, images, and comments",
      "Send and manage connection requests",
      "Chat with accepted connections",
      "Get notified about important updates",
    ],
    icon: FiMessageCircle,
    color: "orange",
    preview: "chat",
  },
];

const extras = [
  {
    icon: FiShield,
    title: "Secure by design",
    description: "Email verification and protected accounts.",
    color: "bg-violet-100 text-violet-700",
  },
  {
    icon: FiUsers,
    title: "Community first",
    description: "Build meaningful academic connections.",
    color: "bg-teal-100 text-teal-700",
  },
  {
    icon: FiSmartphone,
    title: "Works everywhere",
    description: "A responsive experience across devices.",
    color: "bg-orange-100 text-orange-700",
  },
  {
    icon: FiUser,
    title: "Your own profile",
    description: "Showcase your skills and experience.",
    color: "bg-pink-100 text-pink-700",
  },
];

const colors = {
  indigo: {
    icon: "bg-indigo-100 text-indigo-700",
    text: "text-indigo-600",
    dot: "bg-indigo-500",
    glow: "bg-indigo-300/40",
    soft: "bg-indigo-50",
    border: "border-indigo-100",
  },
  teal: {
    icon: "bg-teal-100 text-teal-700",
    text: "text-teal-600",
    dot: "bg-teal-500",
    glow: "bg-teal-300/40",
    soft: "bg-teal-50",
    border: "border-teal-100",
  },
  orange: {
    icon: "bg-orange-100 text-orange-700",
    text: "text-orange-600",
    dot: "bg-orange-500",
    glow: "bg-orange-300/40",
    soft: "bg-orange-50",
    border: "border-orange-100",
  },
};

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

function AcademicPreview() {
  const resources = [
    { title: "Algorithms", subtitle: "Computer Science", color: "from-indigo-200 to-cyan-100" },
    { title: "Marketing", subtitle: "Business Studies", color: "from-violet-200 to-teal-100" },
    { title: "Database Systems", subtitle: "Computer Engineering", color: "from-sky-200 to-indigo-100" },
    { title: "Past Questions", subtitle: "Exam preparation", color: "from-amber-100 to-orange-100" },
  ];

  return (
    <div className="rounded-[1.5rem] border border-white bg-white/95 p-4 shadow-2xl shadow-indigo-950/10 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold text-slate-900">Explore resources</p>
          <p className="mt-1 text-[11px] text-slate-400">Knowledge at your fingertips</p>
        </div>
        <span className="rounded-xl bg-indigo-100 p-3 text-indigo-700">
          <FiBookOpen className="text-lg" />
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
        <FiSearch className="shrink-0 text-indigo-500" />
        <span className="text-xs text-slate-400">Search notes, subjects...</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {["All resources", "Notes", "Question papers"].map((item, index) => (
          <span
            key={item}
            className={`rounded-full px-3 py-2 text-[10px] font-bold ${
              index === 0
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {item}
          </span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {resources.map((resource) => (
          <motion.div
            key={resource.title}
            whileHover={{ y: -3 }}
            className="rounded-xl border border-slate-100 p-2.5 transition hover:border-indigo-200"
          >
            <div className={`flex h-20 items-center justify-center rounded-lg bg-gradient-to-br ${resource.color}`}>
              <FiFileText className="text-3xl text-indigo-600/70" />
            </div>
            <p className="mt-3 text-xs font-extrabold text-slate-800">
              {resource.title}
            </p>
            <p className="mt-1 truncate text-[10px] text-slate-400">
              {resource.subtitle}
            </p>
            <div className="mt-3 flex items-center justify-between text-indigo-600">
              <FiBookmark />
              <FiDownload />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl bg-indigo-50 p-3 text-xs font-semibold text-indigo-700">
        <FiStar />
        Learn more. Achieve more.
      </div>
    </div>
  );
}

function CareerPreview() {
  const jobs = [
    {
      title: "Frontend Developer",
      company: "Technology · Remote",
      tag: "Internship",
      initials: "FE",
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      title: "Data Analyst",
      company: "Analytics · Hybrid",
      tag: "Full-time",
      initials: "DA",
      color: "bg-teal-100 text-teal-700",
    },
    {
      title: "UI/UX Designer",
      company: "Creative · Remote",
      tag: "Internship",
      initials: "UX",
      color: "bg-orange-100 text-orange-700",
    },
  ];

  return (
    <div className="rounded-[1.5rem] border border-white bg-white/95 p-4 shadow-2xl shadow-teal-950/10 sm:p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-extrabold text-slate-900">Career board</p>
          <p className="mt-1 text-[11px] text-slate-400">Find your next move</p>
        </div>
        <span className="rounded-xl bg-teal-100 p-3 text-teal-700">
          <FiTrendingUp className="text-lg" />
        </span>
      </div>

      <div className="mt-4 flex gap-2">
        <span className="rounded-full bg-teal-600 px-3 py-2 text-[10px] font-bold text-white">
          All openings
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-2 text-[10px] font-bold text-slate-500">
          Internships
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-2 text-[10px] font-bold text-slate-500">
          Full-time
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {jobs.map((job) => (
          <motion.div
            key={job.title}
            whileHover={{ x: 3 }}
            className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-teal-200"
          >
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold ${job.color}`}>
              {job.initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold text-slate-800">{job.title}</p>
              <p className="mt-1 truncate text-[10px] text-slate-500">{job.company}</p>
              <span className="mt-2 inline-flex rounded-full bg-teal-50 px-2 py-1 text-[9px] font-bold text-teal-700">
                {job.tag}
              </span>
            </div>
            <FiArrowUpRight className="shrink-0 text-lg text-teal-600" />
          </motion.div>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 p-3">
        <p className="text-xs font-bold text-teal-800">
          <FiBriefcase className="mr-2 inline" />
          Your next opportunity awaits.
        </p>
      </div>
    </div>
  );
}

function ChatPreview() {
  return (
    <div className="rounded-[1.5rem] border border-white bg-white/95 p-4 shadow-2xl shadow-orange-950/10 sm:p-5">
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 text-white">
          <FiUsers className="text-xl" />
          <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-teal-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-extrabold text-slate-800">Your community</p>
          <p className="mt-1 text-[11px] text-teal-600">● Connected and ready</p>
        </div>
        <span className="rounded-xl bg-orange-50 p-2.5 text-orange-600">
          <FiBell />
        </span>
      </div>

      <div className="space-y-4 py-5">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="max-w-[82%] rounded-2xl rounded-tl-sm bg-slate-100 p-3.5 text-xs leading-5 text-slate-700"
        >
          Hey! Did you find the DBMS notes for tomorrow?
          <p className="mt-1 text-[9px] text-slate-400">10:24 AM</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="ml-auto max-w-[82%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-indigo-600 to-violet-600 p-3.5 text-xs leading-5 text-white shadow-lg shadow-indigo-500/15"
        >
          Yes! I found them. Thanks for sharing! 😊
          <p className="mt-1 text-right text-[9px] text-indigo-100">10:25 AM ✓✓</p>
        </motion.div>

        <div className="max-w-[82%] rounded-2xl rounded-tl-sm bg-slate-100 p-3.5 text-xs leading-5 text-slate-700">
          That's great! Good luck with your exam.
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-2.5">
        <span className="px-2 text-xs text-slate-400">Write a message...</span>
        <span className="rounded-lg bg-indigo-600 p-2.5 text-white">
          <FiSend />
        </span>
      </div>
    </div>
  );
}

function FeatureSection({ feature, index }) {
  const Icon = feature.icon;
  const theme = colors[feature.color];
  const reverse = index === 1;

  return (
    <section className={`relative overflow-hidden ${reverse ? "bg-slate-50" : "bg-white"}`}>
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <div className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-20 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm ${theme.icon}`}>
              <Icon className="text-2xl" />
            </div>

            <p className={`text-xs font-extrabold tracking-[0.2em] ${theme.text}`}>
              {feature.eyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              {feature.title}
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
              {feature.description}
            </p>

            <ul className="mt-7 space-y-4">
              {feature.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm leading-6 text-slate-600">
                  <FiCheckCircle className={`mt-1 shrink-0 text-base ${theme.text}`} />
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center gap-3">
              <span className={`h-1.5 w-10 rounded-full ${theme.dot}`} />
              <span className="text-xs font-bold tracking-widest text-slate-400">
                FEATURE {feature.number} / 03
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: reverse ? -25 : 25, y: 12 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-xl"
          >
            <div className={`absolute -inset-5 -z-10 rounded-[2.5rem] ${theme.glow} blur-3xl`} />

            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute -right-2 -top-4 z-10 flex items-center gap-2 rounded-full border border-slate-100 bg-white px-4 py-2.5 text-[10px] font-bold text-slate-600 shadow-lg sm:-right-4">
                <span className={`h-2 w-2 rounded-full ${theme.dot}`} />
                Made for your journey
              </div>
              {feature.preview === "academic" && <AcademicPreview />}
              {feature.preview === "career" && <CareerPreview />}
              {feature.preview === "chat" && <ChatPreview />}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const FeaturesPage = ()=> {
  return (
    <main className="overflow-hidden bg-white text-slate-900">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-linear-to-b from-indigo-50 via-white to-white">
        <div className="pointer-events-none absolute -left-32 top-0 -z-10 h-80 w-80 rounded-full bg-violet-200/60 blur-[110px]" />
        <div className="pointer-events-none absolute -right-32 top-12 -z-10 h-80 w-80 rounded-full bg-teal-200/50 blur-[110px]" />

        <div className="mx-auto max-w-7xl px-5 pb-16 pt-20 text-center sm:px-8 sm:pb-20 sm:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/90 px-4 py-2 text-xs font-extrabold tracking-widest text-indigo-700 shadow-sm"
          >
            <FiZap className="text-teal-500" />
            FEATURES THAT MOVE YOU FORWARD
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-7 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
          >
            Built for learning.
            <br />
            <span className="bg-linear-to-r from-indigo-600 via-violet-600 to-teal-500 bg-clip-text text-transparent">
              Designed for careers.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base"
          >
            Powerful tools to study smarter, find opportunities, and build
            connections that last beyond graduation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            {[
              { icon: FiBookOpen, label: "Learn smarter", color: "text-indigo-600" },
              { icon: FiBriefcase, label: "Find opportunities", color: "text-teal-600" },
              { icon: FiUsers, label: "Grow together", color: "text-orange-500" },
            ].map((item) => (
              <span key={item.label} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-sm">
                <item.icon className={`text-base ${item.color}`} />
                {item.label}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main features */}
      {features.map((feature, index) => (
        <FeatureSection key={feature.id} feature={feature} index={index} />
      ))}

      {/* More features */}
      <section className="bg-slate-50 px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto mb-12 max-w-2xl text-center"
          >
            <span className="rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-extrabold tracking-widest text-indigo-700">
              THE DETAILS MATTER
            </span>
            <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
              And there's more to love.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              A thoughtful experience that brings your learning and
              professional life together.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {extras.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.article
                  key={item.title}
                  variants={reveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -7 }}
                  className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-shadow hover:shadow-xl hover:shadow-indigo-950/5 sm:p-7"
                >
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl transition-transform duration-300 group-hover:scale-110 ${item.color}`}>
                    <Icon />
                  </span>
                  <h3 className="mt-5 text-base font-extrabold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                  <div className="mt-5 h-1 w-9 rounded-full bg-linear-to-r from-indigo-500 to-teal-400 transition-all duration-300 group-hover:w-16" />
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-950 via-indigo-700 to-teal-600 px-6 py-16 text-center text-white shadow-2xl shadow-indigo-900/20 sm:px-12 sm:py-24"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10 shadow-[0_0_0_35px_rgba(255,255,255,0.03),0_0_0_70px_rgba(255,255,255,0.02)]" />

          <span className="relative inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-wider text-teal-100">
            <FiLock />
            YOUR NEXT CHAPTER STARTS HERE
          </span>

          <h2 className="relative mx-auto mt-7 max-w-3xl text-3xl font-extrabold leading-tight sm:text-5xl">
            Learn more.
            <br />
            Connect better. Grow faster.
          </h2>

          <p className="relative mx-auto mt-5 max-w-xl text-sm leading-7 text-indigo-100 sm:text-base">
            Join EduConnect and discover a community built around knowledge,
            collaboration, and opportunity.
          </p>

          <a
            href="/register"
            className="relative mt-9 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 text-sm font-extrabold text-indigo-700 shadow-lg transition hover:-translate-y-1 hover:bg-indigo-50"
          >
            Get started today
            <FiArrowUpRight />
          </a>
        </motion.div>
      </section>
    </main>
  );
}

export default FeaturesPage;