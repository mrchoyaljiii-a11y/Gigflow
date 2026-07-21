import React, { useMemo, useState } from "react";
import {
  FiChevronRight,
  FiChevronLeft,
  FiFileText,
  FiBriefcase,
  FiCheckCircle,
  FiPower,
  FiDollarSign,
  FiEye,
  FiMoreVertical,
} from "react-icons/fi";

import { NavLink,Navigate } from "react-router-dom";

import { useGetAllContracts } from "../../../../hooks/contract_releted/useGetAllContracts.js";

/* --------------------------- style maps --------------------------- */
//states tone style
const TONE = {
  blue: { bg: "bg-blue-600", ring: "group-hover:ring-blue-200" },
  green: { bg: "bg-emerald-500", ring: "group-hover:ring-emerald-200" },
  purple: { bg: "bg-violet-500", ring: "group-hover:ring-violet-200" },
  amber: { bg: "bg-amber-500", ring: "group-hover:ring-amber-200" },
};

const AVATAR_TONES = ["bg-slate-700", "bg-rose-500", "bg-sky-500", "bg-amber-500", "bg-emerald-500", "bg-violet-500"];

// normalize backend contractStatus -> display label
const STATUS_LABEL = {
  active: "Active",
  completed: "Completed",
  hold: "On Hold",
  onhold: "On Hold",
  canceled: "Canceled",
  cancelled: "Canceled",
};

const STATUS_BADGE = {
  Active: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200",
  "On Hold": "bg-amber-50 text-amber-600 ring-1 ring-amber-200",
  Completed: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200",
  Canceled: "bg-red-50 text-red-500 ring-1 ring-red-200",
};

const BAR_COLOR = {
  Active: "bg-blue-500",
  "On Hold": "bg-amber-400",
  Completed: "bg-emerald-500",
  Canceled: "bg-slate-200",
};

const END_TONE = {
  slate: "text-slate-700",
  amber: "text-amber-500",
  green: "text-emerald-500",
  red: "text-red-500",
};



const PAGE_SIZE = 8;

/* ------------------------------ helpers ------------------------------ */

// handles both plain ISO strings and Mongo extended JSON { "$date": "..." } from the backend
function toDate(dateInput) {
  if (!dateInput) return null;
  const raw = typeof dateInput === "object" && dateInput.$date ? dateInput.$date : dateInput;
  const d = new Date(raw);
  return isNaN(d) ? null : d;
}

function formatDate(dateInput) {
  const d = toDate(dateInput);
  if (!d) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function daysLeft(dateInput) {
  const d = toDate(dateInput);
  if (!d) return null;
  return Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24));
}

function getInitials(first = "", last = "") {
  return `${first[0] || ""}${last[0] || ""}`.toUpperCase() || "??";
}

function avatarToneForId(id = "") {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash + id.charCodeAt(i)) % AVATAR_TONES.length;
  return AVATAR_TONES[hash];
}

// computes milestone progress using milestoneStatus, and finds the next pending milestone
function getMilestoneProgress(milestones = []) {

  const DONE_MILESTONE_STATUSES = ["released", "approved"]; // if the milestone status is in this list, it's done and completed

  const total = milestones.length;
  if (total === 0) {
    return { label: "No milestones added yet!", pct: 0, next: null, completedCount: 0, total: 0 };
  }

  const completedCount = milestones.filter((m) =>
    DONE_MILESTONE_STATUSES.includes((m.milestoneStatus || "").toLowerCase())
  ).length;

  // progress bar width as a percentage
  const pct = Math.round((completedCount / total) * 100);

  const pending = milestones
    .filter((m) => !DONE_MILESTONE_STATUSES.includes((m.milestoneStatus || "").toLowerCase()))
    .sort((a, b) => {
      const da = toDate(a.milestoneDueDate);
      const db = toDate(b.milestoneDueDate);
      if (!da) return 1;
      if (!db) return -1;
      return da - db;
    });

  const next = pending[0] || null;

  const label = completedCount === total ? "Completed" : `Milestone ${completedCount} of ${total}`;

  return { label, pct, next, completedCount, total };
}

function getBudget(payment, agreedPrice) {
  if (payment?.totleBudget != null) return `$${payment.totleBudget.toLocaleString()}`;
  if (agreedPrice != null) return `$${agreedPrice.toLocaleString()}`;
  return "—";
}

function mapContract(raw) {

  const status = STATUS_LABEL[(raw.contractStatus || "").toLowerCase()] || raw.contractStatus || "Active";
  const freelancer = raw.freelancerId || {};
  const fullName = `${freelancer.firstName || ""} ${freelancer.lastName || ""}`.trim() || "Unknown";
  const milestoneInfo = getMilestoneProgress(raw.milestones);

  let endNote = formatDate(raw.endDate);
  let endTone = "slate";
  if (status === "Completed") {
    endNote = "Completed";
    endTone = "green";
  } else if (status === "Canceled") {
    endNote = "Canceled";
    endTone = "red";
  } else if (status === "On Hold") {
    endNote = "On Hold";
    endTone = "amber";
  } else {
    const d = daysLeft(raw.endDate);
    endNote = d != null ? (d >= 0 ? `${d} days left` : "Overdue") : "";
    endTone = d != null && d < 0 ? "red" : "slate";
  }

  return {
    id: raw._id?.$oid || raw._id,
    name: fullName,
    handle: freelancer.email ? `@${freelancer.email.split("@")[0]}` : "",
    initials: getInitials(freelancer.firstName, freelancer.lastName),
    avatarTone: avatarToneForId(freelancer._id || raw._id),
    avatarImg: freelancer.profileImage?.url,
    dot: status === "Canceled" ? "red" : "green",
    project: raw.contractTitle,
    contractNumber: raw.contractNumber,
    status,
    milestoneLabel: milestoneInfo.label,
    milestonePct: milestoneInfo.pct,
    nextMilestone: milestoneInfo.next,
    milestoneCompletedCount: milestoneInfo.completedCount,
    milestoneTotal: milestoneInfo.total,
    budget: getBudget(raw.payment, raw.AgreedPrice),
    type: raw.contractType === "Fixed" ? "Fixed Price" : raw.contractType || "—",
    start: formatDate(raw.startDate),
    end: formatDate(raw.endDate),
    endNote,
    endTone,
  };
}

//! main component start here.....
export default function Client_contracts() {

  const [tab, setTab] = useState("all");
  const [page, setPage] = useState(1);

  const { data: rawContracts = [], isLoading, isError, error } = useGetAllContracts();

  const contracts = useMemo(() => rawContracts.map(mapContract), [rawContracts]);

  const stats = useMemo(() => {
    const total = contracts.length;
    const active = contracts.filter((c) => c.status === "Active").length;
    const completed = contracts.filter((c) => c.status === "Completed").length;
    const onHold = contracts.filter((c) => c.status === "On Hold").length;

    const totalSpent = rawContracts.reduce((sum, r) => sum + (r.payment?.totalReleased || 0), 0);

    return [
      { label: "Total Contracts", value: String(total), sub: "All time", icon: FiFileText, tone: "blue" },
      { label: "Active Contracts", value: String(active), sub: "Currently in progress", icon: FiBriefcase, tone: "green" },
      { label: "Completed Contracts", value: String(completed), sub: "Successfully completed", icon: FiCheckCircle, tone: "purple" },
      { label: "On Hold", value: String(onHold), sub: "Currently paused", icon: FiPower, tone: "amber" },
      { label: "Total Spent", value: `$${totalSpent.toLocaleString()}`, sub: "Across all contracts", icon: FiDollarSign, tone: "blue" },
    ];
  }, [contracts, rawContracts]);

  const tabs = useMemo(() => {
    const counts = { all: contracts.length, active: 0, completed: 0, hold: 0, canceled: 0 };
    contracts.forEach((c) => {
      if (c.status === "Active") counts.active++;
      else if (c.status === "Completed") counts.completed++;
      else if (c.status === "On Hold") counts.hold++;
      else if (c.status === "Canceled") counts.canceled++;
    });

    return [
      { key: "all", label: "All Contracts", count: counts.all },
      { key: "active", label: "Active", count: counts.active },
      { key: "completed", label: "Completed", count: counts.completed },
      { key: "hold", label: "On Hold", count: counts.hold },
      { key: "canceled", label: "Canceled", count: counts.canceled },
    ];

  }, [contracts]);

  // show conteacts based on its status like active , pemding , compalete, etc...
  const filtered = useMemo(() => {

    if (tab === "all") return contracts;

    const map = { active: "Active", completed: "Completed", hold: "On Hold", canceled: "Canceled" };
    
    return contracts.filter((c) => c.status === map[tab]);

  }, [contracts, tab]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const pageSafe = Math.min(page, pageCount);


  const paginated = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  const handleTabChange = (key) => {
    setTab(key);
    setPage(1);
  };

  return (
    <div className="main container mx-auto bg-slate-50 font-sans">
      <div className="">
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/70 overflow-hidden">
          {/* ---------- header ---------- */}
          <div className="flex items-center justify-between gap-6 px-7 py-5 border-b border-slate-100">
            <div>
              <h1 className="text-[19px] font-semibold text-slate-900">My Contracts</h1>
            </div>
          </div>

          {/* ---------- stat cards ---------- */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 px-7 py-6">
            {stats.map((s) => {
              const Icon = s.icon;
              const tone = TONE[s.tone];
              return (
                <div
                  key={s.label}
                  className="group bg-white rounded-xl ring-1 ring-slate-200 px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/70 hover:ring-slate-300 cursor-default"
                >
                  <div className={`w-10 h-10 rounded-lg ${tone.bg}  flex items-center justify-center text-white mb-3 ring-4 ring-transparent transition-all duration-200 ${tone.ring}`}>
                    <Icon size={18} strokeWidth={2} />
                  </div>

                  <p className="text-[13px] text-slate-500">{s.label}</p>
                  <p className="text-[22px] font-semibold text-slate-900 leading-tight mt-0.5">{s.value}</p>
                  <p className="text-[12px] text-slate-700 mt-0.5">{s.sub}</p>
                </div>
              );
            })}
          </div>

          {/* ---------- tabs ---------- */}
          <div className="flex items-center justify-between gap-4 px-7 border-b border-slate-100 flex-wrap">
            <div className="flex items-center gap-6">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => handleTabChange(t.key)}
                  className={`relative flex items-center gap-1.5 py-4 text-[0.9rem] font-medium transition-colors duration-150 ${
                    tab === t.key ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {t.label}

                  <span className={`text-[11px] px-1.5 py-0.5 rounded-md ${tab === t.key ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"}`}>
                    {t.count}
                  </span>

                  {tab === t.key && <span className="absolute left-0 right-0 -bottom-px h-[2px] rounded-full bg-blue-600" />}

                </button>
              ))}
            </div>
          </div>

          {/* ---------- loading / error / empty ---------- */}
          {isLoading && (
            <div className="px-7 py-16 text-center text-slate-700 text-sm">Loading contracts…</div>
          )}
          {isError && (
            <div className="px-7 py-16 text-center text-red-500 text-sm">
              Failed to load contracts{error?.message ? `: ${error.message}` : "."}
            </div>
          )}
          {!isLoading && !isError && filtered.length === 0 && (
            <div className="px-7 py-16 text-center text-slate-700 text-sm">No contracts found.</div>
          )}

          {/* ---------- table ---------- */}
          {!isLoading && !isError && filtered.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1020px]">

                <thead>
                  <tr className="text-[11px] uppercase tracking-wide text-slate-700">
                    <th className="px-7 py-3 font-medium">Contract &amp; Freelancer</th>
                    <th className="px-3 py-3 font-medium">Project</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-3 py-3 font-medium">Milestone / Progress</th>
                    <th className="px-3 py-3 font-medium">Budget</th>
                    <th className="px-3 py-3 font-medium">Start Date</th>
                    <th className="px-3 py-3 font-medium">End Date</th>
                    <th className="px-7 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginated.map((c) => (
                    <tr key={c.id} className="group border-t border-slate-100 transition-colors duration-150 hover:bg-slate-50/80">
                      <td className="px-7 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            {c.avatarImg ? (
                              <img
                                src={c.avatarImg}
                                alt={c.name}
                                className="w-9 h-9 rounded-full object-cover transition-transform duration-200 group-hover:scale-105"
                              />
                            ) : (
                              <div className={`w-9 h-9 rounded-full ${c.avatarTone} text-white text-[12px] font-semibold flex items-center justify-center transition-transform duration-200 group-hover:scale-105`}>
                                {c.initials}
                              </div>
                            )}
                            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white ${c.dot === "green" ? "bg-emerald-500" : "bg-red-500"}`} />
                          </div>
                          <div>
                            <p className="text-[13.5px] font-medium text-slate-800">{c.name}</p>
                            <p className="text-[12px] text-slate-700">{c.handle}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-4 text-[13.5px] text-slate-600 max-w-[190px]">
                        <p>{c.project}</p>
                        <p className="text-[11px] text-slate-700">{c.contractNumber}</p>
                      </td>

                      <td className="px-3 py-4">
                        <span className={`inline-block text-[12px] font-medium px-2.5 py-1 rounded-full ${STATUS_BADGE[c.status]}`}>
                          {c.status}
                        </span>
                      </td>

                      <td className="px-3 py-4 min-w-[190px]">
                        <div className="flex items-center justify-between text-[12.5px] mb-1.5">
                          <span className="text-slate-800">{c.milestoneLabel}</span>
                          <span className="font-medium text-slate-700">{c.milestonePct}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${BAR_COLOR[c.status]} transition-all duration-500`}
                            style={{ width: `${c.milestonePct}%` }}
                          />
                        </div>
                        {c.nextMilestone && (
                          <p className="text-[11px] text-slate-700 mt-1.5 truncate" title={c.nextMilestone.milestoneTitle}>
                            Next: {c.nextMilestone.milestoneTitle} · ${c.nextMilestone.milestoneAmount} · due {formatDate(c.nextMilestone.milestoneDueDate)}
                          </p>
                        )}
                      </td>

                      <td className="px-3 py-4">
                        <p className="text-[13.5px] font-medium text-slate-800">{c.budget}</p>
                        <p className="text-[12px] text-slate-700">{c.type}</p>
                      </td>

                      <td className="px-3 py-4 text-[13px] text-slate-600 whitespace-nowrap">{c.start}</td>

                      <td className="px-3 py-4 whitespace-nowrap">
                        <p className="text-[13px] text-slate-600">{c.end}</p>
                        <p className={`text-[12px] ${END_TONE[c.endTone]}`}>{c.endNote}</p>
                      </td>

                      <td className="px-7 py-4">
                        <div className="flex items-center justify-end gap-2">
                          
                          <NavLink to={`/contracts/${c.id}`} >
                            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 ring-1 ring-slate-200 transition-all duration-200 hover:text-blue-600 hover:ring-blue-300 hover:bg-blue-50 hover:shadow-sm active:scale-95">
                            <FiEye size={15} />   
                          </button>
                          </NavLink>

                          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 ring-1 ring-slate-200 transition-all duration-200 hover:text-slate-700 hover:ring-slate-300 hover:bg-slate-50 hover:shadow-sm active:scale-95">
                            <FiMoreVertical size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ---------- pagination ---------- */}
          {!isLoading && !isError && filtered.length > 0 && (
            <div className="flex items-center justify-between px-7 py-5 border-t border-slate-100">
              <p className="text-[13px] text-slate-700">
                Showing {(pageSafe - 1) * PAGE_SIZE + 1} to {Math.min(pageSafe * PAGE_SIZE, filtered.length)} of {filtered.length} contracts
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={pageSafe === 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 ring-1 ring-slate-200 transition-all duration-200 hover:bg-slate-50 hover:ring-slate-300 disabled:opacity-40 "
                >
                  <FiChevronLeft size={15} />
                </button>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-8 h-8 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                      n === pageSafe
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                        : "text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 hover:ring-slate-300"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={pageSafe === pageCount}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 ring-1 ring-slate-200 transition-all duration-200 hover:bg-slate-50 hover:ring-slate-300 disabled:opacity-40"
                >
                  <FiChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}