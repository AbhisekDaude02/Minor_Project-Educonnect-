import React, { useCallback, useEffect, useState } from "react";
import api, { FILE_URL } from "../api";

const errorText = e => e?.response?.data?.message || "Unable to complete that resource request. Please try again.";
export default function Resources() {
  const [data, setData] = useState({ resources: [], total: 0 });
  const [filters, setFilters] = useState({ q: "", subject: "", university: "", category: "" });
  const [form, setForm] = useState({ title: "", description: "", subject: "", university: "", category: "Notes", file: null });
  const [loading, setLoading] = useState(false); const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(""); const [notice, setNotice] = useState("");
  const load = useCallback(async () => { setLoading(true); setError(""); try { const { data: result } = await api.get("/resources", { params: filters }); setData({ resources: Array.isArray(result) ? result : (result.resources || []), total: result.total || 0 }); } catch (e) { setError(errorText(e)); } finally { setLoading(false); } }, [filters]);
  useEffect(() => { load(); }, [load]);
  const submit = async e => { e.preventDefault(); setUploading(true); setError(""); setNotice(""); try { const fd = new FormData(); Object.entries(form).forEach(([k,v]) => { if (v !== null && v !== "") fd.append(k,v); }); await api.post("/resources", fd); setForm({ title:"", description:"", subject:"", university:"", category:"Notes", file:null }); setNotice("Resource uploaded successfully."); await load(); } catch (e) { setError(errorText(e)); } finally { setUploading(false); } };
  return <div className="content"><header className="page-head"><div><span className="eyebrow">KNOWLEDGE LIBRARY</span><h1>Academic Resources</h1><p>Find notes, guides and question papers shared by your community.</p></div></header>
    {error && <div className="error page-alert" role="alert">{error}</div>}{notice && <div className="success page-alert" role="status">{notice}</div>}
    <div className="grid two resource-layout"><form className="card resource-upload" onSubmit={submit}><h2>Share a resource</h2><p className="muted">Help someone else learn a little faster.</p>
      <label>Resource title<input placeholder="e.g. Data Structures — Unit 3 Notes" required maxLength="200" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label>
      <label>Description<textarea placeholder="What does this resource cover?" maxLength="2000" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label>
      <label>Subject<input placeholder="e.g. Computer Networks" required value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}/></label>
      <label>University / institution<input placeholder="Optional" value={form.university} onChange={e=>setForm({...form,university:e.target.value})}/></label>
      <label>Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{["Notes","Guide","Question Paper","Other"].map(x=><option key={x}>{x}</option>)}</select></label>
      <label className="file-picker">Choose file<input type="file" required accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.png,.jpg,.jpeg" onChange={e=>setForm({...form,file:e.target.files?.[0] || null})}/><small>{form.file ? form.file.name : "PDF, DOC, PPT, TXT or image · max 15 MB"}</small></label>
      <button className="primary" disabled={uploading}>{uploading ? "Uploading…" : "Upload resource"}</button>
    </form>
    <section className="resource-results"><div className="card resource-filter"><div className="search-field"><span>⌕</span><input placeholder="Search titles and topics…" value={filters.q} onChange={e=>setFilters({...filters,q:e.target.value})} onKeyDown={e=>e.key==="Enter"&&(e.preventDefault(),load())}/></div><div className="grid two"><input placeholder="Subject" value={filters.subject} onChange={e=>setFilters({...filters,subject:e.target.value})}/><input placeholder="University" value={filters.university} onChange={e=>setFilters({...filters,university:e.target.value})}/></div><select value={filters.category} onChange={e=>setFilters({...filters,category:e.target.value})}><option value="">All categories</option>{["Notes","Guide","Question Paper","Other"].map(x=><option key={x}>{x}</option>)}</select><button className="primary" onClick={load}>Apply filters</button></div>
      <div className="results-heading"><h2>Shared materials</h2><span>{data.total} resources</span></div>
      {loading ? <div className="card state-card"><div className="spinner"/>Loading resources…</div> : data.resources.length===0 ? <div className="card state-card"><div className="state-icon">▤</div><h3>No resources found</h3><p>Try broadening your filters, or be the first to share useful study material.</p></div> : data.resources.map(r=><article className="card resource resource-card" key={r._id}><div className="resource-file-icon">PDF</div><div className="resource-details"><span className="tag">{r.category || "Resource"}</span><h3>{r.title}</h3><p>{r.description || "No description provided."}</p><small>{r.subject || "General"} · {r.university || "Any institution"} · by {r.uploadedBy?.name || "Community member"}</small></div><a className="button" href={`${FILE_URL}${r.fileUrl}`} target="_blank" rel="noreferrer">Download ↗</a></article>)}
    </section></div>
  </div>;
}
