import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  try {
    return await updateSession(request);
  } catch (error) {
    console.warn("Middleware execution error:", error);
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: [
    /*
     * Berlaku untuk semua rute kecuali file aset statis, font, atau gambar:
     * - _next/static (file build static Next.js)
     * - _next/image (optimasi gambar)
     * - favicon.ico
     * - file ekstensi gambar / aset: svg, png, jpg, jpeg, gif, webp, ico
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
