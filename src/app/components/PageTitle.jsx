"use client";

import { useEffect } from "react";

export default function PageTitle({ title, description }) {
  useEffect(() => {
    document.title = title ? `${title} | EventPro` : "EventPro - Wedding & Event Management";
    const meta = document.querySelector('meta[name="description"]');
    if (meta && description) meta.setAttribute("content", description);
  }, [title, description]);
  return null;
}
