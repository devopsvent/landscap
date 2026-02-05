import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { PrimeReactProvider } from "primereact/api";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import { ImageProvider } from "@/context/ImageContext";
import Script from "next/script";
import { UserProvider } from "@/context/UserContext";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Customscape AI",
	description: "Created by Ehsaantech",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const value = {
		ripple: true,
	};
	return (
		<html lang='en'>
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				<Script
					src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
					strategy='afterInteractive'
					async
					defer
				/>
				<Suspense fallback={<div>Loading...</div>}>
					<Toaster position='top-center' reverseOrder={false} />
					<PrimeReactProvider value={value}>
						<ImageProvider>
							<UserProvider>{children}</UserProvider>
						</ImageProvider>
					</PrimeReactProvider>
				</Suspense>
			</body>
		</html>
	);
}
