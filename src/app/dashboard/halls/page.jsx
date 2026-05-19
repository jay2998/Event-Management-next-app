"use client";

import PageTitle from "../../components/PageTitle";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft, Building2, Loader2, Plus, X, Search, MapPin, Users,
  Clock, CheckCircle, AlertCircle, HelpCircle, Sparkles,
  ChevronDown, ChevronRight, DollarSign, Lightbulb,
} from "lucide-react";
import { venuesApi } from "../../../lib/api";

const CITY_OPTIONS = ["Lahore", "Karachi", "Islamabad", "Faisalabad", "Rawalpindi", "Multan", "Peshawar", "Quetta", "Other"];

const SLOT_LABELS = { afternoon: "Afternoon (Lunch)", evening: "Evening (Dinner)" };
const STATUS_LABELS = { available: "Available", hold: "Hold (Tentative)", sold: "Sold Out" };
const STATUS_COLORS = {
  available: "border-green-200 bg-green-50 text-green-700",
  hold: "border-amber-200 bg-amber-50 text-amber-700",
  sold: "border-red-200 bg-red-50 text-red-600",
};
const STATUS_ICONS = {
  available: CheckCircle,
  hold: HelpCircle,
  sold: AlertCircle,
};

export default function VenueManagementPage() {
  const router = useRouter();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [expandedVenue, setExpandedVenue] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedSlot, setSelectedSlot] = useState("evening");

  const [showVenueForm, setShowVenueForm] = useState(false);
  const [showHallForm, setShowHallForm] = useState(false);
  const [editingVenueId, setEditingVenueId] = useState(null);
  const [confirmDeleteVenueId, setConfirmDeleteVenueId] = useState(null);
  const [confirmDeleteHall, setConfirmDeleteHall] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [venueForm, setVenueForm] = useState({
    name: "", city: "Lahore", address: "", description: "",
    contactPhone: "", contactEmail: "",
  });

  const [hallForm, setHallForm] = useState({
    name: "", capacityMin: 50, capacityMax: "", baseServiceFee: "",
    amenities: "",
  });

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token) { router.replace("/login"); return; }
    loadVenues();
  }, [router]);

  const loadVenues = async () => {
    setLoading(true);
    try {
      const res = await venuesApi.list();
      setVenues(res?.data?.data || res?.data || []);
    } catch (err) {
      setError(err.message || "Failed to load venues");
    } finally {
      setLoading(false);
    }
  };

  const openVenueForm = () => {
    setEditingVenueId(null);
    setVenueForm({ name: "", city: "Lahore", address: "", description: "", contactPhone: "", contactEmail: "" });
    setShowVenueForm(true);
  };

  const openEditVenue = (v) => {
    setEditingVenueId(v._id || v.id);
    setVenueForm({
      name: v.name || "",
      city: v.city || "Lahore",
      address: v.address || "",
      description: v.description || "",
      contactPhone: v.contactPhone || "",
      contactEmail: v.contactEmail || "",
    });
    setShowVenueForm(true);
  };

  const submitVenue = async (e) => {
    e.preventDefault();
    try {
      if (editingVenueId) {
        await venuesApi.update(editingVenueId, venueForm);
      } else {
        await venuesApi.create(venueForm);
      }
      setShowVenueForm(false);
      loadVenues();
    } catch (err) {
      setError(err.message || "Operation failed");
    }
  };

  const deleteVenue = async (id) => {
    try {
      await venuesApi.delete(id);
      loadVenues();
    } catch (err) {
      setError(err.message || "Failed");
    }
  };

  const openHallForm = (venueId) => {
    setEditingVenueId(venueId);
    setHallForm({ name: "", capacityMin: 50, capacityMax: "", baseServiceFee: "", amenities: "" });
    setShowHallForm(true);
  };

  const submitHall = async (e) => {
    e.preventDefault();
    try {
      await venuesApi.addHall(editingVenueId, {
        ...hallForm,
        capacityMax: Number(hallForm.capacityMax),
        capacityMin: Number(hallForm.capacityMin),
        baseServiceFee: Number(hallForm.baseServiceFee),
        amenities: hallForm.amenities.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setShowHallForm(false);
      loadVenues();
    } catch (err) {
      setError(err.message || "Operation failed");
    }
  };

  const deleteHall = async (venueId, hallId) => {
    try {
      await venuesApi.removeHall(venueId, hallId);
      loadVenues();
    } catch (err) {
      setError(err.message || "Failed");
    }
  };

  const toggleSlot = async (venueId, hallId, currentStatus) => {
    const statusCycle = { available: "hold", hold: "sold", sold: "available" };
    const nextStatus = statusCycle[currentStatus] || "available";
    try {
      await venuesApi.setHallSlot(venueId, hallId, { date: selectedDate, slot: selectedSlot, status: nextStatus });
      loadVenues();
    } catch (err) {
      setError(err.message || "Failed to update slot");
    }
  };

  const checkSuggestions = async (hallId, city) => {
    try {
      const res = await venuesApi.suggestAlternatives({ hallId, date: selectedDate, slot: selectedSlot, city });
      setSuggestions(res?.data?.data || []);
      setShowSuggestions(true);
    } catch (err) {
      setError(err.message || "Failed to get suggestions");
    }
  };

  const getHallStatus = (hall, dateKey) => {
    const slots = hall.slots || {};
    const daySlots = slots[dateKey];
    if (!daySlots) return null;
    return daySlots[selectedSlot];
  };

  const filtered = venues.filter((v) => {
    const q = search.toLowerCase();
    if (q && !(v.name || "").toLowerCase().includes(q) &&
        !(v.city || "").toLowerCase().includes(q)) return false;
    return true;
  });

  const currency = new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 });

  const isPeakSeason = (() => {
    const m = new Date().getMonth();
    return m >= 10 || m <= 1;
  })();

  return (
    <>
      <PageTitle title="Venue Management" description="Manage venues and halls" />
      <main className="min-h-screen bg-[#f7f3ed] px-4 py-6 text-[#171717] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/dashboard" className="mb-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#c4975a] transition-colors hover:text-[#8b7355]">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>

        {/* Peak Season Banner */}
        {isPeakSeason && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border-[2.5px] border-[#d4af37]/40 bg-gradient-to-r from-[#fff8dc] to-[#fef3c7] px-4 py-3 text-sm">
            <Sparkles size={18} className="text-[#d4af37] shrink-0" />
            <span className="font-bold text-[#8a6a00]">Peak Wedding Season</span>
            <span className="text-[#8a6a00]/70">Halls book up fast. Use the waitlist feature to find alternatives.</span>
          </div>
        )}

        <div className="mb-6 rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8] px-5 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#d4af37]/15 to-[#c4975a]/10 text-[#c4975a]">
                <Building2 size={20} />
              </span>
              <div>
                <h1 className="text-2xl font-black text-[#3d2c1f]">Venue Management</h1>
                <p className="mt-1 text-sm text-black/55">{venues.length} venues &middot; {venues.reduce((s, v) => s + (v.halls || []).length, 0)} halls</p>
              </div>
            </div>
            <button onClick={openVenueForm}
              className="inline-flex items-center gap-2 rounded-xl border-[2.5px] border-[#d4af37] bg-[#d4af37] px-3 py-1.5 text-xs font-extrabold text-white transition hover:bg-[#c4975a]">
              <Plus size={15} /> Add Venue
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-xs">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/35" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search venues..."
                className="w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 pl-9 pr-4 py-2 text-sm outline-none transition focus:border-[#d4af37]" />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-black/50">
                <Clock size={14} />
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                  className="rounded-lg border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" />
              </div>
              <div className="flex rounded-lg border-[2.5px] border-[#c4b096] overflow-hidden">
                {["afternoon", "evening"].map((s) => (
                  <button key={s} onClick={() => setSelectedSlot(s)}
                    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] transition ${
                      selectedSlot === s ? "bg-[#d4af37] text-white" : "bg-white/60 text-black/50 hover:bg-white"
                    }`}>
                    {SLOT_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border-[2.5px] border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>
        )}

        {/* Venue List */}
        {loading ? (
          <div className="grid min-h-[360px] place-items-center rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8]">
            <Loader2 className="animate-spin text-[#d4af37]" size={34} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8] p-12 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <Building2 size={40} className="mx-auto mb-3 text-black/20" />
            <p className="text-sm font-bold text-black/50">{search ? "No venues match." : "No venues yet. Add your first venue."}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((venue) => {
              const isExpanded = expandedVenue === (venue._id || venue.id);
              const halls = venue.halls || [];
              const dateKey = selectedDate;
              return (
                <div key={venue._id || venue.id} className="rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  {/* Venue Header */}
                  <div className="flex items-center justify-between px-5 py-4 cursor-pointer transition hover:bg-white/30"
                    onClick={() => setExpandedVenue(isExpanded ? null : (venue._id || venue.id))}>
                    <div className="flex items-center gap-3 flex-1">
                      {isExpanded ? <ChevronDown size={18} className="text-[#c4975a]" /> : <ChevronRight size={18} className="text-[#8b7355]" />}
                      <div>
                        <div className="text-base font-extrabold text-[#3d2c1f]">{venue.name}</div>
                        <div className="flex items-center gap-3 text-[11px] text-black/50 mt-0.5">
                          <span className="flex items-center gap-1"><MapPin size={11} /> {venue.city}</span>
                          <span className="flex items-center gap-1"><Building2 size={11} /> {halls.length} hall{halls.length !== 1 ? "s" : ""}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); openEditVenue(venue); }}
                        className="rounded-lg border-[2.5px] border-[#c4b096] bg-white/80 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-black/60 transition hover:border-[#d4af37]">
                        Edit
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteVenueId(venue._id || venue.id); }}
                        className="rounded-lg border-[2.5px] border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-red-600 transition hover:bg-red-100">
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Halls */}
                  {isExpanded && (
                    <div className="border-t-[2.5px] border-[#c4b096] px-5 py-4 space-y-3">
                      {halls.length === 0 && (
                        <p className="text-sm text-black/40 text-center py-4">No halls in this venue yet.</p>
                      )}
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {halls.map((hall) => {
                          const hallId = hall._id || hall.id;
                          const status = getHallStatus(hall, dateKey);
                          const StIcon = status ? STATUS_ICONS[status] : CheckCircle;
                          const isSold = status === "sold";
                          return (
                            <div key={hallId}
                              className={`relative rounded-xl border-[2.5px] p-4 transition ${
                                isSold
                                  ? "border-red-200 bg-red-50/40"
                                  : status === "hold"
                                    ? "border-amber-200 bg-amber-50/40"
                                    : "border-[#c4b096] bg-white/60 hover:border-[#d4af37]"
                              }`}>
                              {/* Hall Name + Status */}
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-extrabold text-[#3d2c1f] text-sm">{hall.name}</h3>
                                <span className={`inline-flex items-center gap-1 rounded-md border-[2.5px] px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.1em] shrink-0 ${STATUS_COLORS[status] || "border-gray-200 bg-gray-50 text-gray-600"}`}>
                                  <StIcon size={10} />
                                  {STATUS_LABELS[status] || "Available"}
                                </span>
                              </div>

                              {/* Capacity + Fee */}
                              <div className="flex items-center gap-3 text-[11px] text-black/55 mb-2">
                                <span className="flex items-center gap-1"><Users size={12} /> {hall.capacityMin}–{hall.capacityMax}</span>
                                <span className="flex items-center gap-1"><DollarSign size={12} /> {currency.format(hall.baseServiceFee)}</span>
                              </div>

                              {/* Amenities */}
                              {(hall.amenities || []).length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {hall.amenities.slice(0, 3).map((a, i) => (
                                    <span key={`${a}-${i}`} className="rounded-md border-[2px] border-[#c4b096]/30 bg-white/60 px-1.5 py-0.5 text-[8px] font-bold text-black/50">{a}</span>
                                  ))}
                                  {hall.amenities.length > 3 && (
                                    <span className="text-[8px] font-bold text-black/30">+{hall.amenities.length - 3}</span>
                                  )}
                                </div>
                              )}

                              {/* Slot Actions */}
                              <div className="flex items-center gap-1.5 mt-2 pt-2 border-t-[2px] border-[#c4b096]/30">
                                <button onClick={() => toggleSlot(venue._id || venue.id, hallId, status)}
                                  className="flex-1 rounded-lg border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1 text-[8px] font-black uppercase tracking-[0.1em] text-black/50 transition hover:border-[#d4af37]">
                                  Toggle Status
                                </button>
                                {isSold && (
                                  <button onClick={() => checkSuggestions(hallId, venue.city)}
                                    className="rounded-lg border-[2.5px] border-[#d4af37] bg-[#fff8dc] px-2 py-1 text-[8px] font-black uppercase tracking-[0.1em] text-[#8a6a00] transition hover:bg-[#fef3c7] whitespace-nowrap">
                                    <Lightbulb size={12} className="inline mr-1" />Find Alternatives
                                  </button>
                                )}
                                <button onClick={() => setConfirmDeleteHall({ venueId: venue._id || venue.id, hallId })}
                                  className="rounded-lg border-[2.5px] border-red-200 bg-red-50 px-2 py-1 text-[8px] font-black uppercase tracking-[0.1em] text-red-500 transition hover:bg-red-100">
                                  <X size={12} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Add Hall Button */}
                      <button onClick={() => openHallForm(venue._id || venue.id)}
                        className="w-full rounded-xl border-[2.5px] border-dashed border-[#c4b096] bg-white/40 py-3 text-xs font-extrabold text-[#8b7355] transition hover:border-[#d4af37] hover:bg-white/60">
                        <Plus size={14} className="inline mr-1" /> Add Hall to {venue.name}
                      </button>

                      {/* Venue Info */}
                      {venue.address && (
                        <div className="text-[10px] text-black/40 pt-1 border-t-[2px] border-[#c4b096]/20">
                          {venue.address}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Venue Form Modal */}
        {showVenueForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowVenueForm(false)}>
            <div className="w-full max-w-md rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8] p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-black text-[#3d2c1f]">{editingVenueId ? "Edit Venue" : "Add Venue"}</h2>
                <button onClick={() => setShowVenueForm(false)} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/80">
                  <X size={14} />
                </button>
              </div>
              <form onSubmit={submitVenue} className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-xs font-bold text-black/60">Name*
                    <input value={venueForm.name} onChange={(e) => setVenueForm({ ...venueForm, name: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" required />
                  </label>
                  <label className="block text-xs font-bold text-black/60">City*
                    <select value={venueForm.city} onChange={(e) => setVenueForm({ ...venueForm, city: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]">
                      {CITY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </label>
                </div>
                <label className="block text-xs font-bold text-black/60">Address*
                  <input value={venueForm.address} onChange={(e) => setVenueForm({ ...venueForm, address: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" required />
                </label>
                <label className="block text-xs font-bold text-black/60">Description
                  <textarea value={venueForm.description} onChange={(e) => setVenueForm({ ...venueForm, description: e.target.value })} rows="3" className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-xs font-bold text-black/60">Contact Phone
                    <input value={venueForm.contactPhone} onChange={(e) => setVenueForm({ ...venueForm, contactPhone: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" />
                  </label>
                  <label className="block text-xs font-bold text-black/60">Contact Email
                    <input type="email" value={venueForm.contactEmail} onChange={(e) => setVenueForm({ ...venueForm, contactEmail: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" />
                  </label>
                </div>
                <div className="flex gap-2 pt-1">
                  <button type="submit" className="flex-1 rounded-xl border-[2.5px] border-[#d4af37] bg-[#d4af37] px-3 py-2 text-xs font-extrabold text-white transition hover:bg-[#c4975a]">
                    {editingVenueId ? "Update" : "Create"}
                  </button>
                  <button type="button" onClick={() => setShowVenueForm(false)} className="flex-1 rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-3 py-2 text-xs font-extrabold text-[#3d2c1f] transition hover:border-[#d4af37]">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Hall Form Modal */}
        {showHallForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowHallForm(false)}>
            <div className="w-full max-w-sm rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8] p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-black text-[#3d2c1f]">Add Hall</h2>
                <button onClick={() => setShowHallForm(false)} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/80">
                  <X size={14} />
                </button>
              </div>
              <form onSubmit={submitHall} className="space-y-2">
                <label className="block text-xs font-bold text-black/60">Hall Name*
                  <input value={hallForm.name} onChange={(e) => setHallForm({ ...hallForm, name: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" required />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-xs font-bold text-black/60">Min Capacity
                    <input type="number" value={hallForm.capacityMin} onChange={(e) => setHallForm({ ...hallForm, capacityMin: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" min="1" />
                  </label>
                  <label className="block text-xs font-bold text-black/60">Max Capacity*
                    <input type="number" value={hallForm.capacityMax} onChange={(e) => setHallForm({ ...hallForm, capacityMax: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" required min="1" />
                  </label>
                </div>
                <label className="block text-xs font-bold text-black/60">Base Service Fee (PKR)*
                  <input type="number" value={hallForm.baseServiceFee} onChange={(e) => setHallForm({ ...hallForm, baseServiceFee: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" required min="0" />
                </label>
                <label className="block text-xs font-bold text-black/60">Amenities (comma-separated)
                  <input value={hallForm.amenities} onChange={(e) => setHallForm({ ...hallForm, amenities: e.target.value })} placeholder="AC, WiFi, Parking, Sound System" className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" />
                </label>
                <div className="flex gap-2 pt-1">
                  <button type="submit" className="flex-1 rounded-xl border-[2.5px] border-[#d4af37] bg-[#d4af37] px-3 py-2 text-xs font-extrabold text-white transition hover:bg-[#c4975a]">Add Hall</button>
                  <button type="button" onClick={() => setShowHallForm(false)} className="flex-1 rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-3 py-2 text-xs font-extrabold text-[#3d2c1f] transition hover:border-[#d4af37]">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Suggestions Modal */}
        {showSuggestions && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setShowSuggestions(false)}>
            <div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black text-[#3d2c1f]">
                  <Lightbulb size={18} className="inline mr-2 text-[#d4af37]" />
                  Alternative Halls
                </h2>
                <button onClick={() => setShowSuggestions(false)} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/80">
                  <X size={16} />
                </button>
              </div>
              {suggestions.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 size={36} className="mx-auto mb-2 text-black/20" />
                  <p className="text-sm font-bold text-black/50">No alternatives found for this date/slot.</p>
                  <p className="text-xs text-black/40 mt-1">Try a different date or slot.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-black/50 mb-3">{suggestions.length} available hall{suggestions.length !== 1 ? "s" : ""} found</p>
                  {suggestions.map((s, i) => (
                    <div key={s.hallName || s.hallId || i} className="flex items-center justify-between rounded-xl border-[2.5px] border-[#c4b096] bg-white/60 p-3 transition hover:border-[#d4af37]">
                      <div>
                        <div className="font-extrabold text-[#3d2c1f] text-sm">{s.hallName}</div>
                        <div className="text-[11px] text-black/50">
                          {s.venueName} &middot; {s.capacityMin}–{s.capacityMax} guests
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-[#c4975a]">{currency.format(s.baseServiceFee)}</div>
                        <div className="text-[9px] text-black/40">service fee</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {confirmDeleteVenueId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setConfirmDeleteVenueId(null)}>
            <div className="bg-white p-6 border-2 border-[#c4b096] shadow-xl max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
              <p className="text-sm font-bold text-[#3d2c1f] mb-4">Deactivate this venue?</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setConfirmDeleteVenueId(null)} className="px-4 py-2 text-xs font-bold border-2 border-[#c4b096] bg-white text-black/60 hover:bg-[#f9f3e8]">Cancel</button>
                <button onClick={() => { deleteVenue(confirmDeleteVenueId); setConfirmDeleteVenueId(null); }} className="px-4 py-2 text-xs font-bold border-2 border-red-400 bg-red-50 text-red-700 hover:bg-red-100">Delete</button>
              </div>
            </div>
          </div>
        )}

        {confirmDeleteHall && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setConfirmDeleteHall(null)}>
            <div className="bg-white p-6 border-2 border-[#c4b096] shadow-xl max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
              <p className="text-sm font-bold text-[#3d2c1f] mb-4">Remove this hall?</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setConfirmDeleteHall(null)} className="px-4 py-2 text-xs font-bold border-2 border-[#c4b096] bg-white text-black/60 hover:bg-[#f9f3e8]">Cancel</button>
                <button onClick={() => { deleteHall(confirmDeleteHall.venueId, confirmDeleteHall.hallId); setConfirmDeleteHall(null); }} className="px-4 py-2 text-xs font-bold border-2 border-red-400 bg-red-50 text-red-700 hover:bg-red-100">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
    </>
  );
}
