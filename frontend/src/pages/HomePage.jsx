
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaFileAlt,
  FaCommentAlt,
  FaBriefcase,
  FaArrowRight,
  FaRegHeart,
  FaRegComment,
  FaShareAlt,
  FaFilePdf,
  FaStar,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import HomeExtraSections from "../components/HomeExtraSection";

const phrases = [
  "Journey, Connected.",
  "Future, Empowered.",
  "Community, United.",
  "Success, Together.",
];

const features = [
  {
    icon: FaUsers,
    title: "Student Community",
    description: "Feed, friends, groups",
  },
  {
    icon: FaFileAlt,
    title: "Study Notes",
    description: "Share and find PDFs",
  },
  {
    icon: FaCommentAlt,
    title: "Real-Time Messaging",
    description: "Chat instantly",
  },
  {
    icon: FaBriefcase,
    title: "Jobs & Internships",
    description: "Apply or recruit",
  },
];

const HomePage = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];

    const delay = isDeleting
      ? 45
      : displayText === currentPhrase
        ? 1800
        : 85;

    const timer = setTimeout(() => {
      if (!isDeleting && displayText === currentPhrase) {
        setIsDeleting(true);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      } else if (isDeleting) {
        setDisplayText(currentPhrase.slice(0, -1 * 0 + displayText.length - 1));
      } else {
        setDisplayText(currentPhrase.slice(0, displayText.length + 1));
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIndex]);

  return (<>
    <section className="relative isolate min-h-screen overflow-hidden bg-linear-to-br from-indigo-700 via-blue-600 to-teal-600 text-white">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -bottom-40 -left-36 size-96 rounded-full bg-indigo-400/20" />

      <div className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-cyan-300/15" />

      <div className="pointer-events-none absolute right-10 top-20 size-96 rounded-full border border-white/10 bg-white/5" />

      <div className="pointer-events-none absolute right-2/5 top-1/2 size-14 rounded-full border-2 border-white/30" />

      <div className="pointer-events-none absolute right-12 top-1/3 size-3 rounded-full bg-emerald-300" />

      <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-16 sm:px-8 sm:pt-20 lg:px-10 lg:pt-24">
        {/* Hero content */}
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-10">
          {/* Left section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10"
          >
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md">
              <FaStar className="text-emerald-300" />
              Learn Together. Grow Together.
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              <span className="block text-white">
                Your Learning
              </span>

              <span className="block min-h-20 text-emerald-300 sm:min-h-24">
                {displayText}
                <span className="ml-1 inline-block h-10 w-0.5 translate-y-1 animate-pulse bg-emerald-300 sm:h-12" />
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-blue-50 sm:text-lg">
              Educonnect brings students and professionals together
              through shared knowledge, meaningful connections and
              real career opportunities.
            </p>

            {/* Buttons */}
            <div className="mt-7 flex flex-wrap gap-3">
              <NavLink
                to="/register"
                className="group inline-flex items-center gap-3 rounded-xl bg-emerald-500 px-7 py-3.5 font-semibold text-slate-950 shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-emerald-400"
              >
                Get Started Free
                <FaArrowRight className="transition-transform group-hover:translate-x-1" />
              </NavLink>

              <NavLink
                to="/features"
                className="inline-flex items-center justify-center rounded-xl border border-white/35 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/20"
              >
                Explore Features
              </NavLink>
            </div>

            {/* Community avatars */}
            <div className="mt-7 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[
                  ["AK", "bg-indigo-500"],
                  ["SR", "bg-emerald-600"],
                  ["PC", "bg-cyan-600"],
                  ["RB", "bg-violet-600"],
                ].map(([initials, color]) => (
                  <div
                    key={initials}
                    className={`flex size-8 items-center justify-center rounded-full border-2 border-white ${color} text-xs font-bold`}
                  >
                    {initials}
                  </div>
                ))}
              </div>

              <p className="max-w-64 text-sm font-medium leading-5 text-blue-50">
                Built for learning, collaboration and career growth
              </p>
            </div>
          </motion.div>

          {/* Right section */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mx-auto w-full max-w-lg py-10 lg:ml-auto"
          >
            {/* Main post card */}
            <div className="relative mx-5 rounded-3xl bg-white p-5 pt-12 text-slate-700 shadow-2xl sm:mx-10 sm:p-6 sm:pt-12">
              <div className="absolute left-5 top-5 flex gap-1.5">
                <span className="size-2.5 rounded-full bg-slate-300" />
                <span className="size-2.5 rounded-full bg-slate-300" />
                <span className="size-2.5 rounded-full bg-slate-300" />
              </div>

              <div className="mb-5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-600 to-blue-600 font-bold text-white">
                    AK
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Anisha K.
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Shared a note · 2 min ago
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-800">
                  Study group
                </span>
              </div>

              <p className="text-sm leading-6 text-slate-600">
                Unit 3 revision notes are up. Add your questions
                below and we will go through them together!
              </p>

              {/* PDF preview */}
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-xl text-indigo-600">
                  <FaFilePdf />
                </div>

                <div className="min-w-0">
                  <h4 className="truncate text-sm font-bold text-slate-800">
                    Data Structures · Unit 3
                  </h4>
                  <p className="mt-1 text-xs text-slate-500">
                    PDF · Semester 4
                  </p>
                </div>
              </div>

              {/* Post actions */}
              <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-slate-600">
                <span className="flex items-center gap-2">
                  <FaRegHeart /> Like
                </span>
                <span className="flex items-center gap-2">
                  <FaRegComment /> Comment
                </span>
                <span className="flex items-center gap-2">
                  <FaShareAlt /> Share
                </span>
              </div>
            </div>

            {/* Floating learner card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -left-2 -top-2 z-20 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-xl sm:-left-4 sm:-top-6 sm:p-4"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-lg text-indigo-600">
                <FaUsers />
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  Connect with Learners
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  Find peers in your field
                </p>
              </div>
            </motion.div>

            {/* Top avatar */}
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              className="absolute -right-1 -top-5 z-20 flex size-16 items-center justify-center rounded-full border-4 border-white bg-teal-700 text-xl font-bold shadow-xl sm:-right-2 sm:-top-10 sm:size-20"
            >
              SK
            </motion.div>

            {/* Share knowledge card */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity }}
              className="absolute -right-2 top-2/5 z-20 flex max-w-52 items-center gap-3 rounded-2xl bg-white p-3 shadow-xl sm:-right-4 sm:p-4"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-lg text-teal-700">
                <FaFileAlt />
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  Share Knowledge
                </h4>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Notes, answers, ideas
                </p>
              </div>
            </motion.div>

            {/* Opportunities card */}
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-2 left-0 z-20 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-xl sm:-bottom-7 sm:-left-6 sm:p-4"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-lg text-emerald-700">
                <FaBriefcase />
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  Discover Opportunities
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  Jobs & internships
                </p>
              </div>
            </motion.div>

            {/* Bottom avatar */}
            <div className="absolute -bottom-4 -right-1 z-20 flex size-16 items-center justify-center rounded-full border-4 border-white bg-emerald-700 text-xl font-bold shadow-xl sm:-bottom-10 sm:-right-3 sm:size-20">
              PG
            </div>
          </motion.div>
        </div>

        {/* Feature bar */}
        <motion.div
          id="features"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative mt-24 grid grid-cols-1 overflow-hidden rounded-3xl border border-white/20 bg-slate-950/20 p-3 backdrop-blur-xl sm:grid-cols-2 lg:mt-28 lg:grid-cols-4 lg:p-4"
        >
          {features.map(({ icon: Icon, title, description }, index) => (
            <div
              key={title}
              className={`flex items-center gap-3 px-3 py-4 sm:px-4 lg:py-2 ${
                index !== features.length - 1
                  ? "lg:border-r lg:border-white/20"
                  : ""
              }`}
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/20 text-lg text-white">
                <Icon />
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{title}</h3>
                <p className="mt-1 text-xs text-blue-100">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

       
      </div>
    </section>
    <section>
       <HomeExtraSections/>
    </section>
  </>);
};

export default HomePage;
