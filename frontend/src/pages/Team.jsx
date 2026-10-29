
import React from "react";
import { motion } from "framer-motion";
import {
  FiGithub,
  FiLinkedin,
  FiUsers,
  FiArrowUpRight,
} from "react-icons/fi";

const teamMembers = [
  {
    name: "Abhisek Daude",
    role: "Full Stack Developer",
    description:
      "Building the core experience that connects learning, collaboration, and career opportunities.",
    image: "/images/abhisek.jpg",
    initials: "AD",
    color: "from-indigo-500 to-violet-500",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
  },
  {
    name: "Team Member 2",
    role: "Frontend Developer",
    description:
      "Creating intuitive interfaces and responsive experiences for every EduConnect user.",
    image: "/images/member2.jpg",
    initials: "TM",
    color: "from-teal-500 to-cyan-500",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
  },
  {
    name: "Team Member 3",
    role: "Backend Developer",
    description:
      "Developing reliable APIs, secure authentication, and the systems behind our platform.",
    image: "/images/member3.jpg",
    initials: "TM",
    color: "from-orange-500 to-pink-500",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
  },
  {
    name: "Team Member 4",
    role: "UI/UX & Research",
    description:
      "Helping turn student and professional needs into a thoughtful digital experience.",
    image: "/images/member4.jpg",
    initials: "TM",
    color: "from-blue-500 to-indigo-500",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
  },
];

const reveal = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const Team = ()=> {
  return (
    <main className="overflow-hidden bg-white text-slate-900">
      {/* Hero */}
      <section className="relative bg-linear-to-b from-indigo-50 via-white to-white px-5 pb-16 pt-20 sm:pt-28">
        <div className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-violet-200/40 blur-[100px]" />
        <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-teal-200/40 blur-[100px]" />

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-4xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-bold tracking-widest text-indigo-700 shadow-sm">
            <FiUsers />
            MEET OUR TEAM
          </span>

          <h1 className="mt-7 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Four minds.
            <br />
            <span className="bg-linear-to-r from-indigo-600 via-violet-600 to-teal-500 bg-clip-text text-transparent">
              One shared vision.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            We're a team working to make education, collaboration, and career
            opportunities more accessible through EduConnect.
          </p>
        </motion.div>
      </section>

      {/* Team cards */}
      <section className="px-5 py-12 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, index) => (
            <motion.article
              key={member.name}
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-2xl hover:shadow-indigo-950/10"
            >
              {/* Image */}
              <div className="relative h-72 overflow-hidden bg-linear-to-br from-indigo-100 via-slate-100 to-teal-100">
                <img
                  src={member.image}
                  alt={member.name}
                  loading="lazy"
                  className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />

                <div
                  className={`absolute inset-0 z-0 bg-linear-to-br ${member.color} flex items-center justify-center text-5xl font-extrabold text-white`}
                >
                  {member.initials}
                </div>

                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-slate-950/70 to-transparent p-5 pt-16">
                  <span className="inline-flex rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[10px] font-bold tracking-wider text-white backdrop-blur-md">
                    TEAM MEMBER {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="p-6">
                <h2 className="text-lg font-extrabold text-slate-900">
                  {member.name}
                </h2>

                <p className="mt-2 text-xs font-bold text-indigo-600">
                  {member.role}
                </p>

                <p className="mt-4 min-h-20 text-sm leading-6 text-slate-500">
                  {member.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex gap-2">
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${member.name} GitHub`}
                      className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <FiGithub />
                    </a>

                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${member.name} LinkedIn`}
                      className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <FiLinkedin />
                    </a>
                  </div>

                  <span className="flex items-center gap-1 text-xs font-bold text-indigo-600">
                    Our team <FiArrowUpRight />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="px-5 pb-20 sm:px-8">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-linear-to-br from-indigo-950 via-indigo-800 to-teal-700 px-7 py-12 text-center text-white sm:px-12 sm:py-16"
        >
          <p className="text-xs font-bold tracking-[0.25em] text-teal-200">
            WHAT BRINGS US TOGETHER
          </p>

          <h2 className="mt-5 text-3xl font-extrabold sm:text-4xl">
            Building opportunities, together.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-indigo-100 sm:text-base">
            EduConnect is more than a platform. It's our effort to bring
            students and professionals together, encourage knowledge sharing,
            and help people take the next step in their journey.
          </p>
        </motion.div>
      </section>
    </main>
  );
}

export default Team;