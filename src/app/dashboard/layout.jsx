"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { notificationsApi } from "../../lib/api";
import { hasAccess } from "../../lib/permissions";
import { ToastProvider } from "../components/Toast";
import {
  LayoutDashboard, Building2, Car, PackageCheck, Utensils,
  ClipboardList, Users, Menu, X, LogOut, ChevronDown, ChevronRight,
  Bell, Sparkles, Camera, Palette, Music, Shield, Box, Home,
} from "lucide-react";
import { CATEGORY_GROUPS, EVENT_CATEGORIES } from "../../lib/categories";

const GROUP_ICONS = {
  "Venue & Infrastructure": Building2,
  "Decor & Visuals": Palette,
  "Media & Digital": Camera,
  "Entertainment & Traditions": Music,
  "Logistics & Coordination": ClipboardList,
  "Specialized Services": Sparkles,
};

const allCategoryItems = CATEGORY_GROUPS.map((group) => ({
  icon: GROUP_ICONS[group] || Box,
  label: group,
  subItems: EVENT_CATEGORIES.filter((c) => c.group === group).map((c) => ({
    href: `/bookings?category=${c.key}`,
    icon: Box,
    label: c.label,
  })),
}));

const NAV_SECTIONS = [
  {
    label: "Main",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
      { href: "/dashboard/bookings", icon: ClipboardList, label: "Bookings" },
    ],
  },
  {
    label: "Management",
    items: [
      { href: "/dashboard/halls", icon: Building2, label: "Venue Management" },
      { href: "/dashboard/catering", icon: Utensils, label: "Catering Manager" },
      { href: "/dashboard/rentals", icon: PackageCheck, label: "Rental Manager" },
      { href: "/dashboard/vehicles", icon: Car, label: "Fleet Manager" },
    ],
  },
  {
    label: "Categories",
    items: allCategoryItems,
  },
  {
    label: "Administration",
    items: [
      { href: "/dashboard/users", icon: Users, label: "Users" },
      { href: "/dashboard/admin/access-control", icon: Shield, label: "Access Control" },
    ],
  },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState({});
  const [expandedSections, setExpandedSections] = useState(() => {
    const init = {};
    NAV_SECTIONS.forEach((s, i) => { init[s.label] = i === 0; });
    return init;
  });
  const [expandedGroups, setExpandedGroups] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);
  const [showRead, setShowRead] = useState(false);
  const [toast, setToast] = useState(null);
  const prevNotifCount = useRef(0);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("user");
      if (raw && raw !== "undefined") setUser(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    if (user?.role === "customer") {
      router.replace("/enquiry");
    }
  }, [user, router]);

  useEffect(() => {
    if (notifications.length > prevNotifCount.current && notifications.length > 0) {
      const latest = notifications[0];
      setToast(latest?.message || "New notification");
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
    prevNotifCount.current = notifications.length;
  }, [notifications]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await notificationsApi.list();
        if (res.data?.success) {
          const fetched = res.data.data || [];
          setNotifications((prev) => {
            const existingIds = new Set(prev.map((n) => n.id || n._id));
            const newUnread = fetched.filter((n) => !n.read && !existingIds.has(n.id || n._id));
            return [...newUnread, ...prev];
          });
        }
      } catch {}
    };
    fetchNotifications();
    const id = setInterval(fetchNotifications, 10000);
    return () => clearInterval(id);
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    router.replace("/login");
  };

  const isActive = (href) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const toggleSection = (label) => {
    setExpandedSections((prev) => {
      if (prev[label]) return { ...prev, [label]: false };
      const next = {};
      NAV_SECTIONS.forEach((s) => { next[s.label] = s.label === label; });
      return next;
    });
  };

  const role = user.role || "guest";

  const filteredNavSections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items
      .map((item) => {
        if (item.subItems) {
          const filteredSubs = item.subItems.filter((sub) => hasAccess(sub.href, role));
          return filteredSubs.length > 0 ? { ...item, subItems: filteredSubs } : null;
        }
        return hasAccess(item.href, role) ? item : null;
      })
      .filter(Boolean),
  })).filter((section) => section.items.length > 0);

  const markAsRead = async (id) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) => prev.filter((n) => (n.id || n._id) !== id));
    } catch {}
  };

  const handleNotificationClick = async (n, e) => {
    if (e.target.type === "checkbox") return;
    if (!n.read) {
      await markAsRead(n.id || n._id);
    }
    if (n.bookingId) {
      router.push(`/dashboard/bookings?id=${n.bookingId}`);
      setNotifPanelOpen(false);
    }
  };

  const visibleNotifications = showRead ? notifications : notifications.filter((n) => !n.read);

  const allNavItems = filteredNavSections.flatMap((s) =>
    s.items.flatMap((item) => item.subItems || [item])
  );
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex min-h-screen bg-bg-warm">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-56 flex-col border-r-[2.5px] border-border bg-gradient-to-b from-[#F9F7F2] to-[#f0ebe3] transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex items-center justify-between border-b-[2.5px] border-border px-4 py-3">
          <Link href="/dashboard" className="flex items-center gap-2 transition-all duration-300 hover:opacity-80">
            <img src="/logo.svg" alt="EventPro" className="h-5 w-auto" />
            <div className="text-xs font-extrabold text-foreground leading-tight">EventPro</div>
          </Link>
          <Link href="/" className="flex h-7 w-7 items-center justify-center rounded-lg border-[2.5px] border-border bg-white/60 text-taupe transition hover:border-[#C5A059] hover:text-[#C5A059]" title="Back to home" aria-label="Back to home">
            <Home size={12} />
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-lg text-black/40 hover:bg-white/60 lg:hidden">
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-2">
          <div className="flex items-center gap-2 mb-2 px-2 py-1 rounded-lg bg-[#c4b096]/10 border border-[#c4b096]/20">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#C5A059] to-[#c4975a] text-[7px] font-black text-white shadow-sm shrink-0">
              {(user.name || "U").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-extrabold text-foreground truncate leading-tight max-w-[100px]">{user.name || "User"}</div>
              <div className="text-[8px] font-bold uppercase tracking-[0.1em] text-taupe leading-tight">{user.role || "guest"}</div>
            </div>
          </div>

          {filteredNavSections.map((section) => (
            <div key={section.label} className="mb-1">
              <button onClick={() => toggleSection(section.label)}
                className="flex w-full items-center gap-1 px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-taupe hover:text-foreground transition-colors">
                {expandedSections[section.label] ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                {section.label}
              </button>
              {expandedSections[section.label] && section.items.map((item) => {
                if (item.subItems) {
                  const isOpen = expandedGroups[item.label] === true;
                  const childActive = item.subItems.some((s) => isActive(s.href));
                  return (
                    <div key={item.label} className="mb-0.5">
                      <button onClick={() => setExpandedGroups((p) => {
                        if (p[item.label]) return { ...p, [item.label]: false };
                        const next = {};
                        const section = filteredNavSections.find((s) => s.items.some((i) => i.subItems?.some((sub) => sub)));
                        if (section) {
                          section.items.filter((i) => i.subItems).forEach((i) => { next[i.label] = i.label === item.label; });
                        }
                        return next;
                      })}
                        className={`group flex w-full items-center gap-2 rounded-lg px-2 py-1 text-xs font-bold transition-all ${
                          childActive
                            ? "bg-gradient-to-r from-[#C5A059]/20 to-[#c4975a]/10 text-foreground border-l-[3px] border-[#C5A059]"
                            : "text-text-muted hover:bg-white/60 hover:text-foreground border-l-[3px] border-transparent"
                        }`}>
                        <item.icon size={13} className={childActive ? "text-[#C5A059]" : "text-taupe shrink-0"} />
                        <span className="truncate leading-tight flex-1 text-left text-xs">{item.label}</span>
                        {isOpen ? <ChevronDown size={11} className="text-taupe" /> : <ChevronRight size={11} className="text-taupe" />}
                      </button>
                      {isOpen && (
                        <div className="ml-3 mt-0.5 space-y-0.5 border-l-2 border-[#c4b096]/30 pl-1.5">
                          {item.subItems.map((sub) => {
                            const active = isActive(sub.href);
                            return (
                              <Link key={sub.href} href={sub.href} onClick={() => setSidebarOpen(false)}
                                className={`group flex items-center gap-1.5 rounded-lg px-2 py-0.5 text-[11px] font-semibold transition-all ${
                                  active
                                    ? "bg-gradient-to-r from-[#C5A059]/15 to-[#c4975a]/8 text-foreground border-l-[2px] border-[#C5A059]"
                                    : "text-text-muted hover:bg-white/60 hover:text-foreground border-l-[2px] border-transparent"
                                }`}>
                                <sub.icon size={11} className={active ? "text-[#C5A059]" : "text-taupe shrink-0"} />
                                <span className="truncate leading-tight">{sub.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }
                const active = isActive(item.href);
                return (
                  <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center gap-2 rounded-lg px-2 py-1 text-xs font-bold transition-all ${
                      active
                        ? "bg-gradient-to-r from-[#C5A059]/20 to-[#c4975a]/10 text-foreground border-l-[3px] border-[#C5A059]"
                        : "text-text-muted hover:bg-white/60 hover:text-foreground border-l-[3px] border-transparent"
                    }`}>
                    <item.icon size={13} className={active ? "text-[#C5A059]" : "text-taupe shrink-0"} />
                    <span className="truncate leading-tight">{item.label}</span>
                    {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#C5A059] shrink-0" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="border-t-[2.5px] border-border p-3">
          <button onClick={handleLogout}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border-[2.5px] border-border bg-white/60 px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-text-muted transition hover:border-[#C5A059] hover:bg-white">
            <LogOut size={12} />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col min-w-0 lg:ml-56">
        <header className="sticky top-0 z-30 border-b-[2.5px] border-border bg-[#F9F7F2]/95 backdrop-blur-md">
          <div className="flex items-center justify-between px-4 py-3 lg:px-6">
            <button onClick={() => setSidebarOpen(true)} aria-label="Open sidebar"
              className="flex h-9 w-9 items-center justify-center rounded-xl border-[2.5px] border-border bg-white/80 text-text-muted transition hover:border-[#C5A059] lg:hidden">
              <Menu size={18} />
            </button>
            <Link href="/dashboard" className="items-center gap-2 transition-all duration-300 hover:opacity-80 hidden sm:flex">
              <img src="/logo.svg" alt="EventPro" className="h-5 w-auto" />
              <span className="text-xs font-bold text-foreground">EventPro</span>
            </Link>
            <div className="flex items-center gap-2">
              <button onClick={handleLogout} aria-label="Log out"
                className="flex h-9 w-9 items-center justify-center rounded-xl border-[2.5px] border-border bg-white/80 text-text-muted transition hover:border-[#C5A059]">
                <LogOut size={16} />
              </button>
              <button onClick={() => setNotifPanelOpen((p) => !p)} aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border-[2.5px] border-border bg-white/80 text-text-muted transition hover:border-[#C5A059]">
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-[#C5A059] text-[8px] font-black text-white flex items-center justify-center shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <ToastProvider>
            {children}
          </ToastProvider>
        </main>
      </div>

      {notifPanelOpen && (
        <div className="fixed right-4 top-16 z-50 w-80 rounded-xl border-[2.5px] border-border bg-[#F9F7F2] shadow-2xl">
          <div className="flex items-center justify-between border-b-[2.5px] border-border px-3 py-2.5">
            <span className="text-xs font-black uppercase tracking-[0.1em] text-[#C5A059]">Notifications</span>
            <div className="flex items-center gap-1">
              <button onClick={() => setShowRead((p) => !p)}
                className="text-[9px] font-bold uppercase tracking-[0.08em] text-taupe hover:text-foreground transition-colors">
                {showRead ? "Hide read" : "Show read"}
              </button>
              <button onClick={() => setNotifPanelOpen(false)}
                className="flex h-6 w-6 items-center justify-center rounded-lg text-text-muted hover:bg-white/60 transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {visibleNotifications.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-xs text-taupe">
                {showRead ? "No notifications" : "No unread notifications"}
              </div>
            ) : visibleNotifications.map((n) => (
              <div
                key={n.id || n._id}
                onClick={(e) => handleNotificationClick(n, e)}
                className="flex items-start gap-2 px-3 py-2.5 border-b border-[#c4b096]/40 text-xs leading-relaxed break-words cursor-pointer font-bold text-foreground bg-white/60 hover:bg-white/80 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div>{n.message}</div>
                  <div className="text-[9px] text-taupe/70 mt-0.5">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed right-4 top-20 z-50 max-w-xs animate-slide-in rounded-xl border-[2.5px] border-border bg-[#F9F7F2] px-4 py-3 shadow-2xl">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#C5A059] text-[9px] font-black text-white">!</span>
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.1em] text-[#C5A059]">New Notification</div>
              <p className="mt-0.5 text-xs leading-relaxed text-text-muted">{toast}</p>
            </div>
            <button onClick={() => setToast(null)} className="shrink-0 text-taupe hover:text-text-muted"><X size={14} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
