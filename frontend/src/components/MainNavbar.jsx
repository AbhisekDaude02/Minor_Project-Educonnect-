import { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiBookOpen,
  FiBriefcase,
  FiChevronDown,
  FiChevronRight,
  FiHelpCircle,
  FiLogOut,
  FiMenu,
  FiMessageCircle,
  FiSearch,
  FiSettings,
  FiShield,
  FiUser,
  FiUsers,
  FiX,
  FiBell,
  FiHome,
} from "react-icons/fi";
import { AuthContext } from "../context/authContext";

const MainNavbar = () => {
  const { setIsLogging } = useContext(AuthContext);
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  });

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const profileRef = useRef(null);

  // Refresh profile information if the stored user changes.
  useEffect(() => {
    const readUser = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("user")) || {});
      } catch {
        setUser({});
      }
    };

    window.addEventListener("storage", readUser);
    return () => window.removeEventListener("storage", readUser);
  }, []);

  // Close the profile menu when clicking outside it.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fullName = user.fullName || user.name || user.username || "Student";

  const email = user.email || "";

  // Support common profile image property names.
  const avatar =
    user.profilepic ||
    user.profilePic ||
    user.avatar ||
    user.profileImage ||
    user.image ||
    "";

  const initials = fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const navItems = [
    { label: "Home", path: "/educonnect", icon: FiHome, end: true },
    { label: "Community", path: "/educonnect/community", icon: FiUsers },
    {
      label: "Study Materials",
      path: "/educonnect/study-materials",
      icon: FiBookOpen,
    },
    {
      label: "Jobs & Internships",
      path: "/educonnect/jobs",
      icon: FiBriefcase,
    },
    {
      label: "Messages",
      path: "/educonnect/message",
      icon: FiMessageCircle,
      badge: 3,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setIsLogging(false);
    setProfileOpen(false);
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? "bg-emerald-50 text-emerald-700"
        : "text-slate-600 hover:bg-slate-50 hover:text-emerald-700"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <NavLink
          to="/educonnect"
          className="flex shrink-0 items-center gap-3"
          onClick={() => setMobileOpen(false)}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <FiBookOpen size={25} />
          </div>

          <div className="hidden sm:block">
            <h1 className="text-[23px] font-bold tracking-tight text-slate-900">
              Edu<span className="text-emerald-600">connect</span>
            </h1>
            <p className="-mt-1 text-xs tracking-wide text-slate-500">
              Learn · Share · Grow
            </p>
          </div>
        </NavLink>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 xl:flex">
          {navItems.map(({ label, path, icon: Icon, badge, end }) => (
            <NavLink key={label} to={path} end={end} className={linkClass}>
              <span className="relative">
                <Icon size={19} />
                {badge && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                    {badge}
                  </span>
                )}
              </span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Search */}
        <form
          className="hidden max-w-57.5 flex-1 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-emerald-500 focus-within:bg-white lg:flex"
          onSubmit={(event) => {
            event.preventDefault();
            if (search.trim()) {
              navigate(
                `/educonnect/search?q=${encodeURIComponent(search.trim())}`,
              );
            }
          }}
        >
          <FiSearch className="shrink-0 text-slate-400" size={19} />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search anything..."
            aria-label="Search Educonnect"
            className="w-full bg-transparent px-2.5 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </form>

        {/* Notifications and profile */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/educonnect/notifications")}
            aria-label="Notifications"
            className="relative hidden h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700 sm:flex"
          >
            <FiBell size={21} />
          </button>

          <div className="hidden h-8 w-px bg-slate-200 sm:block" />

          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((previous) => !previous)}
              aria-expanded={profileOpen}
              aria-label="Open profile menu"
              className="flex items-center gap-2.5 rounded-xl p-1.5 transition hover:bg-slate-50"
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt={`${fullName}'s profile`}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                  className="h-10 w-10 rounded-full border-2 border-emerald-500 object-cover"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-50 text-sm font-bold text-emerald-700">
                  {initials || "U"}
                </span>
              )}

              <span className="hidden max-w-28.75 text-left xl:block">
                <span className="block truncate text-sm font-semibold text-slate-800">
                  {fullName}
                </span>
                <span className="block text-xs text-slate-500">My account</span>
              </span>

              <FiChevronDown
                size={17}
                className={`hidden text-slate-500 transition-transform xl:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-72.5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
                {/* User information */}
                <div className="border-b border-slate-100 px-4 py-4">
                  <div className="flex items-center gap-3">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={fullName}
                        className="h-12 w-12 rounded-full border border-slate-200 object-cover"
                      />
                    ) : (
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 font-bold text-emerald-700">
                        {initials || "U"}
                      </span>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {fullName}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {email || "Welcome to Educonnect"}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-emerald-700">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Logged in
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account links */}
                <div className="p-2">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/educonnect/profile");
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <FiUser size={18} />
                    My Profile
                    <FiChevronRight className="ml-auto" size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/educonnect/study-materials");
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <FiBookOpen size={18} />
                    Study Materials
                    <FiChevronRight className="ml-auto" size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/educonnect/settings");
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <FiSettings size={18} />
                    Settings
                  </button>
                </div>

                <div className="mx-4 border-t border-slate-100" />

                <div className="p-2">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/educonnect/help");
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <FiHelpCircle size={18} />
                    Help & Support
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/educonnect/privacy");
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <FiShield size={18} />
                    Privacy Policy
                  </button>
                </div>

                <div className="mx-4 border-t border-slate-100" />

                <div className="p-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                  >
                    <FiLogOut size={18} />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((previous) => !previous)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100 xl:hidden"
          >
            {mobileOpen ? <FiX size={23} /> : <FiMenu size={23} />}
          </button>
        </div>
      </div>

      {/* Responsive mobile navigation */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 shadow-lg xl:hidden">
          <form
            className="mb-3 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3"
            onSubmit={(event) => {
              event.preventDefault();
              if (search.trim()) {
                navigate(
                  `/educonnect/search?q=${encodeURIComponent(search.trim())}`,
                );
                setMobileOpen(false);
              }
            }}
          >
            <FiSearch className="text-slate-400" size={19} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search Educonnect..."
              className="w-full bg-transparent px-2.5 py-3 text-sm outline-none"
            />
          </form>

          <nav className="grid gap-1">
            {navItems.map(({ label, path, icon: Icon, badge, end }) => (
              <NavLink
                key={label}
                to={path}
                end={end}
                onClick={() => setMobileOpen(false)}
                className={linkClass}
              >
                <Icon size={19} />
                {label}
                {badge && (
                  <span className="ml-auto rounded-full bg-rose-500 px-2 py-0.5 text-xs text-white">
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default MainNavbar;
