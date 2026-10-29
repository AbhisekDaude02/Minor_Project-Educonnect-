
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUserPlus,
  FiBookOpen,
  FiBriefcase,
  FiUsers,
  FiMessageCircle,
  FiDownload,
  FiSearch,
  FiFileText,
  FiCheckCircle,
  FiArrowRight,
  FiArrowUpRight,
  FiUploadCloud,
  FiBell,
  FiShield,
  FiZap,
  FiGlobe,
  FiSend,
  FiCalendar,
  FiEye,
  FiUserCheck,
} from "react-icons/fi";

const studentSteps = [
  {
    number: "01",
    title: "Create your account",
    description:
      "Join EduConnect as a student. Complete your profile with your name, university, and academic details.",
    tips: ["Register with your email", "Verify your account", "Build your profile"],
    icon: FiUserPlus,
    color: "violet",
  },
  {
    number: "02",
    title: "Discover study resources",
    description:
      "Find notes, past question papers, assignments, and other academic materials shared by the community.",
    tips: ["Filter by subject and semester", "Preview available resources", "Download useful PDFs"],
    icon: FiBookOpen,
    color: "blue",
  },
  {
    number: "03",
    title: "Find jobs and internships",
    description:
      "Explore opportunities posted by professionals and organizations. Apply for positions that match your skills.",
    tips: ["Search and filter openings", "Read requirements and deadlines", "Submit your resume"],
    icon: FiBriefcase,
    color: "teal",
  },
  {
    number: "04",
    title: "Connect with your community",
    description:
      "Send connection requests, share posts, exchange ideas, and learn from students and professionals.",
    tips: ["Create and interact with posts", "Send connection requests", "Grow your network"],
    icon: FiUsers,
    color: "pink",
  },
  {
    number: "05",
    title: "Chat and grow",
    description:
      "Communicate with your connections, ask questions, exchange knowledge, and build meaningful relationships.",
    tips: ["Message your connections", "Ask for guidance", "Discover new opportunities"],
    icon: FiMessageCircle,
    color: "orange",
  },
];

const professionalSteps = [
  {
    number: "01",
    title: "Create your professional account",
    description:
      "Register as a professional and complete your profile so students can understand your experience and expertise.",
    tips: ["Choose Professional at registration", "Verify your email", "Complete your profile"],
    icon: FiUserPlus,
    color: "violet",
  },
  {
    number: "02",
    title: "Share knowledge and resources",
    description:
      "Contribute useful educational resources to help students learn and prepare for their careers.",
    tips: ["Upload relevant materials", "Add clear descriptions", "Help learners find resources"],
    icon: FiUploadCloud,
    color: "blue",
  },
  {
    number: "03",
    title: "Post jobs and internships",
    description:
      "Publish opportunities with the role, company, job type, location, required skills, salary, and application deadline.",
    tips: ["Choose job or internship", "Add requirements and deadline", "Publish your opening"],
    icon: FiBriefcase,
    color: "teal",
  },
  {
    number: "04",
    title: "Review and manage applicants",
    description:
      "Manage your own openings, review student applications, view resumes, and identify suitable candidates.",
    tips: ["View applicants for your listings", "Review resumes and cover letters", "Update or close openings"],
    icon: FiUserCheck,
    color: "pink",
  },
  {
    number: "05",
    title: "Connect with future talent",
    description:
      "Build your professional network, communicate with students, and help emerging talent discover opportunities.",
    tips: ["Connect with students", "Share industry knowledge", "Support career development"],
    icon: FiMessageCircle,
    color: "orange",
  },
];

const colorStyles = {
  violet: {
    icon: "bg-violet-100 text-violet-700",
    number: "bg-violet-100 text-violet-700",
    light: "bg-violet-50",
    text: "text-violet-700",
    dot: "bg-violet-500",
  },
  blue: {
    icon: "bg-blue-100 text-blue-700",
    number: "bg-blue-100 text-blue-700",
    light: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  teal: {
    icon: "bg-teal-100 text-teal-700",
    number: "bg-teal-100 text-teal-700",
    light: "bg-teal-50",
    text: "text-teal-700",
    dot: "bg-teal-500",
  },
  pink: {
    icon: "bg-pink-100 text-pink-700",
    number: "bg-pink-100 text-pink-700",
    light: "bg-pink-50",
    text: "text-pink-700",
    dot: "bg-pink-500",
  },
  orange: {
    icon: "bg-orange-100 text-orange-700",
    number: "bg-orange-100 text-orange-700",
    light: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-500",
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Small UI previews make the guide easier to understand.
function StepPreview({ step, role }) {
  const [studentStep] = useState(step.number);
  const isStudent = role === "student";

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/50 sm:p-5">
      <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
            E
          </span>
          <span className="text-xs font-bold text-slate-800">
            EduConnect
          </span>
        </div>
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-red-300" />
          <span className="h-2 w-2 rounded-full bg-yellow-300" />
          <span className="h-2 w-2 rounded-full bg-green-300" />
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <p className="text-[10px] font-medium text-slate-400">
            {isStudent ? "STUDENT DASHBOARD" : "PROFESSIONAL DASHBOARD"}
          </p>
          <p className="mt-1 text-sm font-bold text-slate-800">
            {step.title}
          </p>
        </div>
        <span className={`rounded-lg p-2 ${colorStyles[step.color].icon}`}>
          <step.icon className="text-lg" />
        </span>
      </div>

      {studentStep === "01" && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-700">
              <FiUserPlus />
            </div>
            <div className="flex-1">
              <div className="h-2 w-24 rounded bg-slate-300" />
              <div className="mt-2 h-2 w-32 max-w-full rounded bg-slate-200" />
            </div>
            <FiCheckCircle className="text-teal-500" />
          </div>
          <div className="space-y-2">
            <div className="h-9 rounded-lg border border-slate-200 bg-white" />
            <div className="h-9 rounded-lg border border-slate-200 bg-white" />
          </div>
          <div className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-xs font-bold text-white">
            <FiCheckCircle />
            Account setup
          </div>
        </div>
      )}

      {studentStep === "02" && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
              <FiSearch />
              Search resources...
            </div>
            <span className="rounded-lg bg-indigo-600 px-3 py-2 text-xs text-white">
              <FiSearch />
            </span>
          </div>
          {["DBMS Notes.pdf", "Past Questions.pdf", "Lab Report.pdf"].map(
            (file, i) => (
              <div
                key={file}
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
              >
                <span className="rounded-lg bg-red-50 p-2 text-red-500">
                  <FiFileText />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-slate-700">
                    {file}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    Academic resource
                  </p>
                </div>
                <FiDownload className="text-indigo-600" />
              </div>
            )
          )}
        </div>
      )}

      {studentStep === "03" && isStudent && (
        <div className="space-y-3">
          {[
            ["Frontend Intern", "Technology", "Apply now"],
            ["Junior Developer", "Software", "View role"],
          ].map(([title, company, action]) => (
            <div
              key={title}
              className="rounded-xl border border-slate-100 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-slate-800">{title}</p>
                  <p className="mt-1 text-[10px] text-slate-500">{company}</p>
                </div>
                <span className="rounded-md bg-teal-50 px-2 py-1 text-[9px] font-bold text-teal-700">
                  OPEN
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  <FiCalendar className="mr-1 inline" />
                  Check deadline
                </span>
                <span className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-[10px] font-bold text-white">
                  {action}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {studentStep === "03" && !isStudent && (
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-100 p-3">
            <p className="text-xs font-bold text-slate-800">
              New opportunity
            </p>
            <div className="mt-3 space-y-2">
              <div className="h-8 rounded-lg border border-slate-200 px-3 py-2 text-[10px] text-slate-400">
                Job or Internship title
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-8 rounded-lg border border-slate-200 px-2 py-2 text-[10px] text-slate-400">
                  Work mode
                </div>
                <div className="h-8 rounded-lg border border-slate-200 px-2 py-2 text-[10px] text-slate-400">
                  Deadline
                </div>
              </div>
            </div>
            <div className="mt-3 rounded-lg bg-indigo-600 py-2 text-center text-[10px] font-bold text-white">
              <FiBriefcase className="mr-1 inline" />
              Publish opening
            </div>
          </div>
        </div>
      )}

      {studentStep === "04" && isStudent && (
        <div className="space-y-3">
          {["Alex Morgan", "Sam Wilson"].map((name, i) => (
            <div
              key={name}
              className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white ${
                  i === 0 ? "bg-violet-500" : "bg-teal-500"
                }`}
              >
                {name.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800">{name}</p>
                <p className="mt-1 text-[10px] text-slate-500">
                  Suggested connection
                </p>
              </div>
              <span className="rounded-lg bg-indigo-600 px-2.5 py-2 text-[10px] font-bold text-white">
                Connect
              </span>
            </div>
          ))}
        </div>
      )}

      {studentStep === "04" && !isStudent && (
        <div className="space-y-3">
          {["Taylor Reed", "Jordan Lee"].map((name, i) => (
            <div
              key={name}
              className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">
                {name.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800">{name}</p>
                <p className="mt-1 text-[10px] text-slate-500">
                  Applicant · Resume available
                </p>
              </div>
              <FiEye className="text-indigo-600" />
            </div>
          ))}
        </div>
      )}

      {studentStep === "05" && (
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
              <FiMessageCircle />
            </span>
            <div>
              <p className="text-xs font-bold text-slate-800">
                {isStudent ? "Your connections" : "Professional network"}
              </p>
              <p className="text-[10px] text-slate-400">Available to chat</p>
            </div>
            <span className="ml-auto h-2 w-2 rounded-full bg-teal-500" />
          </div>
          <div className="ml-auto max-w-[85%] rounded-xl rounded-br-sm bg-indigo-600 p-3 text-[10px] leading-5 text-white">
            {isStudent
              ? "Hello! Could you help me understand this topic?"
              : "Hello! Feel free to ask about the opportunity."}
          </div>
          <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] text-slate-400">
            Type a message...
            <FiSend className="text-indigo-600" />
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-[10px] text-slate-400">
          STEP {step.number} OF 05
        </span>
        <span className="flex items-center gap-1 text-[10px] font-bold text-teal-600">
          <FiCheckCircle />
          Quick guide
        </span>
      </div>
    </div>
  );
}

function StepCard({ step, index, role }) {
  const Icon = step.icon;
  const colors = colorStyles[step.color];

  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={fadeUp}
      transition={{ delay: index * 0.06 }}
      className="grid items-center gap-7 border-b border-slate-200 py-9 last:border-b-0 md:grid-cols-[1fr_0.95fr] md:gap-12 md:py-12"
    >
      <div className="flex gap-4 sm:gap-6">
        <div className="flex shrink-0 flex-col items-center gap-3">
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-extrabold ${colors.number}`}
          >
            {step.number}
          </span>
          {index !== 4 && (
            <span className="hidden h-full min-h-8 w-px bg-slate-200 sm:block" />
          )}
        </div>

        <div className="min-w-0 flex-1 pt-1">
          <span
            className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${colors.text}`}
          >
            <Icon className="text-base" />
            Step {index + 1}
          </span>

          <h3 className="mt-3 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            {step.title}
          </h3>

          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            {step.description}
          </p>

          <ul className="mt-5 space-y-3">
            {step.tips.map((tip) => (
              <li
                key={tip}
                className="flex items-start gap-2.5 text-sm text-slate-600"
              >
                <FiCheckCircle
                  className={`mt-0.5 shrink-0 ${colors.text}`}
                />
                <span>{tip}</span>
              </li>
            ))}
          </ul>

          {index === 2 && role === "professional" && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-teal-100 bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-800">
              <FiShield />
              You manage your own job listings
            </div>
          )}
        </div>
      </div>

      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="min-w-0"
      >
        <StepPreview step={step} role={role} />
      </motion.div>
    </motion.article>
  );
}

const  HowWorks = ()=> {
  const [role, setRole] = useState("student");
  const steps = role === "student" ? studentSteps : professionalSteps;

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-900">
      {/* HERO */}
      <section className="relative isolate bg-gradient-to-b from-indigo-50 via-white to-white">
        <div className="pointer-events-none absolute -left-32 top-0 -z-10 h-80 w-80 rounded-full bg-violet-200/50 blur-[100px]" />
        <div className="pointer-events-none absolute -right-24 top-16 -z-10 h-80 w-80 rounded-full bg-teal-200/40 blur-[100px]" />

        <div className="mx-auto max-w-7xl px-5 pb-12 pt-16 text-center sm:px-8 sm:pb-16 sm:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-xs font-extrabold tracking-wider text-indigo-700 shadow-sm"
          >
            <FiZap className="text-teal-500" />
            YOUR EDUCONNECT GUIDE
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
          >
            Your next opportunity
            <br className="hidden sm:block" /> starts with{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-teal-500 bg-clip-text text-transparent">
              one connection.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base"
          >
            Learn how to use EduConnect to share knowledge, discover
            opportunities, connect with people, and take the next step in
            your academic or professional journey.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mt-8 inline-flex w-full max-w-md rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-200/50"
          >
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition-all duration-300 ${
                role === "student"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <FiBookOpen />
              For Students
            </button>

            <button
              type="button"
              onClick={() => setRole("professional")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition-all duration-300 ${
                role === "professional"
                  ? "bg-teal-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <FiBriefcase />
              For Professionals
            </button>
          </motion.div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5">
              <FiCheckCircle className="text-teal-500" />
              Easy to get started
            </span>
            <span className="flex items-center gap-1.5">
              <FiShield className="text-indigo-500" />
              Role-based features
            </span>
            <span className="flex items-center gap-1.5">
              <FiGlobe className="text-violet-500" />
              One learning community
            </span>
          </div>
        </div>
      </section>

      {/* ROLE INTRODUCTION */}
      <section className="mx-auto max-w-7xl px-5 pb-4 sm:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className={`flex flex-col gap-4 rounded-3xl border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7 ${
              role === "student"
                ? "border-indigo-100 bg-indigo-50/70"
                : "border-teal-100 bg-teal-50/70"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${
                  role === "student"
                    ? "bg-indigo-600 text-white"
                    : "bg-teal-600 text-white"
                }`}
              >
                {role === "student" ? <FiBookOpen /> : <FiBriefcase />}
              </div>

              <div>
                <h2 className="text-lg font-extrabold sm:text-xl">
                  {role === "student"
                    ? "Your student journey"
                    : "Your professional journey"}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  {role === "student"
                    ? "Access educational resources, apply for jobs and internships, build connections, and communicate with your community."
                    : "Share resources, publish jobs and internships, manage your listings, review applicants, and connect with emerging talent."}
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <span
                className={`inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold shadow-sm ${
                  role === "student" ? "text-indigo-700" : "text-teal-700"
                }`}
              >
                <FiCheckCircle />
                {role === "student"
                  ? "Built for learners"
                  : "Built for professionals"}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* STEP-BY-STEP GUIDE */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-16">
        <div className="mb-4">
          <p className="text-xs font-extrabold tracking-[0.2em] text-indigo-600">
            STEP-BY-STEP
          </p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
            How to get started
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
            Follow these five simple steps to make the most of your
            EduConnect account.
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={role}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {steps.map((step, index) => (
              <StepCard
                key={`${role}-${step.number}`}
                step={step}
                index={index}
                role={role}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ROLE COMPARISON */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto mb-10 max-w-2xl text-center"
          >
            <span className="rounded-full bg-white px-4 py-2 text-xs font-extrabold tracking-wider text-indigo-700 shadow-sm">
              CHOOSE YOUR ROLE
            </span>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Different roles. <span className="text-indigo-600">One community.</span>
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              EduConnect gives each type of user the tools they need.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            <motion.article
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-2xl text-indigo-700">
                  <FiBookOpen />
                </span>
                <div>
                  <h3 className="text-xl font-extrabold">Student</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Learn, explore, and apply.
                  </p>
                </div>
              </div>

              <ul className="mt-7 space-y-4">
                {[
                  "Browse and download academic notes",
                  "Search jobs and internships",
                  "Apply with a resume and cover letter",
                  "Post updates and connect with people",
                  "Chat with accepted connections",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-slate-600">
                    <FiCheckCircle className="mt-0.5 shrink-0 text-indigo-600" />
                    {item}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => setRole("student")}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 py-3 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
              >
                View student guide
                <FiArrowRight />
              </button>
            </motion.article>

            <motion.article
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.12 }}
              whileHover={{ y: -5 }}
              className="rounded-3xl border border-teal-100 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 text-2xl text-teal-700">
                  <FiBriefcase />
                </span>
                <div>
                  <h3 className="text-xl font-extrabold">Professional</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Share expertise and hire talent.
                  </p>
                </div>
              </div>

              <ul className="mt-7 space-y-4">
                {[
                  "Share useful educational resources",
                  "Create job and internship openings",
                  "Edit or delete your own listings",
                  "Review applicants and their resumes",
                  "Connect with students and professionals",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-slate-600">
                    <FiCheckCircle className="mt-0.5 shrink-0 text-teal-600" />
                    {item}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => setRole("professional")}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
              >
                View professional guide
                <FiArrowRight />
              </button>
            </motion.article>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-950 via-indigo-700 to-teal-600 px-6 py-14 text-center text-white shadow-2xl shadow-indigo-900/20 sm:px-12 sm:py-20"
        >
          <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full border border-white/10 shadow-[0_0_0_30px_rgba(255,255,255,0.03),0_0_0_60px_rgba(255,255,255,0.02)]" />
          <div className="pointer-events-none absolute -bottom-36 -right-12 h-72 w-72 rounded-full border border-white/10" />

          <span className="relative inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-wider text-teal-100">
            <FiZap />
            YOUR JOURNEY STARTS HERE
          </span>

          <h2 className="relative mx-auto mt-6 max-w-3xl text-3xl font-extrabold leading-tight sm:text-5xl">
            Ready to learn, connect, and{" "}
            <span className="text-teal-300">grow?</span>
          </h2>

          <p className="relative mx-auto mt-5 max-w-xl text-sm leading-7 text-indigo-100 sm:text-base">
            Join a community where knowledge is shared and opportunities
            become easier to discover.
          </p>

          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-extrabold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-50"
            >
              Create your account
              <FiArrowUpRight />
            </Link>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("role-comparison")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/20"
            >
              Explore user roles
              <FiUsers />
            </button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
export default HowWorks;