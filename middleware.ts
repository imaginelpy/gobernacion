import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const governorOnlyRoutes = ["/gobernador"];
const writerRoutes = ["/api/obras", "/api/distritos"];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/login") || pathname.startsWith("/_next") || pathname.startsWith("/favicon")) {
    return NextResponse.next();
  }

  if (!token && (pathname.startsWith("/dashboard") || pathname.startsWith("/gobernador") || pathname.startsWith("/api"))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (governorOnlyRoutes.some((route) => pathname.startsWith(route)) && token?.role !== "GOBERNADOR") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (
    writerRoutes.some((route) => pathname.startsWith(route)) &&
    ["POST", "PUT", "DELETE"].includes(req.method) &&
    !["GOBERNADOR", "SECRETARIO"].includes((token?.role as string) ?? "")
  ) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/gobernador/:path*", "/api/:path*", "/login", "/"]
};
