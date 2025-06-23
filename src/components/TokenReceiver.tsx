// app/components/TokenReceiver.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TokenReceiver() {
  const router = useRouter();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");

    if (token) {
      localStorage.setItem("support-token", token);
      router.replace("/"); 
    }
  }, []);

  return null;
}
