"use client";
import { getAuth } from "@/store/slices/auth";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useSelector } from "react-redux";
export default function RequireAuth({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const auth = useSelector(getAuth);
  if (!auth.access) {
    if (pathname == "/register") {
      return <>{children}</>;
    } else {
      router.push("/");
    }
  }
  if (auth.access) {
    if (pathname === "/register" || pathname === "/") {
      router.push('/add-friend');
    }
  }
  return <>{children}</>;
}
