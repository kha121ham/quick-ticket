"use client";

import { useState } from "react";

interface PasswordPromptProps {
  onSubmit: (password: string) => void;
}

export default function PasswordPrompt({ onSubmit }: PasswordPromptProps) {
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(true);

  const handleSubmit = () => {
    if (password.trim()) {
      onSubmit(password);
      setVisible(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white border border-gray-300 rounded-xl shadow-lg px-6 py-4 w-full max-w-sm">
        <h2 className="text-base font-medium mb-3 text-center">Enter your password</h2>
        <div className="flex gap-2">
          <input
            type="password"
            className="border rounded px-3 py-2 text-sm flex-1 focus:outline-none focus:ring focus:border-blue-400"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
