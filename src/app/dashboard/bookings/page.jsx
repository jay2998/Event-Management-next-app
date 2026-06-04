"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import {
  ArrowLeft, ChevronDown, Filter, Loader2, Search, X, Plus,
} from "lucide-react";
import { dashboardApi } from "../../../lib/api";
import { useToast } from "../../components/Toast";
import { localDB } from "../../../lib/store";

const STATUS_COLORS = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  confirmed: "bg-blue-50 text-blue-800 border-blue-200",
  completed: "bg-green-50 text-green-800 border-green-200",
  cancelled: "bg-red-50 text-red-800 border-red-200",
};

const formatDate = (d) => {
  if (!d) return "—";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(d));
};

const currency = new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 });

function BookingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const addToast = useToast();
  const [form, setForm] = useState({
    eventName: "", eventDate: "", eventType: "wedding",
    customerName: "", customerEmail: "", customerPhone: "",
    guestCount: "", hallName: "", totalAmount: "",
    status: "pending",
  });

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token) { router.replace("/login"); return; }
    loadBookings();
  }, [router]);

  useEffect(() => {
    if (bookingId && bookings.length > 0) {
      const booking = bookings.find(b => (b.id || b._id) == bookingId);
      if (booking) {
        addToast(`Viewing booking: ${booking.eventName}`, "success");
      }
    }
  }, [bookingId, bookings, addToast]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await dashboardApi.bookings();
      setBookings(res?.data?.data || res?.data || []);
    } catch {
      const local = localDB.findAll("bookings");
      setBookings(local?.data?.data || []);
      setError("Backend offline — showing local data");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ eventName: "", eventDate: "", eventType: "wedding", customerName: "", customerEmail: "", customerPhone: "", guestCount: "", hallName: "", totalAmount: "", status: "pending" });
    setShowForm(true);
  };

  const openEdit = (b) => {
    setEditingId(b._id || b.id);
    setEditingBooking(b);
    setForm({
      eventName: b.eventName || "",
      eventDate: b.eventDate ? new Date(b.eventDate).toISOString().split("T")[0] : "",
      eventType: b.eventType || "wedding",
      customerName: b.customerName || b.customerId?.name || "",
      customerEmail: b.customerEmail || b.customerId?.email || "",
      customerPhone: b.customerPhone || "",
      guestCount: b.guestCount || "",
      hallName: b.hall?.name || b.hallName || "",
      totalAmount: b.totalAmount || "",
      status: b.status || "pending",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        guestCount: form.guestCount ? Number(form.guestCount) : undefined,
        totalAmount: form.totalAmount ? Number(form.totalAmount) : undefined,
      };
      if (editingId && editingBooking?.items?.length) {
        payload.items = editingBooking.items;
      }
      if (editingId) {
        await dashboardApi.updateBooking(editingId, payload).catch(() => localDB.update("bookings", editingId, payload));
      } else {
        await dashboardApi.createBooking(payload).catch(() => localDB.create("bookings", payload));
      }
      setShowForm(false);
      loadBookings();
      addToast(editingId ? "Booking updated successfully" : "Booking created successfully", "success");
    } catch (err) {
      addToast(err.message || "Operation failed", "error");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await dashboardApi.updateBookingStatus(id, status).catch(() => localDB.update("bookings", id, { status }));
      loadBookings();
      addToast(`Booking marked as ${status}`, "success");
    } catch (err) {
      addToast(err.message || "Failed to update status", "error");
    }
  };

  const cancelBooking = async (id) => {
    if (!confirm("Cancel this booking?")) return;
    try {
      await dashboardApi.cancelBooking(id).catch(() => localDB.delete("bookings", id));
      loadBookings();
      addToast("Booking cancelled", "success");
    } catch (err) {
      addToast(err.message || "Failed to cancel booking", "error");
    }
  };

  const filtered = bookings.filter((b) => {
    if (bookingId) {
      return (b.id || b._id) == bookingId;
    }
    const q = search.toLowerCase();
    if (q && !(b.eventName || "").toLowerCase().includes(q) &&
        !(b.customerName || "").toLowerCase().includes(q) &&
        !(b.customerEmail || "").toLowerCase().includes(q)) return false;
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    return true;
  });

  const EVENT_TYPE_OPTIONS = ["wedding", "corporate", "birthday", "gala", "other"];

  return (
    <main className="min-h-screen bg-[#f7f3ed] px-4 py-6 text-[#171717] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/dashboard" className="mb-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#c4975a] transition-colors hover:text-[#8b7355]">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>

        <div className="mb-6 rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8] px-5 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#3d2c1f]">All Bookings</h1>
              <p className="mt-1 text-sm text-black/55">{bookings.length} total bookings</p>
            </div>
            <button onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl border-[2.5px] border-[#d4af37] bg-[#d4af37] px-3 py-1.5 text-xs font-extrabold text-white transition hover:bg-[#c4975a]">
              <Plus size={15} /> New Booking
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/35" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by event name, customer, email..."
                className="w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 pl-9 pr-4 py-2 text-sm outline-none transition focus:border-[#d4af37]" />
              {search && <button onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30"><X size={14} /></button>}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={14} className="text-black/35 shrink-0" />
              {["all", "pending", "confirmed", "completed", "cancelled"].map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`rounded-lg border-[2.5px] px-2 sm:px-3 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] transition ${
                    statusFilter === s
                      ? "border-[#d4af37] bg-[#fff8dc] text-[#8a6a00]"
                      : "border-[#c4b096] bg-white/60 text-black/50 hover:border-[#d4af37]"
                  }`}>{s}</button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border-[2.5px] border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>
        )}

        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowForm(false)}>
            <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8] p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-black text-[#3d2c1f]">{editingId ? "Edit Booking" : "New Booking"}</h2>
                <button onClick={() => setShowForm(false)} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/80">
                  <X size={14} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-xs font-bold text-black/60">Event Name*
                    <input name="eventName" value={form.eventName} onChange={(e) => setForm({ ...form, eventName: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" required />
                  </label>
                  <label className="block text-xs font-bold text-black/60">Event Type*
                    <select value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]">
                      {EVENT_TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                    </select>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-xs font-bold text-black/60">Event Date*
                    <input type="date" name="eventDate" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" required />
                  </label>
                  <label className="block text-xs font-bold text-black/60">Guest Count
                    <input type="number" name="guestCount" value={form.guestCount} onChange={(e) => setForm({ ...form, guestCount: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" min="1" />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-xs font-bold text-black/60">Customer Name
                    <input name="customerName" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" />
                  </label>
                  <label className="block text-xs font-bold text-black/60">Customer Email
                    <input type="email" name="customerEmail" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-xs font-bold text-black/60">Customer Phone
                    <input name="customerPhone" value={form.customerPhone} onChange={(e) => setForm({ ...form, customerPhone: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" />
                  </label>
                  <label className="block text-xs font-bold text-black/60">Hall/Venue
                    <input name="hallName" value={form.hallName} onChange={(e) => setForm({ ...form, hallName: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-xs font-bold text-black/60">Total Amount
                    <input type="number" name="totalAmount" value={form.totalAmount} onChange={(e) => setForm({ ...form, totalAmount: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" min="0" />
                  </label>
                  <label className="block text-xs font-bold text-black/60">Status
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]">
                      {["pending", "confirmed", "completed", "cancelled"].map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </label>
                </div>
                <div className="flex gap-2 pt-1">
                  <button type="submit" className="flex-1 rounded-xl border-[2.5px] border-[#d4af37] bg-[#d4af37] px-3 py-2 text-xs font-extrabold text-white transition hover:bg-[#c4975a]">
                    {editingId ? "Update" : "Create"}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-3 py-2 text-xs font-extrabold text-[#3d2c1f] transition hover:border-[#d4af37]">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid min-h-[360px] place-items-center rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8]">
            <Loader2 className="animate-spin text-[#d4af37]" size={34} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8] p-12 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <p className="text-sm font-bold text-black/50">{search || statusFilter !== "all" ? "No bookings match your filters." : "No bookings yet."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-[2.5px] border-[#c4b096] text-[10px] font-black uppercase tracking-[0.14em] text-black/45">
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Venue</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c4b096]/40">
                {filtered.map((b) => {
                  const isHighlighted = bookingId && (b.id || b._id) == bookingId;
                  return (
                  <tr key={b._id || b.id} className={`transition ${isHighlighted ? "bg-[#C5A059]/10 ring-2 ring-[#C5A059]" : "hover:bg-white/40"}`}>
                    <td className="px-4 py-3">
                      <div className="font-extrabold text-[#3d2c1f]">{b.eventName || "Untitled"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-black/80">{b.customerName || b.customerId?.name || "—"}</div>
                      <div className="text-[10px] text-black/45">{b.customerEmail || b.customerId?.email || ""}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-black/60">{formatDate(b.eventDate)}</td>
                    <td className="px-4 py-3 text-xs text-black/60">{b.hall?.name || b.hallName || "—"}</td>
                    <td className="px-4 py-3 text-xs font-bold">{b.totalAmount ? currency.format(b.totalAmount) : "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-md border-[2.5px] px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.1em] ${STATUS_COLORS[b.status] || "bg-gray-50 text-gray-600"}`}>
                        {b.status || "pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(b)}
                          className="rounded-lg border-[2.5px] border-[#c4b096] bg-white/80 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-black/60 transition hover:border-[#d4af37]">
                          Edit
                        </button>
                        {b.status === "pending" && (
                          <>
                            <button onClick={() => updateStatus(b._id || b.id, "confirmed")}
                              className="rounded-lg border-[2.5px] border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-blue-700 transition hover:bg-blue-100">
                              Confirm
                            </button>
                            <button onClick={() => cancelBooking(b._id || b.id)}
                              className="rounded-lg border-[2.5px] border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-red-600 transition hover:bg-red-100">
                              Cancel
                            </button>
                          </>
                        )}
                        {b.status === "confirmed" && (
                          <>
                            <button onClick={() => updateStatus(b._id || b.id, "completed")}
                              className="rounded-lg border-[2.5px] border-green-200 bg-green-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-green-700 transition hover:bg-green-100">
                              Complete
                            </button>
                            <button onClick={() => cancelBooking(b._id || b.id)}
                              className="rounded-lg border-[2.5px] border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-red-600 transition hover:bg-red-100">
                              Cancel
                            </button>
                          </>
                        )}
                        {b.status === "completed" && (
                          <span className="text-[10px] text-black/30 italic">Done</span>
                        )}
                        {b.status === "cancelled" && (
                          <span className="text-[10px] text-black/30 italic">Cancelled</span>
                        )}
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 text-center text-[10px] text-black/30">
          {filtered.length} of {bookings.length} bookings shown
        </div>
      </div>

    </main>
  );
}

export default function BookingsAdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f3ed] flex items-center justify-center"><Loader2 className="animate-spin text-[#d4af37]" size={34} /></div>}>
      <BookingsContent />
    </Suspense>
  );
}
