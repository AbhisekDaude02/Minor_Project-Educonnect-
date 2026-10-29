
import React from "react";
import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiBriefcase,
  FiUsers,
  FiShield,
  FiGlobe,
  FiHeart,
  FiArrowUpRight,
  FiCheckCircle,
  FiLayers,
  FiMessageCircle,
} from "react-icons/fi";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14 },
  },
};

const features = [
  {
    icon: FiBookOpen,
    number: "01",
    title: "Academic Resource Hub",
    description:
      "Discover, upload, and share notes, past papers, assignments, and learning resources with students across universities.",
    color: "violet",
  },
  {
    icon: FiBriefcase,
    number: "02",
    title: "Opportunities & Connections",
    description:
      "Explore internships, connect with professionals, discover career opportunities, and build meaningful relationships.",
    color: "teal",
  },
];

const values = [
  {
    icon: FiGlobe,
    title: "Open Access",
    description: "Knowledge should be accessible to every learner.",
  },
  {
    icon: FiShield,
    title: "Trust & Safety",
    description: "A respectful, reliable, and supportive learning space.",
  },
  {
    icon: FiUsers,
    title: "Community",
    description: "Share ideas, support one another, and grow together.",
  },
  {
    icon: FiHeart,
    title: "Student First",
    description: "Your learning journey is at the heart of everything.",
  },
];

const audiences = [
  {
    letter: "S",
    title: "Students",
    description:
      "Find study materials, prepare for exams, connect with peers, and apply for internships.",
    color: "orange",
  },
  {
    letter: "P",
    title: "Professionals",
    description:
      "Share expertise, publish opportunities, mentor learners, and discover fresh talent.",
    color: "teal",
  },
  {
    letter: "U",
    title: "Universities & Clubs",
    description:
      "Connect students, support academic collaboration, and build stronger communities.",
    color: "pink",
  },
];

const AboutPage = () => {
  return (
    <main className="overflow-hidden bg-white text-slate-900">
      {/* HERO SECTION */}
      <section className="relative isolate">
        <div className="pointer-events-none absolute -left-32 top-0 -z-10 h-80 w-80 rounded-full bg-violet-200/60 blur-[100px]" />
        <div className="pointer-events-none absolute -right-20 bottom-0 -z-10 h-80 w-80 rounded-full bg-teal-100/80 blur-[100px]" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-24">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-4 py-2 text-xs font-bold tracking-wider text-violet-700"
            >
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              MORE THAN A LEARNING PLATFORM
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mt-7 text-4xl font-extrabold leading-[1.12] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
            >
              Knowledge should never stop at{" "}
              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
                university gates.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg"
            >
              Great ideas deserve to travel. EduConnect brings students,
              professionals, and opportunities together in one community
              built for learning, sharing, and growing.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 flex flex-wrap gap-3"
            >
              {[
                { icon: FiBookOpen, label: "Learn together" },
                { icon: FiUsers, label: "Connect freely" },
                { icon: FiBriefcase, label: "Grow further" },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm"
                >
                  <Icon className="text-violet-600" />
                  {label}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* DEFAULT TEAM IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mx-auto w-full max-w-xl pb-5 pr-3"
          >
            <div className="absolute inset-4 -right-1 -bottom-1 rotate-3 rounded-[2rem] bg-gradient-to-br from-violet-600 to-teal-400" />

            <div className="group relative overflow-hidden rounded-[1.8rem] border-[5px] border-white shadow-2xl shadow-slate-300/70">
              <img
                src="/images/educonnect-team.png"
                alt="University students learning and collaborating together"
                className="h-[300px] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[400px]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xs font-bold tracking-[0.2em] text-teal-200">
                  BUILT FOR THE FUTURE
                </p>
                <h3 className="mt-2 text-xl font-bold sm:text-2xl">
                  Where learning meets opportunity.
                </h3>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-1 right-0 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:-right-4"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-xl text-teal-600">
                <FiCheckCircle />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  One connected community
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Learn. Share. Succeed.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* MISSION AND VISION */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-28">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-100 via-indigo-50 to-teal-50 p-6 sm:p-10"
        >
          <div className="relative flex min-h-72 flex-col justify-center overflow-hidden rounded-2xl border border-white/80 bg-white/50 p-7 sm:min-h-80 sm:p-10">
            <span className="flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold tracking-wider text-violet-700 shadow-sm">
              <FiLayers />
              OUR PURPOSE
            </span>

            <h2 className="mt-7 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              Learning is better
              <br />
              <span className="text-violet-600">when shared.</span>
            </h2>

            <p className="mt-4 max-w-sm leading-7 text-slate-600">
              Your next idea, opportunity, or meaningful connection could
              begin right here.
            </p>

            <FiMessageCircle className="absolute -bottom-8 -right-5 text-[150px] text-violet-500/10 sm:text-[180px]" />
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.span
            variants={fadeUp}
            className="text-xs font-extrabold tracking-[0.2em] text-violet-600"
          >
            WHY EDUCONNECT?
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl"
          >
            Our mission is to make{" "}
            <span className="text-violet-600">
              education more connected.
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-5 leading-8 text-slate-600"
          >
            We believe every student deserves access to quality learning
            resources, supportive communities, and real career opportunities
            regardless of their university or background.
          </motion.p>

          {[
            {
              icon: FiCheckCircle,
              title: "Our mission",
              description:
                "Remove barriers to knowledge sharing and connect learners with people and opportunities that help them succeed.",
              color: "violet",
            },
            {
              icon: FiGlobe,
              title: "Our vision",
              description:
                "Create a connected academic world where collaboration, professional growth, and lifelong learning feel natural.",
              color: "teal",
            },
          ].map(({ icon: Icon, title, description, color }) => (
            <motion.div
              variants={fadeUp}
              key={title}
              className="mt-7 flex items-start gap-4"
            >
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${
                  color === "violet"
                    ? "bg-violet-100 text-violet-600"
                    : "bg-teal-50 text-teal-600"
                }`}
              >
                <Icon />
              </span>
              <div>
                <h3 className="font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto mb-12 max-w-2xl text-center"
          >
            <span className="rounded-full bg-violet-100 px-4 py-2 text-xs font-extrabold tracking-wider text-violet-700">
              WHAT WE BUILD
            </span>
            <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Two goals. <span className="text-violet-600">One platform.</span>
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Everything you need to learn smarter and move forward.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const violet = feature.color === "violet";

              return (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.55, delay: index * 0.12 }}
                  whileHover={{ y: -7 }}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-shadow duration-300 hover:shadow-xl sm:p-9"
                >
                  <div
                    className={`absolute -right-12 -top-12 h-40 w-40 rounded-full transition-transform duration-500 group-hover:scale-125 ${
                      violet ? "bg-violet-50" : "bg-teal-50"
                    }`}
                  />

                  <div className="relative flex items-center justify-between">
                    <span
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${
                        violet
                          ? "bg-violet-100 text-violet-600"
                          : "bg-teal-100 text-teal-600"
                      }`}
                    >
                      <Icon />
                    </span>
                    <span className="text-sm font-extrabold text-slate-300">
                      {feature.number}
                    </span>
                  </div>

                  <h3 className="relative mt-7 text-xl font-bold">
                    {feature.title}
                  </h3>

                  <p className="relative mt-3 text-sm leading-7 text-slate-600">
                    {feature.description}
                  </p>

                  <div
                    className={`relative mt-7 flex items-center justify-between text-xs font-extrabold tracking-wider ${
                      violet ? "text-violet-600" : "text-teal-600"
                    }`}
                  >
                    EXPLORE POSSIBILITIES
                    <FiArrowUpRight className="text-xl transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <span className="text-xs font-extrabold tracking-[0.2em] text-violet-600">
            THE PRINCIPLES WE LIVE BY
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            What we <span className="text-violet-600">stand for.</span>
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            Our values shape every connection we make.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => {
            const Icon = value.icon;
            const teal = index % 2 !== 0;

            return (
              <motion.article
                key={value.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${
                    teal
                      ? "bg-teal-50 text-teal-600"
                      : "bg-violet-100 text-violet-600"
                  }`}
                >
                  <Icon />
                </span>
                <h3 className="mt-5 font-bold">{value.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {value.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* WHO IS EDUCONNECT FOR? */}
      <section className="bg-gradient-to-b from-slate-50 to-indigo-50/60 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <span className="text-xs font-extrabold tracking-[0.2em] text-violet-600">
              MADE FOR EVERY AMBITION
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              A place for <span className="text-violet-600">everyone.</span>
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Different journeys. Shared knowledge. Unlimited possibilities.
            </p>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-3">
            {audiences.map((person, index) => {
              const colors = {
                orange: {
                  icon: "bg-orange-500",
                  line: "bg-orange-400",
                },
                teal: {
                  icon: "bg-teal-500",
                  line: "bg-teal-400",
                },
                pink: {
                  icon: "bg-pink-500",
                  line: "bg-pink-400",
                },
              };

              return (
                <motion.article
                  key={person.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                  whileHover={{ y: -7 }}
                  className="group rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition-shadow hover:shadow-xl sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-extrabold text-white ${colors[person.color].icon}`}
                    >
                      {person.letter}
                    </span>
                    <FiArrowUpRight className="text-xl text-slate-400 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-violet-600" />
                  </div>

                  <h3 className="mt-7 text-lg font-bold">{person.title}</h3>
                  <p className="mt-3 min-h-20 text-sm leading-7 text-slate-600">
                    {person.description}
                  </p>

                  <div
                    className={`mt-6 h-1 w-10 rounded-full transition-all duration-300 group-hover:w-20 ${colors[person.color].line}`}
                  />
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-indigo-950 via-violet-800 to-teal-700 px-6 py-16 text-center text-white shadow-2xl shadow-violet-900/15 sm:px-12 sm:py-20"
        >
          <div className="pointer-events-none absolute -left-20 -top-32 h-72 w-72 rounded-full border border-white/10 shadow-[0_0_0_30px_rgba(255,255,255,0.025),0_0_0_60px_rgba(255,255,255,0.025)]" />

          <div className="pointer-events-none absolute -bottom-40 -right-20 h-80 w-80 rounded-full border border-white/10" />

          <span className="relative text-xs font-extrabold tracking-[0.2em] text-teal-200">
            YOUR JOURNEY STARTS HERE
          </span>

          <h2 className="relative mx-auto mt-5 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Your next big thing starts with a{" "}
            <span className="text-teal-300">connection.</span>
          </h2>

          <p className="relative mx-auto mt-5 max-w-xl text-sm leading-7 text-indigo-100 sm:text-base">
            Share what you know. Discover what is possible. Grow with
            EduConnect.
          </p>

          <motion.a
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            href="/register"
            className="relative mt-8 inline-flex items-center gap-3 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-violet-800 shadow-lg transition hover:bg-teal-50"
          >
            Join the community
            <FiArrowUpRight className="text-lg" />
          </motion.a>
        </motion.div>
      </section>
    </main>
  );
};

export default AboutPage;
