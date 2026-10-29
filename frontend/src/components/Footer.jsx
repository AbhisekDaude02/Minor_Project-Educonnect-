import React from "react";
import { Link } from "react-router-dom";
import {
  FaGraduationCap,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
  FaArrowRight,
  FaRegEnvelope,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Platform",
      links: [
        { name: "Study Materials", path: "/notes" },
        { name: "Community", path: "/community" },
        { name: "Mentorship", path: "/mentorship" },
        { name: "Internships", path: "/internships" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Notes Library", path: "/notes" },
        { name: "Career Guidance", path: "/careers" },
        { name: "Help Center", path: "/help" },
        { name: "FAQs", path: "/faq" },
      ],
    },
    {
      title: "Explore",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Contact Us", path: "/contact" },
        { name: "Login", path: "/login" },
        { name: "Register", path: "/register" },
      ],
    },
  ];

  const socialLinks = [
    { icon: FaFacebookF, url: "https://facebook.com", label: "Facebook" },
    { icon: FaInstagram, url: "https://instagram.com", label: "Instagram" },
    { icon: FaLinkedinIn, url: "https://linkedin.com", label: "LinkedIn" },
    { icon: FaGithub, url: "https://github.com", label: "GitHub" },
  ];

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-300">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 pt-16 sm:px-8 lg:px-12">
        {/* Main footer */}
        <div className="grid grid-cols-1 gap-12 pb-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-10">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <Link to="/" className="group inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-teal-400 to-cyan-600 text-white shadow-lg shadow-teal-500/20 transition-transform duration-300 group-hover:-translate-y-1">
                <FaGraduationCap className="text-2xl" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-white">
                  Edu<span className="text-teal-400">Connect</span>
                </h2>
                <p className="text-xs tracking-widest text-slate-500">
                  LEARN. CONNECT. GROW.
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-slate-400">
              Your learning journey starts here. Connect with students, share
              knowledge, discover opportunities, and grow together with a
              community built for your future.
            </p>

            {/* Social media */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, url, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:border-teal-400/50 hover:bg-teal-400 hover:text-slate-950"
                >
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation columns */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-white">
                {section.title}
              </h3>

              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors duration-200 hover:text-teal-400"
                    >
                      <span>{link.name}</span>
                      <FaArrowRight className="text-[10px] opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter section */}
        <div className="mb-10 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-400/10 text-xl text-teal-400">
                <FaRegEnvelope />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">
                  Stay in the loop
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Get learning tips and opportunities delivered to your inbox.
                </p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Connect this form to your backend newsletter API.
              }}
              className="flex w-full flex-col gap-3 sm:flex-row md:max-w-md"
            >
              <input
                type="email"
                required
                placeholder="Enter your email address"
                aria-label="Email address"
                className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
              />

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-400 px-5 py-3 text-sm font-bold text-slate-950 transition-all duration-300 hover:bg-teal-300"
              >
                Subscribe
                <FaArrowRight />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs leading-6 text-slate-500">
            © {currentYear} EduConnect. All rights reserved.
          </p>

          <p className="text-xs text-slate-500">
            Made with <span className="text-teal-400">♥</span> for learners, by
            learners.
          </p>

          <div className="flex flex-wrap justify-center gap-5 text-xs text-slate-500">
            <Link
              to="/privacy"
              className="transition-colors hover:text-teal-400"
            >
              Privacy Policy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-teal-400">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
