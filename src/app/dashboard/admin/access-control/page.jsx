"use client";

import PageTitle from "../../../components/PageTitle";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";
import {
  ArrowLeft, ShieldCheck, Loader2, Search, Users, UserCog,
  KeyRound, CheckCircle, XCircle, RefreshCw, Eye, EyeOff,
  ChevronDown, ChevronRight, Save,
} from "lucide-react";
import { adminApi } from "../../../../lib/api";
import {
  DEFAULT_ACCESS, LABEL_MAP, GROUP_MAP, GROUP_LABELS,
  getStoredPermissions, saveStoredPermissions,
  getRolePagePermissions,
} from "../../../../lib/permissions";

const ROLES = [
  { key: "vendor", label: "Vendor", color: "amber" },
  { key: "customer", label: "Customer", color: "gray" },
];

export default function AccessControlPage() {
  const router = useRouter();
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [expandedGroups, setExpandedGroups] = useState({});
  const [permDirty, setPermDirty] = useState(false);

  const [perms, setPerms] = useState(() => {
    const stored = getStoredPermissions();
    if (stored) return stored;
    const init = {};
    for (const role of ["vendor", "customer"]) {
      init[role] = getRolePagePermissions(role);
    }
    return init;
  });

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token) { router.replace("/login"); return; }
    loadUsers();
  }, [router]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers();
      setUsers(res?.data?.data || res?.data || []);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (id, currentActive) => {
    try {
      await adminApi.updateUser(id, { isActive: !currentActive });
      loadUsers();
    } catch {
      setError("Failed to update user status");
    }
  };

  const togglePerm = (role, key) => {
    setPerms((prev) => {
      const next = { ...prev, [role]: { ...prev[role], [key]: !prev[role][key] } };
      return next;
    });
    setPermDirty(true);
  };

  const savePerms = useCallback(() => {
    saveStoredPermissions(perms);
    setPermDirty(false);
  }, [perms]);

  const resetPerms = (role) => {
    setPerms((prev) => ({ ...prev, [role]: getRolePagePermissions(role) }));
    setPermDirty(true);
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (u.name || "").toLowerCase().includes(q) ||
           (u.email || "").toLowerCase().includes(q) ||
           (u.role || "").toLowerCase().includes(q);
  });

  const ROLE_COLORS = {
    admin: "bg-purple-100 text-purple-800 border-purple-300",
    supervisor: "bg-blue-100 text-blue-800 border-blue-300",
    vendor: "bg-amber-100 text-amber-800 border-amber-300",
    customer: "bg-gray-100 text-gray-700 border-gray-300",
  };

  const counts = useMemo(() => ({
    admin: users.filter((u) => u.role === "admin").length,
    vendor: users.filter((u) => u.role === "vendor").length,
    customer: users.filter((u) => u.role === "customer").length,
  }), [users]);

  return (
    <>
      <PageTitle title="Access Control" description="Manage user access and permissions" />
      <main className="min-h-screen bg-[#f7f3ed] px-4 py-6 text-[#171717] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/dashboard" className="mb-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#c4975a] transition-colors hover:text-[#8b7355]">
          <ArrowLeft size={16} /> Back to dashboard
        </Link>

        <div className="mb-6 rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8] px-5 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#d4af37]/15 to-[#c4975a]/10 text-[#c4975a]">
                <ShieldCheck size={20} />
              </span>
              <div>
                <h1 className="text-2xl font-black text-[#3d2c1f]">Access Control</h1>
                <p className="mt-1 text-sm text-black/55">{users.length} users</p>
              </div>
            </div>
            {tab === "users" ? (
              <button onClick={loadUsers}
                className="inline-flex items-center gap-2 rounded-xl border-[2.5px] border-[#c4b096] bg-white/80 px-3 py-1.5 text-xs font-extrabold text-[#3d2c1f] transition hover:border-[#d4af37]">
                <RefreshCw size={14} /> Refresh
              </button>
            ) : (
              <div className="flex gap-2">
                {permDirty && (
                  <button onClick={savePerms}
                    className="inline-flex items-center gap-2 rounded-xl border-[2.5px] border-green-400 bg-green-50 px-3 py-1.5 text-xs font-extrabold text-green-700 transition hover:bg-green-100">
                    <Save size={14} /> Save Changes
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2">
            {["users", "permissions"].map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`rounded-xl border-[2.5px] px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] transition ${
                  tab === t
                    ? "border-[#d4af37] bg-[#fff8dc] text-[#8a6a00]"
                    : "border-[#c4b096] bg-white/60 text-black/50 hover:border-[#d4af37]"
                }`}>
                {t === "users" ? "User Management" : "Page Permissions"}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border-[2.5px] border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>
        )}

        {tab === "users" ? (
          <>
            {loading ? (
              <div className="grid min-h-[360px] place-items-center rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8]">
                <Loader2 className="animate-spin text-[#d4af37]" size={34} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8] p-12 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <Users size={40} className="mx-auto mb-3 text-black/20" />
                <p className="text-sm font-bold text-black/50">{search ? "No users match your search." : "No users found."}</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b-[2.5px] border-[#c4b096] text-[10px] font-black uppercase tracking-[0.14em] text-black/45">
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Last Active</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c4b096]/40">
                    {filtered.map((u) => (
                      <tr key={u._id || u.id} className="transition hover:bg-white/40">
                        <td className="px-4 py-3">
                          <div className="font-extrabold text-[#3d2c1f]">{u.name}</div>
                          <div className="text-[11px] text-black/45">{u.email}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block rounded-md border-[2.5px] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.1em] ${ROLE_COLORS[u.role] || "bg-gray-100 text-gray-600 border-gray-300"}`}>
                            {u.role || "customer"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${u.isActive !== false ? "text-green-600" : "text-red-500"}`}>
                            {u.isActive !== false ? <CheckCircle size={12} /> : <XCircle size={12} />}
                            {u.isActive !== false ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-black/45">
                          {u.lastActive ? new Date(u.lastActive).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => toggleUserStatus(u._id || u.id, u.isActive)}
                            className={`rounded-lg border-[2.5px] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] transition ${
                              u.isActive !== false
                                ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                                : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                            }`}>
                            {u.isActive !== false ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-6 rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <h2 className="flex items-center gap-2 text-sm font-black text-[#3d2c1f] mb-3">
                <KeyRound size={16} className="text-[#d4af37]" />
                Permission Summary
              </h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { role: "Admin", key: "admin", perms: "Full system access, user management, all bookings" },
                  { role: "Vendor", key: "vendor", perms: "Service fulfillment, inventory, order management" },
                  { role: "Customer", key: "customer", perms: "My bookings, event planning, invoices" },
                ].map((p) => (
                  <div key={p.role} className="rounded-xl border-[2.5px] border-[#c4b096] bg-white/60 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-[0.1em] text-black/60">{p.role}</span>
                      <span className="text-lg font-black text-[#c4975a]">{counts[p.key]}</span>
                    </div>
                    <p className="mt-1 text-[10px] leading-4 text-black/45">{p.perms}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-5">
            <div className="rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-2 mb-4">
                <Eye size={16} className="text-[#d4af37]" />
                <h2 className="text-sm font-black text-[#3d2c1f]">Page Visibility by Role</h2>
                <p className="text-[10px] text-black/45 ml-auto">Toggle checkboxes to show/hide pages for each role. Admins always see everything.</p>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                {ROLES.map((role) => (
                  <div key={role.key} className="rounded-xl border-[2.5px] border-[#c4b096] bg-white/60 overflow-hidden">
                    <div className="flex items-center justify-between bg-gradient-to-r from-[#d4af37]/10 to-transparent px-4 py-2.5 border-b-[2.5px] border-[#c4b096]">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d4af37]/20 text-[10px] font-black text-[#8a6a00]">
                          {role.label.charAt(0)}
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-[#3d2c1f]">{role.label} Pages</span>
                        <span className="text-[10px] text-black/40">
                          ({Object.values(perms[role.key] || {}).filter(Boolean).length} / {Object.keys(DEFAULT_ACCESS).length} visible)
                        </span>
                      </div>
                      <button onClick={() => resetPerms(role.key)}
                        className="rounded-lg border-[2.5px] border-[#c4b096] bg-white/80 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.1em] text-black/50 transition hover:border-red-300 hover:text-red-500">
                        Reset
                      </button>
                    </div>

                    <div className="divide-y divide-[#c4b096]/20">
                      {Object.entries(GROUP_MAP).map(([groupKey, itemKeys]) => {
                        const isOpen = expandedGroups[`${role.key}-${groupKey}`] !== false;
                        return (
                          <div key={groupKey}>
                            <button
                              onClick={() => setExpandedGroups((p) => ({ ...p, [`${role.key}-${groupKey}`]: !isOpen }))}
                              className="flex w-full items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#8b7355] hover:text-[#3d2c1f] transition-colors hover:bg-white/40">
                              {isOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                              {GROUP_LABELS[groupKey]}
                            </button>
                            {isOpen && (
                              <div className="px-4 pb-2 space-y-1">
                                {itemKeys.map((key) => {
                                  const label = LABEL_MAP[key];
                                  const checked = perms[role.key]?.[key] ?? DEFAULT_ACCESS[key]?.includes(role.key) ?? false;
                                  return (
                                    <label key={key}
                                      className="flex items-center gap-2.5 px-2 py-1 rounded-lg transition hover:bg-white/60 cursor-pointer">
                                      <input type="checkbox" checked={checked}
                                        onChange={() => togglePerm(role.key, key)}
                                        className="h-3.5 w-3.5 rounded border-[#c4b096] text-[#d4af37] focus:ring-[#d4af37] focus:ring-offset-0" />
                                      <span className="text-[11px] font-semibold text-[#3d2c1f]">{label}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border-[2.5px] border-[#c4b096] bg-[#f9f3e8] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-2 mb-4">
                <KeyRound size={16} className="text-[#d4af37]" />
                <h2 className="text-sm font-black text-[#3d2c1f]">Permission Summary</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { role: "Admin", key: "admin", perms: "Full system access, user management, all bookings — cannot be restricted" },
                  { role: "Vendor", key: "vendor", perms: "Service fulfillment, inventory, order management + toggled pages above" },
                  { role: "Customer", key: "customer", perms: "My bookings, event planning, invoices + toggled pages above" },
                ].map((p) => (
                  <div key={p.role} className="rounded-xl border-[2.5px] border-[#c4b096] bg-white/60 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-[0.1em] text-black/60">{p.role}</span>
                      <span className="text-lg font-black text-[#c4975a]">{counts[p.key]}</span>
                    </div>
                    <p className="mt-1 text-[10px] leading-4 text-black/45">{p.perms}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
    </>
  );
}
