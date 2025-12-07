"use client";

import type React from "react";
import UserLayout from "@/components/user/UserLayout";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <UserLayout>{children}</UserLayout>;
}
