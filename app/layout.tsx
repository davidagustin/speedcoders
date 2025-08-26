import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PerformanceTracker from "@/components/PerformanceTracker";
import { initPerformanceMonitoring } from "@/lib/PerformanceMonitor";
import { NextAuthProvider } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
};

export const metadata: Metadata = {
	title: "SpeedCoders - Master Algorithms & Data Structures",
	description:
		"Learn algorithms, solve coding problems, and improve your programming skills with interactive challenges and real-time feedback.",
	keywords:
		"algorithms, data structures, coding problems, leetcode, programming, computer science",
	authors: [{ name: "SpeedCoders Team" }],
	robots: "index, follow",
	openGraph: {
		title: "SpeedCoders - Master Algorithms & Data Structures",
		description:
			"Learn algorithms, solve coding problems, and improve your programming skills",
		type: "website",
		locale: "en_US",
	},
	twitter: {
		card: "summary_large_image",
		title: "SpeedCoders - Master Algorithms & Data Structures",
		description:
			"Learn algorithms, solve coding problems, and improve your programming skills",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	if (typeof window !== "undefined") {
		initPerformanceMonitoring();
	}

	return (
		<html lang="en" className="h-full">
			<body className={`${inter.className} h-full bg-gray-50`}>
				<NextAuthProvider session={null}>
					{children}
					<PerformanceTracker
						enabled={process.env.NODE_ENV === "development"}
						showDebugPanel={true}
					/>
				</NextAuthProvider>
			</body>
		</html>
	);
}
