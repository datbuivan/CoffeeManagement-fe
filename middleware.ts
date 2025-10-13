import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { NAV_ITEMS } from "@/constants/navigation";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "UtQ8L4RNZqUbEyai3bIpvl6VYam6YrsTX2b5JWDeVuUyH08YkV3NlsSCNZg9KlGu";

function findNavItem(pathname: string) {
  // Sắp xếp NAV_ITEMS theo độ dài href giảm dần để match subpath chính xác
  const sortedNavItems = [...NAV_ITEMS].sort(
    (a, b) => b.href.length - a.href.length
  );
  return sortedNavItems.find((item) => pathname.startsWith(item.href));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/login") || pathname.startsWith("/unauthorized")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("accessToken")?.value;
  if (!token) {
    const loginUrl = new URL(
      `/login?redirect=${encodeURIComponent(pathname)}`,
      req.url
    );
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Decode JWT
    const decoded = jwt.verify(token, JWT_SECRET) as { roles: string[] };
    const userRoles = decoded.roles || [];

    // Tìm navItem phù hợp với pathname
    const navItem = findNavItem(pathname);

    if (navItem) {
      const hasAccess = navItem.roles.some((role) => userRoles.includes(role));
      if (!hasAccess) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    return NextResponse.next();
  } catch (err) {
    const loginUrl = new URL(
      `/login?redirect=${encodeURIComponent(pathname)}`,
      req.url
    );
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/:path*"], // tất cả route, middleware sẽ bỏ qua /login và /unauthorized
};
