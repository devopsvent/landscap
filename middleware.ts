// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchAuthSession } from "aws-amplify/auth";

const AUTH_PATHS = [
	"/authentication/signin",
	"/authentication/signup",
	"/forgot-password",
	"/reset-password",
	"/verify-code",
];

export async function middleware(request: NextRequest) {
	const { pathname, searchParams } = request.nextUrl;
	let token = request.cookies.get("accessToken")?.value;
	if (!token) {
		try {
			const session = await fetchAuthSession();
			token = session.tokens?.accessToken?.toString();
		} catch (error) {
			console.error("Failed to get token from Amplify session:", error);
		}
	}

	const isAuthPath = AUTH_PATHS.includes(pathname);

	const isPublic =
		isAuthPath ||
		pathname.startsWith("/authentication") ||
		pathname === "/" ||
		pathname === "/favicon.ico";

	const isSocialRedirect =
		searchParams.has("code") && searchParams.has("state");

	if (isSocialRedirect || (pathname === "/" && token)) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	if ((token && isPublic) || pathname === "/") {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	if (token === "" || (!token && !isPublic)) {
		return NextResponse.redirect(
			new URL("/authentication/signin", request.url),
		);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
