import React, { useCallback, useContext, useEffect, useState } from "react";
import api from "../api";
import { AuthContext } from "../App";
const errorText = e => e?.response?.data?.message || "Could not complete the connection request.";
export default function Network() {
  const { user } = useContext(AuthContext);
  const [users,setUsers]=useState([]); const [connections,setConnections]=useState([]); const [q,setQ]=useState(""); const [loading,setLoading]=useState(false); const [error,setError]=useState(""); const [notice,setNotice]=useState("");
  const load=useCallback(async()=>{setLoading(true);setError("");try{const [u,c]=await Promise.all([api.get("/users",{params:{q:q.trim()}}),api.get("/connections")]);setUsers(Array.isArray(u.data)?u.data:(u.data.users||[]));setConnections(Array.isArray(c.data)?c.data:[]);}catch(e){setError(errorText(e));}finally{setLoading(false);}},[q]);
  useEffect(()=>{load();},[load]);
  const send=async id=>{setError("");try{await api.post(`/connections/${id}`);setNotice("Connection request sent.");await load();}catch(e){setError(errorText(e));}};
  const respond=async(id,status)=>{setError("");try{await api.patch(`/connections/${id}`,{status});setNotice(status==="accepted"?"Connection accepted.":"Request declined.");await load();}catch(e){setError(errorText(e));}};
  const stateFor=id=>connections.find(c=>(c.sender?._id===id||c.receiver?._id===id));
  const incoming=connections.filter(c=>c.status==="pending"&&String(c.receiver?._id)===String(user?._id));
  return <div className="content"><header className="page-head"><div><span className="eyebrow">YOUR COMMUNITY</span><h1>Network</h1><p>Meet people who share your interests, build connections, and learn from each other.</p></div></header>
    {error&&<div className="error page-alert" role="alert">{error}</div>}{notice&&<div className="success page-alert" role="status">{notice}</div>}
    <div className="card filter network-search"><div className="search-field"><span>⌕</span><input placeholder="Search people, skills or universities…" value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&load()}/></div><button className="primary" onClick={load}>Find people</button></div>
    <div className="section-title-row"><h2>People you may know</h2><span>{users.length} profiles</span></div>
    {loading?<div className="card state-card"><div className="spinner"/>Finding people…</div>:users.length===0?<div className="card state-card"><div className="state-icon">♧</div><h3>No profiles found</h3><p>Try another search term or check back later.</p></div>:<div className="grid cards network-grid">{users.map(u=>{const c=stateFor(u._id);return <article className="card person network-person" key={u._id}><div className="avatar big">{u.name?.[0]?.toUpperCase()||"U"}</div><h3>{u.name||"EduConnect member"}</h3><span className="tag">{u.role||"Member"}</span><p>{u.university||"University not provided"}</p>{u.bio&&<p className="muted">{u.bio}</p>}{!c?<button className="primary" onClick={()=>send(u._id)}>＋ Connect</button>:<span className={`connection-state ${c.status}`}>{c.status==="pending"?"Request pending":c.status==="accepted"?"✓ Connected":"Request declined"}</span>}</article>;})}</div>}
    <div className="section-title-row request-title"><h2>Connection requests</h2><span>Review incoming requests</span></div>
    {incoming.length===0?<div className="card muted request-empty">You're all caught up — no pending connection requests.</div>:incoming.map(c=><div className="card request" key={c._id}><div className="request-person"><span className="avatar">{c.sender?.name?.[0]?.toUpperCase()||"U"}</span><div><b>{c.sender?.name||"A member"}</b><small>{c.sender?.university||c.sender?.role||"EduConnect member"}</small></div></div><div className="request-actions"><button className="primary small" onClick={()=>respond(c._id,"accepted")}>Accept</button><button className="button" onClick={()=>respond(c._id,"rejected")}>Decline</button></div></div>)}
  </div>;
}
