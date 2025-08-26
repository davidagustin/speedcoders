import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	const res = NextResponse.next();
	const supabase = createMiddlewareClient({ req: request, res });
	const {
		data: { session },
	} = await supabase.auth.getSession();

	// Optional authentication - users can access all routes
	// Only redirect to dashboard if accessing auth pages while authenticated
	if (request.nextUrl.pathname.startsWith("/auth") && session) {
		const redirectUrl = request.nextUrl.clone();
		redirectUrl.pathname = "/dashboard";
		return NextResponse.redirect(redirectUrl);
	}

	return res;
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
