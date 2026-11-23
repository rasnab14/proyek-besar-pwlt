"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSplashDone(true), 3550);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError(true);
    } else {
      setError(false);
      // TODO: integrate with Supabase auth
    }
  };

  return (
    <>
      {/* Preload background image so splash starts with no flicker */}
      <link rel="preload" as="image" href="/login-bg.jpg" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --k:      #0A0A0A;
          --w:      #ffffff;
          --night:  #0D1117;
          --n50:    #FAFAFA;
          --n100:   #F2F2F2;
          --n400:   #A3A3A3;
          --n600:   #525252;
          --n800:   #262626;
          --acc:    #0EA5E9;
          --acc-h:  #0284C7;
          --acc-s:  #E0F2FE;
          --acc-t:  #0369A1;
          --line:   #E5E5E5;
          --ctl:    #D4D4D4;
          --sh:     0 2px 4px rgba(10,10,10,.06);
        }

        /* ─── Root container — sets the shared bg-image variable ─── */
        .login-root {
          --login-bg-image: url('/login-bg.jpg');
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: Inter, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
          overflow: hidden;
        }

        /* Photo background (page) */
        .login-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
        }

        /* Dark overlay so card is readable */
        .login-overlay {
          position: fixed;
          inset: 0;
          z-index: 1;
          background: rgba(8, 10, 18, 0.62);
        }



        /* ─── Login card ─── */
        .login-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 360px;
          margin: 24px 16px;
          background: #ffffff;
          border-radius: 16px;
          padding: 32px 28px 26px;
          box-shadow: 0 20px 50px rgba(0,0,0,.42), 0 4px 14px rgba(0,0,0,.18);
          display: flex;
          flex-direction: column;
          gap: 14px;
          animation: cardIn .7s 2.75s cubic-bezier(.2,.7,.2,1) backwards;
        }

        /* ─── Card header (logo + brand) ─── */
        .card-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          animation: rise .6s 2.78s cubic-bezier(.2,.7,.2,1) backwards;
        }

        .card-logo-ring {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--k);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,.30);
        }

        .card-brand-name {
          font-weight: 700;
          font-size: 14px;
          letter-spacing: .18em;
          color: var(--k);
        }

        .card-brand-sub {
          font-size: 10.5px;
          letter-spacing: .12em;
          color: var(--n600);
          text-transform: uppercase;
          margin-top: -4px;
        }

        /* ─── Card title ─── */
        .card-title {
          text-align: center;
          animation: rise .6s 2.84s cubic-bezier(.2,.7,.2,1) backwards;
        }

        .card-title h1 {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -.025em;
          color: var(--k);
        }

        .card-title p {
          font-size: 12.5px;
          color: var(--n600);
          margin-top: 4px;
          line-height: 1.5;
        }

        /* ─── Form fields ─── */
        .fc-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          animation: rise .6s cubic-bezier(.2,.7,.2,1) backwards;
        }
        .fc-field:nth-child(1) { animation-delay: 2.90s; }
        .fc-field:nth-child(2) { animation-delay: 2.97s; }

        .fc-field label {
          font-size: 12.5px;
          font-weight: 600;
          color: var(--k);
        }

        .inp {
          height: 40px;
          width: 100%;
          border: 1px solid var(--ctl);
          border-radius: 9px;
          padding: 0 12px;
          font: 400 13.5px Inter, system-ui, sans-serif;
          color: var(--k);
          background: #fff;
          outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .inp::placeholder { color: #A3A3A3; }
        .inp:focus {
          border-color: var(--acc-h);
          box-shadow: 0 0 0 3px var(--acc-s);
        }

        /* Password wrapper */
        .pw-wrap { position: relative; }
        .pw-wrap .inp { padding-right: 68px; }
        .pw-toggle {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          border: 0;
          background: none;
          font: 600 12.5px Inter, system-ui, sans-serif;
          color: var(--acc-t);
          cursor: pointer;
          padding: 4px 8px;
        }
        .pw-toggle:hover { text-decoration: underline; }

        /* ─── Error note ─── */
        .err-note {
          padding: 11px 14px;
          border-radius: 10px;
          border-left: 3px solid #DC2626;
          font-size: 13px;
          line-height: 1.5;
          background: #FDE7E7;
          color: #991B1B;
          animation: rise .4s cubic-bezier(.2,.7,.2,1) both;
        }

        /* ─── Buttons ─── */
        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          width: 100%;
          border-radius: 9px;
          font: 600 13.5px Inter, system-ui, sans-serif;
          cursor: pointer;
          transition: background .15s, border-color .15s, transform .12s, box-shadow .2s;
          text-decoration: none;
        }
        .btn:hover  { transform: translateY(-1px); }
        .btn:active { transform: translateY(0) scale(.97); }

        .btn-pri {
          background: var(--k);
          color: #fff;
          border: 1px solid var(--k);
          box-shadow: 0 4px 14px rgba(0,0,0,.28);
          animation: rise .6s 3.04s cubic-bezier(.2,.7,.2,1) backwards;
        }
        .btn-pri:hover { background: var(--n800); box-shadow: 0 6px 18px rgba(0,0,0,.35); }

        .btn-sec {
          background: #fff;
          color: var(--k);
          border: 1px solid var(--ctl);
          box-shadow: var(--sh);
          animation: rise .6s 3.11s cubic-bezier(.2,.7,.2,1) backwards;
        }
        .btn-sec:hover { background: var(--n50); border-color: #A3A3A3; box-shadow: 0 4px 12px rgba(0,0,0,.1); }

        /* ─── Footer note ─── */
        .card-note {
          font-size: 11.5px;
          color: var(--n600);
          text-align: center;
          line-height: 1.6;
          animation: rise .6s 3.18s cubic-bezier(.2,.7,.2,1) backwards;
        }

        /* ══════════════════════════════════════════
           SPLASH SCREEN
           ══════════════════════════════════════════ */
        .splash {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          color: #fff;
          pointer-events: none;
          overflow: hidden;
          /* Fade out instead of slide up */
          animation: splashOut .9s 2.6s ease-out forwards;
        }

        /* ── Foto latar splash (sama persis dengan halaman) ── */
        .sp-photo {
          position: absolute;
          inset: -4%;
          background: var(--login-bg-image) center / cover no-repeat;
          animation: photoIn 1.2s backwards, kenb 4.2s cubic-bezier(.2,.6,.2,1) forwards;
        }

        /* ── Overlay gelap + vignette ── */
        .sp-shade {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(520px 380px at 50% 42%, rgba(13,17,23,.78), rgba(13,17,23,.35) 70%),
            linear-gradient(180deg, rgba(13,17,23,.55), rgba(13,17,23,.80));
        }

        /* ── Bintang dekoratif ringan ── */
        .sp-stars {
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(1px 1px at 15%  22%, rgba(255,255,255,.65) 0%, transparent 100%),
            radial-gradient(1px 1px at 73%  10%, rgba(255,255,255,.55) 0%, transparent 100%),
            radial-gradient(1px 1px at 42%  38%, rgba(255,255,255,.45) 0%, transparent 100%),
            radial-gradient(1px 1px at 88%  30%, rgba(255,255,255,.60) 0%, transparent 100%),
            radial-gradient(1px 1px at 60%  18%, rgba(255,255,255,.50) 0%, transparent 100%),
            radial-gradient(1px 1px at 28%  55%, rgba(255,255,255,.35) 0%, transparent 100%),
            radial-gradient(1px 1px at 80%  65%, rgba(255,255,255,.40) 0%, transparent 100%);
          animation: fadein 1.4s .5s backwards;
          pointer-events: none;
        }

        /* ── Konten splash (di atas foto) — z-index:2 ── */
        .sp-logo {
          position: relative;
          z-index: 2;
          width: 108px; height: 108px;
          display: flex; align-items: center; justify-content: center;
          animation: logoIn .9s .1s cubic-bezier(.2,.9,.3,1.25) backwards;
        }
        .sp-img-wrap {
          width: 84px; height: 84px;
          border-radius: 50%;
          background: #fff;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          animation: fillIn .7s .55s cubic-bezier(.2,.9,.3,1.25) backwards;
        }
        .sp-ring {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          transform: rotate(-90deg);
        }
        .sp-ring circle {
          stroke-dasharray: 352; stroke-dashoffset: 352;
          animation: ringDraw 1.3s .3s cubic-bezier(.4,0,.2,1) forwards;
        }
        .sp-word {
          position: relative; z-index: 2;
          font-weight: 700; font-size: 24px;
          letter-spacing: .3em; margin-right: -.3em;
          animation: wordIn 1.3s .8s cubic-bezier(.2,.7,.2,1) backwards;
        }
        .sp-sub {
          position: relative; z-index: 2;
          font-size: 12px; color: rgba(255,255,255,.7);
          letter-spacing: .14em; text-transform: uppercase;
          animation: fadein .8s 1.5s backwards;
        }
        .sp-load {
          position: relative; z-index: 2;
          width: 132px; height: 3px; border-radius: 2px;
          background: rgba(255,255,255,.18); overflow: hidden; margin-top: 8px;
          animation: fadein .5s 1.1s backwards;
        }
        .sp-load::after {
          content: ""; display: block; height: 100%;
          background: #0EA5E9; border-radius: 2px; transform-origin: left;
          animation: growx 1.5s 1.1s cubic-bezier(.4,0,.2,1) backwards;
        }

        /* ─── Keyframes ─── */
        @keyframes rise {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(28px) scale(.96); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes fadein  { from { opacity: 0; }              to { opacity: 1; } }
        @keyframes growx   { from { transform: scaleX(0); }    to { transform: scaleX(1); } }

        @keyframes logoIn {
          from { opacity: 0; transform: scale(.3) rotate(-120deg); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes fillIn    { from { transform: scale(0); } to { transform: none; } }
        @keyframes ringDraw  { to { stroke-dashoffset: 0; } }
        @keyframes wordIn {
          from { opacity: 0; letter-spacing: .9em; }
          to   { opacity: 1; letter-spacing: .3em; }
        }
        @keyframes wave {
          0%   { opacity: .7; transform: translate(-50%,-50%) scale(.4); }
          100% { opacity: 0;  transform: translate(-50%,-50%) scale(1.5); }
        }

        /* Foto splash: fade in */
        @keyframes photoIn { from { opacity: 0; } to { opacity: 1; } }

        /* Ken Burns: zoom out halus (mulai besar → normal) */
        @keyframes kenb {
          from { transform: scale(1.18); }
          to   { transform: scale(1); }
        }

        /* splashOut → fade (bukan slide) untuk transisi mulus ke foto yang sama */
        @keyframes splashOut {
          0%   { opacity: 1; }
          100% { opacity: 0; visibility: hidden; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation: none !important; transition: none !important; }
        }
        @media (max-width: 480px) {
          .login-card { padding: 26px 18px 22px; margin: 12px 10px; }
        }
      `}</style>

      {/* ══ Root — defines --login-bg-image ══ */}
      <div className="login-root">

        {/* ── Background photo (halaman) — same image as splash ── */}
        <div className="login-bg">
          <Image
            src="/login-bg.jpg"
            alt=""
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>

        {/* ── Dark overlay ── */}
        <div className="login-overlay" />



        {/* ══ Splash screen ══ */}
        <div className="splash">
          {/* Foto latar — sama dengan halaman */}
          <div className="sp-photo" />
          {/* Overlay gelap */}
          <div className="sp-shade" />
          {/* Bintang dekoratif */}
          <div className="sp-stars" />

          {/* Konten (z-index:2 via CSS) */}
          <div className="sp-logo">
            <svg className="sp-ring" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="56" fill="none" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <div className="sp-img-wrap">
              <Image
                src="/logo-19summit.jpg"
                alt="19 Summit"
                width={72}
                height={72}
                priority
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
          <div className="sp-word">19 SUMMIT</div>
          <div className="sp-sub">Rental &amp; Store</div>
          <div className="sp-load" />
        </div>

        {/* ══ Login card ══ */}
        <div className="login-card">

          {/* Brand / logo */}
          <div className="card-brand">
            <div className="card-logo-ring">
              <Image
                src="/logo-19summit.jpg"
                alt="19 Summit Logo"
                width={38}
                height={38}
                style={{ objectFit: "contain", filter: "invert(1)" }}
              />
            </div>
            <div className="card-brand-name">19 SUMMIT</div>
            <div className="card-brand-sub">Rental &amp; Store</div>
          </div>

          {/* Title */}
          <div className="card-title">
            <h1>Masuk</h1>
            <p>Gunakan akun yang diberikan oleh Owner.</p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {/* Username */}
            <div className="fc-field">
              <label htmlFor="username">Username atau email</label>
              <input
                className="inp"
                id="username"
                type="text"
                placeholder="contoh: admin01"
                autoComplete="username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(false); }}
              />
            </div>

            {/* Password */}
            <div className="fc-field">
              <label htmlFor="password">Password</label>
              <div className="pw-wrap">
                <input
                  className="inp"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(false); }}
                />
                <button
                  type="button"
                  className="pw-toggle"
                  aria-label="Tampilkan password"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? "Sembunyikan" : "Lihat"}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="err-note" role="alert">
                Username atau password tidak sesuai. Periksa kembali data Anda.
              </div>
            )}

            {/* Buttons */}
            <button type="submit" className="btn btn-pri" style={{ marginTop: "4px" }}>
              Masuk sebagai Admin
            </button>

            <button type="button" className="btn btn-sec">
              Masuk sebagai Owner
            </button>
          </form>

          {/* Footer note */}
          <p className="card-note">
            Sistem membedakan menu berdasarkan peran akun.{" "}
            Lupa password? Hubungi Owner untuk pengaturan ulang.
          </p>
        </div>
      </div>
    </>
  );
}
