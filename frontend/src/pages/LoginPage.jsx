import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiArrowRight,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiBookOpen,
  FiUsers,
  FiBriefcase,
  FiMessageCircle,
  FiShield,
} from "react-icons/fi";

import { FaGoogle, FaGithub, FaGraduationCap } from "react-icons/fa";
import { getLoggedUser, userLogin } from "../services/authServices";
import toast from "react-hot-toast";
import { AuthContext } from "../context/authContext";

const features = [
  {
    icon: FiBookOpen,
    title: "Study Materials",
    description: "Access notes, resources and past papers.",
  },
  {
    icon: FiUsers,
    title: "Connect & Network",
    description: "Connect with students and experienced mentors.",
  },
  {
    icon: FiBriefcase,
    title: "Jobs & Internships",
    description: "Discover opportunities to grow your career.",
  },
  {
    icon: FiMessageCircle,
    title: "Learn Together",
    description: "Share ideas, discuss and collaborate.",
  },
];

const LoginPage = () => {
  const { setIsLogging, setUsers } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoding] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoding(true);

      // Login request
      await userLogin(loginData);

      // Fetch authenticated user from backend
      const userInfo = await getLoggedUser();

      // Save user in AuthContext
      setUsers(userInfo.data.user);
      setIsLogging(true);

      toast.success("Login successfully");

      navigate("/educonnect");
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoding(false);
    }
  };

  return (
    <main
      className="relative isolate min-h-screen overflow-x-hidden bg-[#06172e] bg-cover bg-center bg-no-repeat px-4 py-5 text-white sm:px-7 lg:h-screen lg:overflow-hidden lg:px-[5.2%] lg:py-5"
      style={{
        backgroundImage: "url('/campus-bg.jpg')",
      }}
    >
      {/* Background overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-linear-to-r from-[#03132b]/70 via-[#051e41]/35 to-[#03132b]/75" />

      {/* Main content */}
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
          <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
            <FaGraduationCap className="shrink-0 text-3xl text-cyan-400 sm:text-4xl" />

            <div>
              <h2 className="text-lg font-extrabold tracking-tight sm:text-2xl">
                Edu<span className="text-cyan-400">connect</span>
              </h2>

              <p className="mt-0.5 text-[10px] tracking-wide text-blue-100 sm:text-xs">
                Learn · Share · Grow
              </p>
            </div>
          </Link>

          <p className="flex flex-col items-end gap-1 text-right text-[10px] text-blue-100 sm:flex-row sm:items-center sm:gap-3 sm:text-xs">
            <span>New to Educonnect?</span>

            <Link
              to="/register"
              className="font-semibold text-cyan-400 transition hover:text-cyan-200"
            >
              Create Account
            </Link>
          </p>
        </header>

        {/* Login layout */}
        <section className="mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 items-center gap-7 lg:min-h-0 lg:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.95fr)] lg:gap-8 xl:gap-12">
          {/* Left hero section */}
          <section className="flex flex-col justify-center py-3 lg:min-h-0 lg:py-0">
            <h1 className="text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl xl:text-[46px]">
              Welcome Back
              <br />
              To <span className="text-cyan-400">Educonnect</span>
            </h1>

            <p className="mt-4 text-sm leading-6 text-blue-100 sm:text-base sm:leading-7">
              Your learning journey continues here.
              <br className="hidden sm:block" />
              Connect, explore opportunities, and achieve more together.
            </p>

            {/* Feature list */}
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

          {/* Login panel */}
          <section className="w-full max-w-145 justify-self-center rounded-2xl border border-blue-400/40 bg-[#031831]/90 px-5 py-6 shadow-[0_20px_60px_rgba(0,8,25,0.4)] backdrop-blur-xl sm:px-7 sm:py-8 lg:justify-self-end">
            {/* Panel heading */}
            <div className="mb-7 flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                <FiShield className="text-4xl text-cyan-400" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold tracking-tight sm:text-[30px]">
                  Welcome <span className="text-cyan-400">Back!</span>
                </h2>

                <p className="mt-1 text-xs leading-5 text-blue-100 sm:text-sm">
                  Login to continue your Educonnect journey.
                </p>
              </div>
            </div>

            {/* Login form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 flex items-center gap-2.5 text-xs text-blue-50 sm:text-sm"
                >
                  <FiMail className="text-lg" />
                  Email Address
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  required
                  className="h-12 w-full rounded-xl border border-blue-400/45 bg-blue-400/10 px-4 text-sm text-white outline-none transition placeholder:text-blue-200/65 focus:border-cyan-400 focus:bg-blue-400/15 focus:ring-2 focus:ring-cyan-400/10"
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <label
                    htmlFor="password"
                    className="flex items-center gap-2.5 text-xs text-blue-50 sm:text-sm"
                  >
                    <FiLock className="text-lg" />
                    Password
                  </label>

                  <Link
                    to="/forgotpassword"
                    className="text-xs font-medium text-cyan-400 transition hover:text-cyan-200"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="h-12 w-full rounded-xl border border-blue-400/45 bg-blue-400/10 px-4 pr-12 text-sm text-white outline-none transition placeholder:text-blue-200/65 focus:border-cyan-400 focus:bg-blue-400/15 focus:ring-2 focus:ring-cyan-400/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-blue-200 transition hover:text-cyan-300"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between gap-3">
                <label className="flex cursor-pointer items-center gap-2 text-xs text-blue-100">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    className="h-4 w-4 accent-cyan-400"
                  />
                  Remember me
                </label>

                <span className="text-[10px] text-blue-200/70">
                  Secure login
                </span>
              </div>

              {/* Login button */}
              <button
                type="submit"
                className="mt-1 flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-linear-to-r from-blue-500 to-teal-400 text-sm font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_9px_27px_rgba(22,185,230,0.2)]"
              >
                {loading ? "Login To your Account..." : "Login To your Account"}
                {!loading && <FiArrowRight className="text-lg" />}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-blue-300/30" />
                <span className="text-xs text-blue-100">or continue with</span>
                <span className="h-px flex-1 bg-blue-300/30" />
              </div>

              {/* Social login buttons */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-blue-400/45 bg-[#03182f]/70 px-2 text-xs text-white transition hover:border-cyan-400 hover:bg-blue-900/50"
                >
                  <FaGoogle className="text-lg" />
                  Continue with Google
                </button>

                <button
                  type="button"
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-blue-400/45 bg-[#03182f]/70 px-2 text-xs text-white transition hover:border-cyan-400 hover:bg-blue-900/50"
                >
                  <FaGithub className="text-lg" />
                  Continue with GitHub
                </button>
              </div>

              {/* Registration link */}
              <p className="pt-1 text-center text-xs leading-6 text-blue-200">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-cyan-400 transition hover:text-cyan-200"
                >
                  Register now
                </Link>
              </p>

              {/* Terms */}
              <p className="text-center text-[10px] leading-5 text-blue-200/80">
                By continuing, you agree to our{" "}
                <Link to="/terms" className="text-cyan-400 hover:text-cyan-200">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-cyan-400 hover:text-cyan-200"
                >
                  Privacy Policy
                </Link>
              </p>
            </form>
          </section>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
