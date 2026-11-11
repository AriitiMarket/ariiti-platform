import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only evaluate /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isLoginPage = pathname === "/admin/login";

  // If already authenticated and visiting /admin/login, redirect to /admin dashboard
  if (isLoginPage) {
    if (token) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  // If unauthenticated, redirect to /admin/login
  if (!token) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Enforce SUPER_ADMIN restriction for sensitive sub-routes
  const isSuperAdminRoute =
    pathname.startsWith("/admin/users") || pathname.startsWith("/admin/settings");

  if (isSuperAdminRoute && token.role !== "SUPER_ADMIN") {
    const adminUrl = new URL("/admin", req.url);
    adminUrl.searchParams.set("error", "unauthorized_role");
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
