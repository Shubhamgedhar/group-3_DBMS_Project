import { useState, useEffect } from "react";

// ─── INITIAL DATA (mirrors SQL tables from report) ───────────────────────────
const initStudents = [
  { roll_no: "102303001", name: "Arunima Pillai",  department: "ECE", room_no: "A118", year: "2nd", contact_no: "08047634956", email: "arunima.pillai@tiet.ac.in",  date_joined: "2023-08-01", status: "Active" },
  { roll_no: "102303002", name: "Saurabh Iyer",    department: "EE",  room_no: "A102", year: "2nd", contact_no: "08756430850", email: "saurabh.iyer@tiet.ac.in",    date_joined: "2021-08-22", status: "Active" },
  { roll_no: "102303003", name: "Deepak Gokhale",  department: "ME",  room_no: "C313", year: "1st", contact_no: "08936142177", email: "deepak.gokhale@tiet.ac.in",  date_joined: "2023-03-12", status: "Active" },
  { roll_no: "102303004", name: "Sujata Pandey",   department: "BT",  room_no: "C302", year: "4th", contact_no: "09116572074", email: "sujata.pandey@tiet.ac.in",   date_joined: "2022-06-24", status: "Active" },
  { roll_no: "102303006", name: "Rajeev Thomas",   department: "ECE", room_no: "C304", year: "3rd", contact_no: "08076246055", email: "rajeev.thomas@tiet.ac.in",   date_joined: "2022-12-28", status: "Active" },
];

const initRooms = [
  { room_no: "A102", capacity: 2, status: "Occupied",    floor: 1, room_type: "Double" },
  { room_no: "A118", capacity: 1, status: "Occupied",    floor: 1, room_type: "Single" },
  { room_no: "B201", capacity: 4, status: "Vacant",      floor: 2, room_type: "Quad"   },
  { room_no: "C302", capacity: 2, status: "Occupied",    floor: 3, room_type: "Double" },
  { room_no: "C304", capacity: 2, status: "Occupied",    floor: 3, room_type: "Double" },
  { room_no: "C313", capacity: 3, status: "Occupied",    floor: 3, room_type: "Triple" },
  { room_no: "D401", capacity: 1, status: "Maintenance", floor: 4, room_type: "Single" },
  { room_no: "D402", capacity: 2, status: "Vacant",      floor: 4, room_type: "Double" },
];

const initFees = [
  { fee_id: 1, roll_no: "102303001", amount: 50000, due_date: "2025-06-30", payment_date: "2025-05-10", status: "Paid",   receipt_number: "REC-001" },
  { fee_id: 2, roll_no: "102303002", amount: 50000, due_date: "2025-06-30", payment_date: null,         status: "Unpaid", receipt_number: null },
  { fee_id: 3, roll_no: "102303003", amount: 50000, due_date: "2025-06-30", payment_date: null,         status: "Unpaid", receipt_number: null },
  { fee_id: 4, roll_no: "102303004", amount: 50000, due_date: "2025-06-30", payment_date: "2025-04-20", status: "Paid",   receipt_number: "REC-002" },
  { fee_id: 5, roll_no: "102303006", amount: 50000, due_date: "2025-06-30", payment_date: null,         status: "Partial",receipt_number: null },
];

const initStaff = [
  { staff_id: 1, name: "Harpreet Singh",  position: "Warden",    contact_no: "09876543210", salary: 45000, join_date: "2018-03-01" },
  { staff_id: 2, name: "Meena Devi",      position: "Caretaker", contact_no: "09765432109", salary: 28000, join_date: "2019-06-15" },
  { staff_id: 3, name: "Ramesh Kumar",    position: "Cleaner",   contact_no: "09654321098", salary: 18000, join_date: "2020-01-10" },
  { staff_id: 4, name: "Sunita Sharma",   position: "Security",  contact_no: "09543210987", salary: 22000, join_date: "2021-07-20" },
];

const initComplaints = [
  { complaint_id: 21, roll_no: "102303053", complaint: "232ewree",    type: "Maintenance", severity: "Medium", status: "Pending",  date_logged: "2025-05-20T16:48:00", date_resolved: null, resolution_notes: "" },
  { complaint_id: 22, roll_no: "102303028", complaint: "qwerty",      type: "Noise",       severity: "Medium", status: "Pending",  date_logged: "2025-05-20T17:42:00", date_resolved: null, resolution_notes: "" },
  { complaint_id: 23, roll_no: "102303041", complaint: "asdfdsdf",    type: "Cleanliness", severity: "Low",    status: "Resolved", date_logged: "2025-05-20T17:43:00", date_resolved: "2025-05-20", resolution_notes: "Cleaned" },
];

const initVisitors = [
  { visitor_id: 81, roll_no: "102303013", visitor_name: "abcd", visit_date: "2025-05-15", purpose: "xyz", check_in_time: null, check_out_time: null },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN") : "—";
const badge = (val, map) => {
  const cfg = map[val] || { bg: "#334155", color: "#cbd5e1" };
  return (
    <span style={{ background: cfg.bg, color: cfg.color, borderRadius: 6, padding: "2px 10px", fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>
      {val}
    </span>
  );
};

const statusMap = {
  Active:      { bg: "#052e16", color: "#4ade80" },
  Inactive:    { bg: "#3f1f1f", color: "#f87171" },
  Vacant:      { bg: "#052e16", color: "#4ade80" },
  Occupied:    { bg: "#1e3a5f", color: "#60a5fa" },
  Maintenance: { bg: "#422006", color: "#fb923c" },
  Paid:        { bg: "#052e16", color: "#4ade80" },
  Unpaid:      { bg: "#3f1f1f", color: "#f87171" },
  Partial:     { bg: "#2d2005", color: "#fbbf24" },
  Pending:     { bg: "#2d2005", color: "#fbbf24" },
  Resolved:    { bg: "#052e16", color: "#4ade80" },
  "In Progress":{ bg: "#1e3a5f", color: "#60a5fa" },
};

// ─── TOAST ───────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  const col = type === "error" ? "#f87171" : "#4ade80";
  return (
    <div style={{ position: "fixed", bottom: 28, right: 28, background: "#0f172a", border: `1px solid ${col}`, color: col, borderRadius: 10, padding: "12px 20px", fontFamily: "'DM Mono', monospace", fontSize: 14, zIndex: 9999, boxShadow: `0 0 24px ${col}44`, maxWidth: 340 }}>
      {msg}
    </div>
  );
}

// ─── MODAL ───────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000099", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16, padding: 32, minWidth: 420, maxWidth: 560, width: "90%", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 0 60px #0ea5e920" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ margin: 0, color: "#e2e8f0", fontFamily: "'Playfair Display', serif", fontSize: 22 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 22, lineHeight: 1 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── FORM FIELD ──────────────────────────────────────────────────────────────
const F = ({ label, children }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: "block", color: "#94a3b8", fontSize: 12, fontFamily: "'DM Mono', monospace", letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>{label}</label>
    {children}
  </div>
);
const inp = { width: "100%", background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0", padding: "9px 12px", fontFamily: "'DM Mono', monospace", fontSize: 14, boxSizing: "border-box", outline: "none" };
const sel = { ...inp, cursor: "pointer" };
const btn = (accent = "#0ea5e9") => ({ background: accent, color: "#fff", border: "none", borderRadius: 8, padding: "10px 22px", fontFamily: "'DM Mono', monospace", fontSize: 14, cursor: "pointer", fontWeight: 700, letterSpacing: 0.5 });
const btnGhost = { background: "transparent", color: "#94a3b8", border: "1px solid #334155", borderRadius: 8, padding: "10px 22px", fontFamily: "'DM Mono', monospace", fontSize: 14, cursor: "pointer" };

// ─── STAT CARD ───────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, accent }) {
  return (
    <div style={{ background: "#0f172a", border: `1px solid ${accent}33`, borderRadius: 14, padding: "20px 24px", flex: 1, minWidth: 140, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -10, right: -10, fontSize: 52, opacity: 0.07, color: accent }}>{icon}</div>
      <div style={{ fontSize: 28, marginBottom: 4 }}>{icon}</div>
      <div style={{ color: accent, fontSize: 30, fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>{value}</div>
      <div style={{ color: "#64748b", fontSize: 13, fontFamily: "'DM Mono', monospace", marginTop: 2 }}>{label}</div>
    </div>
  );
}

// ─── TABLE WRAPPER ────────────────────────────────────────────────────────────
function DataTable({ cols, rows, emptyMsg = "No records found" }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: "'DM Mono', monospace" }}>
        <thead>
          <tr>{cols.map(c => <th key={c.key} style={{ textAlign: "left", padding: "10px 12px", color: "#64748b", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", borderBottom: "1px solid #1e293b", whiteSpace: "nowrap" }}>{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length === 0
            ? <tr><td colSpan={cols.length} style={{ textAlign: "center", padding: 32, color: "#334155" }}>{emptyMsg}</td></tr>
            : rows.map((row, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #0f172a" }} onMouseEnter={e => e.currentTarget.style.background = "#1e293b44"} onMouseLeave={e => e.currentTarget.style.background = ""}>
                {cols.map(c => <td key={c.key} style={{ padding: "10px 12px", color: "#cbd5e1", verticalAlign: "middle", whiteSpace: c.wrap ? "normal" : "nowrap" }}>{c.render ? c.render(row) : (row[c.key] ?? "—")}</td>)}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard({ students, rooms, fees, complaints, visitors, staff }) {
  const vacant = rooms.filter(r => r.status === "Vacant").length;
  const unpaid = fees.filter(f => f.status !== "Paid").length;
  const pending = complaints.filter(c => c.status === "Pending").length;
  return (
    <div>
      <h2 style={{ color: "#e2e8f0", fontFamily: "'Playfair Display', serif", fontSize: 26, marginBottom: 6 }}>Dashboard Overview</h2>
      <p style={{ color: "#475569", fontFamily: "'DM Mono', monospace", fontSize: 13, marginBottom: 28 }}>Real-time hostel operations at a glance</p>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
        <StatCard icon="🎓" label="Total Students"   value={students.length}  accent="#0ea5e9" />
        <StatCard icon="🏠" label="Total Rooms"      value={rooms.length}     accent="#a78bfa" />
        <StatCard icon="✅" label="Vacant Rooms"     value={vacant}           accent="#4ade80" />
        <StatCard icon="💰" label="Pending Fees"     value={unpaid}           accent="#fbbf24" />
        <StatCard icon="📋" label="Open Complaints"  value={pending}          accent="#f87171" />
        <StatCard icon="👥" label="Staff Members"    value={staff.length}     accent="#34d399" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: 20 }}>
          <h3 style={{ color: "#94a3b8", fontFamily: "'DM Mono', monospace", fontSize: 13, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 16px" }}>Recent Students</h3>
          {students.slice(0, 4).map(s => (
            <div key={s.roll_no} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #1e293b11" }}>
              <div>
                <div style={{ color: "#e2e8f0", fontSize: 14, fontFamily: "'DM Mono', monospace" }}>{s.name}</div>
                <div style={{ color: "#475569", fontSize: 11 }}>{s.roll_no} · {s.department} · Room {s.room_no}</div>
              </div>
              {badge(s.status, statusMap)}
            </div>
          ))}
        </div>
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: 20 }}>
          <h3 style={{ color: "#94a3b8", fontFamily: "'DM Mono', monospace", fontSize: 13, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 16px" }}>Room Status</h3>
          {rooms.slice(0, 6).map(r => (
            <div key={r.room_no} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #1e293b11" }}>
              <div>
                <span style={{ color: "#e2e8f0", fontFamily: "'DM Mono', monospace", fontSize: 14 }}>Room {r.room_no}</span>
                <span style={{ color: "#475569", fontSize: 11, marginLeft: 8 }}>Floor {r.floor} · {r.room_type} · Cap {r.capacity}</span>
              </div>
              {badge(r.status, statusMap)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── STUDENTS ────────────────────────────────────────────────────────────────
function Students({ students, setStudents, rooms, setRooms, toast }) {
  const [tab, setTab] = useState("view");
  const [filterDept, setFilterDept] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState({ roll_no: "", name: "", department: "ECE", room_no: "", year: "1st", contact_no: "", email: "", date_joined: "", status: "Active" });

  const depts = ["ECE", "EE", "ME", "BT", "CSE", "CE"];
  const years = ["1st", "2nd", "3rd", "4th"];

  const filtered = students.filter(s =>
    (!filterDept || s.department === filterDept) &&
    (!filterYear || s.year === filterYear)
  );

  const handleAdd = () => {
    if (!form.roll_no || !form.name || !form.room_no) return toast("Fill all required fields", "error");
    const room = rooms.find(r => r.room_no === form.room_no);
    if (!room) return toast("Room not found", "error");
    if (room.status !== "Vacant") return toast(`Room ${form.room_no} is not vacant`, "error");
    if (students.find(s => s.roll_no === form.roll_no)) return toast("Roll No already exists", "error");
    setStudents(prev => [...prev, { ...form, date_joined: form.date_joined || new Date().toISOString().slice(0, 10) }]);
    setRooms(prev => prev.map(r => r.room_no === form.room_no ? { ...r, status: "Occupied" } : r));
    toast(`Student '${form.name}' added successfully, room ${form.room_no} marked Occupied`, "success");
    setForm({ roll_no: "", name: "", department: "ECE", room_no: "", year: "1st", contact_no: "", email: "", date_joined: "", status: "Active" });
    setTab("view");
  };

  const handleUpdate = () => {
    setStudents(prev => prev.map(s => s.roll_no === form.roll_no ? { ...form } : s));
    toast("Student updated successfully", "success");
    setEditTarget(null);
  };

  const handleDelete = (s) => {
    setStudents(prev => prev.filter(x => x.roll_no !== s.roll_no));
    setRooms(prev => prev.map(r => r.room_no === s.room_no ? { ...r, status: "Vacant" } : r));
    toast(`Student ${s.name} deleted, room ${s.room_no} marked Vacant`, "success");
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ color: "#e2e8f0", fontFamily: "'Playfair Display', serif", fontSize: 26, margin: 0 }}>Students</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {["view", "add"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ ...btn(tab === t ? "#0ea5e9" : "transparent"), color: tab === t ? "#fff" : "#64748b", border: tab === t ? "none" : "1px solid #334155", textTransform: "capitalize" }}>{t === "view" ? "📋 All Students" : "➕ Add Student"}</button>
          ))}
        </div>
      </div>

      {tab === "view" && (
        <>
          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <select value={filterDept} onChange={e => setFilterDept(e.target.value)} style={{ ...sel, width: 160 }}>
              <option value="">All Departments</option>
              {depts.map(d => <option key={d}>{d}</option>)}
            </select>
            <select value={filterYear} onChange={e => setFilterYear(e.target.value)} style={{ ...sel, width: 140 }}>
              <option value="">All Years</option>
              {years.map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
          <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, overflow: "hidden" }}>
            <DataTable
              cols={[
                { key: "roll_no", label: "Roll No" },
                { key: "name", label: "Name" },
                { key: "department", label: "Dept" },
                { key: "room_no", label: "Room" },
                { key: "year", label: "Year" },
                { key: "contact_no", label: "Contact" },
                { key: "email", label: "Email", wrap: true },
                { key: "date_joined", label: "Joined", render: s => fmtDate(s.date_joined) },
                { key: "status", label: "Status", render: s => badge(s.status, statusMap) },
                { key: "actions", label: "Actions", render: s => (
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => { setForm({ ...s }); setEditTarget(s); }} style={{ ...btn("#475569"), padding: "4px 12px", fontSize: 12 }}>Edit</button>
                    <button onClick={() => handleDelete(s)} style={{ ...btn("#7f1d1d"), padding: "4px 12px", fontSize: 12 }}>Del</button>
                  </div>
                )}
              ]}
              rows={filtered}
            />
          </div>
        </>
      )}

      {tab === "add" && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: 28, maxWidth: 600 }}>
          <h3 style={{ color: "#94a3b8", fontFamily: "'DM Mono', monospace", fontSize: 13, letterSpacing: 1, textTransform: "uppercase", marginTop: 0, marginBottom: 20 }}>INSERT INTO students</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <F label="Roll No *"><input style={inp} value={form.roll_no} onChange={e => setForm({ ...form, roll_no: e.target.value })} placeholder="102303XXX" /></F>
            <F label="Name *"><input style={inp} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full Name" /></F>
            <F label="Department"><select style={sel} value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>{depts.map(d => <option key={d}>{d}</option>)}</select></F>
            <F label="Year"><select style={sel} value={form.year} onChange={e => setForm({ ...form, year: e.target.value })}>{years.map(y => <option key={y}>{y}</option>)}</select></F>
            <F label="Room No *">
              <select style={sel} value={form.room_no} onChange={e => setForm({ ...form, room_no: e.target.value })}>
                <option value="">-- Select Vacant Room --</option>
                {rooms.filter(r => r.status === "Vacant").map(r => <option key={r.room_no} value={r.room_no}>{r.room_no} ({r.room_type}, Floor {r.floor})</option>)}
              </select>
            </F>
            <F label="Contact No"><input style={inp} value={form.contact_no} onChange={e => setForm({ ...form, contact_no: e.target.value })} placeholder="09XXXXXXXXX" /></F>
            <F label="Email"><input style={inp} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="x@tiet.ac.in" /></F>
            <F label="Date Joined"><input style={inp} type="date" value={form.date_joined} onChange={e => setForm({ ...form, date_joined: e.target.value })} /></F>
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 10 }}>
            <button style={btn()} onClick={handleAdd}>Add Student</button>
            <button style={btnGhost} onClick={() => setTab("view")}>Cancel</button>
          </div>
        </div>
      )}

      {editTarget && (
        <Modal title={`Edit Student — ${form.roll_no}`} onClose={() => setEditTarget(null)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <F label="Name"><input style={inp} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></F>
            <F label="Department"><select style={sel} value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>{depts.map(d => <option key={d}>{d}</option>)}</select></F>
            <F label="Year"><select style={sel} value={form.year} onChange={e => setForm({ ...form, year: e.target.value })}>{"1st,2nd,3rd,4th".split(",").map(y => <option key={y}>{y}</option>)}</select></F>
            <F label="Contact"><input style={inp} value={form.contact_no} onChange={e => setForm({ ...form, contact_no: e.target.value })} /></F>
            <F label="Email"><input style={inp} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></F>
            <F label="Status"><select style={sel} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option>Active</option><option>Inactive</option></select></F>
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <button style={btn()} onClick={handleUpdate}>Update Student</button>
            <button style={btnGhost} onClick={() => setEditTarget(null)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── ROOMS ───────────────────────────────────────────────────────────────────
function Rooms({ rooms, setRooms, toast }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ room_no: "", capacity: 2, status: "Vacant", floor: 1, room_type: "Double" });
  const [editTarget, setEditTarget] = useState(null);

  const handleAdd = () => {
    if (!form.room_no) return toast("Room number required", "error");
    if (rooms.find(r => r.room_no === form.room_no)) return toast("Room already exists", "error");
    setRooms(prev => [...prev, { ...form, capacity: Number(form.capacity), floor: Number(form.floor) }]);
    toast(`Room '${form.room_no}' added successfully`, "success");
    setForm({ room_no: "", capacity: 2, status: "Vacant", floor: 1, room_type: "Double" });
    setShowAdd(false);
  };

  const handleUpdate = () => {
    setRooms(prev => prev.map(r => r.room_no === form.room_no ? { ...form, capacity: Number(form.capacity), floor: Number(form.floor) } : r));
    toast("Room updated", "success");
    setEditTarget(null);
  };

  const handleDelete = (r) => {
    setRooms(prev => prev.filter(x => x.room_no !== r.room_no));
    toast(`Room ${r.room_no} deleted`, "success");
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ color: "#e2e8f0", fontFamily: "'Playfair Display', serif", fontSize: 26, margin: 0 }}>Rooms</h2>
        <button style={btn()} onClick={() => setShowAdd(!showAdd)}>➕ Add Room</button>
      </div>

      {showAdd && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: 24, maxWidth: 520, marginBottom: 24 }}>
          <h3 style={{ color: "#94a3b8", fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", marginTop: 0, marginBottom: 16 }}>INSERT INTO rooms</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <F label="Room No *"><input style={inp} value={form.room_no} onChange={e => setForm({ ...form, room_no: e.target.value })} placeholder="A101" /></F>
            <F label="Room Type"><select style={sel} value={form.room_type} onChange={e => setForm({ ...form, room_type: e.target.value })}>{["Single","Double","Triple","Quad"].map(t => <option key={t}>{t}</option>)}</select></F>
            <F label="Capacity"><input style={inp} type="number" min="1" max="6" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} /></F>
            <F label="Floor"><input style={inp} type="number" min="1" max="10" value={form.floor} onChange={e => setForm({ ...form, floor: e.target.value })} /></F>
            <F label="Status"><select style={sel} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>{["Vacant","Occupied","Maintenance"].map(s => <option key={s}>{s}</option>)}</select></F>
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 10 }}>
            <button style={btn()} onClick={handleAdd}>Add Room</button>
            <button style={btnGhost} onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, overflow: "hidden" }}>
        <DataTable
          cols={[
            { key: "room_no", label: "Room No" },
            { key: "room_type", label: "Type" },
            { key: "capacity", label: "Capacity" },
            { key: "floor", label: "Floor" },
            { key: "status", label: "Status", render: r => badge(r.status, statusMap) },
            { key: "actions", label: "Actions", render: r => (
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => { setForm({ ...r }); setEditTarget(r); }} style={{ ...btn("#475569"), padding: "4px 12px", fontSize: 12 }}>Edit</button>
                <button onClick={() => handleDelete(r)} style={{ ...btn("#7f1d1d"), padding: "4px 12px", fontSize: 12 }}>Del</button>
              </div>
            )}
          ]}
          rows={rooms}
        />
      </div>

      {editTarget && (
        <Modal title={`Edit Room — ${form.room_no}`} onClose={() => setEditTarget(null)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <F label="Status"><select style={sel} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>{["Vacant","Occupied","Maintenance"].map(s => <option key={s}>{s}</option>)}</select></F>
            <F label="Capacity"><input style={inp} type="number" min="1" max="6" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} /></F>
            <F label="Floor"><input style={inp} type="number" value={form.floor} onChange={e => setForm({ ...form, floor: e.target.value })} /></F>
            <F label="Type"><select style={sel} value={form.room_type} onChange={e => setForm({ ...form, room_type: e.target.value })}>{["Single","Double","Triple","Quad"].map(t => <option key={t}>{t}</option>)}</select></F>
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <button style={btn()} onClick={handleUpdate}>Update Room</button>
            <button style={btnGhost} onClick={() => setEditTarget(null)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── FEES ────────────────────────────────────────────────────────────────────
function Fees({ fees, setFees, students, toast }) {
  const [tab, setTab] = useState("view");
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState({ roll_no: "", amount: 50000, due_date: "", payment_date: "", status: "Unpaid", receipt_number: "" });

  const enriched = fees.map(f => ({ ...f, student_name: students.find(s => s.roll_no === f.roll_no)?.name || "Unknown" }));

  const handleAdd = () => {
    if (!form.roll_no || !form.due_date) return toast("Fill required fields", "error");
    const newId = Math.max(0, ...fees.map(f => f.fee_id)) + 1;
    setFees(prev => [...prev, { ...form, fee_id: newId, amount: Number(form.amount) }]);
    toast("Fee record added", "success");
    setForm({ roll_no: "", amount: 50000, due_date: "", payment_date: "", status: "Unpaid", receipt_number: "" });
    setTab("view");
  };

  const markPaid = (f) => {
    setFees(prev => prev.map(x => x.fee_id === f.fee_id ? { ...x, status: "Paid", payment_date: new Date().toISOString().slice(0, 10), receipt_number: `REC-${Date.now()}` } : x));
    toast(`Fee #${f.fee_id} marked as Paid`, "success");
  };

  const handleDelete = (f) => {
    setFees(prev => prev.filter(x => x.fee_id !== f.fee_id));
    toast("Fee record deleted", "success");
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ color: "#e2e8f0", fontFamily: "'Playfair Display', serif", fontSize: 26, margin: 0 }}>Fees Management</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {["view","add","edit"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ ...btn(tab === t ? "#0ea5e9" : "transparent"), color: tab === t ? "#fff" : "#64748b", border: tab === t ? "none" : "1px solid #334155", textTransform: "capitalize", fontSize: 13 }}>
              {t === "view" ? "📋 View Fees" : t === "add" ? "➕ Add Record" : "✏️ Edit/Delete"}
            </button>
          ))}
        </div>
      </div>

      {tab === "view" && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, overflow: "hidden" }}>
          <DataTable
            cols={[
              { key: "fee_id", label: "Fee ID" },
              { key: "roll_no", label: "Roll No" },
              { key: "student_name", label: "Student" },
              { key: "amount", label: "Amount (₹)", render: f => `₹${Number(f.amount).toLocaleString()}` },
              { key: "due_date", label: "Due Date", render: f => fmtDate(f.due_date) },
              { key: "payment_date", label: "Paid On", render: f => fmtDate(f.payment_date) },
              { key: "status", label: "Status", render: f => badge(f.status, statusMap) },
              { key: "receipt_number", label: "Receipt" },
              { key: "actions", label: "", render: f => f.status !== "Paid" && <button onClick={() => markPaid(f)} style={{ ...btn("#15803d"), padding: "4px 12px", fontSize: 12 }}>Mark Paid</button> }
            ]}
            rows={enriched}
          />
        </div>
      )}

      {tab === "add" && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: 28, maxWidth: 520 }}>
          <h3 style={{ color: "#94a3b8", fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", marginTop: 0, marginBottom: 16 }}>INSERT INTO fees</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <F label="Student *">
              <select style={sel} value={form.roll_no} onChange={e => setForm({ ...form, roll_no: e.target.value })}>
                <option value="">-- Select Student --</option>
                {students.map(s => <option key={s.roll_no} value={s.roll_no}>{s.roll_no} - {s.name}</option>)}
              </select>
            </F>
            <F label="Amount (₹)"><input style={inp} type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></F>
            <F label="Due Date *"><input style={inp} type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} /></F>
            <F label="Status"><select style={sel} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>{["Unpaid","Paid","Partial"].map(s => <option key={s}>{s}</option>)}</select></F>
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 10 }}>
            <button style={btn()} onClick={handleAdd}>Add Fee Record</button>
            <button style={btnGhost} onClick={() => setTab("view")}>Cancel</button>
          </div>
        </div>
      )}

      {tab === "edit" && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, overflow: "hidden" }}>
          <DataTable
            cols={[
              { key: "fee_id", label: "ID" },
              { key: "roll_no", label: "Roll No" },
              { key: "student_name", label: "Student" },
              { key: "amount", label: "Amount", render: f => `₹${Number(f.amount).toLocaleString()}` },
              { key: "status", label: "Status", render: f => badge(f.status, statusMap) },
              { key: "actions", label: "Actions", render: f => (
                <div style={{ display: "flex", gap: 6 }}>
                  {f.status !== "Paid" && <button onClick={() => markPaid(f)} style={{ ...btn("#15803d"), padding: "4px 10px", fontSize: 12 }}>Mark Paid</button>}
                  <button onClick={() => handleDelete(f)} style={{ ...btn("#7f1d1d"), padding: "4px 10px", fontSize: 12 }}>Delete</button>
                </div>
              )}
            ]}
            rows={enriched}
          />
        </div>
      )}
    </div>
  );
}

// ─── COMPLAINTS ───────────────────────────────────────────────────────────────
function Complaints({ complaints, setComplaints, students, toast }) {
  const [tab, setTab] = useState("view");
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState({ roll_no: "", complaint: "", type: "Maintenance", severity: "Medium", status: "Pending", date_logged: "", date_resolved: "", resolution_notes: "" });

  const enriched = complaints.map(c => ({ ...c, student_name: students.find(s => s.roll_no === c.roll_no)?.name || c.roll_no }));

  const handleAdd = () => {
    if (!form.roll_no || !form.complaint) return toast("Fill required fields", "error");
    const newId = Math.max(0, ...complaints.map(c => c.complaint_id)) + 1;
    setComplaints(prev => [...prev, { ...form, complaint_id: newId, date_logged: new Date().toISOString() }]);
    toast("Complaint lodged successfully", "success");
    setForm({ roll_no: "", complaint: "", type: "Maintenance", severity: "Medium", status: "Pending", date_logged: "", date_resolved: "", resolution_notes: "" });
    setTab("view");
  };

  const handleUpdate = () => {
    setComplaints(prev => prev.map(c => c.complaint_id === editTarget.complaint_id ? { ...c, ...form } : c));
    toast("Complaint updated", "success");
    setEditTarget(null);
  };

  const handleDelete = (c) => {
    setComplaints(prev => prev.filter(x => x.complaint_id !== c.complaint_id));
    toast("Complaint deleted", "success");
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ color: "#e2e8f0", fontFamily: "'Playfair Display', serif", fontSize: 26, margin: 0 }}>Complaints</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {["view","lodge","manage"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ ...btn(tab === t ? "#0ea5e9" : "transparent"), color: tab === t ? "#fff" : "#64748b", border: tab === t ? "none" : "1px solid #334155", fontSize: 13, textTransform: "capitalize" }}>
              {t === "view" ? "📋 View" : t === "lodge" ? "➕ Lodge" : "✏️ Manage"}
            </button>
          ))}
        </div>
      </div>

      {tab === "view" && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, overflow: "hidden" }}>
          <DataTable
            cols={[
              { key: "complaint_id", label: "ID" },
              { key: "roll_no", label: "Roll No" },
              { key: "student_name", label: "Student" },
              { key: "complaint", label: "Description", wrap: true },
              { key: "type", label: "Type" },
              { key: "severity", label: "Severity", render: c => badge(c.severity, { Low: { bg: "#1c2e1c", color: "#4ade80" }, Medium: { bg: "#2d2005", color: "#fbbf24" }, High: { bg: "#3f1f1f", color: "#f87171" }, Critical: { bg: "#4a0018", color: "#fb7185" } }) },
              { key: "status", label: "Status", render: c => badge(c.status, statusMap) },
              { key: "date_logged", label: "Logged", render: c => fmtDate(c.date_logged) },
            ]}
            rows={enriched}
          />
        </div>
      )}

      {tab === "lodge" && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: 28, maxWidth: 560 }}>
          <h3 style={{ color: "#94a3b8", fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", marginTop: 0, marginBottom: 16 }}>INSERT INTO complaints</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <F label="Student *">
              <select style={sel} value={form.roll_no} onChange={e => setForm({ ...form, roll_no: e.target.value })}>
                <option value="">-- Select Student --</option>
                {students.map(s => <option key={s.roll_no} value={s.roll_no}>{s.roll_no} - {s.name}</option>)}
              </select>
            </F>
            <F label="Type"><select style={sel} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>{["Maintenance","Cleanliness","Noise","Security","Other"].map(t => <option key={t}>{t}</option>)}</select></F>
            <F label="Severity"><select style={sel} value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })}>{["Low","Medium","High","Critical"].map(s => <option key={s}>{s}</option>)}</select></F>
            <F label="Status"><select style={sel} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>{["Pending","In Progress","Resolved"].map(s => <option key={s}>{s}</option>)}</select></F>
          </div>
          <F label="Complaint Details *"><textarea style={{ ...inp, minHeight: 80, resize: "vertical" }} value={form.complaint} onChange={e => setForm({ ...form, complaint: e.target.value })} placeholder="Describe the issue..." /></F>
          <F label="Resolution Notes"><textarea style={{ ...inp, minHeight: 60, resize: "vertical" }} value={form.resolution_notes} onChange={e => setForm({ ...form, resolution_notes: e.target.value })} /></F>
          <div style={{ marginTop: 8, display: "flex", gap: 10 }}>
            <button style={btn()} onClick={handleAdd}>Lodge Complaint</button>
            <button style={btnGhost} onClick={() => setTab("view")}>Cancel</button>
          </div>
        </div>
      )}

      {tab === "manage" && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, overflow: "hidden" }}>
          <DataTable
            cols={[
              { key: "complaint_id", label: "ID" },
              { key: "student_name", label: "Student" },
              { key: "complaint", label: "Complaint", wrap: true },
              { key: "status", label: "Status", render: c => badge(c.status, statusMap) },
              { key: "actions", label: "Actions", render: c => (
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => { setForm({ ...c }); setEditTarget(c); }} style={{ ...btn("#475569"), padding: "4px 10px", fontSize: 12 }}>Edit</button>
                  <button onClick={() => handleDelete(c)} style={{ ...btn("#7f1d1d"), padding: "4px 10px", fontSize: 12 }}>Del</button>
                </div>
              )}
            ]}
            rows={enriched}
          />
        </div>
      )}

      {editTarget && (
        <Modal title={`Update Complaint #${editTarget.complaint_id}`} onClose={() => setEditTarget(null)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <F label="Status"><select style={sel} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>{["Pending","In Progress","Resolved"].map(s => <option key={s}>{s}</option>)}</select></F>
            <F label="Type"><select style={sel} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>{["Maintenance","Cleanliness","Noise","Security","Other"].map(t => <option key={t}>{t}</option>)}</select></F>
            <F label="Severity"><select style={sel} value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })}>{["Low","Medium","High","Critical"].map(s => <option key={s}>{s}</option>)}</select></F>
            <F label="Resolution Date"><input style={inp} type="date" value={form.date_resolved || ""} onChange={e => setForm({ ...form, date_resolved: e.target.value })} /></F>
          </div>
          <F label="Complaint Details"><textarea style={{ ...inp, minHeight: 70, resize: "vertical" }} value={form.complaint} onChange={e => setForm({ ...form, complaint: e.target.value })} /></F>
          <F label="Resolution Notes"><textarea style={{ ...inp, minHeight: 60, resize: "vertical" }} value={form.resolution_notes} onChange={e => setForm({ ...form, resolution_notes: e.target.value })} /></F>
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <button style={btn()} onClick={handleUpdate}>Update Complaint</button>
            <button style={btnGhost} onClick={() => setEditTarget(null)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── VISITORS ─────────────────────────────────────────────────────────────────
function Visitors({ visitors, setVisitors, students, toast }) {
  const [tab, setTab] = useState("view");
  const [form, setForm] = useState({ roll_no: "", visitor_name: "", visit_date: "", purpose: "", check_in_time: "", check_out_time: "" });

  const enriched = visitors.map(v => ({ ...v, student_name: students.find(s => s.roll_no === v.roll_no)?.name || v.roll_no }));

  const handleAdd = () => {
    if (!form.roll_no || !form.visitor_name) return toast("Fill required fields", "error");
    const newId = Math.max(0, ...visitors.map(v => v.visitor_id)) + 1;
    setVisitors(prev => [...prev, { ...form, visitor_id: newId, visit_date: form.visit_date || new Date().toISOString().slice(0, 10) }]);
    toast("Visitor added successfully", "success");
    setForm({ roll_no: "", visitor_name: "", visit_date: "", purpose: "", check_in_time: "", check_out_time: "" });
    setTab("view");
  };

  const checkout = (v) => {
    setVisitors(prev => prev.map(x => x.visitor_id === v.visitor_id ? { ...x, check_out_time: new Date().toLocaleTimeString() } : x));
    toast(`${v.visitor_name} checked out`, "success");
  };

  const handleDelete = (v) => {
    setVisitors(prev => prev.filter(x => x.visitor_id !== v.visitor_id));
    toast("Visitor record deleted", "success");
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ color: "#e2e8f0", fontFamily: "'Playfair Display', serif", fontSize: 26, margin: 0 }}>Visitor Management</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {["view","add","edit"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ ...btn(tab === t ? "#0ea5e9" : "transparent"), color: tab === t ? "#fff" : "#64748b", border: tab === t ? "none" : "1px solid #334155", fontSize: 13, textTransform: "capitalize" }}>
              {t === "view" ? "📋 View Visitors" : t === "add" ? "➕ Add Visitor" : "✏️ Edit/Delete"}
            </button>
          ))}
        </div>
      </div>

      {tab === "view" && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, overflow: "hidden" }}>
          <DataTable
            cols={[
              { key: "visitor_id", label: "ID" },
              { key: "roll_no", label: "Roll No" },
              { key: "student_name", label: "Resident" },
              { key: "visitor_name", label: "Visitor" },
              { key: "visit_date", label: "Date", render: v => fmtDate(v.visit_date) },
              { key: "purpose", label: "Purpose", wrap: true },
              { key: "check_in_time", label: "Check In" },
              { key: "check_out_time", label: "Check Out", render: v => v.check_out_time || <button onClick={() => checkout(v)} style={{ ...btn("#0ea5e9"), padding: "3px 10px", fontSize: 12 }}>Check Out</button> },
            ]}
            rows={enriched}
          />
        </div>
      )}

      {tab === "add" && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: 28, maxWidth: 520 }}>
          <h3 style={{ color: "#94a3b8", fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", marginTop: 0, marginBottom: 16 }}>INSERT INTO visitors</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <F label="Resident Student *">
              <select style={sel} value={form.roll_no} onChange={e => setForm({ ...form, roll_no: e.target.value })}>
                <option value="">-- Select Student --</option>
                {students.map(s => <option key={s.roll_no} value={s.roll_no}>{s.roll_no} - {s.name}</option>)}
              </select>
            </F>
            <F label="Visitor Name *"><input style={inp} value={form.visitor_name} onChange={e => setForm({ ...form, visitor_name: e.target.value })} placeholder="Guest name" /></F>
            <F label="Visit Date"><input style={inp} type="date" value={form.visit_date} onChange={e => setForm({ ...form, visit_date: e.target.value })} /></F>
            <F label="Check-In Time"><input style={inp} type="time" value={form.check_in_time} onChange={e => setForm({ ...form, check_in_time: e.target.value })} /></F>
          </div>
          <F label="Purpose of Visit"><textarea style={{ ...inp, minHeight: 70, resize: "vertical" }} value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} /></F>
          <div style={{ marginTop: 8, display: "flex", gap: 10 }}>
            <button style={btn()} onClick={handleAdd}>Add Visitor</button>
            <button style={btnGhost} onClick={() => setTab("view")}>Cancel</button>
          </div>
        </div>
      )}

      {tab === "edit" && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, overflow: "hidden" }}>
          <DataTable
            cols={[
              { key: "visitor_id", label: "ID" },
              { key: "student_name", label: "Resident" },
              { key: "visitor_name", label: "Visitor" },
              { key: "visit_date", label: "Date", render: v => fmtDate(v.visit_date) },
              { key: "actions", label: "Actions", render: v => (
                <button onClick={() => handleDelete(v)} style={{ ...btn("#7f1d1d"), padding: "4px 10px", fontSize: 12 }}>Delete</button>
              )}
            ]}
            rows={enriched}
          />
        </div>
      )}
    </div>
  );
}

// ─── STAFF ───────────────────────────────────────────────────────────────────
function Staff({ staff, setStaff, toast }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", position: "Warden", contact_no: "", salary: "", join_date: "" });

  const handleAdd = () => {
    if (!form.name || !form.contact_no) return toast("Fill required fields", "error");
    const newId = Math.max(0, ...staff.map(s => s.staff_id)) + 1;
    setStaff(prev => [...prev, { ...form, staff_id: newId, salary: Number(form.salary), join_date: form.join_date || new Date().toISOString().slice(0, 10) }]);
    toast(`Staff member '${form.name}' added`, "success");
    setForm({ name: "", position: "Warden", contact_no: "", salary: "", join_date: "" });
    setShowAdd(false);
  };

  const handleDelete = (s) => {
    setStaff(prev => prev.filter(x => x.staff_id !== s.staff_id));
    toast(`Staff ${s.name} removed`, "success");
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ color: "#e2e8f0", fontFamily: "'Playfair Display', serif", fontSize: 26, margin: 0 }}>Staff</h2>
        <button style={btn()} onClick={() => setShowAdd(!showAdd)}>➕ Add Staff</button>
      </div>

      {showAdd && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, padding: 24, maxWidth: 520, marginBottom: 24 }}>
          <h3 style={{ color: "#94a3b8", fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", marginTop: 0, marginBottom: 16 }}>INSERT INTO staff</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <F label="Name *"><input style={inp} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></F>
            <F label="Position"><select style={sel} value={form.position} onChange={e => setForm({ ...form, position: e.target.value })}>{["Warden","Caretaker","Cleaner","Security","Cook"].map(p => <option key={p}>{p}</option>)}</select></F>
            <F label="Contact No *"><input style={inp} value={form.contact_no} onChange={e => setForm({ ...form, contact_no: e.target.value })} /></F>
            <F label="Salary (₹)"><input style={inp} type="number" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} /></F>
            <F label="Join Date"><input style={inp} type="date" value={form.join_date} onChange={e => setForm({ ...form, join_date: e.target.value })} /></F>
          </div>
          <div style={{ marginTop: 8, display: "flex", gap: 10 }}>
            <button style={btn()} onClick={handleAdd}>Add Staff</button>
            <button style={btnGhost} onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 14, overflow: "hidden" }}>
        <DataTable
          cols={[
            { key: "staff_id", label: "ID" },
            { key: "name", label: "Name" },
            { key: "position", label: "Position" },
            { key: "contact_no", label: "Contact" },
            { key: "salary", label: "Salary", render: s => `₹${Number(s.salary).toLocaleString()}` },
            { key: "join_date", label: "Joined", render: s => fmtDate(s.join_date) },
            { key: "actions", label: "Actions", render: s => (
              <button onClick={() => handleDelete(s)} style={{ ...btn("#7f1d1d"), padding: "4px 10px", fontSize: 12 }}>Remove</button>
            )}
          ]}
          rows={staff}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [students,   setStudents]   = useState(initStudents);
  const [rooms,      setRooms]      = useState(initRooms);
  const [fees,       setFees]       = useState(initFees);
  const [staff,      setStaff]      = useState(initStaff);
  const [complaints, setComplaints] = useState(initComplaints);
  const [visitors,   setVisitors]   = useState(initVisitors);
  const [active,     setActive]     = useState("dashboard");
  const [toastMsg,   setToastMsg]   = useState(null);

  const toast = (msg, type = "success") => setToastMsg({ msg, type });

  const navItems = [
    { id: "dashboard",  label: "Dashboard",   icon: "⚡" },
    { id: "students",   label: "Students",    icon: "🎓" },
    { id: "rooms",      label: "Rooms",       icon: "🏠" },
    { id: "fees",       label: "Fees",        icon: "💰" },
    { id: "complaints", label: "Complaints",  icon: "📋" },
    { id: "visitors",   label: "Visitors",    icon: "👥" },
    { id: "staff",      label: "Staff",       icon: "👤" },
  ];

  const renderSection = () => {
    const p = { toast };
    switch (active) {
      case "dashboard":  return <Dashboard students={students} rooms={rooms} fees={fees} complaints={complaints} visitors={visitors} staff={staff} />;
      case "students":   return <Students students={students} setStudents={setStudents} rooms={rooms} setRooms={setRooms} {...p} />;
      case "rooms":      return <Rooms rooms={rooms} setRooms={setRooms} {...p} />;
      case "fees":       return <Fees fees={fees} setFees={setFees} students={students} {...p} />;
      case "complaints": return <Complaints complaints={complaints} setComplaints={setComplaints} students={students} {...p} />;
      case "visitors":   return <Visitors visitors={visitors} setVisitors={setVisitors} students={students} {...p} />;
      case "staff":      return <Staff staff={staff} setStaff={setStaff} {...p} />;
      default:           return null;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#020617", fontFamily: "'DM Mono', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Playfair+Display:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #020617; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }
        select option { background: #1e293b; }
      `}</style>

      {/* SIDEBAR */}
      <div style={{ width: 220, background: "#0a0f1e", borderRight: "1px solid #0f172a", display: "flex", flexDirection: "column", padding: "0 0 24px", flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: "28px 20px 20px", borderBottom: "1px solid #0f172a" }}>
          <div style={{ color: "#0ea5e9", fontSize: 22, fontFamily: "'Playfair Display', serif", fontWeight: 800, letterSpacing: -0.5 }}>RoomEase</div>
          <div style={{ color: "#1e3a5f", fontSize: 11, letterSpacing: 2, marginTop: 2 }}>HOSTEL MGMT SYS</div>
        </div>
        <nav style={{ padding: "16px 10px", flex: 1 }}>
          {navItems.map(n => (
            <button key={n.id} onClick={() => setActive(n.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, background: active === n.id ? "#0ea5e915" : "transparent", border: active === n.id ? "1px solid #0ea5e930" : "1px solid transparent", color: active === n.id ? "#0ea5e9" : "#475569", fontSize: 13, cursor: "pointer", marginBottom: 2, textAlign: "left", transition: "all .15s" }}>
              <span style={{ fontSize: 16 }}>{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "12px 20px", borderTop: "1px solid #0f172a" }}>
          <div style={{ color: "#1e3a5f", fontSize: 10, letterSpacing: 1, marginBottom: 4 }}>THAPAR INSTITUTE</div>
          <div style={{ color: "#0f172a", fontSize: 10 }}>CSE Dept · B.Tech Project</div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: "32px 36px", overflowY: "auto", maxHeight: "100vh" }}>
        {renderSection()}
      </div>

      {toastMsg && <Toast msg={toastMsg.msg} type={toastMsg.type} onClose={() => setToastMsg(null)} />}
    </div>
  );
}
