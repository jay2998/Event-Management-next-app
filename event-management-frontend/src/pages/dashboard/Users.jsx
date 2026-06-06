import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft, Loader2, Plus, X, ShieldCheck,
} from "lucide-react";
import { adminApi } from "../../lib/api";
import { localDB } from "../../lib/store";
import FormDropdown from "../../components/FormDropdown";
import { useUser } from "../../lib/hooks/useUser";

const ROLE_COLORS = {
  admin: "bg-purple-50 text-purple-800 border-purple-200",
  supervisor: "bg-blue-50 text-blue-800 border-blue-200",
  vendor: "bg-amber-50 text-amber-800 border-amber-200",
  customer: "bg-gray-50 text-gray-600 border-gray-200",
};

export default function UsersAdminPage() {
  const navigate = useNavigate();
  const user = useUser(); const isAdmin = user?.role === "admin";
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "customer" });

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token) { navigate("/login", { replace: true }); return; }
    loadUsers();
  }, [navigate]);

  useEffect(() => {
    if (!isAdmin) navigate("/dashboard", { replace: true });
  }, [isAdmin, navigate]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers();
      setUsers(res?.data?.data || res?.data || []);
    } catch {
      const local = localDB.findAll("users");
      setUsers(local?.data?.data || []);
      setError("Backend offline \u2014 showing local data");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: "", email: "", password: "", phone: "", role: "customer" });
    setShowForm(true);
  };

  const openEdit = (user) => {
    setEditingId(user._id || user.id);
    setForm({ name: user.name, email: user.email, password: "", phone: user.phone || "", role: user.role || "customer" });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminApi.updateUser(editingId, { name: form.name, email: form.email, phone: form.phone, role: form.role }).catch(() => localDB.update("users", editingId, form));
      } else {
        await adminApi.createUser(form).catch(() => localDB.create("users", form));
      }
      setShowForm(false);
      loadUsers();
    } catch (err) {
      alert(err.message || "Operation failed");
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Soft-delete this user? They can be restored via the database.")) return;
    try {
      await adminApi.deleteUser(id).catch(() => localDB.delete("users", id));
      loadUsers();
    } catch (err) {
      alert(err.message || "Failed to delete user");
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f3ed] px-4 py-6 text-[#171717] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link to="/dashboard" className="mb-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#c4975a] transition-colors hover:text-[#8b7355]">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>

        <div className="mb-6 rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8] px-5 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck size={20} className="text-[#c4975a]" />
              <div>
                <h1 className="!m-0 !text-2xl !not-italic !tracking-normal">User Management</h1>
                <p className="mt-1 text-sm text-black/55">{users.length} registered users</p>
              </div>
            </div>
            <button onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl border border-[#d4af37] bg-[#FFD700] px-4 py-2 text-sm font-extrabold text-black transition hover:bg-[#e6c200]">
              <Plus size={15} /> Add User
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>
        )}

        <FormDropdown show={showForm} onClose={() => setShowForm(false)} title={editingId ? "Edit User" : "Create User"}>
          <form onSubmit={handleSubmit} className="space-y-2">
            <label className="block text-xs font-bold text-black/60">Name<input name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-lg border border-[#d9d1c4] px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" required /></label>
            <label className="block text-xs font-bold text-black/60">Email<input name="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full rounded-lg border border-[#d9d1c4] px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" required /></label>
            {!editingId && (
              <label className="block text-xs font-bold text-black/60">Password<input name="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1 w-full rounded-lg border border-[#d9d1c4] px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" required /></label>
            )}
            <label className="block text-xs font-bold text-black/60">Phone<input name="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1 w-full rounded-lg border border-[#d9d1c4] px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]" /></label>
            <label className="block text-xs font-bold text-black/60">Role<select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="mt-1 w-full rounded-lg border border-[#d9d1c4] px-2 py-1.5 text-xs outline-none focus:border-[#d4af37]">
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
              <option value="supervisor">Supervisor</option>
              <option value="admin">Admin</option>
            </select></label>
            <div className="flex gap-2 pt-1">
              <button type="submit" className="flex-1 rounded-lg border border-[#d4af37] bg-[#FFD700] px-3 py-2 text-xs font-extrabold text-black transition hover:bg-[#e6c200]">
                {editingId ? "Update" : "Create"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 rounded-lg border border-[#d9d1c4] bg-white px-3 py-2 text-xs font-extrabold text-[#171717] transition hover:border-[#b4975a]">
                Cancel
              </button>
            </div>
          </form>
        </FormDropdown>

        {loading ? (
          <div className="grid min-h-[360px] place-items-center rounded-2xl border border-white/30 bg-white/60">
            <Loader2 className="animate-spin text-[#b4975a]" size={34} />
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-2xl border border-white/30 bg-white/60 p-12 text-center">
            <p className="text-sm font-bold text-black/50">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/30 bg-white/70 backdrop-blur-md shadow-lg">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#e8e1d5] text-[10px] font-black uppercase tracking-[0.14em] text-black/45">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8e1d5]/60">
                {users.map((u) => (
                  <tr key={u._id || u.id} className="transition hover:bg-white/60">
                    <td className="px-4 py-3 font-extrabold text-[#171717]">{u.name}</td>
                    <td className="px-4 py-3 text-xs text-black/60">{u.email}</td>
                    <td className="px-4 py-3 text-xs text-black/45">{u.phone || "\u2014"}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block rounded-md border px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.1em]">
                        {u.role || "customer"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold">
                        {u.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(u)}
                          className="rounded-lg border border-[#d9d1c4] bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-black/60 transition hover:border-[#b4975a]">
                          Edit
                        </button>
                        <button onClick={() => deleteUser(u._id || u.id)}
                          className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-red-600 transition hover:bg-red-100">
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
