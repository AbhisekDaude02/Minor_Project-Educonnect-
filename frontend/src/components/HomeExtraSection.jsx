
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiUserPlus,
  FiBookOpen,
  FiBriefcase,
  FiMessageCircle,
  FiArrowRight,
  FiCheckCircle,
  FiUsers,
  FiGlobe,
} from "react-icons/fi";

const steps = [
  {
    number: "01",
    icon: FiUserPlus,
    title: "Create your account",
    description:
      "Join EduConnect as a student or professional and set up your profile in minutes.",
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    number: "02",
    icon: FiBookOpen,
    title: "Discover opportunities",
    description:
      "Explore study materials, question papers, internships, and career opportunities.",
    color: "bg-teal-100 text-teal-600",
  },
  {
    number: "03",
    icon: FiMessageCircle,
    title: "Connect and grow",
    description:
      "Build connections, exchange knowledge, and communicate with your community.",
    color: "bg-orange-100 text-orange-600",
  },
];

const highlights = [
  {
    icon: FiBookOpen,
    title: "Learn without limits",
    description:
      "Find useful academic resources organized by subject, semester, and university.",
  },
  {
    icon: FiBriefcase,
    title: "Build your career",
    description:
      "Discover internships and jobs posted by professionals and organizations.",
  },
  {
    icon: FiUsers,
    title: "Grow your network",
    description:
      "Connect with students and professionals who share your interests.",
  },
  {
    icon: FiGlobe,
    title: "One connected community",
    description:
      "Bring learning, collaboration, and career development together in one place.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export default function HomeExtraSections() {
  return (
    <div className="overflow-hidden bg-white text-slate-900">

      {/* HOW IT WORKS */}
      <section className="bg-slate-50 px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto mb-14 max-w-2xl text-center"
          >
            <span className="rounded-full bg-indigo-100 px-4 py-2 text-xs font-bold uppercase tracking-widest text-indigo-700">
              Simple by design
            </span>

            <h2 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Getting started is
              <span className="text-indigo-600"> easy.</span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
              Everything you need to learn, connect, and discover new
              opportunities in just three simple steps.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.number}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.12 }}
                  whileHover={{ y: -7 }}
                  className="relative rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-xl hover:shadow-indigo-950/5 sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${step.color}`}>
                      <Icon />
                    </span>

                    <span className="text-4xl font-black text-slate-100">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-extrabold">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {step.description}
                  </p>

                  <div className="mt-6 h-1 w-12 rounded-full bg-gradient-to-r from-indigo-600 to-teal-500" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY EDUCONNECT */}
      <section className="px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="rounded-full bg-teal-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-teal-700">
              Why EduConnect?
            </span>

            <h2 className="mt-6 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              More than learning.
              <span className="block bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
                A place to grow.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              Education becomes more powerful when knowledge, people, and
              opportunities come together. EduConnect helps students learn
              collaboratively while helping professionals discover and
              support emerging talent.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Find academic materials in one convenient place",
                "Discover internships and employment opportunities",
                "Connect, communicate, and share knowledge",
                "Build meaningful academic and professional relationships",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <FiCheckCircle className="mt-0.5 shrink-0 text-lg text-teal-600" />
                  <p className="text-sm leading-6 text-slate-700">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <Link
              to="/about"
              className="mt-9 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-1 hover:bg-indigo-700"
            >
              Discover our mission <FiArrowRight />
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-indigo-200/50 to-teal-200/50 blur-2xl" />

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-800 to-teal-700 p-7 text-white sm:p-10">
              <div className="mb-9 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl">
                  <FiUsers />
                </div>

                <div>
                  <h3 className="text-xl font-extrabold">
                    One community
                  </h3>
                  <p className="mt-1 text-sm text-indigo-100">
                    Different goals, shared growth.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-200 text-indigo-800">
                      <FiBookOpen />
                    </span>
                    <div>
                      <h4 className="font-bold">For students</h4>
                      <p className="mt-1 text-xs text-indigo-100">
                        Learn, connect, and apply for opportunities.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-200 text-teal-800">
                      <FiBriefcase />
                    </span>
                    <div>
                      <h4 className="font-bold">For professionals</h4>
                      <p className="mt-1 text-xs text-indigo-100">
                        Share expertise and publish jobs or internships.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-7 text-xs leading-6 text-indigo-100">
                Two different journeys, connected through one learning and
                career community.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="px-5 pb-20 sm:px-8 lg:pb-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-indigo-700 via-indigo-600 to-teal-600 px-6 py-14 text-center text-white shadow-2xl shadow-indigo-900/15 sm:px-12 sm:py-20"
        >
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border-[40px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-32 -left-10 h-72 w-72 rounded-full bg-teal-300/20 blur-3xl" />

          <div className="relative">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-indigo-100">
              Your next chapter starts here
            </span>

            <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              Ready to learn, connect, and grow?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-indigo-100 sm:text-base">
              Join a community where academic knowledge meets real-world
              opportunities.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 text-sm font-extrabold text-indigo-700 shadow-lg transition hover:-translate-y-1 hover:bg-indigo-50"
              >
                Get started for free <FiArrowRight />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/20"
              >
                Talk to our team
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
