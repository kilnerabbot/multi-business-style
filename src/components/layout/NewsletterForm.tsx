"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail]   = useState("");
  const [status, setStatus] = useState<"" | "success" | "error">("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder — wire to Resend / Mailchimp when ready
    setStatus("success");
    setEmail("");
    setTimeout(() => setStatus(""), 4000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#2ECC71] transition-colors"
      />
      <button
        type="submit"
        className="bg-[#2ECC71] hover:bg-[#27AE60] text-[#0D1B2A] font-semibold text-sm px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
      >
        Join
      </button>
      {status === "success" && (
        <p className="absolute text-xs text-[#2ECC71] mt-10">You&apos;re on the list! 🎉</p>
      )}
    </form>
  );
}
