const STORAGE_KEY = "ems_role_permissions";

const DEFAULT_ACCESS = {
  overview: ["admin", "vendor", "customer"],
  bookings: ["admin", "vendor", "customer"],
  users: ["admin"],
  "access-control": ["admin"],
  halls: ["admin", "vendor"],
  catering: ["admin", "vendor"],
  rentals: ["admin", "vendor"],
  vehicles: ["admin", "vendor"],
  photographer: ["admin", "vendor"],
  videographer: ["admin", "vendor"],
  makeup_artist: ["admin", "vendor"],
  mehndi_artist: ["admin", "vendor"],
  musician_dj: ["admin", "vendor"],
  dancer: ["admin", "vendor"],
  fireworks: ["admin", "vendor"],
  event_host: ["admin", "vendor"],
  event_planner: ["admin", "vendor"],
  security: ["admin", "vendor"],
  valet_parking: ["admin", "vendor"],
  invitation: ["admin", "vendor"],
  miscellaneous: ["admin", "vendor"],
};

const LABEL_MAP = {
  overview: "Overview",
  bookings: "Bookings",
  users: "Users",
  "access-control": "Access Control",
  halls: "Venue Management",
  catering: "Catering Manager",
  rentals: "Rental Manager",
  vehicles: "Fleet Manager",
  photographer: "Photographers",
  videographer: "Videographers",
  makeup_artist: "Makeup Artists",
  mehndi_artist: "Mehndi Artists",
  musician_dj: "Musicians / DJ",
  dancer: "Dancers",
  fireworks: "Fireworks",
  event_host: "Event Hosts",
  event_planner: "Event Planners",
  security: "Security",
  valet_parking: "Valet Parking",
  invitation: "Invitations",
  miscellaneous: "Miscellaneous",
};

const GROUP_MAP = {
  main: ["overview", "bookings", "users", "access-control"],
  categories: ["halls", "catering", "rentals", "vehicles"],
  photography_video: ["photographer", "videographer"],
  makeup_mehndi: ["makeup_artist", "mehndi_artist"],
  entertainment: ["musician_dj", "dancer", "fireworks", "event_host"],
  other_services: ["event_planner", "security", "valet_parking", "invitation", "miscellaneous"],
};

const GROUP_LABELS = {
  main: "Main",
  categories: "Category Management",
  photography_video: "Photography & Video",
  makeup_mehndi: "Makeup & Mehndi",
  entertainment: "Entertainment",
  other_services: "Other Services",
};

export function hrefToKey(href) {
  if (href === "/dashboard") return "overview";
  return href.replace("/dashboard/", "").replace(/\//g, "-");
}

export function getStoredPermissions() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredPermissions(perms) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(perms));
}

export function hasAccess(href, role) {
  if (role === "admin") return true;
  const key = hrefToKey(href);
  const defaults = DEFAULT_ACCESS[key];
  if (!defaults) return false;
  if (defaults.includes(role)) return true;
  const overrides = getStoredPermissions();
  if (overrides && overrides[role] && key in overrides[role]) {
    return overrides[role][key];
  }
  return false;
}

export function getFilteredNavItems(role) {
  if (role === "admin") return null;
  const overrides = getStoredPermissions();
  const result = {};
  for (const [key, roles] of Object.entries(DEFAULT_ACCESS)) {
    const allowed = roles.includes(role);
    if (overrides && overrides[role] && key in overrides[role]) {
      result[key] = overrides[role][key];
    } else {
      result[key] = allowed;
    }
  }
  return result;
}

export function getRolePagePermissions(role) {
  const defaultResult = {};
  for (const [key, roles] of Object.entries(DEFAULT_ACCESS)) {
    defaultResult[key] = roles.includes(role);
  }
  return defaultResult;
}

export { DEFAULT_ACCESS, LABEL_MAP, GROUP_MAP, GROUP_LABELS };
