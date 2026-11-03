"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

export default function RegisterPage() {
  const [form, setForm]     = useState({ full_name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError]   = useState("");

  const supabase = createClient();
  const update = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords don't match."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name } },
    });
    if (error) { setError(error.message); setLoading(false); return; }
    window.location.href = "/account";
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#0D1B2A]">Create account</h1>
          <p className="text-gray-400 mt-2">Join Multi Business Style today</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm space-y-4">

          {/* Google button */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl py-2.5 text-sm font-semibold text-[#0D1B2A] transition-all disabled:opacity-60"
          >
            {googleLoading ? (
              <span className="w-4 h-4 border-2 border-gray-300 border-t-[#4285F4] rounded-full animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            {googleLoading ? "Redirecting…" : "Sign up with Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <hr className="flex-1 border-gray-100" />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <hr className="flex-1 border-gray-100" />
          </div>

          {/* Email/password form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {[
              { label: "Full Name", field: "full_name", type: "text",  placeholder: "Thabo Nkosi" },
              { label: "Email",     field: "email",     type: "email", placeholder: "you@email.com" },
            ].map(({ label, field, type, placeholder }) => (
              <div key={field}>
                <label className={labelCls}>{label}</label>
                <input required type={type} value={form[field as keyof typeof form]}
                  onChange={update(field)} className={inputCls} placeholder={placeholder} />
              </div>
            ))}

            {["password", "confirm"].map((field) => (
              <div key={field}>
                <label className={labelCls}>{field === "password" ? "Password" : "Confirm Password"}</label>
                <div className="relative">
                  <input required type={showPw ? "text" : "password"}
                    value={form[field as keyof typeof form]} onChange={update(field)}
                    className={cn(inputCls, "pr-10")} placeholder="••••••••" />
                  {field === "password" && (
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0D1B2A]">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-[#2ECC71] hover:bg-[#27AE60] disabled:bg-gray-200 disabled:text-gray-400 text-[#0D1B2A] font-bold py-3 rounded-xl transition-colors">
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#2ECC71] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";
const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#0D1B2A] focus:outline-none focus:border-[#2ECC71] transition-colors bg-[#F9FAFB]";
