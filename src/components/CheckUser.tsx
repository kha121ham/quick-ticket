"use client";

import { useEffect, useState } from "react";
import PasswordPrompt from "./PasswordPrompt";

export default function CheckUser() {
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!password) return;

    const token = localStorage.getItem("support-token");
    if (!token) return;

    fetch("/api/me", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    });

    localStorage.clear();
  }, [password]);

  return <PasswordPrompt onSubmit={setPassword} />;
}
