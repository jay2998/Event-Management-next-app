"use client";

import PageTitle from "../components/PageTitle";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle, Building2, CalendarDays, Car, ChevronLeft, ChevronRight,
  ClipboardList, Clock, PackageCheck, ShieldCheck, Sparkles,
  Utensils, WalletCards, Users, Check, X, PartyPopper, Heart,
  Briefcase, Cake, Smile, Bell, DollarSign, Truck, Wifi,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell,
} from "recharts";
import { dashboardApi, notificationsApi } from "../../lib/api";

const currency = new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 });

const safeList = (r) => r?.data?.data || r?.data || [];

const statFallback = (bookings, stats) => {
  const rows = Array.isArray(bookings) ? bookings : [];
  return {
    totalBookings: stats.totalBookings ?? stats.total ?? rows.length,
    confirmedBookings: stats.confirmedBookings ?? stats.confirmed ?? rows.filter((b) => b.status === "confirmed").length,
    pendingBookings: stats.pendingBookings ?? stats.pending ?? rows.filter((b) => b.status === "pending").length,
    totalRevenue: stats.totalRevenue ?? rows.reduce((s, b) => s + Number(b.totalAmount || b.amount || 0), 0),
  };
};

const daysUntil = (date) => {
  if (!date) return null;
  const t = new Date(); t.setHours(0, 0, 0, 0);
  const d = new Date(date); d.setHours(0, 0, 0, 0);
  return Math.ceil((d - t) / 86400000);
};

const formatDate = (d) => d ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(d)) : "";

const EVENT_TYPES = {
  wedding:    { color: "#be185d", bg: "#fdf2f8", label: "Wedding",   icon: Heart },
  corporate:  { color: "#1d4ed8", bg: "#eff6ff", label: "Corporate", icon: Briefcase },
  birthday:   { color: "#d97706", bg: "#fffbeb", label: "Birthday",  icon: Cake },
  gala:       { color: "#7c3aed", bg: "#f5f3ff", label: "Gala",      icon: PartyPopper },
  other:      { color: "#8b7355", bg: "#f5f1ea", label: "Event",     icon: Sparkles },
};

const getEventType = (b) => {
  const raw = `${b.eventType || ""} ${b.eventName || ""}`.toLowerCase();
  if (/wedding|nikah|walima|bridal|nikkah/.test(raw)) return "wedding";
  if (/corporate|conference|seminar|meeting|summit/.test(raw)) return "corporate";
  if (/birthday|annivers|bday/.test(raw)) return "birthday";
  if (/gala|awards|charity|dinner|ball/.test(raw)) return "gala";
  return "other";
};

/* ── Compact Stat Card ── */
function StatCard({ title, value, icon }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border-2 border-[#c4b096]/70 bg-[#f9f3e8] px-4 py-2.5 shadow-sm">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#d4af37]/15 to-[#c4975a]/10 text-[#c4975a]">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-black/45">{title}</div>
        <div className="text-lg font-black text-[#3d2c1f] truncate leading-tight">{value}</div>
      </div>
    </div>
  );
}

/* ── Status Badge ── */
function StatusBadge({ status }) {
  const map = {
    confirmed:  { bg: "bg-green-100", text: "text-green-800" },
    pending:    { bg: "bg-[#fff8dc]", text: "text-[#8a6a00]" },
    cancelled:  { bg: "bg-red-100",   text: "text-red-800" },
  };
  const s = map[status?.toLowerCase()] || map.pending;
  return <span className={`${s.bg} ${s.text} inline-flex rounded px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em]`}>{status || "Pending"}</span>;
}

/* ── Countdown Badge ── */
function CountdownBadge({ days }) {
  if (days === 0) return <span className="inline-flex rounded-md bg-[#fef3c7] px-2 py-1 text-[10px] font-black text-[#d97706]">Today</span>;
  if (days < 0)  return <span className="inline-flex rounded-md bg-[#f5f1ea] px-2 py-1 text-[10px] text-black/45">Past</span>;
  if (days <= 7) return <span className="inline-flex rounded-md bg-[#fdf2f8] px-2 py-1 text-[10px] font-black text-[#be185d]">{days}d</span>;
  return <span className="inline-flex rounded-md bg-[#f5f1ea] px-2 py-1 text-[10px] text-black/45">{days}d</span>;
}

/* ── Compact Mini Calendar ── */
function MiniCalendar({ bookings }) {
  const [current, setCurrent] = useState(new Date());
  const daysInMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
  const firstDay = new Date(current.getFullYear(), current.getMonth(), 1).getDay();
  const bookingMap = useMemo(() => {
    const map = {};
    (bookings || []).forEach((b) => { map[new Date(b.eventDate).toDateString()] = (map[new Date(b.eventDate).toDateString()] || 0) + 1; });
    return map;
  }, [bookings]);
  return (
    <div className="border-[2px] border-[#c4b096]/70 bg-[#f9f3e8] p-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[10px] font-bold text-black/50">{current.toLocaleString("default", { month: "short", year: "numeric" })}</span>
        <div className="flex gap-1">
          <button onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1))} className="flex h-5 w-5 items-center justify-center rounded border border-[#e8e0d2] text-black/40 hover:border-[#d4af37]"><ChevronLeft size={11} /></button>
          <button onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1))} className="flex h-5 w-5 items-center justify-center rounded border border-[#e8e0d2] text-black/40 hover:border-[#d4af37]"><ChevronRight size={11} /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <div key={d} className="text-[8px] font-bold text-black/25 py-0.5">{d}</div>)}
        {[...Array(firstDay)].map((_, i) => <div key={`e${i}`} />)}
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const date = new Date(current.getFullYear(), current.getMonth(), day);
          const isToday = date.toDateString() === new Date().toDateString();
          const count = bookingMap[date.toDateString()] || 0;
          return (
            <div key={day} className={`relative text-[9px] py-[3px] rounded ${isToday ? "bg-[#c4975a] text-white font-bold" : count > 0 ? "bg-amber-50 font-bold text-[#8a6a00]" : "text-black/60"}`}>
              {day}
              {count > 0 && !isToday && <div className="absolute top-[1px] right-[1px] h-1 w-1 rounded-full bg-[#d4af37]" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Compact Venue Availability ── */
function VenueAvailability({ halls }) {
  const available = halls.filter((h) => h.isAvailable).length;
  const total = halls.length;
  const pct = total ? Math.round((available / total) * 100) : 0;
  return (
    <div className="border-[2px] border-[#c4b096]/70 bg-[#f9f3e8] p-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-black/45">Venues</span>
        <span className="text-sm font-black text-[#c4975a]">{available}<span className="text-[9px] font-bold text-black/40">/{total}</span></span>
      </div>
      <div className="mb-1.5 h-1.5 overflow-hidden rounded-full bg-[#e8e0d2]">
        <div className="h-full rounded-full bg-gradient-to-r from-[#d4af37] to-[#c4975a]" style={{ width: `${pct}%` }} />
      </div>
      <div className="space-y-1.5">
        {halls.slice(0, 3).map((hall) => (
          <div key={hall.id || hall._id} className="flex items-center justify-between gap-2 border-t border-[#e8e0d2] pt-1.5">
            <span className="text-[10px] font-semibold text-[#3d2c1f] truncate">{hall.name || hall.hallName || "Hall"}</span>
            <span className={`shrink-0 rounded px-1.5 py-0.5 text-[8px] font-black uppercase ${hall.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{hall.isAvailable ? "Avail" : "Booked"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Booking Status Breakdown (PieChart) ── */
const PIE_COLORS = { confirmed: "#22c55e", pending: "#f59e0b", cancelled: "#ef4444", other: "#8b7355" };
function BookingStatusBreakdown({ bookings }) {
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const pending = bookings.filter((b) => b.status === "pending" || !b.status).length;
  const cancelled = bookings.filter((b) => b.status === "cancelled").length;
  const other = bookings.length - confirmed - pending - cancelled;
  const raw = [
    { name: "Confirmed", value: confirmed, color: PIE_COLORS.confirmed },
    { name: "Pending",   value: pending, color: PIE_COLORS.pending },
    { name: "Cancelled", value: cancelled, color: PIE_COLORS.cancelled },
  ];
  if (other > 0) raw.push({ name: "Other", value: other, color: PIE_COLORS.other });
  const data = raw.filter((d) => d.value > 0);
  const total = bookings.length || 0;
  const empty = data.length === 0;
  return (
    <div className="border-2 border-[#c4b096]/70 bg-[#f9f3e8] p-2.5 shadow-sm flex flex-col items-center">
      <div className="shrink-0 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-black/45">Booking Status</span>
        <span className="text-[9px] font-bold text-black/40">{total} total</span>
      </div>
      {empty ? (
        <div className="flex items-center justify-center pt-6"><ClipboardList size={28} className="text-black/20" /></div>
      ) : (
        <div className="flex gap-4 pt-3">
          <div className="shrink-0">
            <PieChart width={180} height={180}>
              <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" paddingAngle={3} isAnimationActive={false}>
                {data.map((d) => <Cell key={d.name} fill={d.color} />)}
              </Pie>
            </PieChart>
          </div>
          <div className="flex-1 space-y-1.5 pt-1">
            {data.map((d) => (
              <div key={d.name}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-[10px] font-bold text-[#3d2c1f]">{d.name}</span>
                  </div>
                  <span className="text-[10px] font-black text-black/60">{d.value}</span>
                </div>
                <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-[#e8e0d2]">
                  <div className="h-full rounded-full transition-all" style={{ width: `${(d.value / (total || 1)) * 100}%`, backgroundColor: d.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Revenue Trend (BarChart) ── */
function groupKey(date, period) {
  const y = date.getFullYear();
  if (period === "daily") return `${y}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  if (period === "weekly") { const start = new Date(date); start.setDate(start.getDate() - start.getDay()); return `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`; }
  if (period === "yearly") return String(y);
  return `${y}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatGroup(key, period) {
  const d = new Date(key);
  if (isNaN(d)) return key;
  if (period === "daily") return d.toLocaleString("default", { weekday: "short", day: "numeric" });
  if (period === "weekly") return `Wk ${d.toLocaleString("default", { month: "short", day: "numeric" })}`;
  if (period === "yearly") return String(d.getFullYear());
  return d.toLocaleString("default", { month: "short" });
}

const MAX_BARS = { daily: 7, weekly: 8, monthly: 6, yearly: 5 };

function RevenueTrend({ bookings, period }) {
  const chartData = useMemo(() => {
    const groups = {};
    (bookings || []).forEach((b) => {
      const date = new Date(b.eventDate || b.createdAt);
      if (isNaN(date)) return;
      const key = groupKey(date, period);
      groups[key] = (groups[key] || 0) + Number(b.totalAmount || b.amount || 0);
    });
    const entries = Object.entries(groups).sort();
    const max = MAX_BARS[period] || 6;
    const recent = entries.slice(-max);
    return recent.map(([k, rev]) => ({ label: formatGroup(k, period), revenue: rev }));
  }, [bookings, period]);

  const hasData = chartData.length > 0 && chartData.some((d) => d.revenue > 0);

  return (
    <div className="border-2 border-[#c4b096]/70 bg-[#f9f3e8] p-2.5 shadow-sm">
      <div className="shrink-0 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-black/45">Revenue Trend</span>
        <span className="text-[9px] font-bold text-black/40 capitalize">{period}</span>
      </div>
      {hasData ? (
        <div className="flex justify-center pt-3">
          <BarChart data={chartData} width={Math.max(chartData.length * 110, 400)} height={260} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: "#8b7355" }} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: "#f9f3e8", border: "2px solid #c4b096", borderRadius: 8, fontSize: 12, fontWeight: 700 }}
              formatter={(v) => [currency.format(v), "Revenue"]}
              cursor={{ fill: "rgba(196, 151, 90, 0.1)" }} />
            <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={60} fill="#c4975a" />
          </BarChart>
        </div>
      ) : (
        <div className="pt-6"><DollarSign size={28} className="mx-auto text-black/20" /></div>
      )}
    </div>
  );
}

/* ── Compact peek row ── */
function PeekRow({ bookings }) {
  const pending = bookings.filter((b) => b.status === "pending" || !b.status).length;
  const today = bookings.filter((b) => new Date(b.eventDate).toDateString() === new Date().toDateString()).length;
  return (
    <div className="border-[2px] border-[#c4b096]/70 bg-[#f9f3e8] p-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-black/45">Quick Peek</span>
      <div className="mt-1.5 flex gap-4">
        <span className="text-[10px]"><span className="font-black text-amber-600">{pending}</span> <span className="text-black/40">pending</span></span>
        <span className="text-[10px]"><span className="font-black text-[#c4975a]">{today}</span> <span className="text-black/40">today</span></span>
        <span className="text-[10px]"><span className="font-black text-[#3d2c1f]">{bookings.length}</span> <span className="text-black/40">total</span></span>
      </div>
    </div>
  );
}

/* ── Compact Notifications ── */
function NotificationsFeed({ notifications }) {
  const unread = (notifications || []).filter((n) => !n.read);
  const recent = unread.slice(0, 2);
  return (
    <div className="border-[2px] border-[#c4b096]/70 bg-[#f9f3e8] p-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-black/45">Alerts</span>
        {unread.length > 0 && <span className="rounded-full bg-[#c4975a] px-1.5 py-0.5 text-[7px] font-black text-white">{unread.length} new</span>}
      </div>
      {recent.length > 0 ? recent.map((n, i) => (
        <div key={n.id || n._id || i} className="border-t border-[#e8e0d2] pt-1.5 text-[9px] leading-tight font-bold text-[#3d2c1f]">
          {n.message}
        </div>
      )) : (
        <p className="text-center text-[9px] text-black/40 py-1.5">No alerts</p>
      )}
    </div>
  );
}

/* ── Dashboard ── */
export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState({});
  const [stats, setStats] = useState({});
  const [bookings, setBookings] = useState([]);
  const [halls, setHalls] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState([]);

  const getUser = () => {
    try {
      const raw = window.localStorage.getItem("user");
      if (!raw || raw === "undefined") return {};
      return JSON.parse(raw);
    } catch { return {}; }
  };

  const isCustomer = user.role === "customer";
  const today = new Date();
  const todayStr = today.toDateString();
  const [period, setPeriod] = useState("monthly");

  const filteredBookings = useMemo(() => {
    if (!bookings || bookings.length === 0) return bookings;
    const now = new Date();
    return bookings.filter((b) => {
      const d = new Date(b.eventDate || b.createdAt);
      if (isNaN(d)) return true;
      const daysDiff = (now - d) / 86400000;
      if (period === "daily") return daysDiff <= 7;
      if (period === "weekly") return daysDiff <= 42;
      if (period === "yearly") return daysDiff <= 365;
      return true;
    });
  }, [bookings, period]);
  const filteredStats = useMemo(() => {
    const rows = Array.isArray(filteredBookings) ? filteredBookings : [];
    return {
      totalBookings: rows.length,
      confirmedBookings: rows.filter((b) => b.status === "confirmed").length,
      pendingBookings: rows.filter((b) => b.status === "pending" || !b.status).length,
      totalRevenue: rows.reduce((s, b) => s + Number(b.totalAmount || b.amount || 0), 0),
    };
  }, [filteredBookings]);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token) { router.replace("/login"); return; }
    setUser(getUser());

    const load = async () => {
      setLoading(true);
      setError("");
      const [bRes, sRes, hRes, vRes, rRes] = await Promise.allSettled([
        dashboardApi.bookings(), dashboardApi.stats().catch(() => ({ data: { data: {} } })),
        dashboardApi.halls().catch(() => ({ data: { data: [] } })),
        dashboardApi.vehicles().catch(() => ({ data: { data: [] } })),
        dashboardApi.rentals().catch(() => ({ data: { data: [] } })),
      ]);
      const bData = bRes.status === "fulfilled" ? safeList(bRes.value) : [];
      const sData = sRes.status === "fulfilled" ? (sRes.value?.data?.data || sRes.value?.data || {}) : {};
      setBookings(bData);
      setStats(statFallback(bData, sData));
      setHalls(hRes.status === "fulfilled" ? safeList(hRes.value) : []);
      setVehicles(vRes.status === "fulfilled" ? safeList(vRes.value) : []);
      setRentals(rRes.status === "fulfilled" ? safeList(rRes.value) : []);
      if ([bRes, sRes, hRes, vRes, rRes].some((r) => r.status === "rejected")) {
        setError("Some data could not be loaded. Partial dashboard shown.");
      }
      setLoading(false);
    };
    load();
  }, [router]);

  useEffect(() => {
    const id = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await notificationsApi.list();
        if (res.data?.success) {
          const fetched = res.data.data || [];
          setNotifications(fetched.filter((n) => !n.read));
        }
      } catch {}
    };
    fetchNotifications();
  }, []);

  const todayEvents = useMemo(() =>
    bookings.filter((b) => new Date(b.eventDate).toDateString() === todayStr), [bookings]);

  const upcomingEvents = useMemo(() =>
    bookings.filter((b) => { const d = daysUntil(b.eventDate); return d === null || d >= 0; })
      .sort((a, b) => new Date(a.eventDate || 0) - new Date(b.eventDate || 0)).slice(0, 5), [bookings]);

  const greeting = today.getHours() < 12 ? "Good morning" : today.getHours() < 17 ? "Good afternoon" : "Good evening";

  if (loading) {
    return (
      <>
        <PageTitle title="Dashboard" description="EventPro management dashboard" />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#d4af37]/20 border-t-[#d4af37]" />
        <span className="text-xs font-bold uppercase tracking-[0.14em] text-black/50">Loading your dashboard&hellip;</span>
      </div>
      </>
    );
  }

  return (
    <>
      <PageTitle title="Dashboard" description="EventPro management dashboard" />
      <main className="px-6 py-6 sm:px-8 bg-gradient-to-br from-[#f7f3ed] via-white to-[#f0ebe3]">
      <div className="mx-auto max-w-[1600px] flex flex-col gap-6">

        {/* ═══════ COMPACT HEADER ═══════ */}
        <div className="flex shrink-0 items-center justify-between rounded-xl bg-gradient-to-r from-[#4a3528] to-[#3d2c1f] px-8 py-5 text-white shadow-lg">
          <div className="flex items-center gap-6 min-w-0">
            <span className="h-3 w-3 shrink-0 rounded-full bg-[#d4af37]" />
            <div className="min-w-0">
              <span className="text-xl font-black leading-tight">{greeting}, {user.name?.split(" ")[0] || "there"}</span>
              <span className="ml-4 text-sm text-[#e8c878]/80">{!isCustomer ? `${stats.totalBookings || 0} total bookings` : "Guest Portal"}</span>
            </div>
            {!isCustomer && (
              <div className="hidden sm:flex items-center gap-4 ml-4">
                {todayEvents.length > 0 && <span className="rounded-full bg-[#d4af37]/20 px-4 py-1 text-sm font-bold text-[#e8c878]">{todayEvents.length} today</span>}
                <span className="text-sm text-[#e8c878]/60">{(stats.totalRevenue || 0).toLocaleString()} PKR</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 text-right shrink-0">
            <div className="text-sm text-[#e8c878]/70 font-bold">{today.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })}</div>
            <div className="hidden sm:block text-sm text-[#d4af37] font-bold ml-2">{currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>
          </div>
        </div>

        {/* ═══════ ERROR ═══════ */}
        {error && (
          <div className="shrink-0 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-1.5 text-[10px] font-semibold text-amber-800">
            <AlertTriangle size={12} /> {error}
          </div>
        )}

        {/* ═══════ STATS + PERIOD FILTER ═══════ */}
        {!isCustomer && (
          <div className="shrink-0 flex flex-wrap items-center gap-6">
            <div className="flex-1 grid grid-cols-4 gap-6 min-w-0">
              <StatCard title="Volume"   value={filteredStats.totalBookings || 0}       icon={<ClipboardList size={24} />} />
              <StatCard title="Confirmed" value={filteredStats.confirmedBookings || 0}    icon={<Check size={24} />} />
              <StatCard title="Pending"  value={filteredStats.pendingBookings || 0}      icon={<Clock size={24} />} />
              <StatCard title="Revenue"   value={currency.format(filteredStats.totalRevenue || 0)} icon={<WalletCards size={24} />} />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {["daily", "weekly", "monthly", "yearly"].map((p) => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`rounded-xl border-2 px-6 py-3 text-sm font-black uppercase tracking-[0.1em] transition ${
                    period === p
                      ? "border-[#d4af37] bg-[#fff8dc] text-[#8a6a00]"
                      : "border-[#c4b096]/60 bg-white/60 text-black/50 hover:border-[#d4af37] hover:text-[#3d2c1f]"
                  }`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

          {/* ═══════ MAIN GRID: fill remaining space ═══════ */}
        {!isCustomer ? (
          <div className="grid gap-6 xl:grid-cols-[1fr_1.8fr_1.8fr_320px] lg:grid-cols-2 md:grid-cols-1">
            {/* Col 1: PieChart */}
            <BookingStatusBreakdown bookings={bookings} />

            {/* Col 2: Revenue Trend */}
            <RevenueTrend bookings={filteredBookings} period={period} />

            {/* Col 3: Upcoming Events */}
            <div className="border-2 border-[#c4b096]/70 bg-[#f9f3e8] p-4 shadow-sm flex flex-col min-h-0">
              <span className="shrink-0 text-[11px] font-bold uppercase tracking-[0.12em] text-black/45">Upcoming</span>
              <div className="overflow-y-auto mt-2 space-y-2 min-h-0 max-h-[320px]">
                {upcomingEvents.length > 0 ? upcomingEvents.slice(0, 8).map((b) => {
                  const ET = EVENT_TYPES[getEventType(b)];
                  return (
                    <div key={b.id || b._id} className="flex items-start gap-3 border-t border-[#e8e0d2] pt-2">
                      <div className="h-2.5 w-2.5 shrink-0 rounded-full mt-0.5" style={{ backgroundColor: ET.color }} />
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-bold text-[#3d2c1f] truncate leading-tight">{b.eventName}</div>
                        <div className="text-[9px] text-black/45">{formatDate(b.eventDate)}{b.customerName ? ` · ${b.customerName}` : ""}</div>
                      </div>
                      <div className="shrink-0">
                        <CountdownBadge days={daysUntil(b.eventDate)} />
                      </div>
                    </div>
                  );
                }) : (
                  <p className="text-center text-[11px] text-black/40 py-4">No upcoming events</p>
                )}
              </div>
            </div>

            {/* Col 4: Right sidebar */}
            <div className="flex flex-col gap-3 min-h-0">
              <MiniCalendar bookings={bookings} />
              {halls.length > 0 && <VenueAvailability halls={halls} />}
              <PeekRow bookings={bookings} />
              <NotificationsFeed notifications={notifications} />
              {user.role === "admin" && (
                <Link href="/dashboard/admin/access-control" className="flex items-center gap-2 border-2 border-[#c4b096]/70 bg-gradient-to-r from-[#f0fdfa]/80 to-[#f9f3e8] p-3 shadow-sm hover:border-[#d4af37] transition shrink-0">
                  <ShieldCheck size={16} className="text-[#c4975a]" />
                  <span className="text-[10px] font-bold text-[#3d2c1f]">Admin Console</span>
                  <span className="ml-auto text-[10px] text-[#c4975a]">&rarr;</span>
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 content-center">
            {[
              { href: "/bookings", icon: CalendarDays, title: "Book a Venue",     desc: "Select and reserve your date." },
              { href: "/bookings",       icon: Utensils,    title: "Plan Menu",        desc: "Customise catering options." },
              { href: "/bookings",       icon: Building2,   title: "Browse Halls",     desc: "Discover our event spaces." },
              { href: "/bookings",       icon: ClipboardList, title: "My Bookings",    desc: "Track your schedule." },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <Link key={card.href} href={card.href}
                  className="flex flex-col border-2 border-[#c4b096]/70 bg-[#f9f3e8] p-4 shadow-sm hover:border-[#d4af37] transition">
                  <span className="mb-1.5 text-[#c4975a]"><Icon size={22} /></span>
                  <h3 className="text-sm font-bold text-[#3d2c1f]">{card.title}</h3>
                  <p className="mt-0.5 text-[11px] text-black/55">{card.desc}</p>
                  <span className="mt-2 text-[10px] font-bold text-[#c4975a]">Start &rarr;</span>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </main>
    </>
  );
}
