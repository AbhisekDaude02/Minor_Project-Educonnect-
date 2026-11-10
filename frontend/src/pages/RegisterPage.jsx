import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiBookOpen,
  FiUsers,
  FiBriefcase,
  FiMessageCircle,
  FiMail,
  FiLock,
  FiUser,
  FiArrowRight,
  FiArrowLeft,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { FaGoogle, FaGithub, FaGraduationCap } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { userRegister } from "../services/authServices";
import toast from "react-hot-toast";

const features = [
  {
    icon: FiBookOpen,
    title: "Study Materials",
    description: "Access notes, resources and past papers.",
  },
  {
    icon: FiUsers,
    title: "Connect & Network",
    description: "Make friends, find mentors and build your network.",
  },
  {
    icon: FiBriefcase,
    title: "Job & Internship",
    description: "Explore opportunities and kickstart your career.",
  },
  {
    icon: FiMessageCircle,
    title: "Share & Collaborate",
    description: "Post, discuss and grow with the community.",
  },
];

const RegisterPage = () => {
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: role,
  });
  const [loding, setLoding] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    setRole(newRole);

    setFormData((prev) => ({
      ...prev,
      role: newRole,
    }));
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Connect your existing registration function here.
    try {
      setLoding(true);

      await userRegister(formData);
      toast.success("Regitration successfull");
      navigate("/login");
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoding(false);
    }
  };

  return (
    <main
      className="relative isolate min-h-screen overflow-x-hidden bg-[#06172e] bg-cover bg-center bg-no-repeat px-4 py-5 text-white sm:px-7 lg:h-screen lg:overflow-hidden lg:px-[5.2%] lg:py-5"
      style={{ backgroundImage: "url('/images/register.png')" }}
    >
      {/* Background overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-linear-to-r from-[#03132b]/65 via-[#051e41]/25 to-[#03132b]/70" />

      {/* Page content */}
      <div className="relative z-10 flex min-h-full flex-col lg:h-full">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="absolute left-0 top-0 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-slate-950/60 text-xl text-white backdrop-blur-md transition hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300"
        >
          <FiArrowLeft />
        </button>

        {/* Header */}
        <header className="mb-4 flex items-center justify-between gap-3 pl-11 lg:mb-3">
          <NavLink to="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
            <FaGraduationCap className="shrink-0 text-3xl text-cyan-400 sm:text-4xl" />

            <div>
              <h2 className="text-lg font-extrabold tracking-tight sm:text-2xl">
                Edu<span className="text-cyan-400">connect</span>
              </h2>
              <p className="mt-0.5 text-[10px] tracking-wide text-blue-100 sm:text-xs">
                Learn · Share · Grow
              </p>
            </div>
          </NavLink>

          <p className="flex flex-col items-end gap-1 text-right text-[10px] text-blue-100 sm:flex-row sm:items-center sm:gap-3 sm:text-xs">
            <span>Already have an account?</span>
            <a
              href="/login"
              className="font-semibold text-cyan-400 transition hover:text-cyan-200"
            >
              Login
            </a>
          </p>
        </header>

        {/* Main content */}
        <section className="mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 items-center gap-7 lg:min-h-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.95fr)] lg:gap-8 xl:gap-12">
          {/* Left side */}
          <section className="flex flex-col justify-center py-3 lg:min-h-0 lg:py-0">
            <h1 className="text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl xl:text-[46px]">
              Build Your Future
              <br />
              Together with <span className="text-cyan-400">Educonnect</span>
            </h1>

            <p className="mt-4 text-sm leading-6 text-blue-100 sm:text-base sm:leading-7">
              Join a community of students and professionals.
              <br className="hidden sm:block" />
              Share knowledge, find opportunities, and grow together.
            </p>

            {/* Features */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:gap-4">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div key={feature.title} className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cyan-300/15 bg-cyan-400/20 text-xl text-cyan-300 shadow-[inset_0_0_18px_rgba(12,188,235,0.08)] sm:h-12 sm:w-12">
                      <Icon />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white">
                        {feature.title}
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-blue-100">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tagline */}
            <div className="mt-5 hidden w-fit lg:block">
              <p className="rotate-[-5deg] font-serif text-xl italic leading-snug text-white xl:text-2xl">
                Better Learning
                <br />
                Brighter Future
              </p>
              <div className="ml-14 mt-1 h-1 w-24 rotate-[-13deg] rounded-full bg-cyan-400" />
            </div>
          </section>

          {/* Right side: registration form */}
          <section className="w-full max-w-145 justify-self-center rounded-2xl border border-blue-400/40 bg-[#031831]/90 px-5 py-5 shadow-[0_20px_60px_rgba(0,8,25,0.4)] backdrop-blur-xl sm:px-7 sm:py-6 lg:max-h-full lg:overflow-y-auto lg:justify-self-end">
            {/* Form heading */}
            <div className="mb-5 flex items-center gap-4">
              <FiUsers className="shrink-0 text-4xl text-cyan-400 sm:text-5xl" />

              <div>
                <h2 className="text-2xl font-extrabold tracking-tight sm:text-[28px]">
                  Create Your <span className="text-cyan-400">Account</span>
                </h2>

                <p className="mt-1 text-xs leading-5 text-blue-100">
                  Get started with Educonnect and be a part of our growing
                  community.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {/* Full name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-1.5 flex items-center gap-2.5 text-xs text-blue-50"
                >
                  <FiUser className="text-lg" />
                  Full Name
                </label>

                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                  className="h-11 w-full rounded-xl border border-blue-400/45 bg-blue-400/10 px-3.5 text-sm text-white outline-none transition placeholder:text-blue-200/65 focus:border-cyan-400 focus:bg-blue-400/15 focus:ring-2 focus:ring-cyan-400/10"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 flex items-center gap-2.5 text-xs text-blue-50"
                >
                  <FiMail className="text-lg" />
                  Email Address
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  required
                  className="h-11 w-full rounded-xl border border-blue-400/45 bg-blue-400/10 px-3.5 text-sm text-white outline-none transition placeholder:text-blue-200/65 focus:border-cyan-400 focus:bg-blue-400/15 focus:ring-2 focus:ring-cyan-400/10"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 flex items-center gap-2.5 text-xs text-blue-50"
                >
                  <FiLock className="text-lg" />
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    required
                    className="h-11 w-full rounded-xl border border-blue-400/45 bg-blue-400/10 px-3.5 pr-11 text-sm text-white outline-none transition placeholder:text-blue-200/65 focus:border-cyan-400 focus:bg-blue-400/15 focus:ring-2 focus:ring-cyan-400/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-lg text-blue-200 transition hover:text-cyan-300"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {/* Role selection */}
              <div>
                <label className="mb-2 flex items-center gap-2.5 text-xs text-blue-50">
                  <FiUsers className="text-lg" />
                  Select Your Role
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    aria-pressed={role === "student"}
                    onClick={() => handleRoleChange("student")}
                    className={`flex h-11 items-center justify-center gap-2 rounded-xl border px-2 text-sm transition ${
                      role === "student"
                        ? "border-cyan-400 bg-cyan-500/15 text-white"
                        : "border-blue-400/45 bg-blue-400/5 text-blue-100 hover:border-cyan-400/70"
                    }`}
                  >
                    <FaGraduationCap
                      className={`text-lg ${
                        role === "student" ? "text-cyan-300" : ""
                      }`}
                    />
                    Student
                  </button>

                  <button
                    type="button"
                    aria-pressed={role === "professional"}
                    onClick={() => handleRoleChange("professional")}
                    className={`flex h-11 items-center justify-center gap-2 rounded-xl border px-2 text-sm transition ${
                      role === "professional"
                        ? "border-cyan-400 bg-cyan-500/15 text-white"
                        : "border-blue-400/45 bg-blue-400/5 text-blue-100 hover:border-cyan-400/70"
                    }`}
                  >
                    <FiBriefcase className="text-lg" />
                    Professional
                  </button>
                </div>

                <input type="hidden" name="role" value={role} />
              </div>

              {/* Register */}
              <button
                type="submit"
                disabled={loding}
                className="mt-1 flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-linear-to-r from-blue-500 to-teal-400 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_9px_27px_rgba(22,185,230,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loding ? "Registering..." : "Register"}
                {!loding && <FiArrowRight className="text-lg" />}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 py-0.5">
                <span className="h-px flex-1 bg-blue-300/40" />
                <span className="text-xs text-blue-100">or</span>
                <span className="h-px flex-1 bg-blue-300/40" />
              </div>

              {/* Social buttons: design only */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  className="flex h-10 items-center justify-center gap-2 rounded-xl border border-blue-400/45 bg-[#03182f]/70 px-2 text-xs text-white transition hover:border-cyan-400 hover:bg-blue-900/50"
                >
                  <FaGoogle className="text-base" />
                  Continue with Google
                </button>

                <button
                  type="button"
                  className="flex h-10 items-center justify-center gap-2 rounded-xl border border-blue-400/45 bg-[#03182f]/70 px-2 text-xs text-white transition hover:border-cyan-400 hover:bg-blue-900/50"
                >
                  <FaGithub className="text-base" />
                  Continue with GitHub
                </button>
              </div>

              {/* Terms */}
              <p className="text-center text-[10px] leading-5 text-blue-200">
                By creating an account, you agree to our{" "}
                <a href="/terms" className="text-cyan-400 hover:text-cyan-200">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="text-cyan-400 hover:text-cyan-200"
                >
                  Privacy Policy
                </a>
              </p>
            </form>
          </section>
        </section>
      </div>
    </main>
  );
};

export default RegisterPage;
