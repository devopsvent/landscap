import { fetchAuthSession } from "aws-amplify/auth";

export async function setAccessTokenCookie() {
	const session = await fetchAuthSession();
	const token = session.tokens?.accessToken?.toString();

	if (token) {
		const isLocalhost =
			typeof window !== "undefined" &&
			window.location.hostname === "localhost";

		const cookieString = `accessToken=${token}; path=/; ${
			isLocalhost ? "" : "Secure;"
		} SameSite=Lax`;

		document.cookie = cookieString;
	}
}

export function clearAccessTokenCookie() {
	const isLocalhost =
		typeof window !== "undefined" &&
		window.location.hostname === "localhost";

	const cookieString = `accessToken=; path=/; ${isLocalhost ? "" : "Secure;"} SameSite=Lax; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

	document.cookie = cookieString;
}
