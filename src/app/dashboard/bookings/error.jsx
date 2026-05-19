"use client";

import ErrorFallback from "@/app/components/ErrorFallback";

export default function Error({ error, reset }) {
  return <ErrorFallback error={error} reset={reset} />;
}
