const STORE_PREFIX = "ems_";

const SEED = {
  bookings: [
    { id: "b1", eventName: "Ahmed & Fatima Wedding", eventDate: new Date(Date.now() + 86400000 * 14).toISOString(), eventType: "wedding", customerName: "Ahmed Khan", customerEmail: "ahmed@email.com", customerPhone: "+92 300 1111111", guestCount: 350, hallName: "Grand Ballroom", totalAmount: 850000, status: "confirmed", notes: "Mehndi, Baraat, Walima", createdAt: new Date().toISOString() },
    { id: "b2", eventName: "Corporate Annual Gala", eventDate: new Date(Date.now() + 86400000 * 45).toISOString(), eventType: "corporate", customerName: "Fatima Corp", customerEmail: "events@fatimacorp.com", customerPhone: "+92 300 2222222", guestCount: 200, hallName: "Convention Hall", totalAmount: 450000, status: "confirmed", notes: "Award ceremony + dinner", createdAt: new Date().toISOString() },
    { id: "b3", eventName: "Zara Birthday Bash", eventDate: new Date(Date.now() + 86400000 * 3).toISOString(), eventType: "birthday", customerName: "Zara Malik", customerEmail: "zara@email.com", customerPhone: "+92 300 3333333", guestCount: 80, hallName: "Garden Pavilion", totalAmount: 120000, status: "pending", notes: "Sweet sixteen theme", createdAt: new Date().toISOString() },
    { id: "b4", eventName: "Charity Dinner", eventDate: new Date(Date.now() - 86400000 * 10).toISOString(), eventType: "gala", customerName: "Al-Khidmat Foundation", customerEmail: "info@alkhidmat.org", customerPhone: "+92 300 4444444", guestCount: 500, hallName: "Grand Ballroom", totalAmount: 200000, status: "completed", notes: "Fundraising dinner", createdAt: new Date(Date.now() - 86400000 * 40).toISOString() },
    { id: "b5", eventName: "Nikkah Ceremony", eventDate: new Date(Date.now() + 86400000 * 60).toISOString(), eventType: "wedding", customerName: "Sana & Ali", customerEmail: "sana@email.com", customerPhone: "+92 300 5555555", guestCount: 150, hallName: "Lawn Garden", totalAmount: 320000, status: "pending", notes: "Simple nikkah + dinner", createdAt: new Date().toISOString() },
  ],
  venues: [
    { id: "v1", name: "Pearl Continental", city: "Lahore", address: "Mall Road, Lahore", description: "Luxury hotel with multiple event spaces", contactPhone: "+92 42 111 1111", contactEmail: "events@pearl.com", halls: [
      { id: "h1", name: "Grand Ballroom", capacityMin: 200, capacityMax: 800, baseServiceFee: 150000, amenities: ["AC", "WiFi", "Sound System", "Stage", "Parking"], slots: {} },
      { id: "h2", name: "Garden Pavilion", capacityMin: 50, capacityMax: 200, baseServiceFee: 80000, amenities: ["AC", "Garden", "Catering Kitchen"], slots: {} },
    ]},
    { id: "v2", name: "Avari Towers", city: "Karachi", address: "Fatima Jinnah Road, Karachi", description: "Premier event venue in Karachi", contactPhone: "+92 21 111 2222", contactEmail: "events@avari.com", halls: [
      { id: "h3", name: "Convention Hall", capacityMin: 150, capacityMax: 600, baseServiceFee: 120000, amenities: ["AC", "WiFi", "Stage", "Backstage"], slots: {} },
      { id: "h4", name: "Lawn Garden", capacityMin: 100, capacityMax: 400, baseServiceFee: 90000, amenities: ["Garden", "Parking", "Stage"], slots: {} },
    ]},
    { id: "v3", name: "Islamabad Club", city: "Islamabad", address: "Khayaban-e-Suhrwardy, Islamabad", description: "Elite club with scenic views", contactPhone: "+92 51 111 3333", contactEmail: "events@islamabadclub.com", halls: [
      { id: "h5", name: "Main Hall", capacityMin: 100, capacityMax: 350, baseServiceFee: 100000, amenities: ["AC", "WiFi", "Projector", "Sound System"], slots: {} },
    ]},
  ],
  catering: [
    { id: "m1", name: "Chicken Biryani", category: "Rice", price: 450, description: "Aromatic basmati rice with tender chicken", city: "Lahore" },
    { id: "m2", name: "Beef Nihari", category: "Main Course", price: 550, description: "Slow-cooked beef shank in rich gravy", city: "Lahore" },
    { id: "m3", name: "Chicken Karahi", category: "Main Course", price: 500, description: "Spiced tomato-based chicken curry", city: "Lahore" },
    { id: "m4", name: "Daal Makhni", category: "Main Course", price: 350, description: "Creamy black lentils", city: "Lahore" },
    { id: "m5", name: "Garlic Naan", category: "Bread", price: 80, description: "Tandoor-baked naan with garlic butter", city: "Lahore" },
    { id: "m6", name: "Raita", category: "Appetizer", price: 100, description: "Yogurt with cucumber and mint", city: "Lahore" },
    { id: "m7", name: "Gulab Jamun", category: "Dessert", price: 120, description: "Deep-fried milk dumplings in sugar syrup", city: "Lahore" },
    { id: "m8", name: "Chicken Tikka", category: "Appetizer", price: 350, description: "Grilled marinated chicken pieces", city: "Lahore" },
    { id: "m9", name: "Cold Drink", category: "Beverage", price: 60, description: "Chilled soft drinks", city: "Lahore" },
    { id: "m10", name: "Fruit Chaat", category: "Snack", price: 150, description: "Fresh seasonal fruit mix", city: "Lahore" },
  ],
  orders: [],
  drafts: [],
  rentals: [
    { id: "r1", name: "Premium Chair Set", city: "Lahore", description: "Royal velvet chairs", minimumOrderValue: 5000, deliveryAvailable: true, deliveryCharges: 2000, items: [{ name: "Royal Chair", category: "Chairs", quantity: 50, pricePerUnit: 150 }] },
    { id: "r2", name: "Furniture Package", city: "Karachi", description: "Complete furniture set for events", minimumOrderValue: 10000, deliveryAvailable: true, deliveryCharges: 3000, items: [{ name: "Sofa Set", category: "Decor", quantity: 5, pricePerUnit: 2000 }, { name: "Center Table", category: "Decor", quantity: 3, pricePerUnit: 1500 }] },
  ],
  vehicles: [
    { id: "vc1", name: "Toyota Corolla", vehicleNumber: "LEH-1234", type: "sedan", capacity: 4, farePerKm: 50, perDayCharge: 5000, condition: "excellent", features: "AC, Bluetooth", description: "Well-maintained sedan for city travel" },
    { id: "vc2", name: "Toyota Hiace", vehicleNumber: "LEH-5678", type: "van", capacity: 12, farePerKm: 80, perDayCharge: 8000, condition: "good", features: "AC, Music System", description: "Comfortable passenger van" },
    { id: "vc3", name: "Suzuki Mehran", vehicleNumber: "LEH-9012", type: "car", capacity: 4, farePerKm: 35, perDayCharge: 3500, condition: "fair", features: "AC", description: "Economy car for basic transport" },
  ],
  users: [
    { id: "u1", name: "Admin User", email: "admin@eventpro.com", password: "admin123", phone: "+92 300 0000000", role: "admin" },
    { id: "u2", name: "Vendor User", email: "vendor@eventpro.com", password: "vendor123", phone: "+92 300 0000001", role: "vendor" },
    { id: "u3", name: "Customer User", email: "customer@eventpro.com", password: "customer123", phone: "+92 300 0000002", role: "customer" },
    { id: "u4", name: "Supervisor", email: "supervisor@eventpro.com", password: "super123", phone: "+92 300 0000003", role: "supervisor" },
  ],
  notifications: [
    { id: "n1", message: "Ahmed & Fatima Wedding confirmed for grand ballroom", read: false, bookingId: "b1", createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: "n2", message: "Zara birthday is tomorrow — prep checklist due", read: false, bookingId: "b3", createdAt: new Date(Date.now() - 7200000).toISOString() },
    { id: "n3", message: "New booking enquiry received for December", read: true, bookingId: null, createdAt: new Date(Date.now() - 86400000).toISOString() },
  ],
};

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function getCollection(name) {
  const key = STORE_PREFIX + name;
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function setCollection(name, data) {
  const key = STORE_PREFIX + name;
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

function ensure(name) {
  let data = getCollection(name);
  if (!data) {
    data = SEED[name] || [];
    setCollection(name, data);
  }
  return data;
}

export const localDB = {
  findAll: (name) => {
    const data = ensure(name);
    return { data: { success: true, data: [...data] } };
  },

  findById: (name, id) => {
    const data = ensure(name);
    const item = data.find((i) => (i.id || i._id) === id);
    return { data: { success: true, data: item || null } };
  },

  create: (name, payload) => {
    const data = ensure(name);
    const item = { ...payload, id: uid(), createdAt: new Date().toISOString() };
    data.unshift(item);
    setCollection(name, data);
    return { data: { success: true, data: item } };
  },

  update: (name, id, payload) => {
    const data = ensure(name);
    const idx = data.findIndex((i) => (i.id || i._id) === id);
    if (idx === -1) return { data: { success: false, message: "Not found" } };
    data[idx] = { ...data[idx], ...payload, id: data[idx].id, _id: data[idx]._id };
    setCollection(name, data);
    return { data: { success: true, data: data[idx] } };
  },

  delete: (name, id) => {
    const data = ensure(name);
    const filtered = data.filter((i) => (i.id || i._id) !== id);
    setCollection(name, filtered);
    return { data: { success: true } };
  },

  patch: (name, id, updates) => {
    return localDB.update(name, id, updates);
  },

  push: (name, item) => {
    const data = ensure(name);
    data.push(item);
    setCollection(name, data);
    return { data: { success: true, data: item } };
  },
};

export function getBookingsStats(bookings) {
  const rows = Array.isArray(bookings) ? bookings : [];
  return {
    totalBookings: rows.length,
    confirmedBookings: rows.filter((b) => b.status === "confirmed").length,
    pendingBookings: rows.filter((b) => b.status === "pending" || !b.status).length,
    totalRevenue: rows.reduce((s, b) => s + Number(b.totalAmount || b.amount || 0), 0),
  };
}
