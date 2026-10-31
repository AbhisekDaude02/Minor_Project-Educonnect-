import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import Resources from "./pages/Resources";
import Jobs from "./pages/Jobs";
import Network from "./pages/Network";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import VerifyEmail from "./pages/VerifyEmail";
import ResetPassword from "./pages/ResetPassword";
import Notifications from "./pages/Notifications";
import About from "./pages/About";

export const AuthContext = React.createContext(null);

function Layout({ children }) {
  const { user, logout } = React.useContext(AuthContext);
  const location = useLocation();
  if (!user) return children;
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand">Edu<span>Connect</span></div>
      <p className="role">{user.role}</p>
      <nav>
        {[["/","🏠 Feed"],["/resources","📚 Resources"],["/jobs","💼 Jobs & Internships"],["/network","🤝 Network"],["/messages","💬 Messages"],["/notifications","🔔 Notifications"],["/profile","👤 Profile"],["/about","✦ About us"]].map(([to,label]) =>
          <Link className={location.pathname===to?"active":""} key={to} to={to}>{label}</Link>
        )}
      </nav>
      <div className="sidebar-bottom"><div className="sidebar-status"><i/> SYSTEM ONLINE</div><button className="logout" onClick={logout}>↗ &nbsp; Logout</button></div>
    </aside>
    <main className="main">{children}</main>
  </div>;
}

function Protected({ children }) {
  const { user } = React.useContext(AuthContext);
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
}

export default function App() {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { localStorage.removeItem("user"); return null; } });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      auth: { token: localStorage.getItem("token") }
    });
    socket.on("message:new", () => window.dispatchEvent(new Event("educonnect:new-message")));
    return () => socket.disconnect();
  }, [user]);

  const login = (data) => {
    if (!data?.token || !data?.user) throw new Error("The server returned an incomplete login response.");
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    navigate("/");
  };
  const logout = () => {
    localStorage.clear(); setUser(null); navigate("/login");
  };

  return <AuthContext.Provider value={{ user, setUser, login, logout }}>
    <Routes>
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
      <Route path="/" element={<Protected><Feed /></Protected>} />
      <Route path="/resources" element={<Protected><Resources /></Protected>} />
      <Route path="/jobs" element={<Protected><Jobs /></Protected>} />
      <Route path="/network" element={<Protected><Network /></Protected>} />
      <Route path="/messages" element={<Protected><Messages /></Protected>} />
      <Route path="/notifications" element={<Protected><Notifications /></Protected>} />
      <Route path="/profile" element={<Protected><Profile /></Protected>} />
      <Route path="/about" element={<Protected><About /></Protected>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </AuthContext.Provider>;
}
