"use client";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense } from "react";

export function TanStackQueryDevtools() {
  return (
    <Suspense fallback={null}>
      {process.env.c && <ReactQueryDevtools />}
    </Suspense>
  );
}
