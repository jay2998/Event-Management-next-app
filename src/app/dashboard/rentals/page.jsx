"use client";

import PageTitle from "../../components/PageTitle";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft, PackageCheck, Loader2, Plus, X, Search,
} from "lucide-react";
import { rentalsApi } from "../../../lib/api";

const ITEM_CATEGORIES = ["Tables", "Chairs", "Linens", "Decor", "Lighting", "Sound", "Tents", "Flatware", "Glassware", "Other"];
const CITY_OPTIONS = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Gujranwala", "Peshawar", "Quetta", "Other"];

export default function RentalsPage() {
  const router = useRouter();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [form, setForm] = useState({
    name: "", description: "", city: "Lahore",
    minimumOrderValue: "", deliveryAvailable: true, deliveryCharges: "",
    itemName: "", itemCategory: "Tables", itemQuantity: "", itemPricePerUnit: "",
  });

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token) { router.replace("/login"); return; }
    loadRentals();
  }, [router]);

  const loadRentals = async () => {
    setLoading(true);
    try {
      const res = await rentalsApi.list();
      setRentals(res?.data?.data || res?.data || []);
    } catch (err) {
      setError(err.message || "Failed to load rentals");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: "", description: "", city: "Lahore", minimumOrderValue: "", deliveryAvailable: true, deliveryCharges: "", itemName: "", itemCategory: "Tables", itemQuantity: "", itemPricePerUnit: "" });
    setShowForm(true);
  };

  const openEdit = (rental) => {
    const firstItem = rental.items?.[0] || {};
    setEditingId(rental._id || rental.id);
    setForm({
      name: rental.name || "",
      description: rental.description || "",
      city: rental.city || "Lahore",
      minimumOrderValue: rental.minimumOrderValue || "",
      deliveryAvailable: rental.deliveryAvailable !== false,
      deliveryCharges: rental.deliveryCharges || "",
      itemName: firstItem.name || "",
      itemCategory: firstItem.category || "Tables",
      itemQuantity: firstItem.quantity || "",
      itemPricePerUnit: firstItem.pricePerUnit || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const items = form.itemName ? [{
        name: form.itemName,
        category: form.itemCategory,
        quantity: Number(form.itemQuantity),
        pricePerUnit: Number(form.itemPricePerUnit),
      }] : [];
      const payload = {
        name: form.name,
        description: form.description,
        city: form.city,
        minimumOrderValue: form.minimumOrderValue ? Number(form.minimumOrderValue) : 0,
        deliveryAvailable: form.deliveryAvailable,
        deliveryCharges: form.deliveryCharges ? Number(form.deliveryCharges) : 0,
        items,
      };
      if (editingId) {
        await rentalsApi.update(editingId, payload);
      } else {
        await rentalsApi.create(payload);
      }
      setShowForm(false);
      loadRentals();
    } catch (err) {
      setError(err.message || "Operation failed");
    }
  };

  const deleteRental = async (id) => {
    try {
      await rentalsApi.delete(id);
      loadRentals();
    } catch (err) {
      setError(err.message || "Failed to delete rental");
    }
  };

  const filtered = rentals.filter((r) => {
    const q = search.toLowerCase();
    if (q && !(r.name || "").toLowerCase().includes(q) &&
        !(r.city || "").toLowerCase().includes(q)) return false;
    return true;
  });

  const currency = new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 });

  const totalItems = (rental) => (rental.items || []).reduce((s, i) => s + (i.quantity || 0), 0);

  return (
    <>
      <PageTitle title="Rental Manager" description="Manage rental inventory" />
      <main className="min-h-screen bg-[#f7f3ed] px-4 py-6 text-[#171717] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/dashboard" className="mb-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#c4975a] transition-colors hover:text-[#8b7355]">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>

        <div className="mb-6 rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8] px-5 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#d4af37]/15 to-[#c4975a]/10 text-[#c4975a]">
                <PackageCheck size={20} />
              </span>
              <div>
                <h1 className="text-2xl font-black text-[#3d2c1f]">Rental Inventory</h1>
                <p className="mt-1 text-sm text-black/55">{rentals.length} rental services registered</p>
              </div>
            </div>
            <button onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl border-[2.5px] border-[#d4af37] bg-[#d4af37] px-3 py-1.5 text-xs font-extrabold text-white transition hover:bg-[#c4975a]">
              <Plus size={15} /> Add Rental
            </button>
          </div>
          <div className="mt-4">
            <div className="relative max-w-xs">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/35" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search rentals..."
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
                <h2 className="text-base font-black text-[#3d2c1f]">{editingId ? "Edit Rental" : "Add Rental"}</h2>
                <button onClick={() => setShowForm(false)} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/80">
                  <X size={14} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-xs font-bold text-black/60">Name*
                    <input name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" required />
                  </label>
                  <label className="block text-xs font-bold text-black/60">City*
                    <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]">
                      {CITY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </label>
                </div>
                <label className="block text-xs font-bold text-black/60">Description
                  <textarea name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="3" className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-xs font-bold text-black/60">Min Order Value
                    <input type="number" name="minimumOrderValue" value={form.minimumOrderValue} onChange={(e) => setForm({ ...form, minimumOrderValue: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" min="0" />
                  </label>
                  <label className="block text-xs font-bold text-black/60">Delivery Charges
                    <input type="number" name="deliveryCharges" value={form.deliveryCharges} onChange={(e) => setForm({ ...form, deliveryCharges: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" min="0" />
                  </label>
                </div>
                <label className="flex items-center gap-2 text-xs font-bold text-black/60">
                  <input type="checkbox" checked={form.deliveryAvailable} onChange={(e) => setForm({ ...form, deliveryAvailable: e.target.checked })} className="h-4 w-4 rounded border-[#c4b096] text-[#d4af37] focus:ring-[#d4af37]" />
                  Delivery Available
                </label>

                <div className="border-t-[2.5px] border-[#c4b096] pt-2">
                  <div className="text-xs font-black uppercase tracking-[0.1em] text-black/45 mb-1">Inventory Item</div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block text-xs font-bold text-black/60">Item Name
                      <input name="itemName" value={form.itemName} onChange={(e) => setForm({ ...form, itemName: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" />
                    </label>
                    <label className="block text-xs font-bold text-black/60">Category
                      <select value={form.itemCategory} onChange={(e) => setForm({ ...form, itemCategory: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]">
                        {ITEM_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <label className="block text-xs font-bold text-black/60">Quantity
                      <input type="number" name="itemQuantity" value={form.itemQuantity} onChange={(e) => setForm({ ...form, itemQuantity: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" min="1" />
                    </label>
                    <label className="block text-xs font-bold text-black/60">Price/Unit
                      <input type="number" name="itemPricePerUnit" value={form.itemPricePerUnit} onChange={(e) => setForm({ ...form, itemPricePerUnit: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" min="0" />
                    </label>
                  </div>
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
            <PackageCheck size={40} className="mx-auto mb-3 text-black/20" />
            <p className="text-sm font-bold text-black/50">{search ? "No rentals match your search." : "No rentals yet. Add your first rental service."}</p>
          </div>
        ) : (
          <>
          <div className="hidden md:block overflow-x-auto rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-[2.5px] border-[#c4b096] text-[10px] font-black uppercase tracking-[0.14em] text-black/45">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">City</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Delivery</th>
                  <th className="px-4 py-3">Min Order</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c4b096]/40">
                {filtered.map((r) => (
                  <tr key={r._id || r.id} className="transition hover:bg-white/40">
                    <td className="px-4 py-3">
                      <div className="font-extrabold text-[#3d2c1f]">{r.name}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-black/60">{r.city}</td>
                    <td className="px-4 py-3 text-xs">
                      <span className="font-bold text-black/70">{totalItems(r)} units</span>
                      <span className="text-black/45"> / {(r.items || []).length} types</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold ${r.deliveryAvailable !== false ? "text-green-600" : "text-red-500"}`}>
                        {r.deliveryAvailable !== false ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-bold">{r.minimumOrderValue ? currency.format(r.minimumOrderValue) : "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(r)}
                          className="rounded-lg border-[2.5px] border-[#c4b096] bg-white/80 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-black/60 transition hover:border-[#d4af37]">
                          Edit
                        </button>
                        <button onClick={() => setConfirmDeleteId(r._id || r.id)}
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

          
          <div className="md:hidden space-y-3">
            {filtered.map((r) => (
              <div key={r._id || r.id} className="rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8] p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-[#3d2c1f]">{r.name}</span>
                  <span className={`text-[10px] font-bold ${r.deliveryAvailable !== false ? "text-green-600" : "text-red-500"}`}>{r.deliveryAvailable !== false ? "Delivery Available" : "No Delivery"}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-black/60">
                  <div>City: {r.city}</div>
                  <div>Items: {totalItems(r)} units / {(r.items || []).length} types</div>
                  <div>Min Order: {r.minimumOrderValue ? currency.format(r.minimumOrderValue) : "—"}</div>
                </div>
                <div className="mt-3 flex gap-2 justify-end">
                  <button onClick={() => openEdit(r)} className="text-[10px] font-black uppercase tracking-[0.1em] text-[#c4975a]">Edit</button>
                  <button onClick={() => setConfirmDeleteId(r._id || r.id)} className="text-[10px] font-black uppercase tracking-[0.1em] text-red-600">Delete</button>
                </div>
              </div>
            ))}
          </div>
          </>
        )}

        {confirmDeleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setConfirmDeleteId(null)}>
            <div className="bg-white p-6 border-2 border-[#c4b096] shadow-xl max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
              <p className="text-sm font-bold text-[#3d2c1f] mb-4">Are you sure you want to delete this rental?</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setConfirmDeleteId(null)} className="px-4 py-2 text-xs font-bold border-2 border-[#c4b096] bg-white text-black/60 hover:bg-[#f9f3e8]">Cancel</button>
                <button onClick={() => { deleteRental(confirmDeleteId); setConfirmDeleteId(null); }} className="px-4 py-2 text-xs font-bold border-2 border-red-400 bg-red-50 text-red-700 hover:bg-red-100">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
    </>
  );
}
