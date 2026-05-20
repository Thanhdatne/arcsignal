import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  const adminSecret = process.env.ADMIN_SECRET
  const key = searchParams.get("key")
  const cookieKey = request.cookies.get("admin_key")?.value

  if (!adminSecret) {
    return NextResponse.next()
  }

  if (key === adminSecret) {
    const response = NextResponse.next()

    response.cookies.set("admin_key", key, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  }

  if (cookieKey === adminSecret) {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL("/", request.url))
}

export const config = {
  matcher: ["/admin/:path*"],
}