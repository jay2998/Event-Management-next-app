const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getStoredToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("token");
};

// Clear auth state — called externally by components when they detect a 401
const clearAuth = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("user");
};

export { clearAuth };

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      body?.message ||
      body?.error ||
      response.statusText ||
      "Request failed";

    const error = new Error(message);
    error.status = response.status;
    error.data = body;
    throw error;
  }

  return { data: body };
};

export const api = {
  request: async (path, options = {}) => {
    const token = getStoredToken();
    const headers = new Headers(options.headers || {});

    const isFormData = options.body instanceof FormData;
    if (!headers.has("Content-Type") && options.body && !isFormData) {
      headers.set("Content-Type", "application/json");
    }

    if (token) headers.set("Authorization", `Bearer ${token}`);

    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
      });

      return await parseResponse(response);
    } catch (error) {
      throw error;
    }
  },

  get: (path, params) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return api.request(`${path}${query}`);
  },

  post: (path, data) =>
    api.request(path, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: (path, data) =>
    api.request(path, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  patch: (path, data) =>
    api.request(path, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (path) =>
    api.request(path, {
      method: "DELETE",
    }),
};

export const authApi = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  me: () => api.get("/auth/me"),
};

export const dashboardApi = {
  bookings: () => api.get("/bookings"),
  getBooking: (id) => api.get(`/bookings/${id}`),
  createBooking: (data) => api.post("/bookings", data),
  updateBooking: (id, data) => api.put(`/bookings/${id}`, data),
  cancelBooking: (id) => api.delete(`/bookings/${id}`),
  updateBookingStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
  addBookingPayment: (id, data) => api.post(`/bookings/${id}/payments`, data),
  getBookingMenu: (id) => api.get(`/bookings/${id}/menu`),
  updateBookingMenu: (id, data) => api.put(`/bookings/${id}/menu`, data),
  getBookingInvoice: (id) => api.get(`/bookings/${id}/invoice`),
  stats: () => api.get("/bookings/stats"),
  halls: () => api.get("/halls"),
  vehicles: () => api.get("/vehicles"),
  rentals: () => api.get("/rentals"),
};

export const adminApi = {
  getUsers: () => api.get("/auth/users"),
  createUser: (data) => api.post("/auth/users", data),
  updateUser: (id, data) => api.put(`/auth/users/${id}`, data),
  deleteUser: (id) => api.delete(`/auth/users/${id}`),
};

export const hallsApi = {
  list: (params) => api.get("/halls", params),
  get: (id) => api.get(`/halls/${id}`),
  create: (data) => api.post("/halls", data),
  update: (id, data) => api.put(`/halls/${id}`, data),
  delete: (id) => api.delete(`/halls/${id}`),
  getVendorHalls: () => api.get("/halls/vendor/my-halls"),
};

export const rentalsApi = {
  list: (params) => api.get("/rentals", params),
  get: (id) => api.get(`/rentals/${id}`),
  create: (data) => api.post("/rentals", data),
  update: (id, data) => api.put(`/rentals/${id}`, data),
  delete: (id) => api.delete(`/rentals/${id}`),
  getVendorRentals: () => api.get("/rentals/vendor/my-rentals"),
};

export const vehiclesApi = {
  list: (params) => api.get("/vehicles", params),
  get: (id) => api.get(`/vehicles/${id}`),
  create: (data) => api.post("/vehicles", data),
  update: (id, data) => api.put(`/vehicles/${id}`, data),
  delete: (id) => api.delete(`/vehicles/${id}`),
  updateAvailability: (id, isAvailable) => api.patch(`/vehicles/${id}/availability`, { isAvailable }),
  updateCondition: (id, condition) => api.patch(`/vehicles/${id}/condition`, { condition }),
};

export const inventoryApi = {
  list: (params) => api.get("/inventory", params),
  get: (id) => api.get(`/inventory/${id}`),
  create: (data) => api.post("/inventory", data),
  update: (id, data) => api.put(`/inventory/${id}`, data),
  delete: (id) => api.delete(`/inventory/${id}`),
};

export const cateringApi = {
  getMenu: () => api.get("/catering/menu"),
  createMenuItem: (data) => api.post("/catering/menu", data),
  updateMenuItem: (id, data) => api.put(`/catering/menu/${id}`, data),
  deleteMenuItem: (id) => api.delete(`/catering/menu/${id}`),
  getMenuDraft: (bookingId) => api.get(`/catering/menu-draft${bookingId ? `?bookingId=${bookingId}` : ""}`),
  saveMenuDraft: (data) => api.post("/catering/menu-draft", data),
  deleteMenuDraft: (id) => api.delete(`/catering/menu-draft/${id}`),
  getOrders: () => api.get("/catering"),
  createOrder: (data) => api.post("/catering", data),
  updateOrder: (id, data) => api.put(`/catering/${id}`, data),
  updateQualityCheck: (id, data) => api.patch(`/catering/${id}/quality-check`, data),
};

export const notificationsApi = {
  list: () => api.get("/notifications"),
  markAllRead: () => api.put("/notifications/read-all"),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
};

export const uploadApi = {
  upload: (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.request("/uploads", {
      method: "POST",
      body: formData,
      headers: {},
    });
  },
};

export const contactApi = {
  send: (data) => api.post("/contact", data),
};

export const venuesApi = {
  list: (params) => api.get("/venues", params),
  get: (id) => api.get(`/venues/${id}`),
  create: (data) => api.post("/venues", data),
  update: (id, data) => api.put(`/venues/${id}`, data),
  delete: (id) => api.delete(`/venues/${id}`),
  addHall: (id, data) => api.post(`/venues/${id}/halls`, data),
  updateHall: (id, hallId, data) => api.put(`/venues/${id}/halls/${hallId}`, data),
  removeHall: (id, hallId) => api.delete(`/venues/${id}/halls/${hallId}`),
  setHallSlot: (id, hallId, data) => api.patch(`/venues/${id}/halls/${hallId}/slot`, data),
  getAvailable: (params) => api.get("/venues/available", params),
  suggestAlternatives: (params) => api.get("/venues/suggest", params),
};

export const calculateApi = {
  breakdown: (data) => api.post("/calculate/breakdown", data),
};

export const categoriesApi = {
  config: () => api.get("/categories/config"),
  list: (slug) => api.get(`/categories/${slug}`),
  get: (slug, id) => api.get(`/categories/${slug}/${id}`),
  create: (slug, data) => api.post(`/categories/${slug}`, data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const auth = authApi;
