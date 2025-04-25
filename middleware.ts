import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  console.log("middleware running for:", req.nextUrl.pathname);
  const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });
  const isLoggedIn = !!token;
  const { pathname } = req.nextUrl;

  if (pathname === "/auth/sign-in" && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
}

export const config = {
  matcher: [
    "/dashboard",
    "/logs/:videoId*",
    "/video/:videoId*",
    "/auth/sign-in",
  ],
};
