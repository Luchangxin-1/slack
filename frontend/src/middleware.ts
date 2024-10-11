"use server";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../auth";

// export { auth as middleware } from "./auth";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;
  if (pathname === "/auth") {
    return NextResponse.next();
  }
  if (!session) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }
  console.log("middleware is running!");
  return NextResponse.next();
}
