import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
const errorText = e => e?.response?.data?.message || "Could not load notifications.";
export default function Notifications() {
  const [items,setItems]=useState([]); const [unread,setUnread]=useState(0); const [loading,setLoading]=useState(true); const [error,setError]=useState("");
  const load=useCallback(async()=>{setLoading(true);setError("");try{const {data}=await api.get("/notifications");setItems(Array.isArray(data.notifications)?data.notifications:[]);setUnread(Number(data.unread)||0);}catch(e){setError(errorText(e));}finally{setLoading(false);}},[]);
  useEffect(()=>{load();},[load]);
  const markRead=async id=>{try{await api.patch(`/notifications/${id}/read`);setItems(old=>old.map(n=>n._id===id?{...n,readAt:new Date().toISOString()}:n));setUnread(n=>Math.max(0,n-1));}catch(e){setError(errorText(e));}};
  const markAll=async()=>{try{await api.patch("/notifications/read-all");setItems(old=>old.map(n=>({...n,readAt:n.readAt||new Date().toISOString()})));setUnread(0);}catch(e){setError(errorText(e));}};
  return <div className="content"><header className="page-head"><div><span className="eyebrow">STAY IN THE LOOP</span><h1>Notifications</h1><p>Updates about your connections, messages, and career activity.</p></div>{unread>0&&<button className="primary" onClick={markAll}>Mark all as read</button>}</header>
    {error&&<div className="error page-alert" role="alert">{error}</div>}{loading?<div className="card state-card">Loading notifications…</div>:items.length===0?<div className="card state-card"><div className="state-icon">♧</div><h3>You're all caught up</h3><p>Important activity will appear here when it happens.</p></div>:<div className="notification-list">{items.map(n=><article className={`card notification-item ${n.readAt?"read":"unread"}`} key={n._id}><span className="notification-symbol">{n.type==="message"?"✉":n.type?.includes("application")?"↗":n.type?.includes("connection")?"♧":"✦"}</span><div className="notification-copy"><b>{n.actor?.name||"EduConnect"}</b><p>{n.message||"You have a new notification."}</p><small>{n.createdAt?new Date(n.createdAt).toLocaleString():"Recently"}</small>{n.link&&<Link to={n.link.startsWith("/jobs")?"/jobs":n.link.startsWith("/messages")?"/messages":"/notifications"}>View activity →</Link>}</div>{!n.readAt&&<button className="button" onClick={()=>markRead(n._id)}>Mark read</button>}</article>)}</div>}
  </div>;
}
