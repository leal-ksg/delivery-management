import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  console.log("Proxy:", {
    path: request.nextUrl.pathname,
    hasToken: !!token,
  });

  const isLoginPage = request.nextUrl.pathname === "/login";

  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/orders", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/orders/:path*",
    "/products/:path*",
    "/customers/:path*",
    "/product-tree/:path*",
  ],
};
