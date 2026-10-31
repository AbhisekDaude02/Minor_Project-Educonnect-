import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../api";
import { AuthContext } from "../App";

const blankForm = { title: "", company: "", description: "", location: "Remote", type: "Internship", skills: "", deadline: "" };
const messageOf = (e, fallback) => e?.response?.data?.message || e?.message || fallback;

export default function Jobs() {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [applications, setApplications] = useState([]);
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const [tab, setTab] = useState("browse");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(blankForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadBrowse = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const params = { q: q.trim(), ...(type !== "All" ? { type } : {}) };
      const { data } = await api.get("/jobs", { params });
      const list = Array.isArray(data) ? data : (data.jobs || data.opportunities || []);
      setItems(Array.isArray(list) ? list : []);
    } catch (e) { setError(messageOf(e, "Could not load jobs and internships. Check that the backend is running and you are logged in.")); }
    finally { setLoading(false); }
  }, [q, type]);

  const loadMine = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const endpoint = user?.role === "Professional" ? "/jobs/mine" : "/jobs/applications/mine";
      const { data } = await api.get(endpoint);
      if (user?.role === "Professional") setItems(Array.isArray(data) ? data : []);
      else setApplications(Array.isArray(data) ? data : []);
    } catch (e) { setError(messageOf(e, "Could not load your records.")); }
    finally { setLoading(false); }
  }, [user?.role]);

  useEffect(() => { if (tab === "browse") loadBrowse(); else if (tab === "mine") loadMine(); }, [tab, loadBrowse, loadMine]);

  const visibleItems = useMemo(() => items, [items]);
  const setField = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const create = async e => {
    e.preventDefault(); setSaving(true); setError(""); setNotice("");
    try {
      await api.post("/jobs", { ...form, skills: form.skills.split(",").map(s => s.trim()).filter(Boolean), deadline: form.deadline || undefined });
      setForm(blankForm); setShowForm(false); setType("All"); setTab("browse"); setNotice("Your opportunity has been published.");
      await loadBrowse();
    } catch (e) { setError(messageOf(e, "Could not publish this opportunity.")); }
    finally { setSaving(false); }
  };

  const apply = async id => {
    const coverLetter = window.prompt("Add a short cover letter (optional):");
    if (coverLetter === null) return;
    setError(""); setNotice("");
    try { await api.post(`/jobs/${id}/apply`, { coverLetter }); setNotice("Application submitted successfully."); }
    catch (e) { setError(messageOf(e, "Could not submit your application.")); }
  };

  const updateApplication = async (jobId, applicationId, status) => {
    try {
      await api.patch(`/jobs/${jobId}/applications/${applicationId}`, { status });
      setNotice(`Application marked ${status.toLowerCase()}.`); await loadMine();
    } catch (e) { setError(messageOf(e, "Could not update application status.")); }
  };

  const removeOpportunity = async id => {
    if (!window.confirm("Delete this opportunity? This cannot be undone.")) return;
    try { await api.delete(`/jobs/${id}`); setNotice("Opportunity deleted."); await loadMine(); }
    catch (e) { setError(messageOf(e, "Could not delete opportunity.")); }
  };

  return <div className="content">
    <header className="page-head"><div><span className="eyebrow">CAREER CENTER</span><h1>Jobs & Internships</h1><p>Discover your next opportunity, or connect great talent with meaningful work.</p></div>
      {user?.role === "Professional" && <button className="primary" onClick={() => setShowForm(v => !v)}>{showForm ? "Close form" : "+ Post opportunity"}</button>}
    </header>
    {error && <div className="error page-alert" role="alert">{error}</div>}{notice && <div className="success page-alert" role="status">{notice}</div>}
    {showForm && user?.role === "Professional" && <form className="card opportunity-form" onSubmit={create}>
      <h2>Publish an opportunity</h2><p className="muted">Add clear details so candidates know whether the role is right for them.</p>
      <div className="grid two"><label>Title<input name="title" placeholder="e.g. Frontend Developer Intern" required maxLength="160" value={form.title} onChange={setField}/></label>
      <label>Company / organization<input name="company" placeholder="Organization name" required maxLength="160" value={form.company} onChange={setField}/></label>
      <label>Opportunity type<select name="type" value={form.type} onChange={setField}><option>Internship</option><option>Job</option></select></label>
      <label>Location<input name="location" placeholder="Remote / Kathmandu" value={form.location} onChange={setField}/></label>
      <label>Required skills<input name="skills" placeholder="React, JavaScript, teamwork" value={form.skills} onChange={setField}/></label>
      <label>Application deadline<input name="deadline" type="date" min={new Date().toISOString().slice(0,10)} value={form.deadline} onChange={setField}/></label></div>
      <label>Description<textarea name="description" placeholder="Responsibilities, requirements, duration and what candidates will learn..." required maxLength="5000" value={form.description} onChange={setField}/></label>
      <button className="primary" disabled={saving}>{saving ? "Publishing…" : "Publish opportunity"}</button>
    </form>}

    <div className="section-tabs" role="tablist" aria-label="Opportunity sections">
      <button className={tab === "browse" ? "selected" : ""} onClick={() => setTab("browse")}>Explore opportunities</button>
      <button className={tab === "mine" ? "selected" : ""} onClick={() => setTab("mine")}>{user?.role === "Professional" ? "My postings" : "My applications"}</button>
    </div>

    {tab === "browse" && <>
      <div className="card opportunity-search"><div className="search-field"><span>⌕</span><input aria-label="Search opportunities" placeholder="Search title, company, skills or location…" value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === "Enter" && loadBrowse()}/></div>
        <select aria-label="Filter by opportunity type" value={type} onChange={e => setType(e.target.value)}><option value="All">All opportunities</option><option value="Internship">Internships</option><option value="Job">Jobs</option></select><button className="primary" onClick={loadBrowse}>Search</button>
      </div>
      {loading ? <div className="card state-card"><div className="spinner"/>Loading opportunities…</div> : visibleItems.length === 0 ? <div className="card state-card"><div className="state-icon">✦</div><h3>No opportunities found</h3><p>Try another keyword or filter, or check back soon for new roles.</p></div> : <div className="opportunity-list">{visibleItems.map(j => <article className="card opportunity-card" key={j._id}>
        <div className="opportunity-icon">{j.type === "Internship" ? "↗" : "▣"}</div><div className="opportunity-body"><div className="opportunity-meta"><span className={`tag ${j.type === "Job" ? "tag-teal" : ""}`}>{j.type || "Opportunity"}</span>{j.deadline && <span className="deadline">Deadline {new Date(j.deadline).toLocaleDateString()}</span>}</div>
          <h2>{j.title || "Untitled opportunity"}</h2><div className="company-line">{j.company || "Organization"} <span>·</span> {j.location || "Location not specified"}</div><p>{j.description || "No description provided."}</p>
          {!!(Array.isArray(j.skills) && j.skills.length) && <div className="skill-tags">{j.skills.map(s => <span key={s}>{s}</span>)}</div>}
          <div className="opportunity-footer"><small>Posted by {j.postedBy?.name || "EduConnect member"}</small>{user?.role === "Student" && <button className="primary" onClick={() => apply(j._id)}>Apply now <span aria-hidden="true">→</span></button>}</div>
        </div></article>)}</div>}
    </>}

    {tab === "mine" && (loading ? <div className="card state-card"><div className="spinner"/>Loading your records…</div> : user?.role === "Professional" ? (items.length ? <div className="opportunity-list">{items.map(j => <article className="card opportunity-card" key={j._id}><div className="opportunity-icon">{j.type === "Internship" ? "↗" : "▣"}</div><div className="opportunity-body"><div className="opportunity-meta"><span className="tag">{j.type}</span><span className="muted">{j.applications?.length || 0} application(s)</span></div><h2>{j.title}</h2><div className="company-line">{j.company} · {j.location || "Remote"}</div><p>{j.description}</p><div className="application-list"><h3>Applicants</h3>{(j.applications || []).length === 0 ? <p className="muted">No applications yet.</p> : j.applications.map(a => <div className="application-row" key={a._id}><div><b>{a.student?.name || "Student"}</b><small>{a.student?.university || "University not provided"} · {a.status || "Applied"}</small>{a.coverLetter && <p>{a.coverLetter}</p>}</div><select value={a.status || "Applied"} onChange={e => updateApplication(j._id, a._id, e.target.value)} aria-label={`Status for ${a.student?.name || "applicant"}`}><option>Applied</option><option>Shortlisted</option><option>Rejected</option><option>Accepted</option></select></div>)}</div><button className="button danger-button" onClick={() => removeOpportunity(j._id)}>Delete posting</button></div></article>)}</div> : <div className="card state-card"><div className="state-icon">▤</div><h3>No postings yet</h3><p>Publish your first job or internship and manage applications here.</p><button className="primary" onClick={() => setShowForm(true)}>Post an opportunity</button></div>) : (applications.length ? <div className="opportunity-list">{applications.map(a => {const j = a.opportunity || {}; return <article className="card opportunity-card" key={a._id}><div className="opportunity-icon">↗</div><div className="opportunity-body"><div className="opportunity-meta"><span className="tag">{j.type || "Application"}</span><span className={`status-pill status-${String(a.status || "Applied").toLowerCase()}`}>{a.status || "Applied"}</span></div><h2>{j.title || "Opportunity"}</h2><div className="company-line">{j.company || "Organization"} · {j.location || "Location not specified"}</div><p>{j.description || ""}</p><small>Applied {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "recently"}</small></div></article>;})}</div> : <div className="card state-card"><div className="state-icon">✦</div><h3>No applications yet</h3><p>Find an opportunity that matches your interests and submit an application.</p><button className="primary" onClick={() => setTab("browse")}>Explore opportunities</button></div>))}
  </div>;
}
