export const CATEGORY_GROUPS = [
  "Venue & Infrastructure",
  "Decor & Visuals",
  "Media & Digital",
  "Entertainment & Traditions",
  "Logistics & Coordination",
  "Specialized Services",
];

const TAG = {
  LOGISTICS: "logistics",
  AESTHETIC: "aesthetic",
  LEGAL: "legal",
  HOSPITALITY: "hospitality",
};

export const TAG_LABELS = {
  [TAG.LOGISTICS]: "Logistics",
  [TAG.AESTHETIC]: "Aesthetic",
  [TAG.LEGAL]: "Legal",
  [TAG.HOSPITALITY]: "Hospitality",
};

export const ALL_TAGS = Object.values(TAG);

export const EVENT_CATEGORIES = [
  {
    key: "venue-selection",
    label: "Venue Selection",
    group: "Venue & Infrastructure",
    bookingType: "venue",
    formFocus: "Hall, city, capacity, indoor/outdoor preference",
    tags: [TAG.LEGAL, TAG.LOGISTICS],
  },
  {
    key: "catering-services",
    label: "Catering Services",
    group: "Venue & Infrastructure",
    bookingType: "catering",
    formFocus: "Menu, guest count, serving style, one-dish compliance",
    tags: [TAG.HOSPITALITY],
  },
  {
    key: "power-backup",
    label: "Power Backup",
    group: "Venue & Infrastructure",
    bookingType: "operations",
    formFocus: "Generator load, hours, fuel, technician support",
    tags: [TAG.LOGISTICS],
  },
  {
    key: "heating-cooling",
    label: "Heating & Cooling",
    group: "Venue & Infrastructure",
    bookingType: "operations",
    formFocus: "Season, marquee size, heaters, air coolers, AC plan",
    tags: [TAG.HOSPITALITY, TAG.LOGISTICS],
  },
  {
    key: "parking-valet",
    label: "Parking & Valet",
    group: "Venue & Infrastructure",
    bookingType: "logistics",
    formFocus: "Vehicle count, valet desk, traffic flow, VIP arrivals",
    tags: [TAG.LOGISTICS],
  },
  {
    key: "security-services",
    label: "Security Services",
    group: "Venue & Infrastructure",
    bookingType: "logistics",
    formFocus: "Guest screening, guards, family/VIP protocol",
    tags: [TAG.LEGAL, TAG.LOGISTICS],
  },
  {
    key: "thematic-decor",
    label: "Thematic Decor",
    group: "Decor & Visuals",
    bookingType: "decor",
    formFocus: "Theme, color palette, entry, seating, photo areas",
    tags: [TAG.AESTHETIC],
  },
  {
    key: "floral-artistry",
    label: "Floral Artistry",
    group: "Decor & Visuals",
    bookingType: "decor",
    formFocus: "Fresh/artificial flowers, garlands, centerpieces",
    tags: [TAG.AESTHETIC],
  },
  {
    key: "stage-design",
    label: "Stage Design",
    group: "Decor & Visuals",
    bookingType: "decor",
    formFocus: "Bride/groom stage, backdrop, sofa, lighting",
    tags: [TAG.AESTHETIC],
  },
  {
    key: "furniture-rental",
    label: "Furniture Rental",
    group: "Decor & Visuals",
    bookingType: "rentals",
    formFocus: "Tables, chairs, lounges, VIP seating, quantity",
    tags: [TAG.LOGISTICS, TAG.AESTHETIC],
  },
  {
    key: "lighting-design",
    label: "Lighting Design",
    group: "Decor & Visuals",
    bookingType: "decor",
    formFocus: "Ambience, stage lights, fairy lights, entrance lighting",
    tags: [TAG.AESTHETIC],
  },
  {
    key: "signage-stationery",
    label: "Signage & Stationery",
    group: "Decor & Visuals",
    bookingType: "print",
    formFocus: "Welcome board, seating chart, menus, cards",
    tags: [TAG.AESTHETIC, TAG.LEGAL],
  },
  {
    key: "photography",
    label: "Photography",
    group: "Media & Digital",
    bookingType: "media",
    formFocus: "Shoot hours, family portraits, albums, delivery date",
    tags: [TAG.AESTHETIC],
  },
  {
    key: "cinematography",
    label: "Cinematography",
    group: "Media & Digital",
    bookingType: "media",
    formFocus: "Highlight film, full event, cameras, edits",
    tags: [TAG.AESTHETIC],
  },
  {
    key: "live-streaming",
    label: "Live Streaming",
    group: "Media & Digital",
    bookingType: "media",
    formFocus: "Platform, internet backup, remote guests, privacy",
    tags: [TAG.LOGISTICS, TAG.AESTHETIC],
  },
  {
    key: "drone-coverage",
    label: "Drone Coverage",
    group: "Media & Digital",
    bookingType: "media",
    formFocus: "Outdoor permissions, timing, aerial shots",
    tags: [TAG.AESTHETIC, TAG.LEGAL],
  },
  {
    key: "invitation-design",
    label: "Invitation Design",
    group: "Media & Digital",
    bookingType: "print",
    formFocus: "Digital card, printed card, RSVP, Urdu/English copy",
    tags: [TAG.AESTHETIC, TAG.LEGAL],
  },
  {
    key: "sound-dj",
    label: "Sound System & DJ",
    group: "Entertainment & Traditions",
    bookingType: "entertainment",
    formFocus: "Speakers, microphones, playlist, qawwali/dholki support",
    tags: [TAG.HOSPITALITY, TAG.AESTHETIC],
  },
  {
    key: "live-stalls",
    label: "Live Stalls",
    group: "Entertainment & Traditions",
    bookingType: "catering",
    formFocus: "BBQ, chaat, desserts, tea, stall count",
    tags: [TAG.HOSPITALITY],
  },
  {
    key: "traditional-performers",
    label: "Traditional Performers",
    group: "Entertainment & Traditions",
    bookingType: "entertainment",
    formFocus: "Dhol, qawwali, folk dance, mehndi entry",
    tags: [TAG.HOSPITALITY, TAG.AESTHETIC],
  },
  {
    key: "special-effects",
    label: "Special Effects",
    group: "Entertainment & Traditions",
    bookingType: "entertainment",
    formFocus: "Cold fireworks, smoke, confetti, safety clearance",
    tags: [TAG.AESTHETIC, TAG.LOGISTICS],
  },
  {
    key: "bridal-mehndi",
    label: "Bridal Mehndi Artists",
    group: "Entertainment & Traditions",
    bookingType: "beauty",
    formFocus: "Bride, family guests, style, artist hours",
    tags: [TAG.AESTHETIC, TAG.HOSPITALITY],
  },
  {
    key: "makeup-styling",
    label: "Makeup & Styling",
    group: "Entertainment & Traditions",
    bookingType: "beauty",
    formFocus: "Bride/groom/family, salon location, trial, timing",
    tags: [TAG.AESTHETIC, TAG.HOSPITALITY],
  },
  {
    key: "guest-management",
    label: "Guest Management",
    group: "Logistics & Coordination",
    bookingType: "logistics",
    formFocus: "RSVP, reception desk, seating, family coordination",
    tags: [TAG.LOGISTICS, TAG.HOSPITALITY],
  },
  {
    key: "transport-rent-a-car",
    label: "Transport / Rent-a-Car",
    group: "Logistics & Coordination",
    bookingType: "transport",
    formFocus: "Cars, coaster, bride/groom car, pickup routes",
    tags: [TAG.LOGISTICS],
  },
  {
    key: "hotel-bookings",
    label: "Hotel Bookings",
    group: "Logistics & Coordination",
    bookingType: "travel",
    formFocus: "Rooms, check-in dates, family blocks, breakfast",
    tags: [TAG.LOGISTICS, TAG.HOSPITALITY],
  },
  {
    key: "event-timeline",
    label: "Event Timeline Management",
    group: "Logistics & Coordination",
    bookingType: "planning",
    formFocus: "Run sheet, vendor arrivals, ceremony timings",
    tags: [TAG.LOGISTICS],
  },
  {
    key: "waitstaff-hospitality",
    label: "Waitstaff & Hospitality",
    group: "Logistics & Coordination",
    bookingType: "staffing",
    formFocus: "Servers, ushers, protocol team, guest service",
    tags: [TAG.HOSPITALITY, TAG.LOGISTICS],
  },
  {
    key: "cake-desserts",
    label: "Cake & Desserts",
    group: "Specialized Services",
    bookingType: "catering",
    formFocus: "Cake size, dessert table, flavors, delivery",
    tags: [TAG.HOSPITALITY],
  },
  {
    key: "gift-packaging",
    label: "Gift Packaging",
    group: "Specialized Services",
    bookingType: "gifting",
    formFocus: "Bari, mithai, favors, trays, tags",
    tags: [TAG.HOSPITALITY, TAG.AESTHETIC],
  },
  {
    key: "honeymoon-planning",
    label: "Honeymoon Planning",
    group: "Specialized Services",
    bookingType: "travel",
    formFocus: "Destination, dates, budget, flights, hotels",
    tags: [TAG.LOGISTICS, TAG.HOSPITALITY],
  },
  {
    key: "post-event-cleaning",
    label: "Post-Event Cleaning",
    group: "Specialized Services",
    bookingType: "operations",
    formFocus: "Venue cleanup, waste pickup, staff count, timing",
    tags: [TAG.LOGISTICS],
  },
];

export const getCategoryByKey = (key) =>
  EVENT_CATEGORIES.find((category) => category.key === key) || EVENT_CATEGORIES[0];

export const getCategoryBookingCount = (bookings, category) => {
  const haystack = `${category.key} ${category.label}`.toLowerCase();

  return (bookings || []).filter((booking) => {
    const serviceCategory = booking.items?.[0]?.serviceId?.category || booking.hall?.category || "";
    const searchable = [
      booking.eventName,
      booking.package,
      booking.notes,
      booking.category,
      booking.eventType,
      serviceCategory,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      searchable.includes(category.key) ||
      searchable.includes(category.label.toLowerCase()) ||
      haystack.includes(serviceCategory.toLowerCase())
    );
  }).length;
};
