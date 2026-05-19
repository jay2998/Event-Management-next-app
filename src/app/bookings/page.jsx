"use client";

import PageTitle from "../components/PageTitle";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Loader2, Save, UserRound } from "lucide-react";
import { dashboardApi } from "../../lib/api";
import { EVENT_CATEGORIES, getCategoryByKey } from "../../lib/categories";

const initialForm = {
  eventName: "",
  eventDate: "",
  eventTime: "18:00",
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  guestCount: 150,
  package: "standard",
  hall: "",
  notes: "",
};

const safeList = (response) => response?.data?.data || response?.data || [];

const getStoredUser = () => {
  try {
    const raw = window.localStorage.getItem("user");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || EVENT_CATEGORIES[0].key;

  const [categoryKey, setCategoryKey] = useState(initialCategory);
  const [form, setForm] = useState(initialForm);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const category = useMemo(() => getCategoryByKey(categoryKey), [categoryKey]);
  const selectedHall = halls.find((hall) => (hall._id || hall.id) === form.hall);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const user = getStoredUser();
    setForm((current) => ({
      ...current,
      customerName: user?.name || "",
      customerEmail: user?.email || "",
    }));

    const loadHalls = async () => {
      try {
        const response = await dashboardApi.halls();
        const rows = safeList(response);
        setHalls(rows);
        if (rows[0]) {
          setForm((current) => ({ ...current, hall: rows[0]._id || rows[0].id }));
        }
      } catch (error) {
        setMessage(error.message || "Could not load services for booking.");
      } finally {
        setLoading(false);
      }
    };

    loadHalls();
  }, [router]);

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    if (!selectedHall) {
      setMessage("Select an available service or venue before creating a booking.");
      setSubmitting(false);
      return;
    }

    const serviceId = selectedHall._id || selectedHall.id;
    const price = Number(
      selectedHall.pricePerHour ||
        selectedHall.price ||
        selectedHall.basePrice ||
        selectedHall.rent ||
        0
    );

    const notes = [
      `[Category: ${category.label}]`,
      `[Category Key: ${category.key}]`,
      `[Booking Type: ${category.bookingType}]`,
      form.notes,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await dashboardApi.createBooking({
        ...form,
        package: `${form.package} - ${category.label}`,
        notes,
        items: [
          {
            serviceId,
            priceAtBooking: price,
            slotDate: form.eventDate,
            slotStartTime: form.eventTime,
            slotEndTime: form.eventTime,
            quantity: 1,
          },
        ],
      });

      router.push("/dashboard");
    } catch (error) {
      setMessage(error.message || "Booking could not be created.");
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f3ed] px-4 py-6 text-[#171717] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-xs font-extrabold text-[#6b2626]"
        >
          <ArrowLeft size={14} />
          Back to dashboard
        </Link>

        <header className="mb-4 rounded-lg border border-[#d9d1c4] bg-white p-4 shadow-[0_18px_45px_-30px_rgba(26,26,26,0.5)]">
          <div className="mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#6b2626]">
            <CalendarDays size={14} />
            Pakistan Wedding & Event Booking
          </div>
          <h1 className="!mb-0 !text-2xl !not-italic !tracking-normal">
            New Category Booking
          </h1>
          <p className="mt-2 max-w-2xl text-xs leading-5 text-black/60">
            Choose one of the 32 event management categories, then capture the core
            booking details needed by the backend.
          </p>
        </header>

        {loading ? (
          <div className="grid min-h-[360px] place-items-center rounded-lg border border-[#e8e1d5] bg-white">
            <Loader2 className="animate-spin text-[#b4975a]" size={34} />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid gap-4 rounded-lg border border-[#e8e1d5] bg-white p-4 shadow-[0_16px_38px_-28px_rgba(26,26,26,0.45)]"
          >
            {message && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                {message}
              </div>
            )}

            <section className="grid gap-3 md:grid-cols-2">
              <label>
                <span className="text-xs font-bold">Category</span>
                <select
                  name="category"
                  value={categoryKey}
                  onChange={(event) => setCategoryKey(event.target.value)}
                  className="mt-1 w-full"
                >
                  {EVENT_CATEGORIES.map((item) => (
                    <option key={item.key} value={item.key}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-lg border border-[#ead27a] bg-[#fff8dc] p-3">
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6b2626]">
                  Form Focus
                </div>
                <p className="mt-1 text-xs leading-5 text-[#4b4138]">
                  {category.formFocus}
                </p>
              </div>
            </section>

            <section className="grid gap-3 md:grid-cols-2">
              <label>
                <span className="text-xs font-bold">Event Name</span>
                <input
                  name="eventName"
                  value={form.eventName}
                  onChange={handleChange}
                  className="mt-1 w-full"
                  required
                />
              </label>
              <label>
                <span className="text-xs font-bold">Service / Venue</span>
                <select
                  name="hall"
                  value={form.hall}
                  onChange={handleChange}
                  className="mt-1 w-full"
                  required
                >
                  {halls.map((hall) => (
                    <option key={hall._id || hall.id} value={hall._id || hall.id}>
                      {hall.name || hall.hallName || "Unnamed service"}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="text-xs font-bold">Event Date</span>
                <input
                  name="eventDate"
                  type="date"
                  value={form.eventDate}
                  onChange={handleChange}
                  className="mt-1 w-full"
                  required
                />
              </label>
              <label>
                <span className="text-xs font-bold">Event Time</span>
                <input
                  name="eventTime"
                  type="time"
                  value={form.eventTime}
                  onChange={handleChange}
                  className="mt-1 w-full"
                  required
                />
              </label>
              <label>
                <span className="text-xs font-bold">Guest Count</span>
                <input
                  name="guestCount"
                  type="number"
                  min="1"
                  value={form.guestCount}
                  onChange={handleChange}
                  className="mt-1 w-full"
                  required
                />
              </label>
              <label>
                <span className="text-xs font-bold">Package</span>
                <select
                  name="package"
                  value={form.package}
                  onChange={handleChange}
                  className="mt-1 w-full"
                >
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="luxury">Luxury</option>
                  <option value="custom">Custom</option>
                </select>
              </label>
            </section>

            <section className="grid gap-3 md:grid-cols-3">
              <label>
                <span className="text-xs font-bold">Customer Name</span>
                <input
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  className="mt-1 w-full"
                />
              </label>
              <label>
                <span className="text-xs font-bold">Email</span>
                <input
                  name="customerEmail"
                  type="email"
                  value={form.customerEmail}
                  onChange={handleChange}
                  className="mt-1 w-full"
                />
              </label>
              <label>
                <span className="text-xs font-bold">Phone</span>
                <input
                  name="customerPhone"
                  value={form.customerPhone}
                  onChange={handleChange}
                  className="mt-1 w-full"
                />
              </label>
            </section>

            <label>
              <span className="text-xs font-bold">Category Requirements / Notes</span>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                className="mt-1 min-h-20 w-full border border-[#e8e1d5] bg-white p-3 text-xs outline-none focus:border-[#d4af37]"
                placeholder={category.formFocus}
              />
            </label>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#eee6da] pt-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-black/55">
                <UserRound size={14} />
                Booking will be saved as {category.label}.
              </div>
              <button
                type="submit"
                disabled={submitting || !halls.length}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#d4af37] bg-[#FFD700] px-4 py-2 text-xs font-extrabold text-black transition hover:bg-[#e6c200] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                Create Booking
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

export default function NewBookingPage() {
  return (
    <>
      <PageTitle title="New Booking" description="Create a new event booking" />
      <Suspense>
        <BookingForm />
      </Suspense>
    </>
  );
}
