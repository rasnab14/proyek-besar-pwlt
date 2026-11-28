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
  let user: any = null;
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

  // Helper untuk menentukan peran pengguna secara komprehensif & presisi
  async function resolveUserRole(): Promise<string> {
    // 1. Cek cookie summit_user_role yang disimpan saat login
    const cookieRole = request.cookies.get("summit_user_role")?.value?.toLowerCase();
    if (cookieRole === "owner" || cookieRole === "admin") {
      return cookieRole;
    }

    // 2. Cek metadata user Supabase (user_metadata / app_metadata)
    const meta = user?.user_metadata || {};
    const appMeta = user?.app_metadata || {};
    const directRole = (meta.role || meta.peran || appMeta.role || appMeta.peran || "")
      ?.toString()
      .toLowerCase();
    if (directRole === "owner" || directRole === "admin") {
      return directRole;
    }

    // 3. Cek email pengguna (akun owner default seperti owner@summit.local atau memuat 'owner')
    if (user?.email && user.email.toLowerCase().includes("owner")) {
      return "owner";
    }

    // 4. Cek database tabel pengguna (sesuai schema.sql)
    try {
      const { data: pengguna } = await supabase
        .from("pengguna")
        .select("peran")
        .or(`auth_user_id.eq.${user.id},email.eq.${user.email || ""}`)
        .maybeSingle();
      if (pengguna?.peran) {
        return String(pengguna.peran).toLowerCase();
      }
    } catch {
      // lanjut fallback
    }

    // 5. Cek database tabel profil (skema kompatibilitas)
    try {
      const { data: profile } = await supabase
        .from("profil")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      if (profile?.role) {
        return String(profile.role).toLowerCase();
      }
    } catch {
      // lanjut fallback
    }

    return "admin";
  }

  const url = request.nextUrl.clone();

  // 1. Jika belum login dan mengakses halaman yang diproteksi (/admin atau /owner)
  if (!user && (url.pathname.startsWith("/admin") || url.pathname.startsWith("/owner"))) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 2. Jika sudah login dan membuka halaman /login, redirect ke dashboard sesuai role
  if (user && url.pathname === "/login") {
    const role = await resolveUserRole();
    supabaseResponse.cookies.set("summit_user_role", role, { path: "/", maxAge: 604800, sameSite: "lax" });

    if (role === "owner") {
      url.pathname = "/owner/dashboard";
    } else {
      url.pathname = "/admin/dashboard";
    }
    const redirectRes = NextResponse.redirect(url);
    redirectRes.cookies.set("summit_user_role", role, { path: "/", maxAge: 604800, sameSite: "lax" });
    return redirectRes;
  }

  // 3. Proteksi Khusus Role Owner: jika user bukan owner mencoba masuk ke area /owner
  if (user && url.pathname.startsWith("/owner")) {
    const role = await resolveUserRole();
    supabaseResponse.cookies.set("summit_user_role", role, { path: "/", maxAge: 604800, sameSite: "lax" });

    if (role !== "owner") {
      url.pathname = "/admin/dashboard";
      const redirectRes = NextResponse.redirect(url);
      redirectRes.cookies.set("summit_user_role", role, { path: "/", maxAge: 604800, sameSite: "lax" });
      return redirectRes;
    }
  }

  return supabaseResponse;
}
