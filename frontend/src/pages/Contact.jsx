
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiMail,
  FiMapPin,
  FiMessageCircle,
  FiSend,
  FiArrowUpRight,
  FiGithub,
  FiLinkedin,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

const contactInfo = [
  {
    icon: FiMail,
    title: "Email us",
    description: "For questions and collaboration",
    value: "educonnect@gmail.com",
    href: "mailto:hello@educonnect.com",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    icon: FiMapPin,
    title: "Our community",
    description: "Built for learners everywhere",
    value: "Mahendranagar, Nepal",
    href: null,
    color: "bg-teal-100 text-teal-700",
  },
  {
    icon: FiClock,
    title: "Response time",
    description: "We'll get back to you",
    value: "Within 1–2 working days",
    href: null,
    color: "bg-orange-100 text-orange-700",
  },
];

const reveal = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const Contact = ()=> {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.message.trim().length < 10) {
      toast.error("Please enter a message with at least 10 characters.");
      return;
    }

    setLoading(true);

    try {
      // Connect this form to your backend contact API.
      // Example: await axios.post("/api/contact", formData);

      toast.success("Your message is ready to be connected to the backend.");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error("Unable to send your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="overflow-hidden bg-white text-slate-900">
      <Toaster position="top-right" />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-linear-to-b from-indigo-50 via-white to-white px-5 pb-16 pt-20 sm:px-8 sm:pb-20 sm:pt-28">
        <div className="pointer-events-none absolute -left-24 top-0 -z-10 h-72 w-72 rounded-full bg-indigo-200/50 blur-[100px]" />
        <div className="pointer-events-none absolute -right-24 top-10 -z-10 h-72 w-72 rounded-full bg-teal-200/40 blur-[100px]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-bold tracking-widest text-indigo-700 shadow-sm">
            <FiMessageCircle />
            GET IN TOUCH
          </span>

          <h1 className="mt-7 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Let's start a
            <br />
            <span className="bg-linear-to-r from-indigo-600 via-violet-600 to-teal-500 bg-clip-text text-transparent">
              meaningful conversation.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Have a question, an idea, or an opportunity to share? We'd love
            to hear from you.
          </p>
        </motion.div>
      </section>

      {/* Contact content */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Left information */}
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-xs font-extrabold tracking-[0.2em] text-indigo-600">
              WE'RE HERE TO HELP
            </p>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
              Let's make something great together.
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
              Whether you're a student looking for resources, a professional
              interested in posting opportunities, or someone who wants to
              collaborate, our team is ready to listen.
            </p>

            <div className="mt-8 space-y-4">
              {contactInfo.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-950/5 sm:p-5"
                  >
                    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl ${item.color}`}>
                      <Icon />
                    </span>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-extrabold">{item.title}</h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.description}
                      </p>

                      {item.href ? (
                        <a
                          href={item.href}
                          className="mt-2 inline-block break-all text-sm font-semibold text-indigo-600 hover:text-teal-600"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="mt-2 text-sm font-semibold text-slate-800">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-7 rounded-2xl bg-linear-to-br from-indigo-950 to-indigo-800 p-6 text-white sm:p-7">
              <span className="inline-flex rounded-xl bg-white/10 p-3 text-xl text-teal-200">
                <FiCheckCircle />
              </span>

              <h3 className="mt-4 text-lg font-extrabold">
                Every great connection starts somewhere.
              </h3>

              <p className="mt-3 text-sm leading-6 text-indigo-100">
                We're building a place where knowledge is shared, talent is
                discovered, and opportunities become real.
              </p>

              <div className="mt-5 flex gap-3">
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="rounded-xl border border-white/20 p-3 transition hover:bg-white/10"
                >
                  <FiGithub />
                </a>

                <a
                  href="https://linkedin.com/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="rounded-xl border border-white/20 p-3 transition hover:bg-white/10"
                >
                  <FiLinkedin />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-linear-to-br from-indigo-200/60 to-teal-200/60 blur-2xl" />

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-indigo-950/5 sm:p-9">
              <div className="mb-8">
                <span className="inline-flex rounded-xl bg-indigo-100 p-3 text-xl text-indigo-700">
                  <FiSend />
                </span>

                <h2 className="mt-5 text-2xl font-extrabold">
                  Send us a message
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Fill in the details below and tell us how we can help.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-bold text-slate-700">
                      Your name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-bold text-slate-700">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-bold text-slate-700">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What would you like to discuss?"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-bold text-slate-700">
                    Your message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us a little about your question or idea..."
                    rows={6}
                    minLength={10}
                    maxLength={3000}
                    required
                    className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                  <p className="mt-2 text-right text-xs text-slate-400">
                    {formData.message.length}/3000 characters
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-3 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 px-6 py-4 text-sm font-extrabold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-600/25 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send your message"}
                  <FiArrowUpRight className="text-lg transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>

                <p className="text-center text-xs leading-5 text-slate-400">
                  Your information should only be used to respond to your
                  inquiry.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
export default Contact;