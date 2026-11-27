import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  function sanitizeSupabaseUrl(url?: string): string {
    if (!url) return "";
    let clean = url.trim();
    clean = clean.replace(/\/rest\/v1\/?$/, "");
    clean = clean.replace(/\/+$/, "");
    return clean;
  }

  const supabaseUrl = sanitizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";

  // Jika Supabase belum dikonfigurasi, lewati middleware agar tidak memblokir local dev/demo
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("xxxxxx") || !supabaseUrl.startsWith("http")) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // PENTING: auth.getUser() memvalidasi token sesi secara aman dengan server Supabase
  let user = null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (!error && data?.user) {
      user = data.user;
    }
  } catch (err) {
    console.warn("Supabase auth check in middleware encountered error:", err);
    // Lewati atau biarkan request lanjut jika terjadi network/offline error agar tidak 500
    return supabaseResponse;
  }

  const url = request.nextUrl.clone();

  // 1. Jika belum login dan mengakses halaman yang diproteksi (/admin atau /owner)
  if (!user && (url.pathname.startsWith("/admin") || url.pathname.startsWith("/owner"))) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 2. Jika sudah login dan membuka halaman /login, redirect ke dashboard sesuai role
  if (user && url.pathname === "/login") {
    let role = "admin";
    try {
      const { data: profile } = await supabase
        .from("profil")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      if (profile?.role) role = profile.role;
    } catch {
      // fallback default
    }

    if (role === "owner") {
      url.pathname = "/owner/dashboard";
    } else {
      url.pathname = "/admin/dashboard";
    }
    return NextResponse.redirect(url);
  }

  // 3. Proteksi Khusus Role Owner: jika user bukan owner mencoba masuk ke area /owner
  if (user && url.pathname.startsWith("/owner")) {
    let role = "admin";
    try {
      const { data: profile } = await supabase
        .from("profil")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      if (profile?.role) role = profile.role;
    } catch {
      // fallback default
    }

    if (role !== "owner") {
      url.pathname = "/admin/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
