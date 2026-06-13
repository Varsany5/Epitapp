import { useState, useEffect, useRef } from "react";

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const INITIAL_LEADS = [
  {
    id: "1", name: "Kovács Péter", phone: "+36301234567", email: "kovacs.peter@gmail.com",
    build_timeline: "0-6_honap", location: "Győr", owns_land: true,
    equity_amount: 12000000, needs_loan: false,
    status: "uj", assigned_to: "Tóth Andor", created_at: "2025-06-10T08:23:00Z",
    last_contacted_at: null, source: "facebook",
    notes: [
      { id: "n1", content: "Érdeklődött az árakról, nagyon motivált.", author: "Tóth Andor", created_at: "2025-06-10T09:00:00Z" }
    ],
    reminders: [
      { id: "r1", message: "Visszahívni árajánlattal", remind_at: "2025-06-17T10:00:00Z", is_done: false }
    ]
  },
  {
    id: "2", name: "Nagy Andrea", phone: "+36201234567", email: "nagy.andrea@freemail.hu",
    build_timeline: "0-6_honap", location: "Pécs", owns_land: true,
    equity_amount: 9500000, needs_loan: false,
    status: "kapcsolatban", assigned_to: "Tóth Andor", created_at: "2025-06-09T14:10:00Z",
    last_contacted_at: "2025-06-10T11:00:00Z", source: "facebook",
    notes: [], reminders: []
  },
  {
    id: "3", name: "Horváth Gábor", phone: "+36701234567", email: "horvath.g@citromail.hu",
    build_timeline: "0-6_honap", location: "Budapest", owns_land: true,
    equity_amount: 8000000, needs_loan: false,
    status: "targyalas", assigned_to: "Tóth Andor", created_at: "2025-06-08T10:00:00Z",
    last_contacted_at: "2025-06-09T15:00:00Z", source: "facebook",
    notes: [
      { id: "n2", content: "Tárgyaláson részt vett, döntéshez kell még 1 hét.", author: "Tóth Andor", created_at: "2025-06-09T16:00:00Z" }
    ],
    reminders: [
      { id: "r2", message: "Döntés utáni visszajelzés", remind_at: "2025-06-16T09:00:00Z", is_done: false }
    ]
  },
  {
    id: "4", name: "Szabó László", phone: "+36301112233", email: "szabo.laszlo@gmail.com",
    build_timeline: "6-12_honap", location: "Debrecen", owns_land: false,
    equity_amount: 7000000, needs_loan: true,
    status: "uj", assigned_to: "Tóth Andor", created_at: "2025-06-11T07:45:00Z",
    last_contacted_at: null, source: "facebook",
    notes: [], reminders: []
  },
  {
    id: "5", name: "Kiss Erzsébet", phone: "+36209876543", email: "kiss.erzsebet@gmail.com",
    build_timeline: "6-12_honap", location: "Miskolc", owns_land: true,
    equity_amount: 5000000, needs_loan: true,
    status: "uj", assigned_to: "Tóth Andor", created_at: "2025-06-11T09:30:00Z",
    last_contacted_at: null, source: "facebook",
    notes: [], reminders: []
  },
  {
    id: "6", name: "Fekete Tamás", phone: "+36302223344", email: "fekete.tamas@gmail.com",
    build_timeline: "1-2_ev", location: "Eger", owns_land: false,
    equity_amount: 3000000, needs_loan: true,
    status: "uj", assigned_to: "Tóth Andor", created_at: "2025-06-11T11:00:00Z",
    last_contacted_at: null, source: "facebook",
    notes: [], reminders: []
  },
  {
    id: "7", name: "Varga Mónika", phone: "+36703334455", email: "varga.m@gmail.com",
    build_timeline: "2_ev_felett", location: "Sopron", owns_land: false,
    equity_amount: 1500000, needs_loan: true,
    status: "uj", assigned_to: "Tóth Andor", created_at: "2025-06-11T13:00:00Z",
    last_contacted_at: null, source: "facebook",
    notes: [], reminders: []
  },
  {
    id: "8", name: "Molnár Zoltán", phone: "+36204445566", email: "molnar.z@gmail.com",
    build_timeline: "0-6_honap", location: "Kecskemét", owns_land: true,
    equity_amount: 15000000, needs_loan: false,
    status: "ajanlat", assigned_to: "Tóth Andor", created_at: "2025-06-07T08:00:00Z",
    last_contacted_at: "2025-06-10T14:00:00Z", source: "facebook",
    notes: [
      { id: "n3", content: "Ajánlat elküldve, várjuk a visszajelzést.", author: "Tóth Andor", created_at: "2025-06-10T14:30:00Z" }
    ],
    reminders: []
  },
  {
    id: "9", name: "Papp Julianna", phone: "+36305556677", email: "papp.juli@gmail.com",
    build_timeline: "1-2_ev", location: "Nyíregyháza", owns_land: false,
    equity_amount: 2500000, needs_loan: true,
    status: "elutasitva", assigned_to: "Tóth Andor", created_at: "2025-06-05T10:00:00Z",
    last_contacted_at: "2025-06-06T09:00:00Z", source: "facebook",
    notes: [
      { id: "n4", content: "Nem megfelelő anyagi helyzet, 2 év múlva újra hívható.", author: "Tóth Andor", created_at: "2025-06-06T09:30:00Z" }
    ],
    reminders: []
  },
  {
    id: "10", name: "Tóth Balázs", phone: "+36206667788", email: "toth.balazs@citromail.hu",
    build_timeline: "0-6_honap", location: "Győr", owns_land: true,
    equity_amount: 11000000, needs_loan: false,
    status: "szerzodve", assigned_to: "Tóth Andor", created_at: "2025-06-01T08:00:00Z",
    last_contacted_at: "2025-06-08T10:00:00Z", source: "facebook",
    notes: [], reminders: []
  }
];

// ─── SCORING ENGINE ──────────────────────────────────────────────────────────
function calculateScore(lead) {
  let score = 0;
  const timelineScores = { "0-6_honap": 30, "6-12_honap": 20, "1-2_ev": 10, "2_ev_felett": 0 };
  score += timelineScores[lead.build_timeline] || 0;
  if (lead.owns_land) score += 25;
  if (lead.equity_amount >= 10000000) score += 30;
  else if (lead.equity_amount >= 5000000) score += 20;
  else if (lead.equity_amount >= 2000000) score += 10;
  if (!lead.needs_loan) score += 15;
  else if (lead.equity_amount >= 5000000) score += 8;
  return score;
}

function getTier(score) {
  if (score >= 75) return "HOT";
  if (score >= 45) return "WARM";
  return "COLD";
}

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const STATUS_LABELS = {
  uj: "Új", kapcsolatban: "Kapcsolatban", targyalas: "Tárgyalás",
  ajanlat: "Ajánlat", szerzodve: "Szerződve", elutasitva: "Elutasítva", inaktiv: "Inaktív"
};
const STATUS_COLORS = {
  uj: "#3B82F6", kapcsolatban: "#8B5CF6", targyalas: "#F59E0B",
  ajanlat: "#F97316", szerzodve: "#10B981", elutasitva: "#EF4444", inaktiv: "#6B7280"
};
const TIMELINE_LABELS = {
  "0-6_honap": "0–6 hónap", "6-12_honap": "6–12 hónap",
  "1-2_ev": "1–2 év", "2_ev_felett": "2 év felett"
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function formatPhone(phone) {
  return phone.replace(/(\+36)(\d{2})(\d{3})(\d{4})/, "$1 $2 $3 $4");
}
function formatDate(isoStr) {
  if (!isoStr) return "—";
  const d = new Date(isoStr);
  return d.toLocaleDateString("hu-HU", { year: "numeric", month: "long", day: "numeric" });
}
function formatDateTime(isoStr) {
  if (!isoStr) return "—";
  const d = new Date(isoStr);
  return d.toLocaleDateString("hu-HU", { month: "short", day: "numeric" }) +
    " " + d.toLocaleTimeString("hu-HU", { hour: "2-digit", minute: "2-digit" });
}
function formatMoney(amt) {
  return (amt / 1000000).toFixed(1).replace(".0", "") + " M Ft";
}

// ─── SVG ICONS ───────────────────────────────────────────────────────────────
const Icons = {
  Phone: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.37 2.18 2 2 0 012.35.01h3a2 2 0 012 1.72c.13 1 .37 1.98.72 2.91a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.17-1.17a2 2 0 012.11-.45c.93.35 1.91.59 2.91.72a2 2 0 011.74 2.03z"/>
    </svg>
  ),
  Mail: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  MapPin: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:14,height:14}}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Land: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:14,height:14}}>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:14,height:14}}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Bank: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:14,height:14}}>
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  Bell: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}>
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}>
      <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/>
    </svg>
  ),
  Back: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}>
      <polyline points="15,18 9,12 15,6"/>
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}>
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}>
      <polyline points="20,6 9,17 4,12"/>
    </svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}>
      <polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}>
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Facebook: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{width:14,height:14}}>
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
    </svg>
  ),
  Filter: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}>
      <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"/>
    </svg>
  ),
  Star: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{width:12,height:12}}>
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
    </svg>
  ),
};

// ─── SCORE RING COMPONENT ────────────────────────────────────────────────────
function ScoreRing({ score, tier, size = 52 }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const tierColors = { HOT: "#EF4444", WARM: "#F59E0B", COLD: "#64748B" };
  const color = tierColors[tier];

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4"/>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={`${progress} ${circumference}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center"
      }}>
        <span style={{ fontSize: size < 48 ? 11 : 13, fontWeight: 700, color: "#F8FAFC", lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 8, color: color, fontWeight: 700, letterSpacing: "0.05em" }}>{tier}</span>
      </div>
    </div>
  );
}

// ─── TIER BADGE ──────────────────────────────────────────────────────────────
function TierBadge({ tier }) {
  const cfg = {
    HOT: { label: "🔴 HOT", bg: "rgba(239,68,68,0.15)", color: "#EF4444", border: "rgba(239,68,68,0.3)" },
    WARM: { label: "🟡 WARM", bg: "rgba(245,158,11,0.15)", color: "#F59E0B", border: "rgba(245,158,11,0.3)" },
    COLD: { label: "🔵 COLD", bg: "rgba(100,116,139,0.15)", color: "#94A3B8", border: "rgba(100,116,139,0.3)" },
  };
  const c = cfg[tier];
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`, letterSpacing: "0.08em"
    }}>{c.label}</span>
  );
}

// ─── STATUS BADGE ────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || "#6B7280";
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
      background: color + "22", color: color, border: `1px solid ${color}44`,
    }}>{STATUS_LABELS[status]}</span>
  );
}

// ─── CALL BUTTON ─────────────────────────────────────────────────────────────
function CallButton({ phone, compact = false }) {
  return (
    <a href={`tel:${phone}`} style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: compact ? "rgba(16,185,129,0.15)" : "#10B981",
      color: compact ? "#10B981" : "#fff",
      border: compact ? "1px solid rgba(16,185,129,0.4)" : "none",
      borderRadius: compact ? 20 : 10, padding: compact ? "5px 12px" : "10px 20px",
      fontWeight: 600, fontSize: compact ? 12 : 14, textDecoration: "none",
      transition: "all 0.15s", cursor: "pointer",
    }}>
      <Icons.Phone />
      {compact ? "Hívás" : "Hívás indítása"}
    </a>
  );
}

// ─── LEAD CARD ───────────────────────────────────────────────────────────────
function LeadCard({ lead, onClick }) {
  const score = calculateScore(lead);
  const tier = getTier(score);

  return (
    <div onClick={onClick} style={{
      background: "linear-gradient(135deg, #1E293B 0%, #1A2535 100%)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 14, padding: "14px 16px", marginBottom: 10, cursor: "pointer",
      transition: "transform 0.1s, border-color 0.15s",
      borderLeft: `3px solid ${tier === "HOT" ? "#EF4444" : tier === "WARM" ? "#F59E0B" : "#475569"}`,
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"}
    onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <ScoreRing score={score} tier={tier} size={52} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#F8FAFC", truncate: true }}>{lead.name}</span>
            <StatusBadge status={lead.status} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#94A3B8" }}>
              <Icons.MapPin />{lead.location}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: lead.owns_land ? "#10B981" : "#EF4444" }}>
              <Icons.Land />{lead.owns_land ? "Telek: ✓" : "Telek: ✗"}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#94A3B8" }}>
              <Icons.Calendar />{TIMELINE_LABELS[lead.build_timeline]}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "#64748B", display: "flex", alignItems: "center", gap: 4 }}>
              <Icons.Facebook />
              <span style={{ color: "#475569" }}>{formatDate(lead.created_at)}</span>
            </span>
            <div onClick={e => e.stopPropagation()}>
              <CallButton phone={lead.phone} compact />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD / LIST SCREEN ─────────────────────────────────────────────────
function DashboardScreen({ leads, onLeadClick, onAddLead }) {
  const [tierFilter, setTierFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const enriched = leads.map(l => ({ ...l, score: calculateScore(l), tier: getTier(calculateScore(l)) }))
    .sort((a, b) => b.score - a.score);

  const hotCount = enriched.filter(l => l.tier === "HOT").length;
  const warmCount = enriched.filter(l => l.tier === "WARM").length;
  const coldCount = enriched.filter(l => l.tier === "COLD").length;

  const filtered = enriched.filter(l => {
    if (tierFilter !== "ALL" && l.tier !== tierFilter) return false;
    if (statusFilter !== "ALL" && l.status !== statusFilter) return false;
    if (search && !l.name.toLowerCase().includes(search.toLowerCase()) &&
        !l.location.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div style={{
        background: "linear-gradient(180deg, #0F172A 0%, #111827 100%)",
        padding: "20px 16px 0", position: "sticky", top: 0, zIndex: 10
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: "#3B82F6", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>
              Lead Manager
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#F8FAFC", margin: 0 }}>Ügyfeleim</h1>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onAddLead} style={{
              background: "#3B82F6", border: "none", borderRadius: 10, width: 36, height: 36,
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff"
            }}><Icons.Plus /></button>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {[
            { key: "ALL", label: `Összes`, count: enriched.length, color: "#64748B" },
            { key: "HOT", label: "🔴 HOT", count: hotCount, color: "#EF4444" },
            { key: "WARM", label: "🟡 WARM", count: warmCount, color: "#F59E0B" },
            { key: "COLD", label: "🔵 COLD", count: coldCount, color: "#64748B" },
          ].map(tab => (
            <button key={tab.key} onClick={() => setTierFilter(tab.key)} style={{
              flex: 1, padding: "7px 4px", borderRadius: 8, border: "none", cursor: "pointer",
              background: tierFilter === tab.key ? tab.color + "22" : "rgba(255,255,255,0.04)",
              borderBottom: tierFilter === tab.key ? `2px solid ${tab.color}` : "2px solid transparent",
              color: tierFilter === tab.key ? tab.color : "#64748B", fontSize: 11, fontWeight: 700,
              transition: "all 0.15s",
            }}>
              <div style={{ fontSize: 14, fontWeight: 800 }}>{tab.count}</div>
              <div style={{ fontSize: 9, letterSpacing: "0.05em" }}>{tab.label}</div>
            </button>
          ))}
        </div>

        {/* Search + Filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#475569" }}>
              <Icons.Search />
            </div>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Keresés névben, városban..."
              style={{
                width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10, padding: "9px 12px 9px 34px", color: "#F8FAFC", fontSize: 13,
                outline: "none", boxSizing: "border-box"
              }}
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10, padding: "9px 10px", color: "#94A3B8", fontSize: 12, outline: "none", cursor: "pointer"
          }}>
            <option value="ALL">Minden státusz</option>
            {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>

      {/* List */}
      <div style={{ padding: "8px 16px 100px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#475569" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Nincs találat</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Próbálj más szűrőt</div>
          </div>
        ) : filtered.map(lead => (
          <LeadCard key={lead.id} lead={lead} onClick={() => onLeadClick(lead.id)} />
        ))}
      </div>
    </div>
  );
}

// ─── LEAD DETAIL SCREEN ──────────────────────────────────────────────────────
function LeadDetailScreen({ lead, onBack, onUpdate }) {
  const [activeTab, setActiveTab] = useState("info");
  const [notes, setNotes] = useState(lead.notes);
  const [reminders, setReminders] = useState(lead.reminders);
  const [newNote, setNewNote] = useState("");
  const [newReminder, setNewReminder] = useState({ message: "", remind_at: "" });
  const [status, setStatus] = useState(lead.status);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const score = calculateScore(lead);
  const tier = getTier(score);

  const handleStatusChange = (s) => {
    setStatus(s);
    setShowStatusMenu(false);
    onUpdate(lead.id, { status: s });
  };
  const addNote = () => {
    if (!newNote.trim()) return;
    const note = { id: Date.now().toString(), content: newNote, author: "Tóth Andor", created_at: new Date().toISOString() };
    const updated = [note, ...notes];
    setNotes(updated);
    onUpdate(lead.id, { notes: updated });
    setNewNote("");
  };
  const deleteNote = (id) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    onUpdate(lead.id, { notes: updated });
  };
  const addReminder = () => {
    if (!newReminder.message.trim() || !newReminder.remind_at) return;
    const r = { id: Date.now().toString(), ...newReminder, is_done: false };
    const updated = [r, ...reminders];
    setReminders(updated);
    onUpdate(lead.id, { reminders: updated });
    setNewReminder({ message: "", remind_at: "" });
  };
  const toggleReminder = (id) => {
    const updated = reminders.map(r => r.id === id ? { ...r, is_done: !r.is_done } : r);
    setReminders(updated);
    onUpdate(lead.id, { reminders: updated });
  };
  const deleteReminder = (id) => {
    const updated = reminders.filter(r => r.id !== id);
    setReminders(updated);
    onUpdate(lead.id, { reminders: updated });
  };

  const tierColors = { HOT: "#EF4444", WARM: "#F59E0B", COLD: "#64748B" };
  const accentColor = tierColors[tier];

  return (
    <div>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, #0F172A 0%, ${accentColor}22 100%)`,
        padding: "20px 16px 16px", position: "sticky", top: 0, zIndex: 10,
        borderBottom: "1px solid rgba(255,255,255,0.06)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <button onClick={onBack} style={{
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer", color: "#94A3B8", flexShrink: 0
          }}><Icons.Back /></button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: accentColor, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Lead adatlap
            </div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#F8FAFC" }}>{lead.name}</h2>
          </div>
          <ScoreRing score={score} tier={tier} size={56} />
        </div>

        {/* Quick actions */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <CallButton phone={lead.phone} />
          <a href={`mailto:${lead.email}`} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(59,130,246,0.15)", color: "#3B82F6",
            border: "1px solid rgba(59,130,246,0.35)", borderRadius: 10, padding: "10px 16px",
            fontWeight: 600, fontSize: 13, textDecoration: "none",
          }}>
            <Icons.Mail /> E-mail
          </a>
          <div style={{ position: "relative", marginLeft: "auto" }}>
            <button onClick={() => setShowStatusMenu(!showStatusMenu)} style={{
              background: STATUS_COLORS[status] + "22", border: `1px solid ${STATUS_COLORS[status]}44`,
              borderRadius: 10, padding: "10px 12px", cursor: "pointer",
              color: STATUS_COLORS[status], fontWeight: 600, fontSize: 12, display: "flex", alignItems: "center", gap: 6
            }}>
              {STATUS_LABELS[status]} ▾
            </button>
            {showStatusMenu && (
              <div style={{
                position: "absolute", right: 0, top: "calc(100% + 6px)", background: "#1E293B",
                border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, overflow: "hidden",
                zIndex: 100, minWidth: 160, boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
              }}>
                {Object.entries(STATUS_LABELS).map(([k, v]) => (
                  <button key={k} onClick={() => handleStatusChange(k)} style={{
                    display: "block", width: "100%", padding: "10px 16px", textAlign: "left",
                    background: status === k ? STATUS_COLORS[k] + "22" : "transparent",
                    color: status === k ? STATUS_COLORS[k] : "#94A3B8",
                    border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500,
                    borderBottom: "1px solid rgba(255,255,255,0.05)"
                  }}>{v}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4 }}>
          {[
            { key: "info", label: "Adatok" },
            { key: "notes", label: `Megjegyzések (${notes.length})` },
            { key: "reminders", label: `Emlékeztetők (${reminders.filter(r=>!r.is_done).length})` },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              flex: 1, padding: "8px 4px", background: "transparent", border: "none",
              borderBottom: `2px solid ${activeTab === tab.key ? accentColor : "transparent"}`,
              color: activeTab === tab.key ? accentColor : "#64748B",
              fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s"
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ padding: "16px", paddingBottom: 100 }}>

        {/* INFO TAB */}
        {activeTab === "info" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Contact */}
            <div style={{
              background: "#1E293B", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 14, overflow: "hidden"
            }}>
              <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Elérhetőség
              </div>
              <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 32, height: 32, background: "rgba(16,185,129,0.12)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981", flexShrink: 0 }}><Icons.Phone /></div>
                  <div>
                    <div style={{ fontSize: 11, color: "#475569", marginBottom: 2 }}>Telefonszám</div>
                    <a href={`tel:${lead.phone}`} style={{ fontSize: 15, color: "#10B981", fontWeight: 600, textDecoration: "none" }}>{formatPhone(lead.phone)}</a>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 32, height: 32, background: "rgba(59,130,246,0.12)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#3B82F6", flexShrink: 0 }}><Icons.Mail /></div>
                  <div>
                    <div style={{ fontSize: 11, color: "#475569", marginBottom: 2 }}>E-mail cím</div>
                    <div style={{ fontSize: 14, color: "#CBD5E1" }}>{lead.email}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project */}
            <div style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>Projekt adatok</div>
              <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { icon: <Icons.Calendar />, label: "Tervezett időzítés", value: TIMELINE_LABELS[lead.build_timeline], color: "#3B82F6" },
                  { icon: <Icons.MapPin />, label: "Helyszín", value: lead.location, color: "#8B5CF6" },
                  { icon: <Icons.Land />, label: "Saját telek", value: lead.owns_land ? "✓ Igen" : "✗ Nincs telek", color: lead.owns_land ? "#10B981" : "#EF4444" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 32, height: 32, background: item.color + "18", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: item.color, flexShrink: 0 }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize: 11, color: "#475569", marginBottom: 2 }}>{item.label}</div>
                      <div style={{ fontSize: 14, color: item.color, fontWeight: 600 }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial */}
            <div style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>Pénzügyi adatok</div>
              <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 32, height: 32, background: "rgba(245,158,11,0.12)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#F59E0B", flexShrink: 0 }}><Icons.Bank /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: "#475569", marginBottom: 2 }}>Önerő</div>
                    <div style={{ fontSize: 18, color: "#F59E0B", fontWeight: 800 }}>{formatMoney(lead.equity_amount)}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 32, height: 32, background: lead.needs_loan ? "rgba(239,68,68,0.12)" : "rgba(16,185,129,0.12)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: lead.needs_loan ? "#EF4444" : "#10B981", flexShrink: 0 }}><Icons.Bank /></div>
                  <div>
                    <div style={{ fontSize: 11, color: "#475569", marginBottom: 2 }}>Hitelből épít</div>
                    <div style={{ fontSize: 14, color: lead.needs_loan ? "#EF4444" : "#10B981", fontWeight: 600 }}>{lead.needs_loan ? "Igen, hitelt igénybe vesz" : "Nem — saját önerőből"}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Score breakdown */}
            <div style={{ background: "#1E293B", border: `1px solid ${accentColor}33`, borderRadius: 14, overflow: "hidden" }}>
              <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", display: "flex", justifyContent: "space-between" }}>
                <span>Pontozás részletei</span>
                <TierBadge tier={tier} />
              </div>
              <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Időzítés", val: { "0-6_honap": 30, "6-12_honap": 20, "1-2_ev": 10, "2_ev_felett": 0 }[lead.build_timeline] || 0, max: 30 },
                  { label: "Saját telek", val: lead.owns_land ? 25 : 0, max: 25 },
                  { label: "Önerő összege", val: lead.equity_amount >= 10000000 ? 30 : lead.equity_amount >= 5000000 ? 20 : lead.equity_amount >= 2000000 ? 10 : 0, max: 30 },
                  { label: "Hitelhelyzet", val: !lead.needs_loan ? 15 : lead.equity_amount >= 5000000 ? 8 : 0, max: 15 },
                ].map((item, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "#94A3B8" }}>{item.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: item.val > 0 ? accentColor : "#475569" }}>{item.val} / {item.max} pont</span>
                    </div>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(item.val / item.max) * 100}%`, background: accentColor, borderRadius: 2, transition: "width 0.4s ease" }} />
                    </div>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#F8FAFC" }}>Összpontszám</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: accentColor }}>{score} / 100</span>
                </div>
              </div>
            </div>

            <div style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "12px 16px" }}>
              <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#64748B" }}>
                <span>📅 Beérkezett: {formatDate(lead.created_at)}</span>
                <span>🤝 Utoljára: {formatDate(lead.last_contacted_at)}</span>
              </div>
            </div>
          </div>
        )}

        {/* NOTES TAB */}
        {activeTab === "notes" && (
          <div>
            <div style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 14, marginBottom: 12 }}>
              <textarea
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Új megjegyzés írása..."
                rows={3}
                style={{
                  width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, padding: "10px 12px", color: "#F8FAFC", fontSize: 13, resize: "none",
                  outline: "none", boxSizing: "border-box", marginBottom: 10, fontFamily: "inherit"
                }}
              />
              <button onClick={addNote} style={{
                background: "#3B82F6", border: "none", borderRadius: 10, padding: "9px 18px",
                color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6
              }}><Icons.Plus /> Megjegyzés mentése</button>
            </div>

            {notes.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#475569" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📝</div>
                <div style={{ fontSize: 14 }}>Még nincs megjegyzés</div>
              </div>
            ) : notes.map(note => (
              <div key={note.id} style={{
                background: "#1E293B", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 12, padding: "12px 14px", marginBottom: 8
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#3B82F6" }}>{note.author}</span>
                    <span style={{ fontSize: 11, color: "#475569", marginLeft: 8 }}>{formatDateTime(note.created_at)}</span>
                  </div>
                  <button onClick={() => deleteNote(note.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 4, display: "flex" }}><Icons.Trash /></button>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "#CBD5E1", lineHeight: 1.5 }}>{note.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* REMINDERS TAB */}
        {activeTab === "reminders" && (
          <div>
            <div style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 14, marginBottom: 12 }}>
              <input
                value={newReminder.message}
                onChange={e => setNewReminder(p => ({ ...p, message: e.target.value }))}
                placeholder="Emlékeztető leírása..."
                style={{
                  width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, padding: "10px 12px", color: "#F8FAFC", fontSize: 13,
                  outline: "none", boxSizing: "border-box", marginBottom: 8, fontFamily: "inherit"
                }}
              />
              <input
                type="datetime-local"
                value={newReminder.remind_at}
                onChange={e => setNewReminder(p => ({ ...p, remind_at: e.target.value }))}
                style={{
                  width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, padding: "10px 12px", color: "#94A3B8", fontSize: 13,
                  outline: "none", boxSizing: "border-box", marginBottom: 10, fontFamily: "inherit"
                }}
              />
              <button onClick={addReminder} style={{
                background: "#F59E0B", border: "none", borderRadius: 10, padding: "9px 18px",
                color: "#000", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6
              }}><Icons.Bell /> Emlékeztető mentése</button>
            </div>

            {reminders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#475569" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>⏰</div>
                <div style={{ fontSize: 14 }}>Nincs emlékeztető</div>
              </div>
            ) : reminders.map(r => (
              <div key={r.id} style={{
                background: "#1E293B", border: `1px solid ${r.is_done ? "rgba(255,255,255,0.04)" : "rgba(245,158,11,0.2)"}`,
                borderRadius: 12, padding: "12px 14px", marginBottom: 8, opacity: r.is_done ? 0.5 : 1,
                transition: "all 0.2s"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button onClick={() => toggleReminder(r.id)} style={{
                    width: 26, height: 26, borderRadius: 8, border: `2px solid ${r.is_done ? "#10B981" : "#F59E0B"}`,
                    background: r.is_done ? "#10B981" : "transparent", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0
                  }}>
                    {r.is_done && <Icons.Check />}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: r.is_done ? "#475569" : "#F8FAFC", fontWeight: 500, textDecoration: r.is_done ? "line-through" : "none" }}>{r.message}</div>
                    <div style={{ fontSize: 11, color: "#475569", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                      <Icons.Calendar />{formatDateTime(r.remind_at)}
                    </div>
                  </div>
                  <button onClick={() => deleteReminder(r.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 4, display: "flex" }}><Icons.Trash /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ADD LEAD SCREEN ─────────────────────────────────────────────────────────
function AddLeadScreen({ onBack, onSave }) {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", build_timeline: "6-12_honap",
    location: "", owns_land: false, equity_amount: "", needs_loan: false
  });
  const [preview, setPreview] = useState(null);

  const up = (k, v) => {
    const updated = { ...form, [k]: v };
    setForm(updated);
    if (updated.equity_amount) {
      const mock = { ...updated, equity_amount: parseInt(updated.equity_amount) || 0 };
      setPreview({ score: calculateScore(mock), tier: getTier(calculateScore(mock)) });
    }
  };

  const handleSave = () => {
    if (!form.name || !form.phone) return;
    const newLead = {
      id: Date.now().toString(), ...form,
      equity_amount: parseInt(form.equity_amount) || 0,
      status: "uj", assigned_to: "Tóth Andor",
      created_at: new Date().toISOString(), last_contacted_at: null,
      source: "manual", notes: [], reminders: []
    };
    onSave(newLead);
  };

  const Field = ({ label, children }) => (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B", letterSpacing: "0.07em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, padding: "11px 14px", color: "#F8FAFC", fontSize: 14,
    outline: "none", boxSizing: "border-box", fontFamily: "inherit"
  };

  return (
    <div>
      <div style={{ background: "#0F172A", padding: "20px 16px 16px", position: "sticky", top: 0, zIndex: 10, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onBack} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#94A3B8" }}><Icons.Back /></button>
          <div>
            <div style={{ fontSize: 11, color: "#3B82F6", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Új lead</div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#F8FAFC" }}>Lead hozzáadása</h2>
          </div>
          {preview && (
            <div style={{ marginLeft: "auto" }}>
              <ScoreRing score={preview.score} tier={preview.tier} size={48} />
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: "16px", paddingBottom: 120 }}>
        <div style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>Személyes adatok</div>
          <Field label="Teljes név *"><input value={form.name} onChange={e => up("name", e.target.value)} placeholder="Pl. Kovács Péter" style={inputStyle} /></Field>
          <Field label="Telefonszám *"><input value={form.phone} onChange={e => up("phone", e.target.value)} placeholder="+36 30 000 0000" style={inputStyle} /></Field>
          <Field label="E-mail cím"><input value={form.email} onChange={e => up("email", e.target.value)} placeholder="pelda@email.hu" type="email" style={inputStyle} /></Field>
        </div>

        <div style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>Projekt adatok</div>
          <Field label="Építkezés tervezett ideje">
            <select value={form.build_timeline} onChange={e => up("build_timeline", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
              <option value="0-6_honap">0–6 hónap</option>
              <option value="6-12_honap">6–12 hónap</option>
              <option value="1-2_ev">1–2 év</option>
              <option value="2_ev_felett">2 év felett</option>
            </select>
          </Field>
          <Field label="Helyszín"><input value={form.location} onChange={e => up("location", e.target.value)} placeholder="Pl. Budapest, Győr..." style={inputStyle} /></Field>
          <Field label="Saját telek">
            <div style={{ display: "flex", gap: 10 }}>
              {[true, false].map(v => (
                <button key={String(v)} onClick={() => up("owns_land", v)} style={{
                  flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer",
                  background: form.owns_land === v ? (v ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)") : "rgba(255,255,255,0.04)",
                  border: `1px solid ${form.owns_land === v ? (v ? "#10B981" : "#EF4444") : "rgba(255,255,255,0.1)"}`,
                  color: form.owns_land === v ? (v ? "#10B981" : "#EF4444") : "#64748B",
                  fontWeight: 600, fontSize: 13,
                }}>{v ? "✓ Igen" : "✗ Nincs"}</button>
              ))}
            </div>
          </Field>
        </div>

        <div style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>Pénzügyi adatok</div>
          <Field label="Önerő összege (Ft)"><input value={form.equity_amount} onChange={e => up("equity_amount", e.target.value)} placeholder="Pl. 5000000" type="number" style={inputStyle} /></Field>
          <Field label="Hitel igénybevétele">
            <div style={{ display: "flex", gap: 10 }}>
              {[false, true].map(v => (
                <button key={String(v)} onClick={() => up("needs_loan", v)} style={{
                  flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer",
                  background: form.needs_loan === v ? (v ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)") : "rgba(255,255,255,0.04)",
                  border: `1px solid ${form.needs_loan === v ? (v ? "#EF4444" : "#10B981") : "rgba(255,255,255,0.1)"}`,
                  color: form.needs_loan === v ? (v ? "#EF4444" : "#10B981") : "#64748B",
                  fontWeight: 600, fontSize: 13,
                }}>{v ? "Igen, hitelt vesz" : "Nem kell hitel"}</button>
              ))}
            </div>
          </Field>
        </div>

        <button onClick={handleSave} disabled={!form.name || !form.phone} style={{
          width: "100%", background: form.name && form.phone ? "#3B82F6" : "#1E293B",
          border: "none", borderRadius: 14, padding: "16px", color: form.name && form.phone ? "#fff" : "#475569",
          fontWeight: 700, fontSize: 16, cursor: form.name && form.phone ? "pointer" : "not-allowed",
          transition: "all 0.15s"
        }}>
          Lead mentése
        </button>
      </div>
    </div>
  );
}

// ─── SETTINGS SCREEN ─────────────────────────────────────────────────────────
function SettingsScreen({ leads }) {
  const enriched = leads.map(l => ({ ...l, score: calculateScore(l), tier: getTier(calculateScore(l)) }));
  const hot = enriched.filter(l => l.tier === "HOT").length;
  const warm = enriched.filter(l => l.tier === "WARM").length;
  const cold = enriched.filter(l => l.tier === "COLD").length;
  const contracted = enriched.filter(l => l.status === "szerzodve").length;
  const convRate = leads.length > 0 ? ((contracted / leads.length) * 100).toFixed(0) : 0;
  const avgScore = leads.length > 0 ? Math.round(enriched.reduce((s, l) => s + l.score, 0) / leads.length) : 0;

  return (
    <div style={{ padding: "24px 16px 100px" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: "#3B82F6", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Beállítások</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#F8FAFC", margin: 0 }}>Statisztikák & Info</h1>
      </div>

      {/* Stats */}
      <div style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden", marginBottom: 14 }}>
        <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>Összefoglaló</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(255,255,255,0.05)" }}>
          {[
            { label: "Összes lead", value: leads.length, color: "#F8FAFC" },
            { label: "Átlag score", value: avgScore + " pont", color: "#3B82F6" },
            { label: "Szerződve", value: contracted, color: "#10B981" },
            { label: "Konverzió", value: convRate + "%", color: "#F59E0B" },
          ].map((stat, i) => (
            <div key={i} style={{ background: "#1E293B", padding: "14px 16px" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Priority distribution */}
      <div style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 16, marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>Prioritás megoszlás</div>
        {[
          { tier: "HOT", count: hot, color: "#EF4444" },
          { tier: "WARM", count: warm, color: "#F59E0B" },
          { tier: "COLD", count: cold, color: "#64748B" },
        ].map(item => (
          <div key={item.tier} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: item.color, fontWeight: 700 }}>{item.tier}</span>
              <span style={{ fontSize: 13, color: "#64748B" }}>{item.count} lead</span>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: leads.length > 0 ? `${(item.count / leads.length) * 100}%` : "0%", background: item.color, borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Scoring info */}
      <div style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden", marginBottom: 14 }}>
        <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase" }}>Pontozási rendszer</div>
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: "Időzítés (0-6 hónap)", points: 30 },
            { label: "Saját telek", points: 25 },
            { label: "Önerő (10M+ Ft)", points: 30 },
            { label: "Nincs hitelszükséglet", points: 15 },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "#94A3B8" }}>{item.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#3B82F6" }}>max {item.points} p</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#F8FAFC" }}>Összesen</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#3B82F6" }}>100 pont</span>
          </div>
        </div>
      </div>

      <div style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 16 }}>
        <div style={{ fontSize: 12, color: "#475569", marginBottom: 8 }}>Értékesítő</div>
        <div style={{ fontSize: 15, color: "#F8FAFC", fontWeight: 600 }}>Tóth Andor</div>
        <div style={{ fontSize: 12, color: "#475569", marginTop: 12, marginBottom: 4 }}>Adatforrás</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
          <span style={{ fontSize: 13, color: "#10B981" }}>Facebook Lead Ads — aktív</span>
        </div>
        <div style={{ fontSize: 12, color: "#475569", marginTop: 12, marginBottom: 4 }}>Verzió</div>
        <div style={{ fontSize: 13, color: "#64748B" }}>Lead Manager v1.0 · Build 2025.06</div>
      </div>
    </div>
  );
}

// ─── BOTTOM NAVIGATION ───────────────────────────────────────────────────────
function BottomNav({ screen, setScreen, hotCount }) {
  const tabs = [
    { key: "dashboard", label: "Leadek", icon: <Icons.Star /> },
    { key: "settings", label: "Info", icon: <Icons.Settings /> },
  ];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430,
      background: "rgba(15,23,42,0.95)", backdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(255,255,255,0.08)",
      display: "flex", zIndex: 50, paddingBottom: "env(safe-area-inset-bottom, 0px)"
    }}>
      {tabs.map(tab => (
        <button key={tab.key} onClick={() => setScreen(tab.key)} style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "12px 0 10px", background: "none", border: "none", cursor: "pointer",
          color: screen === tab.key ? "#3B82F6" : "#475569", transition: "color 0.15s",
          position: "relative"
        }}>
          {tab.icon}
          <span style={{ fontSize: 10, fontWeight: 600, marginTop: 4 }}>{tab.label}</span>
          {tab.key === "dashboard" && hotCount > 0 && (
            <div style={{
              position: "absolute", top: 8, right: "calc(50% - 12px)",
              background: "#EF4444", color: "#fff", fontSize: 9, fontWeight: 700,
              width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"
            }}>{hotCount}</div>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [screen, setScreen] = useState("dashboard");
  const [selectedLeadId, setSelectedLeadId] = useState(null);

  const handleLeadClick = (id) => {
    setSelectedLeadId(id);
    setScreen("detail");
  };
  const handleUpdate = (id, changes) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...changes } : l));
  };
  const handleAddLead = (newLead) => {
    setLeads(prev => [newLead, ...prev]);
    setScreen("dashboard");
  };

  const selectedLead = leads.find(l => l.id === selectedLeadId);
  const hotCount = leads.filter(l => getTier(calculateScore(l)) === "HOT" && l.status === "uj").length;

  const showNav = screen === "dashboard" || screen === "settings";

  return (
    <div style={{
      minHeight: "100vh", background: "#0F172A",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      display: "flex", justifyContent: "center"
    }}>
      <div style={{ width: "100%", maxWidth: 430, position: "relative", minHeight: "100vh", overflowX: "hidden" }}>
        <div style={{ overflowY: "auto", height: "100vh" }}>
          {screen === "dashboard" && (
            <DashboardScreen
              leads={leads}
              onLeadClick={handleLeadClick}
              onAddLead={() => setScreen("add")}
            />
          )}
          {screen === "detail" && selectedLead && (
            <LeadDetailScreen
              lead={selectedLead}
              onBack={() => setScreen("dashboard")}
              onUpdate={handleUpdate}
            />
          )}
          {screen === "add" && (
            <AddLeadScreen
              onBack={() => setScreen("dashboard")}
              onSave={handleAddLead}
            />
          )}
          {screen === "settings" && (
            <SettingsScreen leads={leads} />
          )}
        </div>
        {showNav && <BottomNav screen={screen} setScreen={setScreen} hotCount={hotCount} />}
      </div>
    </div>
  );
}
