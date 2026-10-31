import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../App";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const submit = async e => {
    e.preventDefault(); setError(""); setBusy(true);
    try { login((await api.post("/auth/login", form)).data); }
    catch (err) { setError(err.response?.data?.message || "We couldn't sign you in. Check your connection and try again."); }
    finally { setBusy(false); }
  };
  return <main className="auth-page auth-dark">
    <div className="auth-orb orb-one"/><div className="auth-orb orb-two"/>
    <section className="auth-showcase"><div className="lamp-scene"><div className="lamp-rope"/><button type="button" className="lamp" aria-label="Toggle warm lamp light" onClick={e=>e.currentTarget.closest(".auth-showcase").classList.toggle("lamp-on")}><span/></button></div><Link to="/login" className="auth-brand"><span className="brand-mark">E</span><span>Edu<span className="brand-accent">Connect</span></span></Link>
      <div className="showcase-copy"><span className="eyebrow bright">YOUR NEXT CHAPTER STARTS HERE</span><h2>Where ambition<br/>finds its <span>community.</span></h2><p>Build meaningful connections, discover opportunities, and turn what you learn into what comes next.</p>
        <div className="showcase-points"><div><span>✦</span><div><b>Learn together</b><small>Share knowledge that moves everyone forward.</small></div></div><div><span>↗</span><div><b>Grow with purpose</b><small>Find internships and people who open doors.</small></div></div></div>
      </div><div className="showcase-foot">A better future is built together. <span>© EduConnect</span></div>
    </section>
    <section className="auth-form-wrap"><form className="auth-card auth-card-dark" onSubmit={submit}>
      <div className="mobile-auth-brand"><span className="brand-mark">E</span> Edu<span className="brand-accent">Connect</span></div>
      <span className="eyebrow">WELCOME BACK</span><h1>Sign in to your space</h1><p className="auth-subtitle">Pick up where your journey left off.</p>
      {error && <div className="error auth-error" role="alert">{error}</div>}
      <label className="auth-label" htmlFor="login-email">Email address</label><input id="login-email" className="auth-input" placeholder="you@example.com" type="email" autoComplete="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}/>
      <div className="password-label-row"><label className="auth-label" htmlFor="login-password">Password</label><Link to="/reset-password">Forgot password?</Link></div>
      <div className="password-wrap"><input id="login-password" className="auth-input" placeholder="Enter your password" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}/><button type="button" className="password-toggle" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button></div>
      <button className="primary auth-submit" disabled={busy}>{busy ? <><span className="button-spinner"/> Signing in…</> : <>Sign in <span>→</span></>}</button>
      <div className="auth-divider"><span>NEW TO EDUCONNECT?</span></div><Link className="create-account" to="/register">Create your account <span>↗</span></Link>
      <p className="auth-terms">By continuing, you agree to use EduConnect respectfully and responsibly.</p>
    </form><p className="mobile-copyright">© EduConnect · Connect. Learn. Grow.</p></section>
  </main>;
}
