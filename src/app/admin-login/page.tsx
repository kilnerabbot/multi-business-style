"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    window.location.href = "/admin";
  };

  return (
    <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-white font-bold text-2xl">
            Multi<span className="text-[#2ECC71]">Business</span>
          </span>
          <p className="text-white/40 text-xs uppercase tracking-widest mt-1">Admin Panel</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-4"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#2ECC71]/15 mx-auto mb-2">
            <Lock size={20} className="text-[#2ECC71]" />
          </div>
          <h1 className="text-white font-bold text-xl text-center mb-4">Sign in to Admin</h1>

          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wide mb-1.5">
              Email
            </label>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#2ECC71] transition-colors"
              placeholder="admin@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wide mb-1.5">
              Password
            </label>
            <input
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#2ECC71] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full bg-[#2ECC71] hover:bg-[#27AE60] disabled:bg-white/10 disabled:text-white/30 text-[#0D1B2A] font-bold py-3 rounded-xl transition-colors mt-2"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-white/20 text-xs mt-6">
          <a href="/" className="hover:text-white/50 transition-colors">← Back to store</a>
        </p>
      </div>
    </div>
  );
}
