import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api";
export default function VerifyEmail(){
 const [params]=useSearchParams(); const [status,setStatus]=useState("Verifying your email…"); const [error,setError]=useState(false);
 useEffect(()=>{const token=params.get("token");if(!token){setStatus("Verification token is missing.");setError(true);return;}api.post("/auth/verify-email",{token}).then(r=>setStatus(r.data.message||"Email verified successfully.")).catch(e=>{setStatus(e.response?.data?.message||"Could not verify email.");setError(true)});},[params]);
 return <div className="auth-page auth-dark verify-stage"><div className="auth-card auth-card-dark verify-glass"><div className="brand center">Edu<span>Connect</span></div><h1>Email verification</h1><p className={error?"error":"success"}>{status}</p><p className="center"><Link to="/login">Continue to login</Link></p></div></div>;
}
