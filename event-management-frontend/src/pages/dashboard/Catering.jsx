import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft, Utensils, Loader2, Plus, X, Search, ShoppingBag,
  Calculator, ChevronDown, DollarSign, FileText, Trash2, Eye,
  Clock, Users, Save, List, Filter,
} from "lucide-react";
import { cateringApi, calculateApi } from "../../lib/api";
import { useToast } from "../../components/Toast";
import { localDB } from "../../lib/store";
import FormDropdown from "../../components/FormDropdown";
import { useUser } from "../../lib/hooks/useUser";

const MENU_CATEGORIES = ["Appetizer", "Main Course", "Rice", "Bread", "Dessert", "Beverage", "Snack", "Other"];
const MENU_TIERS = [
  { key: "budget", label: "Budget", price: 1800, desc: "Basic 3-course meal" },
  { key: "standard", label: "Standard", price: 2800, desc: "Premium 4-course meal" },
  { key: "luxury", label: "Luxury", price: 4500, desc: "5-course gourmet experience" },
];
const ADD_ON_OPTIONS = [
  { key: "generator", label: "Generator Fuel", price: 25000 },
  { key: "decor", label: "Extra Decor", price: 35000 },
  { key: "bbq", label: "Live BBQ Stations", price: 45000 },
];
const ORDER_STATUSES = ["All", "Pending", "Confirmed", "Inspected", "Cancelled"];

export default function CateringPage() {
  const navigate = useNavigate();
  const user = useUser(); const isAdmin = user?.role === "admin";
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("menu");
  const [orderFilter, setOrderFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "", category: "Main Course", price: "", description: "", city: "",
  });
  const [viewOrder, setViewOrder] = useState(null);

  const [showOrderForm, setShowOrderForm] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [orderForm, setOrderForm] = useState({
    name: "", bookingId: "", eventDate: "", totalAmount: "", status: "Pending", items: [],
  });
  const [orderItemInput, setOrderItemInput] = useState({ name: "", price: "", quantity: 1 });

  const [showQcForm, setShowQcForm] = useState(false);
  const [qcOrderId, setQcOrderId] = useState(null);
  const [qcForm, setQcForm] = useState({
    appearance: "", taste: "", temperature: "", plating: "", notes: "",
  });

  const [showDraftForm, setShowDraftForm] = useState(false);
  const [draftForm, setDraftForm] = useState({ bookingId: "", guestCount: 100, items: [] });
  const [editingDraftId, setEditingDraftId] = useState(null);

  const [calcInput, setCalcInput] = useState({
    guestCount: 200,
    menuTier: "standard",
    taxStatus: "non-filer",
    addOns: [],
    hallUtilityFee: 0,
  });
  const [calcResult, setCalcResult] = useState(null);
  const [calcLoading, setCalcLoading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const addToast = useToast();

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token) { navigate("/login", { replace: true }); return; }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [menuRes, ordersRes, draftsRes] = await Promise.allSettled([
        cateringApi.getMenu(),
        cateringApi.getOrders().catch(() => ({ data: { data: [] } })),
        cateringApi.getMenuDraft().catch(() => ({ data: { data: [] } })),
      ]);
      if (menuRes.status === "fulfilled") {
        const raw = menuRes.value?.data?.data || menuRes.value?.data?.menu || menuRes.value?.data || [];
        setMenuItems(raw.map((item) => ({ ...item, price: item.basePrice || item.price || 0 })));
      } else {
        const local = localDB.findAll("catering");
        setMenuItems(local?.data?.data || []);
        setError("Backend offline \u2014 showing local data");
      }
      if (ordersRes.status === "fulfilled") {
        setOrders(ordersRes.value?.data?.data || ordersRes.value?.data || []);
      } else {
        const local = localDB.findAll("orders");
        setOrders(local?.data?.data || []);
      }
      if (draftsRes.status === "fulfilled") {
        const d = draftsRes.value?.data?.data || [];
        setDrafts(Array.isArray(d) ? d : []);
      } else {
        const local = localDB.findAll("drafts");
        setDrafts(local?.data?.data || []);
      }
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: "", category: "Main Course", price: "", description: "", city: "" });
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name || "",
      category: MENU_CATEGORIES.includes(item.category) ? item.category : "Main Course",
      price: item.price || "",
      description: item.description || "",
      city: item.city || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, price: Number(form.price) };
      if (editingId) {
        await cateringApi.updateMenuItem(editingId, payload).catch(() => localDB.update("catering", editingId, payload));
      } else {
        await cateringApi.createMenuItem(payload).catch(() => localDB.create("catering", payload));
      }
      setShowForm(false);
      loadData();
      addToast(editingId ? "Menu item updated" : "Menu item created", "success");
    } catch (err) {
      addToast(err.message || "Operation failed", "error");
    }
  };

  const deleteMenuItem = async (id) => {
    try {
      await cateringApi.deleteMenuItem(id).catch(() => localDB.delete("catering", id));
      loadData();
      addToast("Menu item deleted", "success");
    } catch (err) {
      addToast(err.message || "Failed to delete menu item", "error");
    }
  };

  const openNewDraft = () => {
    setEditingDraftId(null);
    setDraftForm({
      bookingId: "", guestCount: 100,
      items: menuItems.map((m) => ({
        id: m.id, name: m.name, price: Number(m.price || 0),
        category: m.category || "Other", description: m.description || "",
        quantity: 0,
      })),
    });
    setShowDraftForm(true);
  };

  const openEditDraft = (draft) => {
    setEditingDraftId(draft.id);
    const existing = (draft.items || []).reduce((map, di) => {
      map[di.id || di.name] = di.quantity || 0;
      return map;
    }, {});
    setDraftForm({
      bookingId: draft.bookingId || "",
      guestCount: draft.guestCount || 100,
      items: menuItems.map((m) => ({
        id: m.id, name: m.name, price: Number(m.price || 0),
        category: m.category || "Other", description: m.description || "",
        quantity: existing[m.id] || existing[m.name] || 0,
      })),
    });
    setShowDraftForm(true);
  };

  const saveDraft = async () => {
    setSavingDraft(true);
    try {
      const selected = draftForm.items.filter((i) => i.quantity > 0).map((i) => ({
        id: String(i.id), name: i.name, price: Number(i.price || 0),
        quantity: Number(i.quantity || 1), category: i.category || "Other",
        description: i.description || "",
      }));
      const totalPrice = selected.reduce((s, i) => s + i.price * i.quantity, 0);
      const payload = {
        bookingId: draftForm.bookingId || null,
        guestCount: Number(draftForm.guestCount),
        items: selected,
        totalPrice,
      };
      if (editingDraftId) {
        payload.id = editingDraftId;
        await cateringApi.saveMenuDraft(payload).catch(() => localDB.update("drafts", editingDraftId, payload));
      } else {
        await cateringApi.saveMenuDraft(payload).catch(() => localDB.create("drafts", payload));
      }
      setShowDraftForm(false);
      loadData();
      addToast(editingDraftId ? "Draft updated" : "Draft saved", "success");
    } catch (err) {
      addToast(err.message || "Failed to save draft", "error");
    } finally {
      setSavingDraft(false);
    }
  };

  const deleteDraft = async (id) => {
    try {
      await cateringApi.deleteMenuDraft(id).catch(() => localDB.delete("drafts", id));
      loadData();
      addToast("Draft deleted", "success");
    } catch (err) {
      addToast(err.message || "Failed to delete draft", "error");
    }
  };

  const toggleAddOn = (key) => {
    setCalcInput((prev) => ({
      ...prev,
      addOns: prev.addOns.includes(key)
        ? prev.addOns.filter((a) => a !== key)
        : [...prev.addOns, key],
    }));
  };

  const runCalculation = async () => {
    setCalcLoading(true);
    try {
      const res = await calculateApi.breakdown(calcInput);
      setCalcResult(res?.data?.data?.breakdown || null);
    } catch (err) {
      addToast(err.message || "Calculation failed", "error");
    } finally {
      setCalcLoading(false);
    }
  };

  const openCreateOrder = () => {
    setEditingOrderId(null);
    setOrderForm({ name: "", bookingId: "", eventDate: "", totalAmount: "", status: "Pending", items: [] });
    setOrderItemInput({ name: "", price: "", quantity: 1 });
    setShowOrderForm(true);
  };

  const openEditOrder = (o) => {
    setEditingOrderId(o.id);
    setOrderForm({
      name: o.name || "",
      bookingId: typeof o.bookingId === "object" ? o.bookingId.id || "" : o.bookingId || "",
      eventDate: o.eventDate ? new Date(o.eventDate).toISOString().split("T")[0] : "",
      totalAmount: o.totalAmount || "",
      status: o.status || "Pending",
      items: (o.items || o.menuItems || []).map((i) => ({
        name: i.name, price: i.price || 0, quantity: i.quantity || 1,
      })),
    });
    setOrderItemInput({ name: "", price: "", quantity: 1 });
    setShowOrderForm(true);
  };

  const addOrderItem = () => {
    if (!orderItemInput.name || !orderItemInput.price) return;
    setOrderForm((prev) => ({
      ...prev,
      items: [...prev.items, { ...orderItemInput, price: Number(orderItemInput.price), quantity: Number(orderItemInput.quantity) }],
    }));
    setOrderItemInput({ name: "", price: "", quantity: 1 });
  };

  const removeOrderItem = (idx) => {
    setOrderForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: orderForm.name,
        bookingId: orderForm.bookingId || undefined,
        eventDate: orderForm.eventDate || undefined,
        totalAmount: Number(orderForm.totalAmount) || 0,
        status: orderForm.status,
        items: orderForm.items,
        menuItems: orderForm.items,
      };
      if (editingOrderId) {
        await cateringApi.updateOrder(editingOrderId, payload).catch(() => localDB.update("orders", editingOrderId, payload));
      } else {
        await cateringApi.createOrder(payload).catch(() => localDB.create("orders", payload));
      }
      setShowOrderForm(false);
      loadData();
      addToast(editingOrderId ? "Order updated" : "Order created", "success");
    } catch (err) {
      addToast(err.message || "Failed to save order", "error");
    }
  };

  const openQcForm = (o) => {
    setQcOrderId(o.id);
    const qc = o.qualityCheck || {};
    setQcForm({
      appearance: qc.appearance != null ? String(qc.appearance) : "",
      taste: qc.taste != null ? String(qc.taste) : "",
      temperature: qc.temperature != null ? String(qc.temperature) : "",
      plating: qc.plating != null ? String(qc.plating) : "",
      notes: qc.notes || "",
    });
    setShowQcForm(true);
  };

  const handleQcSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {};
      if (qcForm.appearance) payload.appearance = Number(qcForm.appearance);
      if (qcForm.taste) payload.taste = Number(qcForm.taste);
      if (qcForm.temperature) payload.temperature = Number(qcForm.temperature);
      if (qcForm.plating) payload.plating = Number(qcForm.plating);
      if (qcForm.notes) payload.notes = qcForm.notes;
      await cateringApi.updateQualityCheck(qcOrderId, payload).catch(() => localDB.update("orders", qcOrderId, { qualityCheck: payload }));
      setShowQcForm(false);
      setViewOrder(null);
      loadData();
      addToast("Quality check saved", "success");
    } catch (err) {
      addToast(err.message || "Failed to save quality check", "error");
    }
  };

  const filteredMenu = menuItems.filter((m) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (m.name || "").toLowerCase().includes(q) ||
      (m.category || "").toLowerCase().includes(q);
  });

  const groupedMenu = MENU_CATEGORIES.map((cat) => ({
    category: cat,
    items: filteredMenu.filter((m) => (m.category || "").toLowerCase() === cat.toLowerCase()),
  })).filter((g) => g.items.length > 0);

  const filteredOrders = orders.filter((o) => {
    if (orderFilter !== "All") {
      const status = (o.status || "pending").toLowerCase();
      if (status !== orderFilter.toLowerCase()) return false;
    }
    const q = search.toLowerCase();
    if (!q) return true;
    return (o.name || "").toLowerCase().includes(q);
  });

  const currency = new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 });

  const statusBadge = (status) => {
    const s = (status || "pending").toLowerCase();
    const colors = {
      confirmed: "border-green-200 bg-green-50 text-green-700",
      inspected: "border-blue-200 bg-blue-50 text-blue-700",
      passed: "border-green-200 bg-green-50 text-green-700",
      cancelled: "border-red-200 bg-red-50 text-red-600",
      pending: "border-amber-200 bg-amber-50 text-amber-700",
    };
    const c = Object.entries(colors).find(([k]) => s === k || s.includes(k))?.[1] || "border-gray-200 bg-gray-50 text-gray-600";
    return (
      <span className={`inline-block rounded-md border-[2.5px] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.1em] ${c}`}>
        {s}
      </span>
    );
  };

  const renderMenuForm = () => (
    <FormDropdown show={showForm} onClose={() => setShowForm(false)} title={editingId ? "Edit Menu Item" : "Add Menu Item"}>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <label className="block text-xs font-bold text-black/60">Name*
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" required />
          </label>
          <label className="block text-xs font-bold text-black/60">Category*
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]">
              {MENU_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        </div>
        <label className="block text-xs font-bold text-black/60">Price*
          <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" required min="0" />
        </label>
        <label className="block text-xs font-bold text-black/60">Description
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="2" className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" />
        </label>
        <label className="block text-xs font-bold text-black/60">City
          <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]">
            <option value="">Other</option>
            <option value="Lahore">Lahore</option>
            <option value="Karachi">Karachi</option>
            <option value="Islamabad">Islamabad</option>
            <option value="Rawalpindi">Rawalpindi</option>
            <option value="Faisalabad">Faisalabad</option>
            <option value="Multan">Multan</option>
            <option value="Gujranwala">Gujranwala</option>
          </select>
        </label>
        <div className="flex gap-2 pt-1">
          <button type="submit" className="flex-1 rounded-xl border-[2.5px] border-[#d4af37] bg-[#d4af37] px-3 py-2 text-xs font-extrabold text-white transition hover:bg-[#c4975a]">
            {editingId ? "Update" : "Create"}
          </button>
          <button type="button" onClick={() => setShowForm(false)} className="flex-1 rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-3 py-2 text-xs font-extrabold text-[#3d2c1f] transition hover:border-[#d4af37]">Cancel</button>
        </div>
      </form>
    </FormDropdown>
  );

  const renderDraftForm = () => (
    <FormDropdown show={showDraftForm} onClose={() => setShowDraftForm(false)} title={editingDraftId ? "Edit Draft Menu" : "New Draft Menu"}>
      <div className="mb-3">
        <label className="text-xs font-bold text-black/60 block mb-1">Guest Count</label>
        <input type="number" value={draftForm.guestCount}
          onChange={(e) => setDraftForm({ ...draftForm, guestCount: Number(e.target.value) })}
          className="w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-3 py-2 text-sm outline-none focus:border-[#d4af37]" min="1" />
      </div>

      <div className="mb-3">
        <label className="text-xs font-bold text-black/60 block mb-1">
          Select Items &mdash; <span className="text-[#c4975a]">
            {draftForm.items.filter((i) => i.quantity > 0).length} selected
          </span>
        </label>
        <div className="max-h-64 overflow-y-auto space-y-1.5 rounded-xl border-[2.5px] border-[#c4b096] bg-white/60 p-2">
          {menuItems.length === 0 && (
            <p className="text-xs text-black/40 text-center py-4">No menu items available. Add some first.</p>
          )}
          {MENU_CATEGORIES.map((cat) => {
            const catItems = draftForm.items.filter((i) => i.category === cat);
            if (catItems.length === 0) return null;
            return (
              <div key={cat}>
                <div className="text-[10px] font-black uppercase tracking-[0.1em] text-black/40 px-1 py-1">{cat}</div>
                {catItems.map((item, idx) => {
                  const realIdx = draftForm.items.findIndex((i) => i.id === item.id);
                  return (
                    <div key={item.id || idx} className="flex items-center gap-2 rounded-lg border border-[#c4b096]/30 bg-white/80 px-2.5 py-1.5">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-[#3d2c1f] truncate">{item.name}</div>
                        <div className="text-[10px] text-black/45">{currency.format(item.price)}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => {
                          const copy = [...draftForm.items];
                          copy[realIdx] = { ...copy[realIdx], quantity: Math.max(0, (copy[realIdx].quantity || 0) - 1) };
                          setDraftForm({ ...draftForm, items: copy });
                        }} className="flex h-6 w-6 items-center justify-center rounded-md border border-[#c4b096]/40 bg-white text-xs font-bold text-black/50 hover:border-[#d4af37]">-</button>
                        <span className="w-6 text-center text-xs font-extrabold text-[#3d2c1f]">{item.quantity || 0}</span>
                        <button type="button" onClick={() => {
                          const copy = [...draftForm.items];
                          copy[realIdx] = { ...copy[realIdx], quantity: (copy[realIdx].quantity || 0) + 1 };
                          setDraftForm({ ...draftForm, items: copy });
                        }} className="flex h-6 w-6 items-center justify-center rounded-md border border-[#c4b096]/40 bg-white text-xs font-bold text-black/50 hover:border-[#d4af37]">+</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border-[2.5px] border-[#d4af37]/40 bg-[#fff8dc] px-3 py-2 mb-3">
        <span className="text-xs font-bold text-[#3d2c1f]">Total</span>
        <span className="text-lg font-black text-[#c4975a]">
          {currency.format(draftForm.items.reduce((s, i) => s + Number(i.price || 0) * Number(i.quantity || 0), 0))}
        </span>
      </div>

      <div className="flex gap-2">
        <button onClick={saveDraft} disabled={savingDraft}
          className="flex-1 rounded-xl border-[2.5px] border-[#d4af37] bg-[#d4af37] px-3 py-2 text-xs font-extrabold text-white transition hover:bg-[#c4975a] disabled:opacity-50 inline-flex items-center justify-center gap-1.5">
          <Save size={13} /> {savingDraft ? "Saving..." : editingDraftId ? "Update Draft" : "Save Draft"}
        </button>
        <button type="button" onClick={() => setShowDraftForm(false)}
          className="flex-1 rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-3 py-2 text-xs font-extrabold text-[#3d2c1f] transition hover:border-[#d4af37]">Cancel</button>
      </div>
    </FormDropdown>
  );

  const renderOrderModal = () => {
    if (!viewOrder) return null;
    const o = viewOrder;
    return (
      <FormDropdown show={!!viewOrder} onClose={() => setViewOrder(null)} title={o.name || "Order Details"}>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center pb-2 border-b border-[#c4b096]/30">
            <span className="text-xs text-black/55">Status</span>
            {statusBadge(o.status || "pending")}
          </div>

          {o.bookingId && (
            <div className="flex justify-between">
              <span className="text-xs text-black/55">Booking</span>
              <span className="text-xs font-bold">{typeof o.bookingId === "object" ? o.bookingId.name : o.bookingId}</span>
            </div>
          )}

          {o.eventDate && (
            <div className="flex justify-between">
              <span className="text-xs text-black/55">Event Date</span>
              <span className="text-xs font-bold">{new Date(o.eventDate).toLocaleDateString()}</span>
            </div>
          )}

          {o.totalAmount && (
            <div className="flex justify-between">
              <span className="text-xs text-black/55">Total Amount</span>
              <span className="text-sm font-extrabold text-[#c4975a]">{currency.format(o.totalAmount)}</span>
            </div>
          )}

          {(o.items || o.menuItems) && (
            <div>
              <div className="text-xs font-bold text-black/55 mb-1.5">Items</div>
              <div className="rounded-xl border border-[#c4b096]/30 bg-white/60 p-2 space-y-1">
                {(o.items || o.menuItems || []).map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#3d2c1f]">{item.name} {item.quantity > 1 && <span className="text-black/40 font-normal">&times;{item.quantity}</span>}</span>
                    <span className="text-[#c4975a] font-bold">{currency.format(Number(item.price || 0) * Number(item.quantity || 1))}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {o.qualityCheck && typeof o.qualityCheck === "object" && (o.qualityCheck.appearance != null || o.qualityCheck.taste != null || o.qualityCheck.temperature != null || o.qualityCheck.plating != null || o.qualityCheck.notes) && (
            <div>
              <div className="text-xs font-bold text-black/55 mb-1.5">Quality Check</div>
              <div className="rounded-xl border border-[#c4b096]/30 bg-white/60 p-2 space-y-1 text-xs">
                {[["appearance", "Appearance"], ["taste", "Taste"], ["temperature", "Temperature"], ["plating", "Plating"]].filter(([k]) => o.qualityCheck[k] != null).map(([k, label]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-black/55">{label}</span>
                    <span className="font-bold text-[#3d2c1f]">{o.qualityCheck[k]}/5</span>
                  </div>
                ))}
                {o.qualityCheck.notes && (
                  <div className="pt-1 border-t border-[#c4b096]/20">
                    <span className="text-black/55">Notes: </span>
                    <span className="text-[#3d2c1f]">{o.qualityCheck.notes}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <button onClick={() => { setViewOrder(null); openEditOrder(o); }}
            className="flex-1 rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-3 py-2 text-xs font-extrabold text-[#3d2c1f] transition hover:border-[#d4af37]">Edit</button>
          <button onClick={() => { setViewOrder(null); openQcForm(o); }}
            className="flex-1 rounded-xl border-[2.5px] border-blue-200 bg-blue-50 px-3 py-2 text-xs font-extrabold text-blue-700 transition hover:bg-blue-100">Quality Check</button>
          <button onClick={() => setViewOrder(null)}
            className="flex-1 rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-3 py-2 text-xs font-extrabold text-[#3d2c1f] transition hover:border-[#d4af37]">Close</button>
        </div>
      </FormDropdown>
    );
  };

  const renderOrderForm = () => (
    <FormDropdown show={showOrderForm} onClose={() => setShowOrderForm(false)} title={editingOrderId ? "Edit Order" : "New Order"}>
      <form onSubmit={handleOrderSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs font-bold text-black/60">Order Name*
            <input value={orderForm.name} onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" required />
          </label>
          <label className="block text-xs font-bold text-black/60">Booking ID
            <input value={orderForm.bookingId} onChange={(e) => setOrderForm({ ...orderForm, bookingId: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs font-bold text-black/60">Event Date
            <input type="date" value={orderForm.eventDate} onChange={(e) => setOrderForm({ ...orderForm, eventDate: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" />
          </label>
          <label className="block text-xs font-bold text-black/60">Total Amount
            <input type="number" value={orderForm.totalAmount} onChange={(e) => setOrderForm({ ...orderForm, totalAmount: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" min="0" />
          </label>
        </div>
        <label className="block text-xs font-bold text-black/60">Status
          <select value={orderForm.status} onChange={(e) => setOrderForm({ ...orderForm, status: e.target.value })} className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]">
            {["Pending", "Confirmed", "Inspected", "Cancelled"].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <div>
          <label className="text-xs font-bold text-black/60 block mb-1">Order Items</label>
          <div className="rounded-xl border-[2.5px] border-[#c4b096] bg-white/60 p-2 space-y-1.5 mb-2 max-h-32 overflow-y-auto">
            {orderForm.items.length === 0 ? (
              <p className="text-[10px] text-black/40 text-center py-2">No items added</p>
            ) : orderForm.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <span className="flex-1 font-bold text-[#3d2c1f] truncate">{item.name}</span>
                <span className="text-black/50">&times;{item.quantity}</span>
                <span className="text-[#c4975a] font-bold">{currency.format(Number(item.price) * Number(item.quantity))}</span>
                <button type="button" onClick={() => removeOrderItem(idx)} className="text-red-500 hover:text-red-700"><X size={12} /></button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input value={orderItemInput.name} onChange={(e) => setOrderItemInput({ ...orderItemInput, name: e.target.value })} placeholder="Item name" className="flex-1 rounded-lg border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1 text-[10px] outline-none focus:border-[#d4af37]" />
            <input type="number" value={orderItemInput.price} onChange={(e) => setOrderItemInput({ ...orderItemInput, price: e.target.value })} placeholder="Price" className="w-20 rounded-lg border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1 text-[10px] outline-none focus:border-[#d4af37]" min="0" />
            <input type="number" value={orderItemInput.quantity} onChange={(e) => setOrderItemInput({ ...orderItemInput, quantity: Number(e.target.value) })} placeholder="Qty" className="w-14 rounded-lg border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1 text-[10px] outline-none focus:border-[#d4af37]" min="1" />
            <button type="button" onClick={addOrderItem} className="rounded-lg border-[2.5px] border-[#d4af37] bg-[#d4af37] px-2 py-1 text-[9px] font-black text-white hover:bg-[#c4975a]">+</button>
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <button type="submit" className="flex-1 rounded-xl border-[2.5px] border-[#d4af37] bg-[#d4af37] px-3 py-2 text-xs font-extrabold text-white transition hover:bg-[#c4975a]">
            {editingOrderId ? "Update Order" : "Create Order"}
          </button>
          <button type="button" onClick={() => setShowOrderForm(false)} className="flex-1 rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-3 py-2 text-xs font-extrabold text-[#3d2c1f] transition hover:border-[#d4af37]">Cancel</button>
        </div>
      </form>
    </FormDropdown>
  );

  const renderQcForm = () => (
    <FormDropdown show={showQcForm} onClose={() => setShowQcForm(false)} title="Quality Check">
      <form onSubmit={handleQcSubmit} className="space-y-3">
        {[["appearance", "Appearance"], ["taste", "Taste"], ["temperature", "Temperature"], ["plating", "Plating"]].map(([key, label]) => (
          <label key={key} className="block text-xs font-bold text-black/60">
            {label} (1-5)
            <select value={qcForm[key]} onChange={(e) => setQcForm({ ...qcForm, [key]: e.target.value })}
              className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]">
              <option value="">\u2014</option>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
        ))}
        <label className="block text-xs font-bold text-black/60">Notes
          <textarea value={qcForm.notes} onChange={(e) => setQcForm({ ...qcForm, notes: e.target.value })} rows="2" className="mt-1 w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" />
        </label>
        <div className="flex gap-2 pt-1">
          <button type="submit" className="flex-1 rounded-xl border-[2.5px] border-[#d4af37] bg-[#d4af37] px-3 py-2 text-xs font-extrabold text-white transition hover:bg-[#c4975a]">Save</button>
          <button type="button" onClick={() => setShowQcForm(false)} className="flex-1 rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-3 py-2 text-xs font-extrabold text-[#3d2c1f] transition hover:border-[#d4af37]">Cancel</button>
        </div>
      </form>
    </FormDropdown>
  );

  return (
    <main className="min-h-screen bg-[#f7f3ed] px-4 py-6 text-[#171717] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link to="/dashboard" className="mb-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#c4975a] transition-colors hover:text-[#8b7355]">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>

        <div className="mb-6 rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8] px-5 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#d4af37]/15 to-[#c4975a]/10 text-[#c4975a]">
                <Utensils size={20} />
              </span>
              <div>
                <h1 className="text-2xl font-black text-[#3d2c1f]">Catering</h1>
                <p className="mt-1 text-sm text-black/55">{menuItems.length} menu items &middot; {drafts.length} drafts &middot; {orders.length} orders</p>
              </div>
            </div>
            <div className="flex gap-2">
              {tab === "menu" && isAdmin && (
                <button onClick={openCreate}
                  className="inline-flex items-center gap-2 rounded-xl border-[2.5px] border-[#d4af37] bg-[#d4af37] px-3 py-1.5 text-xs font-extrabold text-white transition hover:bg-[#c4975a]">
                  <Plus size={15} /> Add Item
                </button>
              )}
              {tab === "orders" && isAdmin && (
                <button onClick={openCreateOrder}
                  className="inline-flex items-center gap-2 rounded-xl border-[2.5px] border-[#d4af37] bg-[#d4af37] px-3 py-1.5 text-xs font-extrabold text-white transition hover:bg-[#c4975a]">
                  <Plus size={15} /> New Order
                </button>
              )}
              {tab === "drafts" && isAdmin && (
                <button onClick={openNewDraft}
                  className="inline-flex items-center gap-2 rounded-xl border-[2.5px] border-[#d4af37] bg-[#d4af37] px-3 py-1.5 text-xs font-extrabold text-white transition hover:bg-[#c4975a]">
                  <FileText size={15} /> New Draft
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              {["menu", "orders", "drafts", "calculator"].map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`rounded-xl border-[2.5px] px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] transition ${
                    tab === t
                      ? "border-[#d4af37] bg-[#fff8dc] text-[#8a6a00]"
                      : "border-[#c4b096] bg-white/60 text-black/50 hover:border-[#d4af37]"
                  }`}>
                  {t === "menu" ? "Menu Items" : t === "orders" ? "Orders" : t === "drafts" ? "Drafts" : "Calculator"}
                </button>
              ))}
            </div>
            {tab !== "calculator" && (
              <div className="relative max-w-xs">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/35" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder={`Search ${tab}...`}
                  className="w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 pl-9 pr-4 py-2 text-sm outline-none transition focus:border-[#d4af37]" />
              </div>
            )}
          </div>

          {tab === "orders" && (
            <div className="mt-3 flex items-center gap-2">
              <Filter size={13} className="text-black/35" />
              {ORDER_STATUSES.map((s) => (
                <button key={s} onClick={() => setOrderFilter(s)}
                  className={`rounded-lg border-[2.5px] px-2.5 py-0.5 text-[9px] font-black uppercase tracking-[0.1em] transition ${
                    orderFilter === s
                      ? "border-[#d4af37] bg-[#fff8dc] text-[#8a6a00]"
                      : "border-[#c4b096] bg-white/60 text-black/50 hover:border-[#d4af37]"
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="mb-5 rounded-xl border-[2.5px] border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>
        )}

        {showForm && renderMenuForm()}
        {showDraftForm && renderDraftForm()}
        {showOrderForm && renderOrderForm()}
        {showQcForm && renderQcForm()}
        {viewOrder && renderOrderModal()}

        {loading ? (
          <div className="grid min-h-[360px] place-items-center rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8]">
            <Loader2 className="animate-spin text-[#d4af37]" size={34} />
          </div>
        ) : tab === "menu" ? (
          groupedMenu.length === 0 ? (
            <div className="rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8] p-12 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <Utensils size={40} className="mx-auto mb-3 text-black/20" />
              <p className="text-sm font-bold text-black/50">{search ? "No matches." : "No menu items yet."}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {groupedMenu.map(({ category, items }) => (
                <div key={category}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="h-5 w-1 rounded-full bg-gradient-to-b from-[#d4af37] to-[#c4975a]" />
                    <h2 className="text-sm font-black uppercase tracking-[0.12em] text-[#3d2c1f]">{category}</h2>
                    <span className="text-[10px] font-bold text-black/35">({items.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {items.map((m) => (
                      <div key={m.id} className="group rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 p-3.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition hover:border-[#d4af37] hover:shadow-md">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-extrabold text-[#3d2c1f] truncate">{m.name}</h3>
                            {m.description && (
                              <p className="text-[10px] text-black/45 mt-0.5 line-clamp-2">{m.description}</p>
                            )}
                          </div>
                          <span className="shrink-0 ml-2 text-xs font-black text-[#c4975a]">{currency.format(m.price)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="inline-block rounded-md border border-[#c4b096]/40 bg-white/60 px-2 py-0.5 text-[9px] font-bold text-black/50">{m.category}</span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(m)}
                              className="rounded-lg border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.1em] text-black/50 transition hover:border-[#d4af37]">Edit</button>
                            {isAdmin && (
                              <button onClick={() => deleteMenuItem(m.id)}
                                className="rounded-lg border-[2.5px] border-red-200 bg-red-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.1em] text-red-500 transition hover:bg-red-100">Delete</button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : tab === "drafts" ? (
          drafts.length === 0 ? (
            <div className="rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8] p-12 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <FileText size={40} className="mx-auto mb-3 text-black/20" />
              <p className="text-sm font-bold text-black/50">No draft menus yet.</p>
              {isAdmin && (
                <button onClick={openNewDraft}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl border-[2.5px] border-[#d4af37] bg-[#d4af37] px-4 py-2 text-xs font-extrabold text-white transition hover:bg-[#c4975a]">
                  <Plus size={14} /> Create Your First Draft
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {drafts.map((d) => {
                const itemCount = (d.items || []).reduce((s, i) => s + Number(i.quantity || 0), 0);
                return (
                  <div key={d.id} className="rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition hover:border-[#d4af37] hover:shadow-md">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#d4af37]/15 to-[#c4975a]/10 text-[#c4975a]">
                          <FileText size={16} />
                        </span>
                        <div>
                          {d.bookingId ? (
                            <div className="text-xs font-bold text-[#3d2c1f]">Booking #{d.bookingId}</div>
                          ) : (
                            <div className="text-xs font-bold text-black/40">No booking linked</div>
                          )}
                          <div className="text-[9px] text-black/40">
                            {new Date(d.updatedAt || d.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      {statusBadge(d.status || "draft")}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-black/55 mb-3">
                      <span className="flex items-center gap-1"><Users size={12} /> {d.guestCount || "\u2014"}</span>
                      <span className="flex items-center gap-1"><List size={12} /> {itemCount} items</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {new Date(d.updatedAt || d.createdAt).toLocaleDateString()}</span>
                    </div>

                    {d.items && d.items.length > 0 && (
                      <div className="rounded-lg border border-[#c4b096]/30 bg-[#f9f3e8] p-2 mb-3 max-h-20 overflow-y-auto">
                        {d.items.slice(0, 4).map((item, i) => (
                          <div key={i} className="flex justify-between text-[10px] py-0.5">
                            <span className="text-[#3d2c1f] truncate">{item.name} {item.quantity > 1 && <span className="text-black/40">&times;{item.quantity}</span>}</span>
                            <span className="text-[#c4975a] font-bold">{currency.format(Number(item.price || 0) * Number(item.quantity || 1))}</span>
                          </div>
                        ))}
                        {d.items.length > 4 && (
                          <div className="text-[9px] text-black/40 text-center pt-1">+{d.items.length - 4} more items</div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-[#c4b096]/30">
                      <span className="text-lg font-black text-[#c4975a]">{currency.format(d.totalPrice || 0)}</span>
                      <div className="flex gap-1">
                        <button onClick={() => openEditDraft(d)}
                          className="rounded-lg border-[2.5px] border-[#c4b096] bg-white/80 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-black/50 transition hover:border-[#d4af37]">Edit</button>
                        {isAdmin && (
                          <button onClick={() => deleteDraft(d.id)}
                            className="rounded-lg border-[2.5px] border-red-200 bg-red-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-red-500 transition hover:bg-red-100">Delete</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : tab === "orders" ? (
          filteredOrders.length === 0 ? (
            <div className="rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8] p-12 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <ShoppingBag size={40} className="mx-auto mb-3 text-black/20" />
              <p className="text-sm font-bold text-black/50">{search || orderFilter !== "All" ? "No matches." : "No catering orders yet."}</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b-[2.5px] border-[#c4b096] text-[10px] font-black uppercase tracking-[0.14em] text-black/45">
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Booking</th>
                    <th className="px-4 py-3">Items</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c4b096]/40">
                  {filteredOrders.map((o) => {
                    const itemCount = (o.items || o.menuItems || []).reduce((s, i) => s + Number(i.quantity || 1), 0);
                    return (
                      <tr key={o.id || o._id} className="transition hover:bg-white/40">
                        <td className="px-4 py-3">
                          <div className="font-extrabold text-[#3d2c1f]">{o.name || `Order #${String(o.id || "").slice(-6)}`}</div>
                          {o.eventDate && <div className="text-[10px] text-black/40">{new Date(o.eventDate).toLocaleDateString()}</div>}
                        </td>
                        <td className="px-4 py-3 text-xs text-black/60">{typeof o.bookingId === "object" ? o.bookingId.name : o.bookingId || "\u2014"}</td>
                        <td className="px-4 py-3 text-xs text-black/50">{itemCount} items</td>
                        <td className="px-4 py-3 text-xs font-bold">{o.totalAmount ? currency.format(o.totalAmount) : "\u2014"}</td>
                        <td className="px-4 py-3">{statusBadge(o.status || "pending")}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => setViewOrder(o)}
                              className="inline-flex items-center gap-1 rounded-lg border-[2.5px] border-[#c4b096] bg-white/80 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-black/50 transition hover:border-[#d4af37]">
                              <Eye size={12} /> View
                            </button>
                            <button onClick={() => openEditOrder(o)}
                              className="inline-flex items-center gap-1 rounded-lg border-[2.5px] border-[#c4b096] bg-white/80 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-black/50 transition hover:border-[#d4af37]">
                              Edit
                            </button>
                            <button onClick={() => openQcForm(o)}
                              className="inline-flex items-center gap-1 rounded-lg border-[2.5px] border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-blue-700 transition hover:bg-blue-100">
                              QC
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <h2 className="flex items-center gap-2 text-base font-black text-[#3d2c1f] mb-4">
                <Calculator size={18} className="text-[#d4af37]" />
                Event Cost Calculator
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-black/60 block mb-1">Guest Count</label>
                  <input type="number" value={calcInput.guestCount}
                    onChange={(e) => setCalcInput({ ...calcInput, guestCount: Number(e.target.value) })}
                    className="w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-4 py-2.5 text-sm outline-none focus:border-[#d4af37]" min="1" />
                </div>

                <div>
                  <label className="text-xs font-bold text-black/60 block mb-2">Menu Tier</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {MENU_TIERS.map((tier) => (
                      <button key={tier.key} onClick={() => setCalcInput({ ...calcInput, menuTier: tier.key })}
                        className={`rounded-xl border-[2.5px] p-3 text-left transition ${
                          calcInput.menuTier === tier.key
                            ? "border-[#d4af37] bg-[#fff8dc]"
                            : "border-[#c4b096] bg-white/60 hover:border-[#d4af37]"
                        }`}>
                        <div className="text-sm font-extrabold text-[#3d2c1f]">{tier.label}</div>
                        <div className="text-lg font-black text-[#c4975a]">{currency.format(tier.price)}</div>
                        <div className="text-[9px] text-black/40 mt-0.5">{tier.desc}</div>
                        <div className="text-[9px] font-bold text-black/40">per head</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-black/60 block mb-1">Tax Status</label>
                  <div className="flex gap-2">
                    {[{ key: "filer", label: "Filer (10%)" }, { key: "non-filer", label: "Non-Filer (20%)" }].map((t) => (
                      <button key={t.key} onClick={() => setCalcInput({ ...calcInput, taxStatus: t.key })}
                        className={`flex-1 rounded-xl border-[2.5px] py-2.5 text-xs font-extrabold uppercase tracking-[0.1em] transition ${
                          calcInput.taxStatus === t.key
                            ? "border-[#d4af37] bg-[#fff8dc] text-[#8a6a00]"
                            : "border-[#c4b096] bg-white/60 text-black/50 hover:border-[#d4af37]"
                        }`}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-black/60 block mb-1">Hall Utility Fee</label>
                  <input type="number" value={calcInput.hallUtilityFee}
                    onChange={(e) => setCalcInput({ ...calcInput, hallUtilityFee: Number(e.target.value) })}
                    className="w-full rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-4 py-2.5 text-sm outline-none focus:border-[#d4af37]" min="0" />
                </div>

                <div>
                  <label className="text-xs font-bold text-black/60 block mb-2">Add-ons</label>
                  <div className="space-y-2">
                    {ADD_ON_OPTIONS.map((addon) => (
                      <label key={addon.key}
                        className={`flex items-center justify-between rounded-xl border-[2.5px] px-4 py-2.5 cursor-pointer transition ${
                          calcInput.addOns.includes(addon.key)
                            ? "border-[#d4af37] bg-[#fff8dc]"
                            : "border-[#c4b096] bg-white/60 hover:border-[#d4af37]"
                        }`}>
                        <div className="flex items-center gap-3">
                          <input type="checkbox" checked={calcInput.addOns.includes(addon.key)}
                            onChange={() => toggleAddOn(addon.key)}
                            className="h-4 w-4 rounded border-[#c4b096] text-[#d4af37] focus:ring-[#d4af37]" />
                          <span className="text-sm font-bold text-[#3d2c1f]">{addon.label}</span>
                        </div>
                        <span className="text-xs font-bold text-[#c4975a]">{currency.format(addon.price)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button onClick={runCalculation} disabled={calcLoading}
                  className="w-full rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c4975a] py-3 text-sm font-extrabold text-white shadow-md transition hover:shadow-lg disabled:opacity-50">
                  {calcLoading ? "Calculating..." : "Calculate Total"}
                </button>
              </div>
            </div>

            <div>
              <div className="rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] sticky top-24">
                <h2 className="flex items-center gap-2 text-base font-black text-[#3d2c1f] mb-4">
                  <DollarSign size={18} className="text-[#d4af37]" />
                  Cost Breakdown
                </h2>

                {!calcResult ? (
                  <div className="text-center py-10 text-black/40">
                    <Calculator size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm font-bold">Enter details and calculate</p>
                    <p className="text-xs mt-1">Adjust inputs and press Calculate Total</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b-[2px] border-[#c4b096]/30">
                      <span className="text-xs text-black/55">Guest Count</span>
                      <span className="text-sm font-bold text-[#3d2c1f]">{calcResult.guestCount} &times; {currency.format(calcResult.menuPricePerHead)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-[#3d2c1f]">Food &amp; Venue</span>
                      <span className="text-lg font-black text-[#3d2c1f]">{currency.format(calcResult.foodVenueSubtotal)}</span>
                    </div>

                    <div className="text-[11px] text-black/45 space-y-1 pl-2 border-l-[3px] border-[#c4b096]">
                      <div className="flex justify-between">
                        <span>Base Cost ({calcResult.guestCount} &times; {currency.format(calcResult.menuPricePerHead)})</span>
                        <span>{currency.format(calcResult.baseCost)}</span>
                      </div>
                      {calcResult.smallEventSurcharge > 0 && (
                        <div className="flex justify-between text-amber-700">
                          <span>Small Event Surcharge (&lt;200 guests)</span>
                          <span>{currency.format(calcResult.smallEventSurcharge)}</span>
                        </div>
                      )}
                      {calcResult.hallUtilityFee > 0 && (
                        <div className="flex justify-between">
                          <span>Hall Utility Fee</span>
                          <span>{currency.format(calcResult.hallUtilityFee)}</span>
                        </div>
                      )}
                    </div>

                    {calcResult.addOns?.length > 0 && (
                      <>
                        <div className="flex justify-between items-center pt-2 border-t-[2px] border-[#c4b096]/30">
                          <span className="text-sm font-bold text-[#3d2c1f]">Add-ons</span>
                          <span className="text-sm font-bold text-[#c4975a]">{currency.format(calcResult.addOnTotal)}</span>
                        </div>
                        <div className="text-[11px] text-black/45 space-y-1 pl-2">
                          {calcResult.addOns.map((a, i) => (
                            <div key={i} className="flex justify-between">
                              <span>{a.name}</span>
                              <span>{currency.format(a.amount)}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    <div className="flex justify-between items-center pt-2 border-t-[2px] border-[#c4b096]/30">
                      <span className="text-sm font-bold text-[#3d2c1f]">
                        Govt. Taxes ({calcResult.taxRate}% {calcResult.taxStatus === "filer" ? "Filer" : "Non-Filer"})
                      </span>
                      <span className="text-sm font-bold text-red-600">{currency.format(calcResult.govtTax)}</span>
                    </div>
                    <div className="text-[10px] text-black/40 pl-2">
                      Taxed on: {currency.format(calcResult.taxableAmount)} (Base + Add-ons)
                    </div>

                    <div className="flex justify-between items-center pt-3 mt-3 border-t-[3px] border-[#d4af37] bg-gradient-to-r from-[#fff8dc] to-[#fef3c7] -mx-5 -mb-5 px-5 py-4 rounded-b-2xl">
                      <span className="text-base font-black text-[#3d2c1f]">Total Payable</span>
                      <span className="text-2xl font-black text-[#c4975a]">{currency.format(calcResult.totalPayable)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
