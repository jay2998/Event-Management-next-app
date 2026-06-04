"use client";

import { useState, useEffect } from "react";

export function useUser() {
  const [user, setUser] = useState({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw && raw !== "undefined") setUser(JSON.parse(raw));
    } catch {}
  }, []);

  return user;
}

export function useAuthGuard(router) {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.replace("/login");
  }, [router]);
}
