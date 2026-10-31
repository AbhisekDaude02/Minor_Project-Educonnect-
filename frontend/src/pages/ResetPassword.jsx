import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api";
export default function ResetPassword(){
 const [params]=useSearchParams();const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [message,setMessage]=useState("");const [error,setError]=useState("");const token=params.get("token");
 const submit=async e=>{e.preventDefault();setMessage("");setError("");try{const r=token?await api.post("/auth/reset-password",{token,password}):await api.post("/auth/forgot-password",{email});setMessage(r.data.message)}catch(err){setError(err.response?.data?.message||"Request failed")}};
 return <div className="auth-page"><form className="auth-card" onSubmit={submit}><div className="brand center">Edu<span>Connect</span></div><h1>{token?"Choose a new password":"Forgot password?"}</h1>{message&&<div className="success">{message}</div>}{error&&<div className="error">{error}</div>}{token?<input type="password" placeholder="New password (8+ characters)" minLength="8" maxLength="128" required value={password} onChange={e=>setPassword(e.target.value)}/>:<input type="email" placeholder="Your registered email" required value={email} onChange={e=>setEmail(e.target.value)}/>}<button className="primary">{token?"Reset password":"Send reset instructions"}</button><p className="center"><Link to="/login">Back to login</Link></p></form></div>;
}
