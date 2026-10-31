import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Register() {
  const [form,setForm]=useState({name:"",email:"",password:"",role:"Student",university:"",bio:""});
  const [error,setError]=useState(""); const [message,setMessage]=useState(""); const [devToken,setDevToken]=useState("");
  const submit=async e=>{e.preventDefault();setError("");setMessage("");setDevToken("");try{const {data}=await api.post("/auth/register",form);setMessage(data.message || "Account created. Follow the verification instructions.");if(data.developmentVerificationToken)setDevToken(data.developmentVerificationToken);}catch(err){setError(err.response?.data?.message||"Registration failed")}};
  const change=e=>setForm({...form,[e.target.name]:e.target.value});
  return <div className="auth-page"><form className="auth-card wide" onSubmit={submit}>
    <div className="brand center">Edu<span>Connect</span></div><h1>Create your account</h1>
    {error&&<div className="error">{error}</div>}{message&&<div className="success">{message}</div>}
    {devToken&&<div className="notice"><strong>Development verification token</strong><p style={{wordBreak:"break-all"}}>{devToken}</p><Link to={`/verify-email?token=${encodeURIComponent(devToken)}`}>Verify this account</Link></div>}
    <input name="name" placeholder="Full name" required maxLength="100" value={form.name} onChange={change}/>
    <input name="email" type="email" placeholder="Email" required value={form.email} onChange={change}/>
    <input name="password" type="password" placeholder="Password (8 characters minimum)" minLength="8" maxLength="128" required value={form.password} onChange={change}/>
    <select name="role" value={form.role} onChange={change}><option>Student</option><option>Professional</option></select>
    <input name="university" placeholder="University / Organization" value={form.university} onChange={change}/>
    <textarea name="bio" placeholder="Short bio" value={form.bio} onChange={change}/>
    <button className="primary">Register</button><p className="center">Already registered? <Link to="/login">Login</Link></p>
  </form></div>;
}
