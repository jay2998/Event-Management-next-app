"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft, Car, Loader2, Plus, X, Search,
} from "lucide-react";
import { vehiclesApi } from "../../../lib/api";

const VEHICLE_TYPES = ["car", "sedan", "suv", "van", "bus", "luxury", "decorated"];
const CONDITION_OPTIONS = ["excellent", "good", "fair", "maintenance"];

export default function VehiclesPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "", vehicleNumber: "", type: "car", capacity: "",
    farePerKm: "", perDayCharge: "", description: "",
    features: "", condition: "good",
  });

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token) { router.replace("/login"); return; }
    loadVehicles();
  }, [router]);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const res = await vehiclesApi.list();
      setVehicles(res?.data?.data || res?.data || []);
    } catch (err) {
      setError(err.message || "Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: "", vehicleNumber: "", type: "car", capacity: "", farePerKm: "", perDayCharge: "", description: "", features: "", condition: "good" });
    setShowForm(true);
  };

  const openEdit = (vehicle) => {
    setEditingId(vehicle._id || vehicle.id);
    setForm({
      name: vehicle.name || "",
      vehicleNumber: vehicle.vehicleNumber || "",
      type: vehicle.type || "car",
      capacity: vehicle.capacity || "",
      farePerKm: vehicle.farePerKm || "",
      perDayCharge: vehicle.perDayCharge || "",
      description: vehicle.description || "",
      features: (vehicle.features || []).join(", "),
      condition: vehicle.condition || "good",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        capacity: Number(form.capacity),
        farePerKm: Number(form.farePerKm),
        perDayCharge: Number(form.perDayCharge),
        features: form.features.split(",").map((s) => s.trim()).filter(Boolean),
      };
      if (editingId) {
        await vehiclesApi.update(editingId, payload);
      } else {
        await vehiclesApi.create(payload);
      }
      setShowForm(false);
      loadVehicles();
    } catch (err) {
      alert(err.message || "Operation failed");
    }
  };

  const deleteVehicle = async (id) => {
    if (!confirm("Delete this vehicle?")) return;
    try {
      await vehiclesApi.delete(id);
      loadVehicles();
    } catch (err) {
      alert(err.message || "Failed to delete vehicle");
    }
  };

  const toggleAvailability = async (vehicle) => {
    try {
      await vehiclesApi.updateAvailability(vehicle._id || vehicle.id, !vehicle.isAvailable);
      loadVehicles();
    } catch (err) {
      alert(err.message || "Failed to update availability");
    }
  };

  const filtered = vehicles.filter((v) => {
    const q = search.toLowerCase();
    if (q && !(v.name || "").toLowerCase().includes(q) &&
        !(v.vehicleNumber || "").toLowerCase().includes(q) &&
        !(v.type || "").toLowerCase().includes(q)) return false;
    return true;
  });

  const currency = new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 });

  const CONDITION_COLORS = {
    excellent: "border-green-200 bg-green-50 text-green-700",
    good: "border-blue-200 bg-blue-50 text-blue-700",
    fair: "border-amber-200 bg-amber-50 text-amber-700",
    maintenance: "border-red-200 bg-red-50 text-red-600",
  };

  return (
    <main className="min-h-screen bg-[#f7f3ed] px-4 py-6 text-[#171717] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/dashboard" className="mb-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#c4975a] transition-colors hover:text-[#8b7355]">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>

        <div className="mb-6 rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8] px-5 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#d4af37]/15 to-[#c4975a]/10 text-[#c4975a]">
                <Car size={20} />
              </span>
              <div>
                <h1 className="text-2xl font-black text-[#3d2c1f]">Vehicle Fleet</h1>
                <p className="mt-1 text-sm text-black/55">{vehicles.length} vehicles registered</p>
              </div>
            </div>
            <button onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl border-[2.5px] border-[#d4af37] bg-[#d4af37] px-3 py-1.5 text-xs font-extrabold text-white transition hover:bg-[#c4975a]">
              <Plus size={15} /> Add Vehicle
            </button>
          </div>
          <div className="mt-4">
            <div className="relative max-w-xs">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/35" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, number, type..."
                className="w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 pl-9 pr-4 py-2 text-sm outline-none transition focus:border-[#d4af37]" />
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
                <h2 className="text-base font-black text-[#3d2c1f]">{editingId ? "Edit Vehicle" : "Add Vehicle"}</h2>
                <button onClick={() => setShowForm(false)} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/80">
                  <X size={14} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-xs font-bold text-black/60">Name*
                    <input name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" required />
                  </label>
                  <label className="block text-xs font-bold text-black/60">Vehicle Number*
                    <input name="vehicleNumber" value={form.vehicleNumber} onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" required />
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <label className="block text-xs font-bold text-black/60">Type*
                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]">
                      {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                    </select>
                  </label>
                  <label className="block text-xs font-bold text-black/60">Capacity*
                    <input type="number" name="capacity" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" required min="1" />
                  </label>
                  <label className="block text-xs font-bold text-black/60">Condition
                    <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]">
                      {CONDITION_OPTIONS.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-xs font-bold text-black/60">Fare/Km*
                    <input type="number" name="farePerKm" value={form.farePerKm} onChange={(e) => setForm({ ...form, farePerKm: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" required min="0" />
                  </label>
                  <label className="block text-xs font-bold text-black/60">Per Day Charge*
                    <input type="number" name="perDayCharge" value={form.perDayCharge} onChange={(e) => setForm({ ...form, perDayCharge: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" required min="0" />
                  </label>
                </div>
                <label className="block text-xs font-bold text-black/60">Features (comma-separated)
                  <input name="features" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="AC, GPS, Music System" className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" />
                </label>
                <label className="block text-xs font-bold text-black/60">Description
                  <textarea name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="3" className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" />
                </label>
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
            <Car size={40} className="mx-auto mb-3 text-black/20" />
            <p className="text-sm font-bold text-black/50">{search ? "No vehicles match your search." : "No vehicles yet. Add your first vehicle."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-[2.5px] border-[#c4b096] text-[10px] font-black uppercase tracking-[0.14em] text-black/45">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Number</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Capacity</th>
                  <th className="px-4 py-3">Fare/Km</th>
                  <th className="px-4 py-3">Condition</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c4b096]/40">
                {filtered.map((v) => (
                  <tr key={v._id || v.id} className="transition hover:bg-white/40">
                    <td className="px-4 py-3">
                      <div className="font-extrabold text-[#3d2c1f]">{v.name}</div>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono font-bold text-black/70">{v.vehicleNumber}</td>
                    <td className="px-4 py-3 text-xs text-black/60 capitalize">{v.type}</td>
                    <td className="px-4 py-3 text-xs font-bold text-black/70">{v.capacity}</td>
                    <td className="px-4 py-3 text-xs font-bold">{v.farePerKm ? currency.format(v.farePerKm) : "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.1em] ${CONDITION_COLORS[v.condition] || "border-gray-200 bg-gray-50 text-gray-600"}`}>
                        {v.condition || "good"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => toggleAvailability(v)}
                          className={`rounded-lg border-[2.5px] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] transition ${
                            v.isAvailable !== false
                              ? "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                              : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
                          }`}>
                          {v.isAvailable !== false ? "Active" : "Inactive"}
                        </button>
                        <button onClick={() => openEdit(v)}
                          className="rounded-lg border-[2.5px] border-[#c4b096] bg-white/80 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-black/60 transition hover:border-[#d4af37]">
                          Edit
                        </button>
                        <button onClick={() => deleteVehicle(v._id || v.id)}
                          className="rounded-lg border-[2.5px] border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-red-600 transition hover:bg-red-100">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
