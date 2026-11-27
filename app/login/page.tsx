"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/utils/supabase/client";
import "./login.css";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [autoFillBadge, setAutoFillBadge] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setSplashDone(true), 3550);
    return () => clearTimeout(timer);
  }, []);

  // Handler auto-fill credential ketika tombol demo admin/owner diklik
  const handleAutoFill = (role: "admin" | "owner") => {
    setErrorMsg(null);
    if (role === "admin") {
      setUsername("admin@summit.local");
      setPassword("admin12345");
      setAutoFillBadge("Akun Admin otomatis terisi. Silakan klik tombol 'Masuk'");
    } else {
      setUsername("owner@summit.local");
      setPassword("owner12345");
      setAutoFillBadge("Akun Owner otomatis terisi. Silakan klik tombol 'Masuk'");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedUser = username.trim();
    if (!trimmedUser || !password) {
      setErrorMsg("Username/email dan password wajib diisi.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Cek apakah koneksi Supabase telah terkonfigurasi di .env.local
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        if (supabase) {
          const { data: authData, error: authError } =
            await supabase.auth.signInWithPassword({
              email: trimmedUser,
              password: password,
            });

          if (authError) {
            setErrorMsg(
              authError.message === "Invalid login credentials"
                ? "Email atau password yang kamu masukkan salah. Silakan periksa kembali."
                : authError.message
            );
            setIsLoading(false);
            return;
          }

          if (authData.user) {
            // Ambil role dari tabel public.profil
            const { data: profile } = await supabase
              .from("profil")
              .select("role")
              .eq("id", authData.user.id)
              .maybeSingle();

            const role = profile?.role || (trimmedUser.includes("owner") ? "owner" : "admin");
            const target = role === "owner" ? "/owner/dashboard" : "/admin/dashboard";

            setIsExiting(true);
            setTimeout(() => {
              router.push(target);
            }, 240);
            return;
          }
        }
      }

      // 2. Fallback mode (jika Supabase belum dihubungkan / offline testing)
      await new Promise((res) => setTimeout(res, 400));
      const target = trimmedUser.toLowerCase().includes("owner")
        ? "/owner/dashboard"
        : "/admin/dashboard";

      setIsExiting(true);
      setTimeout(() => {
        router.push(target);
      }, 240);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat masuk.";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-900 font-sans">
      {/* ── Background Photo (Cover) ── */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/login-bg.jpg"
          alt="19 Summit Mountain Background"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* ── Dark Translucent Overlay ── */}
      <div className="fixed inset-0 z-10 bg-slate-950/65 backdrop-blur-[1px]" />

      {/* ── Splash Screen (Disappears after 3.5s) ── */}
      {!splashDone && (
        <div className="splash-screen">
          <div className="sp-photo" />
          <div className="sp-shade" />
          <div className="sp-stars" />

          <div className="sp-logo">
            <svg className="sp-ring" viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="60" r="56" fill="none" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <div className="sp-img-wrap shadow-lg">
              <Image
                src="/logo-19summit.jpg"
                alt="19 Summit"
                width={72}
                height={72}
                priority
                className="object-contain"
              />
            </div>
          </div>
          <div className="sp-word mt-2">19 SUMMIT</div>
          <div className="sp-sub mt-1">Rental &amp; Store</div>
          <div className="sp-load" />
        </div>
      )}

      {/* ── Login Card (Tailwind CSS) ── */}
      <main className={`relative z-20 w-full max-w-[390px] mx-3 sm:mx-4 my-4 sm:my-6 bg-white rounded-2xl p-5 sm:p-8 shadow-2xl border border-slate-100 flex flex-col gap-3.5 sm:gap-4 login-card-anim ${isExiting ? "login-card-exit" : ""}`}>
        {/* Brand / Logo */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-12 h-12 rounded-full bg-slate-950 flex items-center justify-center shadow-md">
            <Image
              src="/logo-19summit.jpg"
              alt="19 Summit Logo"
              width={36}
              height={36}
              className="object-contain invert"
            />
          </div>
          <div className="text-slate-950 font-bold text-base tracking-[0.2em] -mr-[0.2em]">
            19 SUMMIT
          </div>
          <div className="text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
            Rental &amp; Store
          </div>
        </div>

        {/* Card Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Masuk</h1>
          <p className="text-xs text-slate-500 mt-1">
            Gunakan akun yang telah terdaftar di sistem.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5 mt-1">
          {/* Username Field */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="username" className="text-xs font-semibold text-slate-800">
              Email atau Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="contoh: admin@summit.local"
              autoComplete="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrorMsg(null);
                setAutoFillBadge(null);
              }}
              className="h-10 w-full px-3.5 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all duration-150"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-semibold text-slate-800">
                Password
              </label>
            </div>
            <div className="relative flex items-center">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg(null);
                  setAutoFillBadge(null);
                }}
                className="h-10 w-full pl-3.5 pr-20 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all duration-150"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 text-xs font-semibold text-slate-500 hover:text-slate-900 px-2 py-1 rounded transition-colors cursor-pointer"
                aria-label="Tampilkan password"
              >
                {showPassword ? "Sembunyikan" : "Lihat"}
              </button>
            </div>
          </div>

          {/* Feedback Info / Autofill Note */}
          {autoFillBadge && !errorMsg && (
            <div className="p-2.5 rounded-lg border border-sky-200 bg-sky-50 text-sky-800 text-[11px] font-medium leading-relaxed flex items-center gap-1.5 animate-fadeIn">
              <span className="text-sky-600 font-bold">✓</span>
              <span>{autoFillBadge}</span>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div
              className="p-3 rounded-lg border-l-4 border-red-500 bg-red-50 text-red-700 text-xs font-medium leading-relaxed"
              role="alert"
            >
              {errorMsg}
            </div>
          )}

          {/* Primary Submit Button: Masuk */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-1 h-10 w-full rounded-lg bg-sky-600 hover:bg-sky-500 active:scale-[0.98] text-white text-sm font-semibold shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Memproses Masuk...</span>
              </>
            ) : (
              <span>Masuk</span>
            )}
          </button>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200" />
            <span className="flex-shrink mx-3 text-[11px] font-medium text-slate-400">
              Pilihan Cepat Masuk
            </span>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          {/* Quick-Fill Shortcut Buttons (Admin & Owner) */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleAutoFill("admin")}
              className="h-9 w-full rounded-lg bg-slate-950 hover:bg-slate-800 active:scale-[0.98] text-white text-xs font-semibold shadow-sm transition-all duration-150 flex items-center justify-between px-3.5 cursor-pointer group"
              title="Klik untuk otomatis mengisi username & password Admin"
            >
              <span>Masuk sebagai Admin</span>
              <span className="text-[10px] text-slate-400 group-hover:text-slate-200 font-normal">
                Isi otomatis ↵
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleAutoFill("owner")}
              className="h-9 w-full rounded-lg bg-white hover:bg-slate-50 active:scale-[0.98] border border-slate-300 hover:border-slate-400 text-slate-800 text-xs font-semibold shadow-sm transition-all duration-150 flex items-center justify-between px-3.5 cursor-pointer group"
              title="Klik untuk otomatis mengisi username & password Owner"
            >
              <span>Masuk sebagai Owner</span>
              <span className="text-[10px] text-slate-500 group-hover:text-slate-700 font-normal">
                Isi otomatis ↵
              </span>
            </button>
          </div>
        </form>

        {/* Footer Note */}
        <p className="text-[11px] text-slate-500 text-center leading-relaxed mt-0.5">
          Sistem membedakan menu berdasarkan peran akun.{" "}
          <span className="text-slate-600 font-medium">Lupa password?</span> Hubungi Owner untuk pengaturan ulang.
        </p>
      </main>
    </div>
  );
}

